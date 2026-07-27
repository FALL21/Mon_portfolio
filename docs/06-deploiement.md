# 06 · Déploiement

[← Retour au sommaire](./README.md)

---

Guide complet pour mettre le portfolio en production. Trois options sont
documentées ; **Vercel + domaine `mameboufall.com`** est la voie utilisée en
production actuelle.

| Méthode | Quand l'utiliser | Difficulté |
| ------- | ---------------- | ---------- |
| **[A. Vercel](#a-déploiement-vercel--recommandé)** | Production rapide, HTTPS, CDN, Git | Facile |
| **[B. Docker local / Compose](#b-docker-local--compose)** | Test production en local | Facile |
| **[C. VPS + Docker](#c-vps--docker--reverse-proxy)** | Contrôle total du serveur | Moyenne |

---

## Prérequis communs

- Compte **GitHub** avec le dépôt :
  [`FALL21/Mon_portfolio`](https://github.com/FALL21/Mon_portfolio)
- Domaine **`mameboufall.com`** (registrar : Namecheap ou équivalent)
- URLs SEO déjà alignées dans le code :
  - `src/app/layout.tsx` → `metadataBase`
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`

Si vous changez de domaine, mettez à jour ces trois fichiers puis committez /
poussez. Voir [chapitre 07](./07-seo-performance.md).

---

## A. Déploiement Vercel (recommandé)

Next.js est édité par Vercel. Sur cette plateforme, `output: "standalone"`
(dans `next.config.mjs`) est **ignoré** : Vercel gère l'empaquetage lui-même.
Rien à changer dans le Dockerfile pour cette méthode.

### A.1. Connecter le dépôt GitHub

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous.
2. **Add New… → Project**.
3. Importez **`FALL21/Mon_portfolio`** (branche `main`).
4. Réglages attendus :

   | Champ | Valeur |
   | ----- | ------ |
   | Framework Preset | **Next.js** (détecté automatiquement) |
   | Root Directory | `./` |
   | Build Command | `next build` (défaut) |
   | Output Directory | (laisser le défaut Next.js) |
   | Install Command | `npm install` (défaut) |

5. Variables d'environnement : **aucune n'est requise** pour ce portfolio.
6. Cliquez sur **Deploy**.

À la fin du build, Vercel fournit une URL temporaire du type :

```text
https://mon-portfolio-xxxx.vercel.app
```

Vérifiez que cette URL affiche bien le site avant d'ajouter le domaine
personnalisé.

### A.2. Ajouter le domaine `mameboufall.com`

1. Projet Vercel → **Settings** → **Domains**.
2. Ajoutez :
   - `mameboufall.com`
   - `www.mameboufall.com`
3. Configuration **recommandée** (domaine principal = apex) :

   | Domaine | Réglage Vercel |
   | ------- | -------------- |
   | `mameboufall.com` | **Connect to environment** → **Production** |
   | `www.mameboufall.com` | **Redirect** → `mameboufall.com` (308 permanent) |

> Important : ne redirigez **pas** `www` vers l'URL `*.vercel.app`. La cible
> doit être `mameboufall.com`.

4. Cliquez sur **Save** / **Sauvegarder**.

### A.3. DNS chez le registrar (Namecheap)

Dans **Advanced DNS**, configurez exactement :

| Type | Host | Value | TTL |
| ---- | ---- | ----- | --- |
| **A** | `@` | `216.198.79.1` | Automatic |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic |

#### À ne pas faire

- Ne laissez **pas** un CNAME `www` vers `parkingpage.namecheap.com`
  (page parking Namecheap).
- Ne cumulez **pas** un **URL Redirect Record** sur `@` avec le **A Record**
  vers Vercel : les deux se contredisent.
- N'utilisez pas d'ancien IP Vercel (`76.76.21.21`) si le tableau Domains
  affiche une nouvelle IP recommandée : suivez la valeur indiquée dans Vercel
  (aujourd'hui typiquement `216.198.79.1`).

Cliquez sur **Save All Changes** chez Namecheap.

### A.4. SSL (HTTPS)

Vercel obtient automatiquement un certificat Let's Encrypt.

Statuts possibles dans **Domains** :

| Statut | Signification | Action |
| ------ | ------------- | ------ |
| Valid Configuration | DNS + SSL OK | Aucune |
| Generating SSL Certificate | Certificat en cours | Attendre 1–15 min, puis Rafraîchir |
| Invalid Configuration | DNS incorrect ou non propagé | Corriger le DNS, Rafraîchir |
| DNS Change Recommended | Nouvelle IP Vercel suggérée | Mettre à jour le A Record |

### A.5. Vérification

```bash
# DNS
nslookup -type=A mameboufall.com 8.8.8.8
nslookup -type=CNAME www.mameboufall.com 8.8.8.8

# Site (doit répondre 200 sur l'apex une fois la config ci-dessus appliquée)
curl -sI https://mameboufall.com | head -15
curl -sI https://www.mameboufall.com | head -15
```

Attendu :

- Apex `A` → IP Vercel (`216.198.79.1` ou celle affichée dans le dashboard)
- `www` CNAME → `cname.vercel-dns.com` (ou un alias `*.vercel-dns-*.com`)
- `https://mameboufall.com` → **200**
- `https://www.mameboufall.com` → **308** vers `https://mameboufall.com/`

URL de production : **[https://mameboufall.com](https://mameboufall.com)**

### A.6. Mises à jour après le premier déploiement

Chaque `git push` sur `main` redéploie automatiquement :

```bash
# depuis la machine locale
git add -A
git commit -m "Mise à jour du contenu"
git push origin main
```

Suivez le build dans Vercel → **Deployments**. En cas d'échec, consultez les
logs de build (souvent une erreur TypeScript ou une dépendance manquante).

### A.7. Dépannage DNS / navigateur

**Symptôme :** Vercel affiche « Configuration valide » mais Chrome montre
`ERR_CONNECTION_CLOSED` sur `www`.

**Cause fréquente :** cache DNS local encore pointé vers
`parkingpage.namecheap.com` (`216.227.142.170`), alors que Google DNS (`8.8.8.8`)
a déjà la bonne valeur Vercel.

**Solutions :**

1. Vider le cache DNS macOS :

   ```bash
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

2. Tester en navigation privée, ou forcer le DNS `8.8.8.8` / `1.1.1.1`.
3. Vérifier avec :

   ```bash
   dig +short www.mameboufall.com @8.8.8.8
   dig +short www.mameboufall.com   # résolveur local
   ```

4. Utiliser l'apex `https://mameboufall.com` en attendant la fin de propagation
   de `www` (quelques minutes à 48 h selon le TTL).

Plus de cas dans le [chapitre 08 · Dépannage](./08-depannage.md).

---

## B. Docker local / Compose

Utile pour valider le build de production avant un push, ou pour une démo
hors-ligne.

### Build & démarrage

```bash
docker compose up -d --build
```

Site : **http://localhost:3000**

```bash
docker compose ps          # état + healthcheck
docker compose logs -f     # logs
docker compose down        # arrêt
```

### Dockerfile (rappel)

[`Dockerfile`](../Dockerfile) : construction **multi-stage** en trois étapes.

| Étape | Base | Rôle |
| ----- | ---- | ---- |
| `deps` | `node:22-alpine` | `npm ci` |
| `builder` | `node:22-alpine` | `npm run build` |
| `runner` | `node:22-alpine` | Image finale (`public/`, `.next/standalone`, `.next/static`) |

Points clés :

- Utilisateur non-root `nextjs` (uid 1001)
- `output: "standalone"` → image légère
- `CMD ["node", "server.js"]`
- `NEXT_TELEMETRY_DISABLED=1`

[`docker-compose.yml`](../docker-compose.yml) :

- Port `3000:3000`
- `restart: unless-stopped`
- Healthcheck HTTP sur `http://localhost:3000`

### Docker sans Compose

```bash
docker build -t portfolio-mamebou-fall .
docker run --rm -p 3000:3000 portfolio-mamebou-fall
```

---

## C. VPS + Docker + reverse proxy

Pour un serveur (Hetzner, DigitalOcean, OVH, etc.) :

1. Installer **Docker Engine** + plugin **Compose**.
2. Cloner le dépôt :

   ```bash
   git clone https://github.com/FALL21/Mon_portfolio.git
   cd Mon_portfolio
   docker compose up -d --build
   ```

3. Placer un reverse proxy HTTPS devant le port `3000`.

### Caddy (HTTPS automatique)

`Caddyfile` :

```
mameboufall.com, www.mameboufall.com {
    reverse_proxy localhost:3000
}
```

Redirection `www` → apex (optionnel, dans Caddy) :

```
www.mameboufall.com {
    redir https://mameboufall.com{uri} permanent
}

mameboufall.com {
    reverse_proxy localhost:3000
}
```

DNS VPS typique (hors Vercel) :

| Type | Host | Value |
| ---- | ---- | ----- |
| A | `@` | IP publique du VPS |
| A ou CNAME | `www` | IP du VPS ou `@` |

### Nginx + Certbot

```nginx
server {
    listen 80;
    server_name mameboufall.com www.mameboufall.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Puis :

```bash
sudo certbot --nginx -d mameboufall.com -d www.mameboufall.com
```

### Mise à jour sur VPS

```bash
git pull
docker compose up -d --build
```

---

## Checklist de mise en production

- [ ] Code poussé sur `main` (`FALL21/Mon_portfolio`)
- [ ] Build Vercel (ou Docker) réussi
- [ ] URL `*.vercel.app` (ou `localhost:3000`) testée
- [ ] Domaines `mameboufall.com` + `www` ajoutés dans Vercel
- [ ] Apex = Production ; `www` = redirect 308 vers apex
- [ ] DNS A `@` → IP Vercel ; CNAME `www` → `cname.vercel-dns.com.`
- [ ] Pas de parking Namecheap ni de URL Redirect conflictuel sur `@`
- [ ] SSL « Valid Configuration » sur les deux domaines
- [ ] `https://mameboufall.com` répond 200
- [ ] Photo (`public/profile.jpg`) et CV (`public/CV_Mame_Bou_FALL.pdf`) OK
- [ ] Liens contact / LinkedIn / VBS vérifiés

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
| Mode standalone | `next.config.mjs` |
| Variables (optionnel) | `.env.example` |
| Dépôt distant | `https://github.com/FALL21/Mon_portfolio.git` |

---

[Chapitre précédent → Composants](./05-composants.md) ·
[Chapitre suivant → SEO & performance](./07-seo-performance.md)
