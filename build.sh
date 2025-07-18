#!/bin/bash

# Script de build para Vercel
echo "🔧 Generando cliente de Prisma..."
npx prisma generate

echo "🏗️ Construyendo aplicación Next.js..."
npx next build

echo "✅ Build completado!"
