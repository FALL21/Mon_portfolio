# 02 · Architecture

[← Retour au sommaire](./README.md)

---

## Stack technique

| Couche | Technologie | Rôle |
| ------ | ----------- | ---- |
| Framework | **Next.js 15** (App Router) | Rendu, routage, optimisations. |
| UI | **React 19** | Composants. |
| Langage | **TypeScript** | Typage statique. |
| Styles | **Tailwind CSS 3** | Utilitaires + thème personnalisé. |
| Animations | **Framer Motion** + Canvas 2D | Reveals, compteurs, maillage neuronal. |
| Icônes | **lucide-react** | Pictogrammes vectoriels. |
| Polices | **@fontsource** (Inter, Plus Jakarta Sans, JetBrains Mono) | Polices auto-hébergées. |
| Conteneur | **Docker** multi-stage + Compose | Empaquetage et exécution. |

---

## Arborescence

```
portfolio-mamebou-fall/
├── Dockerfile              # Build multi-stage (deps → builder → runner)
├── docker-compose.yml      # Orchestration + healthcheck
├── .dockerignore           # Fichiers exclus du contexte Docker
├── next.config.mjs         # output: "standalone", options build
├── tailwind.config.ts      # Thème : couleurs, polices, animations
├── postcss.config.mjs      # Tailwind + Autoprefixer
├── tsconfig.json           # Config TypeScript (alias @/*)
├── package.json            # Dépendances et scripts
├── docs/                   # ← Cette documentation
├── public/                 # Fichiers statiques servis tels quels
│   ├── profile.jpg         #   Photo de profil
│   └── CV_Mame_Bou_FALL.pdf#   CV téléchargeable
└── src/
    ├── app/                # App Router
    │   ├── layout.tsx      #   Layout racine : polices, metadata, JSON-LD
    │   ├── page.tsx        #   Page d'accueil : assemble les sections
    │   ├── globals.css     #   Styles globaux, tokens, classes utilitaires
    │   ├── icon.svg        #   Favicon (monogramme MB)
    │   ├── robots.ts       #   Génère /robots.txt
    │   └── sitemap.ts      #   Génère /sitemap.xml
    ├── components/         # Composants d'interface (voir chapitre 05)
    └── data/
        └── portfolio.ts    # ← TOUT le contenu éditorial
```

---

## Flux de rendu

1. **`src/app/layout.tsx`** est le point d'entrée. Il importe les polices
   auto-hébergées, applique les métadonnées SEO et injecte le JSON-LD (Person),
   puis rend `{children}`.
2. **`src/app/page.tsx`** assemble, dans l'ordre, les sections :
   `ScrollProgress → Navbar → Hero → Stats → About → Timeline → Skills →
   Services → Projects → Experience → Contact → Footer`.
3. Chaque section lit ses données depuis **`src/data/portfolio.ts`**. Aucune
   donnée n'est codée en dur dans les composants d'affichage.

### Composants serveur vs client

- Next.js rend par défaut des **composants serveur** (pas de JavaScript envoyé au
  navigateur).
- Les composants interactifs ou animés portent la directive `"use client"` en
  première ligne (`Hero`, `Navbar`, `Stats`, `NeuralMesh`, etc.), car ils
  utilisent des hooks React (`useState`, `useEffect`) ou Framer Motion.
- `SectionHeading` et `Footer` restent des composants serveur (statiques).

---

## Choix techniques notables

### `output: "standalone"`

Dans `next.config.mjs`, cette option demande à Next.js de produire, à la
compilation, un dossier `.next/standalone` **auto-suffisant** contenant un
`server.js` et uniquement les dépendances réellement utilisées. C'est ce qui
permet une image Docker finale légère (voir [chapitre 06](./06-deploiement.md)).

### Polices auto-hébergées

Plutôt que `next/font/google` (qui télécharge les polices depuis Google au moment
du build), le projet utilise les paquets **`@fontsource/*`**. Les fichiers de
police sont donc versionnés dans `node_modules` et empaquetés localement. Avantages :

- Build **reproductible et hors-ligne** (aucun appel réseau vers Google).
- Respect de la vie privée (pas de requête vers les serveurs Google côté visiteur).

Les familles sont déclarées comme variables CSS dans `globals.css`
(`--font-sans`, `--font-display`, `--font-mono`) et mappées dans
`tailwind.config.ts` (`font-sans`, `font-display`, `font-mono`).

### Alias d'import `@/`

`tsconfig.json` définit `@/*` → `./src/*`. On écrit donc
`import { profile } from "@/data/portfolio"` au lieu de chemins relatifs.

---

[Chapitre suivant → Personnalisation du contenu](./03-personnalisation.md)
