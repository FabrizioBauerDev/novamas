import type { Metadata } from "next";
import { roboto } from '@/components/fonts';
import "./globals.css";
import Footer from '@/components/shared/footer';
import Navbar from '@/components/shared/navbar';
import { Analytics } from '@vercel/analytics/next';
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: '%s | NoVa+ chatbot',
    default: 'NoVa+',
  },
  description: "NoVa+ tu asistente virtual para la adicción a las apuestas y juegos de azar.",
  // metadataBase: new URL('https://next-tuto-dashboard.vercel.app/'),
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
        <Navbar user={session?.user}/>
        {children}
        <Footer/>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
