#!/bin/bash
# Docker up
npm run build
docker-compose -f docker-compose-production.yml build --no-cache
docker-compose -f docker-compose-production.yml up -d --force-recreate