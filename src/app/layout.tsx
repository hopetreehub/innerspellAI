import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/features/layout/header';
import { AppFooter } from '@/features/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    template: '%s | 이너스펠 AI',
    default: '이너스펠 AI - 당신의 영적 길잡이',
  },
  description: 'AI 기술로 당신의 내면과 숨겨진 이야기를 연결하는 신뢰할 수 있는 영적 허브입니다. 최고의 상담사를 만나보세요.',
  openGraph: {
    title: '이너스펠 AI',
    description: '당신의 내면과 숨겨진 이야기를 연결하는 신뢰할 수 있는 영적 허브입니다.',
    url: 'https://innerspell.ai', // Replace with actual URL
    siteName: 'Innerspell AI',
    images: [
      {
        url: 'https://innerspell.ai/og-image.png', // Replace with actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이너스펠 AI',
    description: 'AI 기술로 당신의 내면과 숨겨진 이야기를 연결합니다.',
    images: ['https://innerspell.ai/og-image.png'], // Replace with actual OG image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <AppFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
