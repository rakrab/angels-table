#!/bin/sh

# Create data directory if it doesn't exist
mkdir -p /app/data

# Check if database file exists, if not create it
if [ ! -f /app/data/database.sqlite ]; then
  echo "Database not found. Initializing..."
  # Create an empty file first so the mount doesn't create a directory
  touch /app/data/database.sqlite
  node scripts/init-db.js
fi

# Start the Next.js server
exec npm start