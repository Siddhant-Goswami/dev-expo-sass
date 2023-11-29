import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

import { TRPCReactProvider } from '@/trpc/react';
import localFont from 'next/font/local';
import { headers } from 'next/headers';

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
  title: '100xTalent',
  description: '100xTalent | For finding 100x AI talent for the right job.',
  icons: [
    {
      rel: 'icon',
      url: 'https://framerusercontent.com/images/yQZPiDumORgz6c8KG1wLzbJi9rQ.png',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={NeueMont.className}>
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
