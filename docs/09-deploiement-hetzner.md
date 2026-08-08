# 09 · Déploiement Hetzner (production)

[← Retour au sommaire](./README.md)

---

Guide **complet** du déploiement en production du portfolio sur le VPS
**Hetzner**, domaine **`mameboufall.com`**, **sans casser** l'application
déjà hébergée (**FTF · Fall Trading Farmer** · `falltradingfarmer.com`).

Ce chapitre est la référence opérationnelle. Le [chapitre 06](./06-deploiement.md)
reste la vue d'ensemble (Hetzner / Docker local / Vercel preview).

---

## 1. État de production (référence)

| Élément | Valeur |
| ------- | ------ |
| Cloud | [Hetzner Cloud](https://console.hetzner.cloud) · projet **VBS Digital** |
| Serveur | `ubuntu-8gb-fsn1-1` · type **CX33** · Falkenstein |
| OS | Ubuntu 26.04 LTS |
| IPv4 | `46.224.76.38` |
| Domaine portfolio | [https://mameboufall.com](https://mameboufall.com) |
| Registrar DNS | Namecheap (`dns1/dns2.registrar-servers.com`) |
| App coexistante | [https://falltradingfarmer.com](https://falltradingfarmer.com) |
| Chemin portfolio | `/opt/portfolio` |
| Conteneur portfolio | `portfolio-mamebou-fall` |
| Reverse proxy | Nginx **1.31.3** dans `ftf-frontend-prod` |
| Config Nginx | `/opt/ftf/docker/nginx.conf` |
| Certificats | `/opt/ftf/certbot/conf/live/mameboufall.com/` |
| Réseau Docker partagé | `ftf-prod` |
| Dépôt Git | [FALL21/Mon_portfolio](https://github.com/FALL21/Mon_portfolio) |

URL de production : **[https://mameboufall.com](https://mameboufall.com)**

---

## 2. Architecture

```
Internet
   │
   │  DNS A mameboufall.com / www  →  46.224.76.38
   │  DNS A falltradingfarmer.com  →  46.224.76.38
   ▼
┌─────────────────────────────────────────────────────────┐
│  Conteneur ftf-frontend-prod (Nginx :80 / :443)         │
│  Volume : /opt/ftf/docker/nginx.conf → conf.d/default   │
│  Volume : /opt/ftf/certbot/conf → /etc/nginx/ssl         │
│  Volume : /opt/ftf/certbot/www  → /var/www/certbot       │
│                                                         │
│  Host: falltradingfarmer.com  → fichiers SPA FTF        │
│  Host: mameboufall.com        → portfolio-mamebou-fall:3000
└──────────────────────────┬──────────────────────────────┘
                           │ réseau Docker ftf-prod
                           ▼
              ┌────────────────────────────┐
              │ portfolio-mamebou-fall     │
              │ Next.js standalone :3000   │
              │ (bind hôte 127.0.0.1:3010) │
              └────────────────────────────┘
```

### Règles d'or (ne pas casser FTF)

1. **Ne jamais** remplacer entièrement `/opt/ftf/docker/nginx.conf` : on
   **ajoute** des blocs `server` pour `mameboufall.com`.
2. **Ne pas** republier les ports `80`/`443` pour le portfolio : ils
   appartiennent à `ftf-frontend-prod`.
3. Le portfolio rejoint le réseau externe **`ftf-prod`** pour que Nginx
   résolve `portfolio-mamebou-fall` par nom de conteneur.
4. Le bind `127.0.0.1:3010` sert uniquement au debug depuis le VPS ; le
   trafic public passe par Nginx.

### Pourquoi pas un Nginx système ?

FTF expose déjà Nginx **dans Docker** (`0.0.0.0:80` et `:443` via
`docker-proxy`). Il n'y a **pas** de binaire `nginx` installé sur l'hôte.
Toute config HTTPS / ACME doit donc passer par ce conteneur et les volumes
Certbot FTF.

---

## 3. Prérequis

### Sur le VPS

- Accès SSH root (ou sudo) : `ssh root@46.224.76.38`
- Docker Engine + plugin Compose (`docker compose version`)
- Stack FTF déjà up (`ftf-frontend-prod`, réseau `ftf-prod`)
- Ports `3010` libre sur l'hôte

### Depuis votre machine / compte

- Dépôt GitHub : [`FALL21/Mon_portfolio`](https://github.com/FALL21/Mon_portfolio)
- Accès Namecheap → domaine `mameboufall.com` → **Advanced DNS**
- (Optionnel) Projet Vercel pour retirer les domaines custom

### Fichiers du dépôt utiles

| Fichier | Rôle |
| ------- | ---- |
| [`Dockerfile`](../Dockerfile) | Build multi-stage Next.js standalone |
| [`docker-compose.yml`](../docker-compose.yml) | Compose de base |
| [`docker-compose.hetzner.yml`](../docker-compose.hetzner.yml) | Overlay prod : port `3010` + réseau `ftf-prod` |
| [`deploy/hetzner/nginx-mameboufall.conf`](../deploy/hetzner/nginx-mameboufall.conf) | Blocs Nginx HTTP→HTTPS + proxy |
| [`deploy/hetzner/inspect.sh`](../deploy/hetzner/inspect.sh) | Diagnostic serveur |
| [`deploy/hetzner/setup-portfolio.sh`](../deploy/hetzner/setup-portfolio.sh) | Script d'install assisté |
| [`deploy/hetzner/issue-ssl.sh`](../deploy/hetzner/issue-ssl.sh) | Certificat Let's Encrypt (webroot) |
| [`deploy/hetzner/.env.example`](../deploy/hetzner/.env.example) | Exemple `PORTFOLIO_PUBLISH` |

---

## 4. Déploiement pas à pas (depuis zéro)

### 4.1. Connexion SSH

```bash
ssh -o ServerAliveInterval=30 root@46.224.76.38
```

`ServerAliveInterval` limite les coupures *Broken pipe* sur sessions longues.

### 4.2. Inspecter le serveur

```bash
curl -fsSL https://raw.githubusercontent.com/FALL21/Mon_portfolio/main/deploy/hetzner/inspect.sh | bash
```

Contrôles attendus :

- Ports `80` / `443` tenus par `docker-proxy` (conteneur FTF)
- Conteneur `ftf-frontend-prod` **Up**
- Pas de Nginx système (`nginx: command not found` est normal)
- Port `3010` libre

### 4.3. Cloner et démarrer le portfolio

```bash
mkdir -p /opt/portfolio
git clone https://github.com/FALL21/Mon_portfolio.git /opt/portfolio
# si déjà présent :
# git -C /opt/portfolio pull --ff-only origin main

cd /opt/portfolio
docker compose -f docker-compose.yml -f docker-compose.hetzner.yml up -d --build
```

Vérification locale :

```bash
docker compose -f docker-compose.yml -f docker-compose.hetzner.yml ps
curl -sI http://127.0.0.1:3010 | head -8
# Attendu : HTTP/1.1 200 OK
```

Le conteneur doit apparaître dans le réseau `ftf-prod` :

```bash
docker network inspect ftf-prod --format '{{range .Containers}}{{.Name}} {{end}}'
# doit contenir : portfolio-mamebou-fall … ftf-frontend-prod …
```

### 4.4. Ajouter le vhost Nginx (sans toucher FTF)

1. Sauvegarder la config actuelle :

   ```bash
   cp -a /opt/ftf/docker/nginx.conf \
     /opt/ftf/docker/nginx.conf.bak.$(date +%Y%m%d%H%M%S)
   ```

2. **Avant le certificat SSL**, vous pouvez d'abord coller une version HTTP
   seule (proxy + ACME). En production actuelle, le fichier de référence
   complète (HTTP→HTTPS + SSL) est :

   [`deploy/hetzner/nginx-mameboufall.conf`](../deploy/hetzner/nginx-mameboufall.conf)

3. **Ajouter** (concaténer) ce contenu **à la fin** de
   `/opt/ftf/docker/nginx.conf`. Ne pas effacer les blocs
   `falltradingfarmer.com`.

4. Recharger Nginx **dans le conteneur** :

   ```bash
   docker exec ftf-frontend-prod nginx -t
   docker exec ftf-frontend-prod nginx -s reload
   ```

5. Test par en-tête `Host` (avant ou après DNS) :

   ```bash
   curl -sI -H 'Host: mameboufall.com' http://127.0.0.1 | head -10
   curl -skI https://falltradingfarmer.com | head -10
   ```

   Attendu : portfolio **200** ; FTF toujours **200**.

> Si le certificat n'existe pas encore, activez d'abord uniquement le
> `server { listen 80; … }` + ACME, obtenez le cert (§4.6), puis ajoutez le
> bloc `listen 443 ssl`.

### 4.5. DNS Namecheap

Dans **Domain List → mameboufall.com → Advanced DNS** :

| Type | Host | Value | Action |
| ---- | ---- | ----- | ------ |
| **A** | `@` | `46.224.76.38` | Créer / mettre à jour |
| **A** | `www` | `46.224.76.38` | Créer / mettre à jour |

**À supprimer** (conflits) :

- A / AAAA pointant vers des IP Vercel (`216.198.79.x`, etc.)
- CNAME `www` → `cname.vercel-dns.com` ou `*.vercel-dns-*.com`
- URL Redirect Record sur `@` en conflit avec le A Record

Vérification :

```bash
dig +short A mameboufall.com @8.8.8.8
# → 46.224.76.38
dig +short A www.mameboufall.com @8.8.8.8
# → 46.224.76.38
dig +short CNAME www.mameboufall.com @8.8.8.8
# → (vide)
```

Dans **Vercel → projet → Settings → Domains** : retirer
`mameboufall.com` et `www.mameboufall.com` pour éviter les conflits de
certificat / ownership. Garder le projet si vous voulez une preview
`*.vercel.app`.

Propagation : quelques minutes à quelques heures selon le TTL.

### 4.6. Certificat SSL (Let's Encrypt)

Les certificats FTF et portfolio cohabitent dans le **même** volume Certbot :

```text
/opt/ftf/certbot/conf/live/falltradingfarmer.com/
/opt/ftf/certbot/conf/live/mameboufall.com/
```

Émission (webroot, via le conteneur officiel Certbot) :

```bash
# Après DNS A → 46.224.76.38
bash /opt/portfolio/deploy/hetzner/issue-ssl.sh
```

Équivalent manuel :

```bash
docker run --rm \
  -v /opt/ftf/certbot/conf:/etc/letsencrypt \
  -v /opt/ftf/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d mameboufall.com -d www.mameboufall.com \
  --email mameboufall21@gmail.com \
  --agree-tos --non-interactive --expand
```

Le challenge ACME doit être servi par Nginx :

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/certbot;
    default_type "text/plain";
}
```

Puis activer / vérifier le bloc `listen 443 ssl` (chemins) :

```nginx
ssl_certificate     /etc/nginx/ssl/live/mameboufall.com/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/live/mameboufall.com/privkey.pem;
```

Recharger :

```bash
docker exec ftf-frontend-prod nginx -t
docker exec ftf-frontend-prod nginx -s reload
```

Renouvellement : Certbot stocke la config de renouvellement dans le volume.
Un cron / timer sur l'hôte ou un conteneur périodique peut exécuter
`certbot renew` avec les mêmes volumes, puis `nginx -s reload`.

---

## 5. Vérification post-déploiement

```bash
# Portfolio public
curl -4 -sI https://mameboufall.com | head -15
# → HTTP/2 200 , server: nginx/…

curl -4 -s https://mameboufall.com | grep -o '<title>[^<]*</title>'
# → <title>Mame Bou FALL · Ingénieur IA &amp; Big Data</title>

curl -4 -sI https://www.mameboufall.com | head -10
# → 200 ou 301 vers https://mameboufall.com

# FTF intact
curl -4 -skI https://falltradingfarmer.com | head -10
# → HTTP/2 200 , content-length typique FTF (~1573 pour l'index)

# Conteneurs
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

Checklist navigateur :

- [ ] Hero affiche **Ingénieur IA & Big Data** en premier
- [ ] Photo `/profile.jpg` et CV `/CV_Mame_Bou_FALL.pdf` OK
- [ ] Candado HTTPS valide (pas d'alerte certificat)
- [ ] `falltradingfarmer.com` inchangé

---

## 6. Mises à jour du portfolio

```bash
cd /opt/portfolio
git pull --ff-only origin main
docker compose -f docker-compose.yml -f docker-compose.hetzner.yml up -d --build

# Si l'IP du conteneur a changé, rafraîchir la résolution upstream Nginx :
docker exec ftf-frontend-prod nginx -s reload
```

Pas besoin de toucher FTF (`docker compose` dans `/opt/ftf`) pour une
simple mise à jour de contenu / code portfolio.

---

## 7. Commandes d'exploitation

| Action | Commande |
| ------ | -------- |
| Logs portfolio | `docker logs -f portfolio-mamebou-fall` |
| État santé | `docker inspect --format='{{.State.Health.Status}}' portfolio-mamebou-fall` |
| Test config Nginx | `docker exec ftf-frontend-prod nginx -t` |
| Reload Nginx | `docker exec ftf-frontend-prod nginx -s reload` |
| Stop portfolio seul | `cd /opt/portfolio && docker compose -f docker-compose.yml -f docker-compose.hetzner.yml down` |
| Redémarrer portfolio | `docker restart portfolio-mamebou-fall` |
| Backup Nginx | `cp -a /opt/ftf/docker/nginx.conf /opt/ftf/docker/nginx.conf.bak.$(date +%Y%m%d%H%M%S)` |

---

## 8. Rollback rapide

### Portfolio en erreur, FTF OK

```bash
cd /opt/portfolio
docker compose -f docker-compose.yml -f docker-compose.hetzner.yml down
# FTF continue de servir falltradingfarmer.com
```

### Mauvaise config Nginx

```bash
# Restaurer la dernière sauvegarde
cp -a /opt/ftf/docker/nginx.conf.bak.XXXXXXXX /opt/ftf/docker/nginx.conf
docker exec ftf-frontend-prod nginx -t
docker exec ftf-frontend-prod nginx -s reload
```

### Revenir temporairement sur Vercel

1. Remettre les DNS Namecheap vers Vercel (A / CNAME indiqués dans le dashboard Vercel).
2. Réattacher les domaines dans Vercel → Domains.
3. Laisser le conteneur portfolio arrêté ou en place (sans DNS, il n'est plus public).

---

## 9. Dépannage Hetzner

### `502 Bad Gateway` sur mameboufall.com

Causes fréquentes :

- Conteneur portfolio pas encore prêt après un recreate
- Conteneur hors du réseau `ftf-prod`
- Upstream Nginx qui a mis en cache une ancienne IP

```bash
curl -sI http://127.0.0.1:3010 | head -5
docker network connect ftf-prod portfolio-mamebou-fall   # si absent
docker exec ftf-frontend-prod wget -qO- -S http://portfolio-mamebou-fall:3000 2>&1 | head -10
docker exec ftf-frontend-prod nginx -s reload
```

### HTTPS affiche encore FTF au lieu du portfolio

Le vhost SSL `mameboufall.com` est absent : Nginx utilise le premier
`server` 443 (FTF). Vérifiez que le bloc `server_name mameboufall.com`
écoute bien sur `443 ssl` dans `nginx.conf`, puis `nginx -t` + reload.

### Certbot échoue (ACME)

1. DNS A doit déjà pointer vers `46.224.76.38`.
2. Le `location ^~ /.well-known/acme-challenge/` doit exister **avant** le
   `proxy_pass` / redirect HTTPS.
3. Test :

   ```bash
   mkdir -p /opt/ftf/certbot/www/.well-known/acme-challenge
   echo ok > /opt/ftf/certbot/www/.well-known/acme-challenge/ping
   curl -s http://mameboufall.com/.well-known/acme-challenge/ping
   # → ok
   ```

### Le navigateur voit encore Vercel

- Vider le cache DNS macOS :

  ```bash
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  ```

- Forcer IPv4 : `curl -4 -sI https://mameboufall.com`
- Supprimer tout CNAME `www` résiduel vers Vercel
- Retirer les domaines dans Vercel → Domains

### SSH `Broken pipe` / timeout

```bash
ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=3 root@46.224.76.38
```

### Conflit de ports au démarrage Compose

Ne mappez **jamais** `80:80` ou `443:443` sur le service portfolio : ces
ports appartiennent à FTF. Utilisez uniquement
[`docker-compose.hetzner.yml`](../docker-compose.hetzner.yml).

---

## 10. Sécurité & bonnes pratiques

- Portfolio non exposé publiquement hors Nginx (`127.0.0.1:3010` seulement).
- Utilisateur non-root `nextjs` dans l'image Docker.
- HSTS activé sur le vhost HTTPS portfolio.
- Sauvegarder `nginx.conf` avant chaque édition.
- Ne pas committer de secrets (`.env` FTF, clés privées Let's Encrypt).
- Renouveler / surveiller l'expiration des certificats (≈ 90 jours).

---

## 11. Checklist complète

### Première installation

- [ ] SSH OK sur `46.224.76.38`
- [ ] `ftf-frontend-prod` Up, réseau `ftf-prod` présent
- [ ] Clone `/opt/portfolio` depuis GitHub `main`
- [ ] `docker compose … hetzner.yml up -d --build` → 200 sur `:3010`
- [ ] Conteneur joint à `ftf-prod`
- [ ] Backup + append de `nginx-mameboufall.conf`
- [ ] `nginx -t` + reload OK
- [ ] DNS A `@` et `www` → `46.224.76.38` (plus de CNAME Vercel)
- [ ] Domaines retirés de Vercel
- [ ] Certbot webroot OK pour `mameboufall.com` (+ `www`)
- [ ] HTTPS public 200 + titre portfolio
- [ ] FTF HTTPS toujours 200

### Après chaque mise à jour code

- [ ] `git pull` + `docker compose … up -d --build`
- [ ] `curl -sI https://mameboufall.com` → 200
- [ ] `curl -skI https://falltradingfarmer.com` → 200

---

## 12. Schéma récapitulatif des chemins

```text
/opt/portfolio/                          # code + compose portfolio
  docker-compose.yml
  docker-compose.hetzner.yml
  deploy/hetzner/…
  .env                                   # PORTFOLIO_PUBLISH=127.0.0.1:3010 (si utilisé)

/opt/ftf/                                # stack FTF (ne pas casser)
  docker/nginx.conf                      # ← vhosts FTF + mameboufall
  docker-compose.prod.yml
  certbot/conf/live/falltradingfarmer.com/
  certbot/conf/live/mameboufall.com/     # ← certificats portfolio
  certbot/www/                           # ← webroot ACME
```

---

## Voir aussi

- [06 · Déploiement (vue d'ensemble)](./06-deploiement.md)
- [07 · SEO & performance](./07-seo-performance.md)
- [08 · Dépannage & FAQ](./08-depannage.md)
- [01 · Installation](./01-installation.md)

[← Retour au sommaire](./README.md)
