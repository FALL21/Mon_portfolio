# 06 · Déploiement

[← Retour au sommaire](./README.md)

---

Guide complet pour mettre le portfolio en production.

**Production actuelle :** VPS **Hetzner** (`46.224.76.38`) + **Nginx** + Docker,
domaine **`mameboufall.com`**, en coexistence avec l'app **FTF (Fall Trading
Farmer)** déjà présente sur le même serveur.

| Méthode | Quand l'utiliser | Difficulté |
| ------- | ---------------- | ---------- |
| **[A. Hetzner VPS](#a-hetzner-vps--nginx--docker--recommandé)** | Production `mameboufall.com` | Moyenne |
| **[B. Docker local / Compose](#b-docker-local--compose)** | Test production en local | Facile |
| **[C. Vercel](#c-vercel-secours--preview)** | Preview / secours `*.vercel.app` | Facile |

---

## Prérequis communs

- Compte **GitHub** avec le dépôt :
  [`FALL21/Mon_portfolio`](https://github.com/FALL21/Mon_portfolio)
- Domaine **`mameboufall.com`** (registrar : Namecheap)
- URLs SEO déjà alignées dans le code :
  - `src/app/layout.tsx` → `metadataBase`
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`

Voir [chapitre 07](./07-seo-performance.md).

---

## A. Hetzner VPS + Nginx + Docker (recommandé)

### Architecture

```
Internet
   │
   ▼
Nginx :80 / :443          ← déjà en place (sert aussi FTF)
   │
   ├─ Host: (domaine FTF)     → app existante (inchangée)
   └─ Host: mameboufall.com   → 127.0.0.1:3010 (conteneur portfolio)
```

Règles :

- Le portfolio Docker écoute **uniquement** `127.0.0.1:3010` (pas exposé
  publiquement).
- On **ajoute** un vhost Nginx ; on ne remplace pas la config FTF.
- Fichiers utiles dans le dépôt :
  - [`deploy/hetzner/nginx-mameboufall.conf`](../deploy/hetzner/nginx-mameboufall.conf)
  - [`deploy/hetzner/setup-portfolio.sh`](../deploy/hetzner/setup-portfolio.sh)
  - [`deploy/hetzner/inspect.sh`](../deploy/hetzner/inspect.sh)
  - [`deploy/hetzner/.env.example`](../deploy/hetzner/.env.example)

Serveur cible :

| Champ | Valeur |
| ----- | ------ |
| Projet Hetzner | VBS Digital |
| Serveur | `ubuntu-8gb-fsn1-1` (CX33) |
| IPv4 | `46.224.76.38` |
| Proxy détecté | Nginx 1.31.3 |
| App coexistante | FTF · Fall Trading Farmer |

### A.1. Inspecter (optionnel mais recommandé)

En SSH sur le VPS :

```bash
curl -fsSL https://raw.githubusercontent.com/FALL21/Mon_portfolio/main/deploy/hetzner/inspect.sh | bash
```

Vérifiez que les ports `80`/`443` sont bien tenus par Nginx, et que `3010`
est libre.

### A.2. Déployer le portfolio (Docker)

```bash
sudo bash -c 'curl -fsSL https://raw.githubusercontent.com/FALL21/Mon_portfolio/main/deploy/hetzner/setup-portfolio.sh | bash'
```

Ou manuellement :

```bash
sudo mkdir -p /opt/portfolio && cd /opt/portfolio
sudo git clone https://github.com/FALL21/Mon_portfolio.git .
# si déjà cloné : sudo git -C /opt/portfolio pull --ff-only
echo 'PORTFOLIO_PUBLISH=127.0.0.1:3010' | sudo tee /opt/portfolio/.env
cd /opt/portfolio && sudo docker compose up -d --build
curl -sI http://127.0.0.1:3010 | head -5
```

Attendu : HTTP **200**. L'app FTF n'est pas touchée.

Variable d'environnement (voir [`docker-compose.yml`](../docker-compose.yml)) :

| Variable | Local (défaut) | Prod Hetzner |
| -------- | -------------- | ------------ |
| `PORTFOLIO_PUBLISH` | `3000` | `127.0.0.1:3010` |

### A.3. Ajouter le vhost Nginx (sans casser FTF)

Si le script n'a pas pu activer le vhost (Nginx dans Docker, chemins
différents), ajoutez-le à la main.

**Nginx système** (`sites-available`) :

```bash
sudo cp /opt/portfolio/deploy/hetzner/nginx-mameboufall.conf \
  /etc/nginx/sites-available/mameboufall.com
sudo ln -sfn /etc/nginx/sites-available/mameboufall.com \
  /etc/nginx/sites-enabled/mameboufall.com
sudo nginx -t && sudo systemctl reload nginx
```

**Nginx en conteneur** : copiez le même bloc `server { ... }` dans le
`conf.d` / volume monté du conteneur proxy, **en plus** des fichiers FTF,
puis rechargez Nginx dans ce conteneur (`nginx -s reload`).

Test avant bascule DNS (Host header) :

```bash
curl -sI -H 'Host: mameboufall.com' http://127.0.0.1 | head -10
```

### A.4. Bascule DNS Namecheap

Dans **Advanced DNS**, remplacer les enregistrements Vercel par :

| Type | Host | Value | TTL |
| ---- | ---- | ----- | --- |
| **A** | `@` | `46.224.76.38` | Automatic |
| **A** | `www` | `46.224.76.38` | Automatic |

À supprimer :

- A `@` vers IP Vercel (`216.198.79.1`, etc.)
- CNAME `www` vers `cname.vercel-dns.com` / `*.vercel-dns-*.com`
- Tout **URL Redirect** conflictuel sur `@`

Dans **Vercel → Domains** : retirer `mameboufall.com` et `www` (évite les
conflits de certificat). Garder le projet pour l'URL `*.vercel.app` en
secours.

### A.5. SSL (Certbot) après propagation DNS

```bash
dig +short A mameboufall.com @8.8.8.8
# doit afficher 46.224.76.38

sudo certbot --nginx -d mameboufall.com -d www.mameboufall.com
```

Si Nginx est dans Docker, adaptez (certbot en conteneur, ou volumes
Let's Encrypt déjà utilisés par FTF).

### A.6. Vérification

```bash
curl -sI https://mameboufall.com | head -15
curl -sI https://www.mameboufall.com | head -15
# Vérifier aussi l'URL / domaine de FTF (doit rester inchangé)
```

Attendu :

- `https://mameboufall.com` → **200** (portfolio, Nginx)
- `www` → 200 ou redirection vers l'apex
- FTF toujours accessible comme avant

### A.7. Mises à jour du portfolio

```bash
cd /opt/portfolio
sudo git pull --ff-only
sudo docker compose up -d --build
```

---

## B. Docker local / Compose

```bash
docker compose up -d --build
```

Site : **http://localhost:3000**

```bash
docker compose ps
docker compose logs -f
docker compose down
```

[`Dockerfile`](../Dockerfile) : multi-stage (`deps` → `builder` → `runner`),
utilisateur non-root `nextjs`, `output: "standalone"`.

---

## C. Vercel (secours / preview)

Utile pour une URL de preview `*.vercel.app` sans toucher au DNS de
`mameboufall.com`.

1. Importer [`FALL21/Mon_portfolio`](https://github.com/FALL21/Mon_portfolio)
   sur [vercel.com](https://vercel.com).
2. Framework : Next.js (détecté). Aucune variable d'env requise.
3. **Ne pas** attacher `mameboufall.com` si la prod est sur Hetzner.
4. Chaque `git push` sur `main` redéploie la preview Vercel.

---

## Checklist de mise en production (Hetzner)

- [ ] Code sur `main` (`FALL21/Mon_portfolio`)
- [ ] `docker compose` up sur le VPS, `curl http://127.0.0.1:3010` → 200
- [ ] Vhost Nginx `mameboufall.com` ajouté (FTF intact)
- [ ] DNS A `@` et `www` → `46.224.76.38`
- [ ] Domaines retirés de Vercel
- [ ] Certbot SSL OK
- [ ] `https://mameboufall.com` → 200
- [ ] Site FTF toujours OK
- [ ] Photo + CV OK

---

## Aide-mémoire des fichiers

| Sujet | Fichier |
| ----- | ------- |
| Contenu éditorial | `src/data/portfolio.ts` |
| URL SEO / Open Graph | `src/app/layout.tsx` |
| robots.txt | `src/app/robots.ts` |
| sitemap | `src/app/sitemap.ts` |
| Image Docker | `Dockerfile` |
| Orchestration | `docker-compose.yml` |
| Bind port prod | `PORTFOLIO_PUBLISH` / `deploy/hetzner/.env.example` |
| Vhost Nginx | `deploy/hetzner/nginx-mameboufall.conf` |
| Script install | `deploy/hetzner/setup-portfolio.sh` |
| Dépôt distant | `https://github.com/FALL21/Mon_portfolio.git` |

---

[Chapitre précédent → Composants](./05-composants.md) ·
[Chapitre suivant → SEO & performance](./07-seo-performance.md)
