import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { encrypt } from '../src/utils/encryption.js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de base de datos...')

  // Cliente principal
  const client = await prisma.client.upsert({
    where: { domain: 'escueladigital.com' },
    update: {},
    create: {
      name: 'Escuela de Asesores',
      domain: 'escueladigital.com',
      branding: {
        primaryColor: '#C4972A',
        secondaryColor: '#141414',
        accentColor: '#F5F0E8',
        logo: '/logo.svg',
        darkMode: true
      },
      settings: {
        tiempo_free: 5,
        dias_activo: 30,
        cuenta_regresiva: 5,
        dias_guardado: 10,
        tiempo_informe: 'weekly',
        actualiza_ranking: 'daily',
        X_ranking: 10,
        base_ingreso: 70,
        nombre_escuela: 'Escuela de Asesores'
      },
      subscriptionStatus: 'ACTIVE'
    }
  })

  console.log('✅ Cliente creado:', client.name)

  // Eliminar credenciales viejas si existen
  await prisma.user.deleteMany({
    where: { email: { in: ['admin@escueladigital.com', 'admin@escueladeasesor.com', 'escueladeasesoresmps@gmail.com'] } }
  })

  // Admin
  const adminPassword = await bcrypt.hash('Admin2026!EA', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'andrealorenaperez14@gmail.com' },
    update: { passwordHash: adminPassword },
    create: {
      email: 'andrealorenaperez14@gmail.com',
      dni: 'ADMIN001',
      passwordHash: adminPassword,
      role: 'ADMIN',
      clientId: client.id,
      profile: { create: { firstName: 'Andrea', lastName: 'Lorena' } }
    }
  })

  console.log('✅ Admin creado:', admin.email)

  // Client user
  const clientPassword = await bcrypt.hash('Yami!2026', 12)
  const clientUser = await prisma.user.upsert({
    where: { email: 'yamilamansilla154@gmail.com' },
    update: { passwordHash: clientPassword },
    create: {
      email: 'yamilamansilla154@gmail.com',
      dni: 'CLIENT001',
      passwordHash: clientPassword,
      role: 'CLIENT',
      clientId: client.id,
      profile: { create: { firstName: 'Yamila', lastName: 'Mansilla' } }
    }
  })

  console.log('✅ Client creado:', clientUser.email)

  // --- Prompts reales desde docs/ ---
  function extractSection(txt, startMarker, endMarker) {
    const start = txt.indexOf(startMarker)
    if (start === -1) return txt
    const content = txt.slice(start + startMarker.length)
    if (!endMarker) return content.trim()
    const end = content.indexOf(endMarker)
    return (end === -1 ? content : content.slice(0, end)).trim()
  }

  const coachTxt = readFileSync(join(__dirname, '../../docs/prompt-ia-coach.txt'), 'utf8')
  const mentalidadTxt = readFileSync(join(__dirname, '../../docs/prompt-ia-mentalidad.txt'), 'utf8')
  const consultivaTxt = readFileSync(join(__dirname, '../../docs/prompt-ia-consultiva.txt'), 'utf8')

  const SYSTEM_MARKER = 'SYSTEM PROMPT'
  const INSTRUCCIONES_MARKER = '====================================================\nINSTRUCCIONES'

  function parsePromptFile(txt) {
    const systemStart = txt.indexOf('====================================================\n', txt.indexOf(SYSTEM_MARKER))
    const instrStart = txt.indexOf(INSTRUCCIONES_MARKER)
    const systemRaw = systemStart !== -1 && instrStart !== -1
      ? txt.slice(systemStart, instrStart)
      : txt
    const systemClean = systemRaw
      .replace(/^={2,}[\s\S]*?={2,}\n/, '')
      .replace(/^={2,}[\s\S]*?={2,}\n/, '')
      .trim()

    const instrRaw = instrStart !== -1 ? txt.slice(instrStart) : ''
    const instrClean = instrRaw
      .replace(/^={2,}[\s\S]*?={2,}\n/, '')
      .replace(/^={2,}[\s\S]*?={2,}\n/, '')
      .trim()

    return { systemPrompt: systemClean, instructions: instrClean }
  }

  const coachPrompts = parsePromptFile(coachTxt)
  const mentalidadPrompts = parsePromptFile(mentalidadTxt)
  const consultivaPrompts = parsePromptFile(consultivaTxt)

  // Agente COACH — pipeline: Claude(primary) → Gemini(backup) → OpenAI
  const consultivo = await prisma.iAAgent.upsert({
    where: { clientId_type: { clientId: client.id, type: 'COACH' } },
    update: {
      systemPrompt: coachPrompts.systemPrompt,
      instructions: coachPrompts.instructions,
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder')
    },
    create: {
      clientId: client.id,
      type: 'COACH',
      name: 'IA Coach',
      description: 'Acompaña tu proceso de aprendizaje 24/7',
      icon: '🔍',
      systemPrompt: coachPrompts.systemPrompt,
      instructions: coachPrompts.instructions,
      knowledgeBase: '[]',
      metricsConfig: { alertThresholdLow: 0.6, alertThresholdHigh: 0.9, reportingSchedule: 'weekly' },
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder'),
      published: true,
      publishedDate: new Date()
    }
  })

  // Agente MENTALIDAD — pipeline: Claude(primary) → Gemini(backup) → OpenAI
  const mentor = await prisma.iAAgent.upsert({
    where: { clientId_type: { clientId: client.id, type: 'MENTALIDAD' } },
    update: {
      systemPrompt: mentalidadPrompts.systemPrompt,
      instructions: mentalidadPrompts.instructions,
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder')
    },
    create: {
      clientId: client.id,
      type: 'MENTALIDAD',
      name: 'IA Mentalidad',
      description: 'Trabaja tus miedos y bloqueos personales',
      icon: '🎯',
      systemPrompt: mentalidadPrompts.systemPrompt,
      instructions: mentalidadPrompts.instructions,
      knowledgeBase: '[]',
      metricsConfig: { alertThresholdLow: 0.6, alertThresholdHigh: 0.9, reportingSchedule: 'weekly' },
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder'),
      published: true,
      publishedDate: new Date()
    }
  })

  // Agente CONSULTIVA (NOVA) — pipeline: Claude(primary) → Gemini(backup) → OpenAI
  const consultiva = await prisma.iAAgent.upsert({
    where: { clientId_type: { clientId: client.id, type: 'CONSULTIVA' } },
    update: {
      systemPrompt: consultivaPrompts.systemPrompt,
      instructions: consultivaPrompts.instructions,
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder')
    },
    create: {
      clientId: client.id,
      type: 'CONSULTIVA',
      name: 'IA Consultiva',
      description: 'Consultora experta en obras sociales y prepagas',
      icon: '📊',
      systemPrompt: consultivaPrompts.systemPrompt,
      instructions: consultivaPrompts.instructions,
      knowledgeBase: '[]',
      metricsConfig: { alertThresholdLow: 0.6, alertThresholdHigh: 0.9, reportingSchedule: 'weekly' },
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder'),
      published: true,
      publishedDate: new Date()
    }
  })

  // Cargar base de conocimiento de NOVA (15 obras sociales)
  const kbDir = join(__dirname, '../../docs/knowledge-base')
  try {
    const kbFiles = readdirSync(kbDir).filter(f => f.endsWith('.txt'))
    for (const filename of kbFiles) {
      const text = readFileSync(join(kbDir, filename), 'utf8')
      const paragraphs = text.split(/(\r?\n){2,}/).map(p => p.trim()).filter(p => p.length > 50)
      const chunks = []
      let chunkIndex = 0
      let current = ''
      for (const para of paragraphs) {
        if ((current + para).length > 1000 && current.length > 0) {
          chunks.push({ agentId: consultiva.id, filename, chunkIndex: chunkIndex++, content: current.trim() })
          current = para
        } else {
          current = current ? `${current}\n\n${para}` : para
        }
      }
      if (current.trim()) chunks.push({ agentId: consultiva.id, filename, chunkIndex, content: current.trim() })
      await prisma.documentChunk.deleteMany({ where: { agentId: consultiva.id, filename } })
      await prisma.documentChunk.createMany({ data: chunks })
      console.log(`  📄 ${filename}: ${chunks.length} chunks`)
    }
    console.log(`✅ Base de conocimiento NOVA cargada: ${kbFiles.length} archivos`)
  } catch (err) {
    console.warn('⚠️  No se pudo cargar knowledge-base:', err.message)
  }

  console.log('✅ Agentes IA creados:', consultivo.name, '|', mentor.name, '|', consultiva.name)

  // Contenido del curso
  await prisma.courseContent.createMany({
    skipDuplicates: true,
    data: [
      {
        clientId: client.id, type: 'FREE', order: 1,
        title: 'Introducción al Curso',
        description: 'Bienvenida y overview del programa',
        content: '# Bienvenida a Escuela de Asesores\n\nEste curso está diseñado para profesionales que buscan...'
      },
      {
        clientId: client.id, type: 'FREE', order: 2,
        title: 'Módulo 1: Fundamentos',
        description: 'Conceptos básicos esenciales',
        content: '# Módulo 1: Fundamentos\n\nEn este módulo aprenderás los conceptos base...'
      },
      {
        clientId: client.id, type: 'PAID', order: 3,
        title: 'Módulo 2: Estrategias Avanzadas',
        description: 'Técnicas avanzadas para profesionales',
        content: '# Módulo 2: Estrategias Avanzadas\n\nContenido exclusivo para suscriptores...'
      },
      {
        clientId: client.id, type: 'PAID', order: 4,
        title: 'Módulo 3: Implementación Práctica',
        description: 'Casos de uso reales y ejercicios',
        content: '# Módulo 3: Implementación Práctica\n\nEjercicios con casos reales...'
      }
    ]
  })

  // 5 estudiantes de muestra
  const estudiantes = [
    { email: 'maria@ejemplo.com', dni: '12345678', firstName: 'María', lastName: 'González' },
    { email: 'carlos@ejemplo.com', dni: '23456789', firstName: 'Carlos', lastName: 'Rodríguez' },
    { email: 'ana@ejemplo.com', dni: '34567890', firstName: 'Ana', lastName: 'Martínez' },
    { email: 'luis@ejemplo.com', dni: '45678901', firstName: 'Luis', lastName: 'García' },
    { email: 'sofia@ejemplo.com', dni: '56789012', firstName: 'Sofía', lastName: 'López' }
  ]

  const studentPassword = await bcrypt.hash('Student123!', 12)

  for (const est of estudiantes) {
    const user = await prisma.user.upsert({
      where: { email: est.email },
      update: {},
      create: {
        email: est.email,
        dni: est.dni,
        passwordHash: studentPassword,
        role: 'STUDENT',
        clientId: client.id,
        profile: { create: { firstName: est.firstName, lastName: est.lastName, lastLoginAt: new Date() } },
        subscriptions: {
          create: {
            planType: '30_DAYS',
            status: 'ACTIVE',
            activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            suspensionDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            lastPaymentDate: new Date()
          }
        }
      }
    })

    for (const agent of [consultivo, mentor, consultiva]) {
      await prisma.iAMetric.upsert({
        where: { agentId_userId: { agentId: agent.id, userId: user.id } },
        update: {},
        create: {
          agentId: agent.id,
          userId: user.id,
          totalSessions: Math.floor(Math.random() * 20) + 1,
          totalQuestions: agent.type === 'COACH' ? Math.floor(Math.random() * 15) : 0,
          engagementScore: Math.random() * 0.5 + 0.5,
          completionRate: Math.random() * 0.4 + 0.6,
          habitStreak: Math.floor(Math.random() * 10) + 1,
          status: 'BUENO'
        }
      })
    }
  }

  console.log('✅ 5 estudiantes de muestra creados')
  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📋 Credenciales de acceso:')
  console.log('  Admin:  andrealorenaperez14@gmail.com / Admin2026!EA')
  console.log('  Client: yamilamansilla154@gmail.com / Yami!2026')
  console.log('  Alumno: maria@ejemplo.com / Student123!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
