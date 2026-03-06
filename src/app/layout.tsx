import type { Metadata } from "next";
import { roboto } from '@/components/fonts';
import "./globals.css";
import Footer from '@/components/shared/footer';
import Navbar from '@/components/shared/navbar';
import { Analytics } from '@vercel/analytics/next';
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from '@vercel/speed-insights/next';
import SessionProviderWrapper from '@/components/providers/session-provider';

export const metadata: Metadata = {
  title: {
    template: '%s | Asistente Virtual',
    default: 'Asistente Virtual',
  },
  description: "Tu asistente virtual para la adicción a las apuestas y juegos de azar.",
  metadataBase: new URL('https://novamas.vercel.app/'),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <html lang="es">
      <body
        className={`${roboto.className}`}
      >
        <SessionProviderWrapper>
          <Navbar user={session?.user}/>
          {children}
          <Footer/>
          <Toaster />
        </SessionProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
