import type { Metadata, Viewport } from 'next'
import { Cinzel, Great_Vibes, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-display', weight: ['400', '600', '700'] })
const greatVibes = Great_Vibes({ subsets: ['latin'], variable: '--font-script', weight: ['400'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Academia Comunidad Imparable — MÉTODO RAÍZ',
  description: 'De adentro hacia afuera. Transformá tu mentalidad, sanás y accionás con el MÉTODO RAÍZ de Cintia Paolucci y Alejandra Cuello.',
  manifest: '/manifest.json',
  icons: { icon: '/assets/client1/LOGO-comunidad-imparable.jpeg' },
  openGraph: {
    title: 'Academia Comunidad Imparable — MÉTODO RAÍZ',
    description: 'De adentro hacia afuera. Transformá tu vida con el MÉTODO RAÍZ: Reconocer y Sanar · Activar tu Potencial · Acción y Práctica.',
    url: 'https://comunidad-imparables.vercel.app',
    siteName: 'Academia Comunidad Imparable',
    images: [
      {
        url: 'https://comunidad-imparables.vercel.app/assets/client1/Alejandra y Cintia.jpeg',
        width: 1200,
        height: 630,
        alt: 'Cintia Paolucci y Alejandra Cuello — Academia Comunidad Imparable',
      }
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academia Comunidad Imparable — MÉTODO RAÍZ',
    description: 'De adentro hacia afuera. MÉTODO RAÍZ con Cintia Paolucci y Alejandra Cuello.',
    images: ['https://comunidad-imparables.vercel.app/assets/client1/Alejandra y Cintia.jpeg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#160D28'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${cinzel.variable} ${greatVibes.variable} ${dmSans.variable}`}>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: true });
            `}</Script>
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
