# 04 · Système de design

[← Retour au sommaire](./README.md)

---

## Palette de couleurs

Définie dans [`tailwind.config.ts`](../tailwind.config.ts) (clé `colors`) et
disponible comme classes Tailwind (`bg-base`, `text-primary`, etc.).

| Token Tailwind | Hex | Usage |
| -------------- | --- | ----- |
| `base`    | `#071A10` | Fond principal (vert forêt très sombre). |
| `surface` | `#0A2216` | Fond des sections alternées. |
| `panel`   | `#0D2A1B` | Fond des panneaux vitrés. |
| `primary` | `#22C55E` | Vert principal (accents, CTAs, liens). |
| `accent`  | `#16A34A` | Vert secondaire (dégradés). |
| `muted`   | `#B4B4B4` | Texte secondaire. |
| `line`    | `#1F2937` | Bordures / séparateurs. |

Pour changer l'identité colorimétrique, modifiez ces valeurs à **deux endroits** :
`tailwind.config.ts` (les classes) et les variables `--bg`, `--primary`, `--accent`
dans [`src/app/globals.css`](../src/app/globals.css) (utilisées par le canvas et
quelques effets).

---

## Typographie

Trois familles, chargées localement via `@fontsource` (voir
[chapitre 02](./02-architecture.md#polices-auto-hébergées)) :

| Rôle | Famille | Classe Tailwind | Usage |
| ---- | ------- | --------------- | ----- |
| Display | **Plus Jakarta Sans** | `font-display` | Titres, grands intitulés. |
| Corps | **Inter** | `font-sans` (défaut) | Paragraphes, texte courant. |
| Mono | **JetBrains Mono** | `font-mono` | Chiffres, libellés techniques, eyebrows. |

Les familles sont mappées via des variables CSS (`--font-display`, `--font-sans`,
`--font-mono`) dans `globals.css`.

---

## Classes utilitaires personnalisées

Définies dans `globals.css` (couche `@layer components`) :

| Classe | Effet |
| ------ | ----- |
| `.glass` | Panneau vitré translucide (glassmorphism léger). |
| `.glass-strong` | Variante plus opaque (navbar au scroll, carte contact). |
| `.text-gradient` | Dégradé blanc → vert appliqué au texte. |
| `.eyebrow` | Petit intitulé mono en majuscules espacées. |
| `.section-pad` | Espacement vertical standard des sections. |
| `.container-x` | Conteneur centré, largeur max ~1152 px. |
| `.bg-dotgrid` | Motif de points en fond (grille discrète). |

---

## La signature visuelle : `NeuralMesh`

Le fond animé du Hero est le composant
[`src/components/NeuralMesh.tsx`](../src/components/NeuralMesh.tsx). Il dessine sur
un `<canvas>` un ensemble de points qui dérivent lentement et se relient à leurs
voisins proches : une évocation d'un **face-mesh** et d'un **espace d'embeddings**,
en écho au pipeline de reconnaissance faciale (SCRFD + ArcFace) du portfolio.

Comportement :

- Les points proches du **curseur** s'illuminent (comme des *keypoints* détectés).
- La densité s'adapte à la taille de l'écran.
- Le mouvement respecte `prefers-reduced-motion` (voir plus bas).

Paramètres faciles à ajuster en tête du `useEffect` :

| Variable | Rôle |
| -------- | ---- |
| `density` | Nombre de points (plafonné pour la performance). |
| `LINK` | Distance max (px) pour tracer un lien entre deux points. |
| couleurs `rgba(34,197,94,…)` | Teinte des points et liens. |

---

## Animations

- **Reveal au scroll** : [`Reveal.tsx`](../src/components/Reveal.tsx) enveloppe un
  bloc et le fait apparaître (fondu + translation) à l'entrée dans le viewport.
  Props : `delay`, `y` (décalage initial), `className`.
- **Compteurs** : [`Stats.tsx`](../src/components/Stats.tsx) anime les chiffres de
  0 à leur valeur cible avec une courbe d'accélération (easing cubique).
- **Barre de progression** : [`ScrollProgress.tsx`](../src/components/ScrollProgress.tsx)
  affiche l'avancement de lecture en haut de page.
- **Micro-interactions** : survols de cartes (`whileHover`) via Framer Motion.

---

## Accessibilité & mouvement réduit

`globals.css` inclut une règle `@media (prefers-reduced-motion: reduce)` qui coupe
les animations et le défilement fluide pour les personnes qui l'ont demandé au
niveau du système. Le maillage neuronal se fige également dans ce mode. Les états
de focus clavier restent visibles.

---

[Chapitre suivant → Référence des composants](./05-composants.md)
