# 06 · Déploiement

[← Retour au sommaire](./README.md)

---

## Le Dockerfile en bref

[`Dockerfile`](../Dockerfile) utilise une construction **multi-stage** en trois
étapes, pour une image finale minimale et sécurisée :

| Étape | Base | Rôle |
| ----- | ---- | ---- |
| `deps` | `node:22-alpine` | Installe les dépendances via `npm ci`. |
| `builder` | `node:22-alpine` | Compile l'application (`npm run build`). |
| `runner` | `node:22-alpine` | Image finale : ne copie que `public/`, `.next/standalone` et `.next/static`. |

Points clés :

- **Utilisateur non-root** (`nextjs`) pour l'exécution : bonne pratique de sécurité.
- Grâce à `output: "standalone"` (dans `next.config.mjs`), l'image ne contient que
  les dépendances réellement utilisées → image légère.
- Commande de démarrage : `node server.js` (généré par le mode standalone).
- Télémétrie Next.js désactivée (`NEXT_TELEMETRY_DISABLED=1`).

---

## Docker Compose

[`docker-compose.yml`](../docker-compose.yml) définit le service `portfolio` :

- **Port** : `3000:3000` (hôte:conteneur).
- **`restart: unless-stopped`** : redémarrage automatique.
- **Healthcheck** : vérifie que `http://localhost:3000` répond ; l'état apparaît
  dans `docker compose ps`.

```bash
docker compose up -d --build   # déployer / redéployer
docker compose ps              # vérifier l'état (healthy)
docker compose logs -f         # consulter les logs
docker compose down            # arrêter
```

---

## Déploiement sur un VPS (Hetzner, DigitalOcean, etc.)

1. **Installer Docker** sur le serveur (Docker Engine + plugin Compose).
2. **Transférer le projet** (via `git clone` ou `scp` de l'archive).
3. **Lancer** :

   ```bash
   docker compose up -d --build
   ```

4. **Mettre un reverse proxy** devant, pour le nom de domaine et le HTTPS.

### Exemple avec Caddy (HTTPS automatique)

`Caddyfile` minimal :

```
mameboufall.dev {
    reverse_proxy localhost:3000
}
```

Caddy obtient et renouvelle automatiquement le certificat TLS (Let's Encrypt).

### Exemple avec Nginx

Extrait de configuration de site :

```nginx
server {
    server_name mameboufall.dev;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ajoutez ensuite HTTPS avec Certbot (`certbot --nginx`).

---

## Déploiement sur Vercel (sans Docker)

Next.js est édité par Vercel ; le déploiement y est le plus simple :

1. Poussez le projet sur GitHub / GitLab.
2. Sur Vercel, « **Add New Project** » → importez le dépôt.
3. Aucune configuration nécessaire (Vercel détecte Next.js). Cliquez sur **Deploy**.

> Remarque : sur Vercel, `output: "standalone"` est simplement ignoré ; la
> plateforme gère elle-même l'empaquetage. Rien à changer.

---

## Mettre à jour le site en production

Après avoir modifié le contenu (`portfolio.ts`), la photo ou le CV :

```bash
# VPS / Docker
git pull                        # ou re-transférer les fichiers
docker compose up -d --build    # reconstruit et redéploie

# Vercel
git push                        # redéploiement automatique
```

---

## Domaine personnalisé

Le projet référence `https://mameboufall.com` à quelques endroits SEO
(`layout.tsx`, `robots.ts`, `sitemap.ts`). Si vous utilisez un autre domaine,
remplacez cette URL dans ces trois fichiers. Voir
[chapitre 07](./07-seo-performance.md).

---

[Chapitre suivant → SEO & performance](./07-seo-performance.md)
