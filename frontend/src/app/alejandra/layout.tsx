import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alejandra Cuello — Espiritualidad y Sanación',
  description: 'Sanar desde adentro transforma tu vida. Te acompaño en tu camino espiritual con Reiki, Metafísica, Gemoterapia y Biodescodificación para que reconectes con tu esencia y des pasos concretos.',
  openGraph: {
    title: 'Alejandra Cuello — Reconocer y Sanar',
    description: 'Sanar desde adentro transforma tu vida. Acompañamiento espiritual con Reiki, Metafísica, Biodescodificación y Gemoterapia para reconectar con tu esencia.',
    url: 'https://comunidad-imparables.vercel.app/alejandra',
    siteName: 'Academia Comunidad Imparable',
    images: [
      {
        url: 'https://comunidad-imparables.vercel.app/assets/client1/og-alejandra.jpeg',
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
    description: 'Sanar desde adentro transforma tu vida. Acompañamiento espiritual con Reiki, Metafísica y Biodescodificación.',
    images: ['https://comunidad-imparables.vercel.app/assets/client1/og-alejandra.jpeg'],
  },
}

export default function AlejandraLayout({ children }: { children: React.ReactNode }) {
  return children
}
