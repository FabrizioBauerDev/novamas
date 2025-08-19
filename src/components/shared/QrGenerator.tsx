"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QrGeneratorProps {
  url: string;
  size?: number;
  className?: string;
}

export default function QrGenerator({ url, size = 128, className = "" }: QrGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !url) return;

      try {
        setIsLoading(true);
        setError(null);
        
        await QRCode.toCanvas(canvasRef.current, url, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "M",
        });
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Error al generar el código QR");
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [url, size]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted-foreground text-center">
          Error QR
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg animate-pulse"
          style={{ width: size, height: size }}
        >
          <span className="text-xs text-muted-foreground">
            Generando...
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`rounded-lg ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
