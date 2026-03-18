#!/bin/bash
# check-services.sh - Auditoría de Conectividad de Servicios
# Lista proyectos en todos los proveedores configurados para verificar acceso.

# Cargar credenciales
if [ -f "$HOME/.integra/credentials.env" ]; then
    set -a
    source "$HOME/.integra/credentials.env"
    set +a
    echo "🔑 Credenciales cargadas de INTEGRA."
else
    echo "⚠️  No se encontró ~/.integra/credentials.env"
fi

echo "=================================================="
echo "📦 VERCEL (Token: ${VERCEL_TOKEN:0:5}...)"
echo "=================================================="
# Vercel puede ignorar VERCEL_TOKEN env si no se especifica --token si no hay credentials locales
if [ -n "$VERCEL_TOKEN" ]; then
  vercel project ls --token "$VERCEL_TOKEN" || echo "❌ Error conectando a Vercel con Token"
else
  echo "⚠️  VERCEL_TOKEN no configurado"
fi

echo ""
echo "=================================================="
echo "🚂 RAILWAY (Token: ${RAILWAY_TOKEN:0:5}...)"
echo "=================================================="
# Railway CLI a veces requiere login interactivo si no detecta token
# Forzamos uso de token si existe
if [ -n "$RAILWAY_TOKEN" ]; then
  railway list || echo "❌ Error conectando a Railway"
else
  echo "⚠️  RAILWAY_TOKEN no configurado"
fi

echo ""
echo "=================================================="
echo "🔥 FIREBASE (Token: ${FIREBASE_TOKEN:0:5}...)"
echo "=================================================="
if [ -n "$FIREBASE_TOKEN" ]; then
  firebase projects:list --token "$FIREBASE_TOKEN" || echo "❌ Error conectando a Firebase"
else 
  echo "⚠️  FIREBASE_TOKEN no configurado"
fi

echo ""
echo "=================================================="
echo "⚡ SUPABASE (Token: ${SUPABASE_ACCESS_TOKEN:0:5}...)"
echo "=================================================="
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
  supabase projects list || echo "❌ Error conectando a Supabase"
else
  echo "⚠️  SUPABASE_ACCESS_TOKEN no configurado"
fi

echo ""
echo "=================================================="
echo "☁️  GOOGLE CLOUD (Auth: User/Service Account)"
echo "=================================================="
gcloud projects list --quiet || echo "❌ Error conectando a GCloud"
