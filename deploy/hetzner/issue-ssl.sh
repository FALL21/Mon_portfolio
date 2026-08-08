#!/usr/bin/env bash
# Après bascule DNS A @ / www → 46.224.76.38
# Obtient un certificat Let's Encrypt (webroot FTF) et active le HTTPS.
set -euo pipefail

EMAIL="${CERTBOT_EMAIL:-mameboufall21@gmail.com}"
DOMAIN_ROOT="/opt/ftf/certbot"

echo "==> Certbot webroot pour mameboufall.com"
docker run --rm \
  -v "${DOMAIN_ROOT}/conf:/etc/letsencrypt" \
  -v "${DOMAIN_ROOT}/www:/var/www/certbot" \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d mameboufall.com -d www.mameboufall.com \
  --email "${EMAIL}" --agree-tos --non-interactive --expand

echo "==> Vérifier que les certificats existent :"
ls -la "${DOMAIN_ROOT}/conf/live/mameboufall.com/"

echo ""
echo "Ensuite : activer le bloc HTTPS mameboufall dans /opt/ftf/docker/nginx.conf"
echo "(voir deploy/hetzner/nginx-mameboufall.conf), puis :"
echo "  docker exec ftf-frontend-prod nginx -t && docker exec ftf-frontend-prod nginx -s reload"
echo "Et faire rediriger le location / HTTP vers HTTPS (comme FTF)."
