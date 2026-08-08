#!/usr/bin/env bash
# Déploie le portfolio sur le VPS sans toucher à l'app existante (FTF).
# Prérequis : Docker + Compose, Nginx (système ou à configurer ensuite).
# Usage (en root ou avec sudo) :
#   curl -fsSL https://raw.githubusercontent.com/FALL21/Mon_portfolio/main/deploy/hetzner/setup-portfolio.sh | sudo bash
# ou depuis le dépôt cloné :
#   sudo bash deploy/hetzner/setup-portfolio.sh
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/FALL21/Mon_portfolio.git}"
INSTALL_DIR="${INSTALL_DIR:-/opt/portfolio}"
PUBLISH="${PORTFOLIO_PUBLISH:-127.0.0.1:3010}"

echo "==> Installation du portfolio dans ${INSTALL_DIR}"
mkdir -p "${INSTALL_DIR}"

if [[ -d "${INSTALL_DIR}/.git" ]]; then
  echo "==> git pull"
  git -C "${INSTALL_DIR}" fetch origin
  git -C "${INSTALL_DIR}" checkout main
  git -C "${INSTALL_DIR}" pull --ff-only origin main
else
  if [[ -n "$(ls -A "${INSTALL_DIR}" 2>/dev/null || true)" ]]; then
    echo "ERREUR: ${INSTALL_DIR} n'est pas vide et n'est pas un dépôt git."
    exit 1
  fi
  echo "==> git clone"
  git clone "${REPO_URL}" "${INSTALL_DIR}"
fi

cd "${INSTALL_DIR}"

echo "PORTFOLIO_PUBLISH=${PUBLISH}" > .env
echo "==> .env écrit (PORTFOLIO_PUBLISH=${PUBLISH})"

echo "==> docker compose up -d --build"
docker compose up -d --build

echo "==> Healthcheck local"
sleep 3
if curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3010 | grep -qE '200|304'; then
  echo "OK: portfolio répond sur 127.0.0.1:3010"
else
  echo "ATTENTION: pas de 200 sur 127.0.0.1:3010 — voir: docker compose logs --tail=50"
  docker compose ps || true
fi

NGINX_CONF_SRC="${INSTALL_DIR}/deploy/hetzner/nginx-mameboufall.conf"

if [[ -d /etc/nginx/sites-available ]]; then
  echo "==> Nginx système détecté : ajout du vhost mameboufall.com"
  cp "${NGINX_CONF_SRC}" /etc/nginx/sites-available/mameboufall.com
  ln -sfn /etc/nginx/sites-available/mameboufall.com /etc/nginx/sites-enabled/mameboufall.com
  nginx -t
  systemctl reload nginx
  echo "OK: vhost activé. Après bascule DNS :"
  echo "  sudo certbot --nginx -d mameboufall.com -d www.mameboufall.com"
elif docker ps --format '{{.Names}}' 2>/dev/null | grep -qi nginx; then
  echo "==> Nginx semble tourner dans Docker."
  echo "    Copiez le contenu de deploy/hetzner/nginx-mameboufall.conf"
  echo "    dans le volume/conf.d du conteneur Nginx existant, puis reload."
  echo "    Ne remplacez PAS la config FTF."
else
  echo "==> Aucun Nginx système détecté. Installez le vhost manuellement"
  echo "    (fichier: ${NGINX_CONF_SRC})"
fi

echo ""
echo "==> Suite DNS (Namecheap)"
echo "  A  @    → 46.224.76.38"
echo "  A  www  → 46.224.76.38"
echo "  Retirer les enregistrements Vercel, puis Certbot (ci-dessus)."
echo "Terminé."
