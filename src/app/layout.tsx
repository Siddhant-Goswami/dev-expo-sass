import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

import localFont from 'next/font/local';

const NeueMont = localFont({
  src: [
    {
      path: '../../public/fonts/NeueMontreal-Light.otf',
      weight: '300',
    },
    {
      path: '../../public/fonts/NeueMontreal-Regular.otf',
      weight: '400',
    },
    {
      path: '../../public/fonts/NeueMontreal-Medium.otf',
      weight: '500',
    },
    {
      path: '../../public/fonts/NeueMontreal-Bold.otf',
      weight: '700',
    },
  ],
  display: 'swap',
});

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
      <body className={NeueMont.className}>
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
