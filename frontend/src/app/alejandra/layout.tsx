import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alejandra Cuello — Espiritualidad y Sanación',
  description: 'Módulo I del MÉTODO RAÍZ. Reiki, Metafísica, Gemoterapia, Biodescodificación y Psicomagia para reconocer y sanar desde adentro hacia afuera.',
  openGraph: {
    title: 'Alejandra Cuello — Reconocer y Sanar',
    description: 'Módulo I del MÉTODO RAÍZ. Espiritualidad, sanación y expansión de consciencia con Reiki, Metafísica y Biodescodificación.',
    url: 'https://comunidad-imparables.vercel.app/alejandra',
    siteName: 'Academia Comunidad Imparable',
    images: [
      {
        url: 'https://comunidad-imparables.vercel.app/assets/client1/alenajdra0.jpeg',
        width: 1200,
        height: 630,
        alt: 'Alejandra Cuello — Espiritualidad y Sanación',
      }
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alejandra Cuello — Espiritualidad y Sanación',
    description: 'Módulo I del MÉTODO RAÍZ. Reconocer y sanar desde adentro hacia afuera.',
    images: ['https://comunidad-imparables.vercel.app/assets/client1/alenajdra0.jpeg'],
  },
}

export default function AlejandraLayout({ children }: { children: React.ReactNode }) {
  return children
}
