import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cintia Paolucci — Método Conecta con tu Ser',
  description: 'Coaching ontológico para transformar tu mentalidad e identidad. Escucha, Consciencia, Claridad y Acción: el camino para conectar con quien realmente sos y avanzar desde ahí.',
  openGraph: {
    title: 'Cintia Paolucci — Coaching ontológico y Mentalidad',
    description: 'Escucha, Consciencia, Claridad y Acción. Descubrí el Método Conecta con tu Ser y transformá tu mentalidad e identidad desde adentro hacia afuera.',
    url: 'https://comunidad-imparables.vercel.app/cintia',
    siteName: 'Academia Comunidad Imparable',
    images: [
      {
        url: 'https://comunidad-imparables.vercel.app/assets/client1/og-cintia.jpeg',
        width: 1200,
        height: 630,
        alt: 'Cintia Paolucci — Coaching ontológico',
      }
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cintia Paolucci — Método Conecta con tu Ser',
    description: 'Coaching ontológico, mentalidad e identidad. Transformá tu vida con el Método Conecta con tu Ser.',
    images: ['https://comunidad-imparables.vercel.app/assets/client1/og-cintia.jpeg'],
  },
}

export default function CintiaLayout({ children }: { children: React.ReactNode }) {
  return children
}
