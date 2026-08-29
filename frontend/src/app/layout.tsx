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
  title: 'Comunidad Imparables',
  description: 'De adentro hacia afuera. Transformamos mujeres, no solo negocios.',
  manifest: '/manifest.json',
  icons: { icon: '/assets/client1/LOGO-comunidad-imparable.jpeg' }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C0C0C'
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
