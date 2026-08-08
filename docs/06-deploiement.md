# 06 · Déploiement

[← Retour au sommaire](./README.md)

---

Guide complet pour mettre le portfolio en production.

**Production actuelle :** VPS **Hetzner** (`46.224.76.38`) + **Nginx** (conteneur
FTF) + Docker, domaine **`mameboufall.com`**.

> Guide opérationnel détaillé (architecture, DNS, SSL, rollback, dépannage) :
> **[09 · Déploiement Hetzner](./09-deploiement-hetzner.md)**.

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

**Documentation complète :** [09 · Déploiement Hetzner](./09-deploiement-hetzner.md)
(architecture, pas-à-pas, SSL, DNS, rollback, dépannage).

Résumé rapide ci-dessous.

### Architecture

```
Internet
   │
   ▼
ftf-frontend-prod (Nginx 1.31.3) :80 / :443
   │  fichier : /opt/ftf/docker/nginx.conf
   │
   ├─ Host: falltradingfarmer.com  → SPA FTF (inchangé)
   └─ Host: mameboufall.com        → portfolio-mamebou-fall:3000
                                      (réseau Docker ftf-prod)
```

Règles :

- Nginx tourne **dans** le conteneur FTF (`ftf-frontend-prod`), pas en
  package système.
- Le portfolio rejoint le réseau externe **`ftf-prod`**
  ([`docker-compose.hetzner.yml`](../docker-compose.hetzner.yml)).
- Bind hôte `127.0.0.1:3010` (debug local) ; le proxy utilise le nom de
  conteneur.
- On **ajoute** des blocs `server` dans `nginx.conf` ; on ne remplace pas
  les vhosts FTF.
- Fichiers utiles :
  - [`deploy/hetzner/nginx-mameboufall.conf`](../deploy/hetzner/nginx-mameboufall.conf)
  - [`deploy/hetzner/setup-portfolio.sh`](../deploy/hetzner/setup-portfolio.sh)
  - [`deploy/hetzner/issue-ssl.sh`](../deploy/hetzner/issue-ssl.sh)
  - [`docker-compose.hetzner.yml`](../docker-compose.hetzner.yml)

Serveur cible :

| Champ | Valeur |
| ----- | ------ |
| Projet Hetzner | VBS Digital |
| Serveur | `ubuntu-8gb-fsn1-1` (CX33) |
| IPv4 | `46.224.76.38` |
| Proxy | Nginx dans `ftf-frontend-prod` |
| App coexistante | FTF · [falltradingfarmer.com](https://falltradingfarmer.com) |
| Portfolio | `/opt/portfolio` · conteneur `portfolio-mamebou-fall` |

### A.1. Inspecter (optionnel mais recommandé)

En SSH sur le VPS :

```bash
curl -fsSL https://raw.githubusercontent.com/FALL21/Mon_portfolio/main/deploy/hetzner/inspect.sh | bash
```

Vérifiez que les ports `80`/`443` sont bien tenus par Nginx, et que `3010`
est libre.

### A.2. Déployer le portfolio (Docker)

```bash
sudo mkdir -p /opt/portfolio
sudo git clone https://github.com/FALL21/Mon_portfolio.git /opt/portfolio
# si déjà cloné : sudo git -C /opt/portfolio pull --ff-only
cd /opt/portfolio
sudo docker compose -f docker-compose.yml -f docker-compose.hetzner.yml up -d --build
curl -sI http://127.0.0.1:3010 | head -5
```

Attendu : HTTP **200**. FTF n'est pas redémarré.

### A.3. Ajouter le vhost dans Nginx FTF (sans casser FTF)

1. Sauvegarder : `cp /opt/ftf/docker/nginx.conf /opt/ftf/docker/nginx.conf.bak`
2. **Ajouter** (pas remplacer) le contenu de
   [`deploy/hetzner/nginx-mameboufall.conf`](../deploy/hetzner/nginx-mameboufall.conf)
   à la fin de `/opt/ftf/docker/nginx.conf`
3. Recharger :

```bash
docker exec ftf-frontend-prod nginx -t
docker exec ftf-frontend-prod nginx -s reload
```

Test avant bascule DNS :

```bash
curl -sI -H 'Host: mameboufall.com' http://127.0.0.1 | head -10
# → 200, title portfolio
curl -skI https://falltradingfarmer.com | head -10
# → 200 FTF
```

### A.4. Bascule DNS Namecheap (à faire manuellement)

Dans **Advanced DNS**, remplacer les enregistrements Vercel par :

| Type | Host | Value | TTL |
| ---- | ---- | ----- | --- |
| **A** | `@` | `46.224.76.38` | Automatic |
| **A** | `www` | `46.224.76.38` | Automatic |

À supprimer : IP / CNAME Vercel, URL Redirect conflictuels.

Dans **Vercel → Domains** : retirer `mameboufall.com` et `www`.

### A.5. SSL après propagation DNS

Voir le détail dans [09 §4.6](./09-deploiement-hetzner.md#46-certificat-ssl-lets-encrypt) :

```bash
dig +short A mameboufall.com @8.8.8.8   # → 46.224.76.38
bash /opt/portfolio/deploy/hetzner/issue-ssl.sh
docker exec ftf-frontend-prod nginx -t && docker exec ftf-frontend-prod nginx -s reload
```

### A.6. Vérification

```bash
curl -sI https://mameboufall.com | head -15
curl -skI https://falltradingfarmer.com | head -10
```

### A.7. Mises à jour du portfolio

```bash
cd /opt/portfolio
sudo git pull --ff-only
sudo docker compose -f docker-compose.yml -f docker-compose.hetzner.yml up -d --build
docker exec ftf-frontend-prod nginx -s reload   # si upstream a changé d'IP
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
| Guide Hetzner complet | `docs/09-deploiement-hetzner.md` |
| Dépôt distant | `https://github.com/FALL21/Mon_portfolio.git` |

---

[Chapitre précédent → Composants](./05-composants.md) ·
[Chapitre suivant → SEO & performance](./07-seo-performance.md) ·
[Guide Hetzner détaillé →](./09-deploiement-hetzner.md)
