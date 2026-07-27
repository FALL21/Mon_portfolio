# Documentation · Portfolio Mame Bou FALL

Bienvenue dans la documentation technique du portfolio. Elle couvre l'installation,
l'architecture, la personnalisation du contenu, le système de design, la référence
des composants, le déploiement, le SEO/performance et le dépannage.

> Public visé : la personne qui installe, personnalise, déploie ou fait évoluer ce
> portfolio. Aucune connaissance préalable de Next.js n'est requise pour la
> personnalisation de base (section 3).

## Sommaire

| #  | Chapitre | Contenu |
| -- | -------- | ------- |
| 01 | [Installation & prise en main](./01-installation.md) | Prérequis, lancement Docker et local, commandes utiles. |
| 02 | [Architecture](./02-architecture.md) | Stack, arborescence, flux de rendu, choix techniques. |
| 03 | [Personnalisation du contenu](./03-personnalisation.md) | Éditer `portfolio.ts`, changer la photo, le CV, les projets. |
| 04 | [Système de design](./04-design-system.md) | Couleurs, typographie, tokens, glassmorphism, la signature *NeuralMesh*. |
| 05 | [Référence des composants](./05-composants.md) | Rôle et props de chaque composant `src/components`. |
| 06 | [Déploiement](./06-deploiement.md) | Vercel + domaine, DNS Namecheap, Docker, VPS. |
| 07 | [SEO & performance](./07-seo-performance.md) | Metadata, Open Graph, JSON-LD, sitemap, optimisations. |
| 08 | [Dépannage & FAQ](./08-depannage.md) | Problèmes fréquents et solutions. |

## Démarrage express

```bash
docker compose up --build      # → http://localhost:3000
```

ou, sans Docker (Node.js 20+) :

```bash
npm install && npm run dev
```

## Résumé du projet

Portfolio personnel **Next.js 15 / TypeScript / Tailwind CSS / Framer Motion**,
dark mode, glassmorphism, entièrement dockerisé. Tout le contenu éditorial est
centralisé dans **un seul fichier** : [`src/data/portfolio.ts`](../src/data/portfolio.ts).

Pour toute question non couverte ici, se reporter d'abord au chapitre
[Dépannage & FAQ](./08-depannage.md).
