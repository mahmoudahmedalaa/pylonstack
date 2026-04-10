import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/hooks/useAuth';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pylon — Build Your Perfect Tech Stack',
    template: '%s | Pylon',
  },
  description:
    'Stop researching. Start building. Pylon uses AI to recommend the perfect tech stack for your project, with drag-and-drop stack building and live cost tracking.',
  keywords: [
    'tech stack',
    'developer tools',
    'AI recommendations',
    'stack builder',
    'software architecture',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Pylon',
    title: 'Pylon — Build Your Perfect Tech Stack',
    description:
      'AI-powered tech stack recommendations and visual stack building for developers and teams.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pylon — Build Your Perfect Tech Stack',
    description:
      'AI-powered tech stack recommendations and visual stack building for developers and teams.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} premium-gradient min-h-screen font-sans antialiased`}
      >
        <div className="noise" aria-hidden="true" />
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
