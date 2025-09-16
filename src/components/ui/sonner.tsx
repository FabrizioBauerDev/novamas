"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--error-bg": "#dc2626",
          "--error-text": "#ffffff",
          "--error-border": "#b91c1c",
          "--success-bg": "#16a34a",
          "--success-text": "#ffffff",
          "--success-border": "#15803d",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          // Estilos específicos para toast de error
          background: "var(--normal-bg)",
          color: "var(--normal-text)",
          border: "1px solid var(--normal-border)",
        },
        classNames: {
          error: "bg-red-600 text-white border-red-700",
          success: "bg-green-600 text-white border-green-700",
          warning: "bg-yellow-600 text-white border-yellow-700",
          info: "bg-blue-600 text-white border-blue-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
