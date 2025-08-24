#!/bin/bash

echo "Checking for Database..."
until pg_isready -h db -p 5432; do
    sleep 1
done

echo "Running migrations..."
npx prisma migrate deploy


echo "Generating client..."
npx prisma generate

echo "Starting development server..."
npm run dev