import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { env } from '@/env';
import '@/styles/globals.css';
import { TRPCReactProvider } from '@/trpc/react';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import Script from 'next/script';

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
  title: 'Overpowered Jobs',
  description:
    'Overpowered Jobs | For finding most overpowered talent for your company',
  icons: [
    {
      rel: 'icon',
      url: './images/opj.png',
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
      <Script id="tawkto" strategy="afterInteractive">
        {`
         var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
         (function () {
             var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
             s1.async = true;
             s1.src = '${env.NEXT_PUBLIC_TAWK_TO_SRC_URL}';
             s1.charset = 'UTF-8';
             s1.setAttribute('crossorigin', '*');
             s0.parentNode.insertBefore(s1, s0);
         })();
        `}
      </Script>

      <body className={NeueMont.className}>
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
      <Script id="tawkto" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${env.NEXT_PUBLIC_MICROSOFT_CLARITY_CODE}");
        `}
      </Script>
    </html>
  );
}
