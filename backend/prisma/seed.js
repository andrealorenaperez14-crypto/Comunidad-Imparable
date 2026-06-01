import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { encrypt } from '../src/utils/encryption.js'

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

  // Agente COACH — pipeline: Claude(primary) → Gemini(backup) → OpenAI
  const consultivo = await prisma.iAAgent.upsert({
    where: { clientId_type: { clientId: client.id, type: 'COACH' } },
    update: {
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder')
    },
    create: {
      clientId: client.id,
      type: 'COACH',
      name: 'IA Coach',
      description: 'Acompaña tu proceso de aprendizaje 24/7',
      icon: '🔍',
      systemPrompt: 'Eres la IA Coach de Escuela de Asesores. Tu rol es acompañar al estudiante durante su proceso de aprendizaje, responder preguntas sobre el contenido del curso y guiarlo para que avance con claridad. Habla siempre en español latinoamericano, de forma clara y empática.',
      instructions: 'Responde siempre en español. Usa ejemplos prácticos. Mantén el contexto de la conversación para dar respuestas coherentes. Si la pregunta no está relacionada con el curso, redirige amablemente al estudiante.',
      knowledgeBase: '[]',
      metricsConfig: {
        alertThresholdLow: 0.6,
        alertThresholdHigh: 0.9,
        reportingSchedule: 'weekly'
      },
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
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder')
    },
    create: {
      clientId: client.id,
      type: 'MENTALIDAD',
      name: 'IA Mentalidad',
      description: 'Trabaja tus miedos y bloqueos personales',
      icon: '🎯',
      systemPrompt: 'Eres la IA de Mentalidad de Escuela de Asesores. Tu misión es ayudar al estudiante a trabajar sus miedos, bloqueos y limitaciones mentales que le impiden crecer. Eres empático, contenedor y orientado a la acción. Usa técnicas de coaching y PNL adaptadas al mundo de las ventas. Habla siempre en español latinoamericano.',
      instructions: 'Mantén un tono positivo y alentador. Ayuda al estudiante a identificar sus bloqueos concretos. Usa el historial de la conversación para hacer seguimiento y profundizar. Cuando detectes desmotivación, aplica técnicas de reencuadre.',
      knowledgeBase: '[]',
      metricsConfig: {
        alertThresholdLow: 0.6,
        alertThresholdHigh: 0.9,
        reportingSchedule: 'weekly'
      },
      primaryApiKey: encrypt(process.env.ANTHROPIC_API_KEY || 'placeholder'),
      backupApiKey: encrypt(process.env.GEMINI_API_KEY || 'placeholder'),
      published: true,
      publishedDate: new Date()
    }
  })

  console.log('✅ Agentes IA creados:', consultivo.name, '|', mentor.name)

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

    for (const agent of [consultivo, mentor]) {
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
