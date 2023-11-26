import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
import { GeistSans } from 'geist/font/sans';

export const metadata = {
  title: 'InnovAIte',
  description: 'INNOVAITE | Innovating the way you for AI talent',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ReactQueryProvider>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
