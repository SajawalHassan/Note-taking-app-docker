#!/bin/sh
set -e

echo "⏳ Waiting for Postgres to be ready..."
until pg_isready -h db -p 5432; do
  sleep 1
done

echo "⚡ Running Prisma migrations..."
npx prisma migrate deploy

echo "⚙️ Generating Prisma client..."
npx prisma generate

echo "🚀 Starting server..."
npm run dev
