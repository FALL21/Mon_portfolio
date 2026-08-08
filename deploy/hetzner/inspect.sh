#!/usr/bin/env bash
# Inspection VPS (à coller / exécuter en SSH). Collez toute la sortie dans le chat.
set -euo pipefail

echo "========== IDENTITÉ =========="
whoami; hostname; uname -a

echo "========== PORTS =========="
sudo ss -tlnp | grep -E ':80|:443|:3000|:3010' || true

echo "========== DOCKER =========="
command -v docker || echo "docker: absent"
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}' 2>/dev/null || true
docker compose version 2>/dev/null || true

echo "========== NGINX SYSTÈME =========="
command -v nginx || echo "nginx binaire: absent"
sudo nginx -t 2>&1 || true
ls -la /etc/nginx/sites-enabled 2>/dev/null || echo "pas de sites-enabled"
ls -la /etc/nginx/conf.d 2>/dev/null || true

echo "========== NGINX DOCKER (si présent) =========="
for c in $(docker ps --format '{{.Names}}' 2>/dev/null); do
  if docker exec "$c" nginx -t 2>/dev/null; then
    echo "--- conteneur nginx: $c ---"
    docker exec "$c" ls -la /etc/nginx/conf.d 2>/dev/null || true
    docker exec "$c" ls -la /etc/nginx/sites-enabled 2>/dev/null || true
  fi
done

echo "========== DISQUE / RAM =========="
df -h /; free -h

echo "========== FIN =========="
