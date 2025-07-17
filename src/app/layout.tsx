import type { Metadata } from "next";
import { roboto } from '@/components/fonts';
import "./globals.css";
import Footer from '@/components/shared/footer';
import Navbar from '@/components/shared/navbar';

export const metadata: Metadata = {
  title: {
    template: '%s | NoVa+ chatbot',
    default: 'NoVa+',
  },
  description: "NoVa+ tu asistente virtual para la adicción a las apuestas y juegos de azar.",
  // metadataBase: new URL('https://next-tuto-dashboard.vercel.app/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${roboto.className}`}
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
