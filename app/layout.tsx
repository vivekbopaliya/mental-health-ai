import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/query-provider';
// import { ProactiveCheckIn } from '@/components/ProactiveCheckIns';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mental Health Support',
  description: 'AI-powered mental health support platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
            {/* <ProactiveCheckIn /> */}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}