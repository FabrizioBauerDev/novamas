import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Registro de Especialistas',
  description: 'Registro de nuevos especialistas en la plataforma NoVa+. Crea tu cuenta para acceder al panel de administración.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
