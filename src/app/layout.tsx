import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/hooks/useAuth';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
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
    default: 'Pylon — AI-Driven Cloud Architecture Planner',
    template: '%s | Pylon',
  },
  description:
    'Generate precise tech stacks, calculate unit economics, and foresee integration risks in minutes. Define your constraints, and the Pylon Orchestration Engine builds your infrastructure roadmap.',
  keywords: [
    'tech stack',
    'developer tools',
    'AI architecture generator',
    'infrastructure planning',
    'software engineering',
    'cloud infrastructure',
    'Next.js',
    'database pricing calculator',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Pylon',
    title: 'Pylon — Architect Your Stack with Engineering Precision',
    description:
      'Input technical constraints and our AI engine computes the optimal architecture tailored to your specific scale parameters and team size.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pylon — Architect Your Stack with Engineering Precision',
    description:
      'Input technical constraints and our AI engine computes the optimal architecture tailored to your specific scale parameters and team size.',
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
        className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-jakarta min-h-screen bg-black antialiased`}
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
