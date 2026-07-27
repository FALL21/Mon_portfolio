# Portfolio · Mame Bou FALL

Portfolio personnel de **Mame Bou FALL** · Ingénieur IA & Big Data · Développeur Full Stack.

Interface moderne, dark mode, glassmorphism et animations fluides. Conçu avec **Next.js 15**, **TypeScript**, **Tailwind CSS** et **Framer Motion**, entièrement **dockerisé**.

---

## ✨ Points forts

- **Design premium** inspiré de Vercel / Linear / Stripe : palette vert forêt, glassmorphism, typographie soignée.
- **Signature visuelle** : un maillage de points animé (canvas) façon *face-mesh / espace d'embeddings*, en écho au pipeline de reconnaissance faciale (SCRFD + ArcFace).
- **Sections** : Hero, Statistiques animées, À propos, Parcours, Compétences, Services, Projets, Expérience, Formation, Contact.
- **Performances** : rendu statique, ~162 kB de JS au premier chargement, polices auto-hébergées (aucune requête Google Fonts).
- **SEO** : metadata, Open Graph, Twitter Cards, JSON-LD (Person), `robots.txt`, `sitemap.xml`, favicon.
- **Accessibilité** : navigation clavier, focus visible, `prefers-reduced-motion` respecté.
- **Responsive** : mobile, tablette, desktop.

---

## 🚀 Démarrage rapide

### Option A : Docker Compose (recommandé)

Prérequis : **Docker** + **Docker Compose**.

```bash
docker compose up --build
```

Le site est accessible sur **http://localhost:3000**.

Pour lancer en arrière-plan :

```bash
docker compose up -d --build
```

Pour arrêter :

```bash
docker compose down
```

### Option B : Docker seul

```bash
docker build -t portfolio-mamebou-fall .
docker run -p 3000:3000 portfolio-mamebou-fall
```

### Option C : En local (sans Docker)

Prérequis : **Node.js 20+**.

```bash
npm install
npm run dev      # développement  → http://localhost:3000
```

Build de production :

```bash
npm run build
npm run start
```

---

## 📚 Documentation

Une documentation technique complète est disponible dans le dossier
**[`docs/`](./docs/README.md)** :

| # | Chapitre | |
| - | -------- | - |
| 01 | [Installation & prise en main](./docs/01-installation.md) | Prérequis, Docker, Node. |
| 02 | [Architecture](./docs/02-architecture.md) | Stack, arborescence, choix techniques. |
| 03 | [Personnalisation du contenu](./docs/03-personnalisation.md) | Éditer le texte, la photo, le CV, les projets. |
| 04 | [Système de design](./docs/04-design-system.md) | Couleurs, polices, animations. |
| 05 | [Référence des composants](./docs/05-composants.md) | Chaque composant expliqué. |
| 06 | [Déploiement](./docs/06-deploiement.md) | Vercel + domaine, DNS, Docker, VPS. |
| 07 | [SEO & performance](./docs/07-seo-performance.md) | Metadata, sitemap, optimisations. |
| 08 | [Dépannage & FAQ](./docs/08-depannage.md) | Problèmes fréquents et solutions. |

---

## 🗂️ Structure du projet

```
portfolio-mamebou-fall/
├── Dockerfile              # build multi-stage, image légère non-root
├── docker-compose.yml      # orchestration + healthcheck
├── next.config.mjs         # output: "standalone" (Docker)
├── tailwind.config.ts      # thème & couleurs
├── public/
│   ├── profile.jpg         # photo de profil
│   └── CV_Mame_Bou_FALL.pdf # CV téléchargeable
└── src/
    ├── app/                # layout, page, styles, SEO (robots/sitemap/icon)
    ├── components/         # Hero, About, Projects, Skills, etc.
    └── data/
        └── portfolio.ts    # ← TOUT le contenu (à éditer ici)
```

---

## ✏️ Personnaliser le contenu

Presque tout se modifie dans un seul fichier : **`src/data/portfolio.ts`**.
On y trouve les informations de profil, les statistiques, le parcours, les
compétences, les services, les projets, les expériences et la formation.

- **Changer la photo** : remplacer `public/profile.jpg`.
- **Changer le CV** : remplacer `public/CV_Mame_Bou_FALL.pdf` (garder le même nom,
  ou mettre à jour `profile.cvPath` dans `portfolio.ts`).
- **Couleurs** : `tailwind.config.ts` (clé `colors`) et les variables dans
  `src/app/globals.css`.

---

## 🧰 Stack technique

| Domaine     | Technologies                                        |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 15 (App Router), React 19                   |
| Langage     | TypeScript                                          |
| Styles      | Tailwind CSS 3, glassmorphism                       |
| Animations  | Framer Motion, canvas 2D                            |
| Icônes      | lucide-react                                        |
| Polices     | Inter · Plus Jakarta Sans · JetBrains Mono (auto-hébergées) |
| Conteneur   | Docker (multi-stage) + Docker Compose               |

---

## 📦 Déploiement

- **Vercel** : importer le dépôt, aucune configuration nécessaire.
- **VPS / Hetzner** : `docker compose up -d --build` derrière un reverse proxy
  (Nginx / Caddy / Traefik) pour le HTTPS.

---

© Mame Bou FALL · « La technologie prend tout son sens lorsqu'elle résout des problèmes réels. »
