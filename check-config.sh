#!/bin/bash

echo "🔍 Vérification de la configuration - Touris App"
echo "================================================"
echo ""

# Vérifier Node.js
echo "📦 Node.js version:"
node -v || echo "❌ Node.js n'est pas installé"
echo ""

# Vérifier npm
echo "📦 npm version:"
npm -v || echo "❌ npm n'est pas installé"
echo ""

# Vérifier les dépendances
echo "📚 Dépendances installées:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules existe"
else
    echo "❌ node_modules manquant - Exécuter: npm install"
fi
echo ""

# Vérifier .env.local
echo "⚙️  Fichier .env.local:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local existe"
    grep "NEXT_PUBLIC_API_URL" .env.local || echo "⚠️  NEXT_PUBLIC_API_URL manquant"
else
    echo "❌ .env.local manquant"
    echo "Créer le fichier avec:"
    echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api"
fi
echo ""

# Vérifier package.json
echo "📋 Configuration package.json:"
if grep -q '"dev": "next dev -p 3001"' package.json; then
    echo "✅ Port 3001 configuré dans package.json"
else
    echo "⚠️  Port par défaut (3000) - Attention au conflit avec le backend"
fi
echo ""

# Vérifier si le port 3001 est libre
echo "🔌 Ports disponibles:"
if lsof -i:3001 > /dev/null 2>&1; then
    echo "⚠️  Port 3001 déjà utilisé"
    echo "Processus utilisant le port 3001:"
    lsof -i:3001
else
    echo "✅ Port 3001 disponible"
fi
echo ""

# Vérifier si le backend tourne
echo "🔗 Backend API:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Backend répond sur http://localhost:3000"
else
    echo "❌ Backend ne répond pas - Démarrer le backend d'abord"
fi
echo ""

# Résumé
echo "================================================"
echo "📊 Résumé:"
echo ""
echo "Configuration attendue:"
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:3001"
echo ""

if [ ! -d "node_modules" ]; then
    echo "🚀 Prochaine étape: npm install"
elif lsof -i:3001 > /dev/null 2>&1; then
    echo "⚠️  Prochaine étape: Libérer le port 3001 ou choisir un autre port"
elif ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "🚀 Prochaine étape: Démarrer le backend (listing-backend)"
else
    echo "✅ Prêt à démarrer: npm run dev"
fi
echo ""
