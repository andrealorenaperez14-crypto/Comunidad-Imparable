import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cintia Paolucci — Método Conecta con tu Ser',
  description: 'Coaching ontológico, mentalidad e identidad. Módulo II del MÉTODO RAÍZ de la Academia Comunidad Imparable. Descubrí tus métodos: Conecta con tu Ser y Vender desde tu Ser.',
  openGraph: {
    title: 'Cintia Paolucci — Coaching ontológico y Mentalidad',
    description: 'Módulo II del MÉTODO RAÍZ. Escucha, Consciencia, Claridad y Acción para transformar tu mentalidad e identidad.',
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
    description: 'Coaching ontológico, mentalidad e identidad. Módulo II del MÉTODO RAÍZ.',
    images: ['https://comunidad-imparables.vercel.app/assets/client1/og-cintia.jpeg'],
  },
}

export default function CintiaLayout({ children }: { children: React.ReactNode }) {
  return children
}
