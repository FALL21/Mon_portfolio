# 01 · Installation & prise en main

[← Retour au sommaire](./README.md)

---

## Prérequis

Deux façons de lancer le portfolio. Choisissez selon votre environnement.

| Méthode | Prérequis | Recommandé pour |
| ------- | --------- | --------------- |
| **Docker** | Docker Engine 24+ et Docker Compose v2 | Mise en production, environnement reproductible |
| **Node.js** | Node.js **20 ou 22** (LTS) et npm 10+ | Développement, itération rapide sur le contenu |

Vérifier les versions installées :

```bash
docker --version && docker compose version   # méthode Docker
node --version && npm --version               # méthode Node
```

---

## Méthode A : Docker (recommandée)

À la racine du projet (le dossier contenant le `Dockerfile`) :

```bash
docker compose up --build
```

Le site est servi sur **http://localhost:3000**.

Commandes courantes :

```bash
docker compose up -d --build   # lancer en arrière-plan (détaché)
docker compose logs -f         # suivre les logs
docker compose ps              # état du conteneur + healthcheck
docker compose down            # arrêter et supprimer le conteneur
docker compose up -d --build   # redéployer après modification
```

Le premier build prend 1 à 3 minutes (téléchargement de l'image Node + `npm ci` +
build Next.js). Les builds suivants sont plus rapides grâce au cache Docker.

### Sans Docker Compose (Docker seul)

```bash
docker build -t portfolio-mamebou-fall .
docker run -p 3000:3000 portfolio-mamebou-fall
```

---

## Méthode B : Node.js (développement)

```bash
npm install        # installe les dépendances (une seule fois)
npm run dev        # serveur de développement avec rechargement à chaud
```

→ http://localhost:3000. Toute modification d'un fichier `.tsx` ou de
`portfolio.ts` se recharge automatiquement dans le navigateur.

Pour tester la version de production en local :

```bash
npm run build      # génère la build optimisée (.next/)
npm run start      # sert la build de production sur le port 3000
```

---

## Scripts npm disponibles

| Script | Commande | Effet |
| ------ | -------- | ----- |
| `dev`   | `npm run dev`   | Serveur de développement (hot reload). |
| `build` | `npm run build` | Build de production optimisée. |
| `start` | `npm run start` | Sert la build de production (port 3000). |

Définis dans [`package.json`](../package.json).

---

## Changer le port

- **Docker Compose** : éditer le mappage dans `docker-compose.yml`, par ex.
  `- "8080:3000"` pour exposer le site sur `http://localhost:8080`.
- **Node local** : `PORT=8080 npm run start`.

---

[Chapitre suivant → Architecture](./02-architecture.md)
