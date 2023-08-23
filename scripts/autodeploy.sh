#!/bin/bash
pm2 stop bdigital-be

git pull

npm install
npm run build
npm run migration:run

pm2 start dist/main.js -n bdigital-be