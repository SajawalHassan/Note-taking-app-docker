#!/bin/bash

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h $PRIVATE_IP -p "5432"; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "⏳ Running Prisma Migrations..."
npx prisma migrate deploy
npx prisma generate

echo "⏳ Starting server..."
node dist/index.js