import type { Metadata, Viewport } from 'next'
import { Cinzel, Great_Vibes, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-display', weight: ['400', '600', '700'] })
const greatVibes = Great_Vibes({ subsets: ['latin'], variable: '--font-script', weight: ['400'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Escuela de Asesores',
  description: 'Formamos Líderes, No Vendedores. Transformamos Vidas, No Solo Negocios.',
  manifest: '/manifest.json',
  icons: { icon: '/assets/client1/LOGO_SOLO_ESCUELA_DE_ASESORES.png' }
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
