# 03 · Personnalisation du contenu

[← Retour au sommaire](./README.md)

---

Presque tout le contenu du portfolio se modifie dans **un seul fichier** :
[`src/data/portfolio.ts`](../src/data/portfolio.ts). Après chaque modification :

- en mode `npm run dev`, la page se recharge automatiquement ;
- en Docker, relancer `docker compose up -d --build`.

> Règle d'or : gardez la **structure** (les noms de champs) et ne changez que les
> **valeurs**. Chaque bloc est typé en TypeScript ; si vous cassez la structure,
> l'éditeur ou le build vous le signalera.

---

## Vue d'ensemble des blocs

| Objet exporté | Section affichée | Type d'affichage |
| ------------- | ---------------- | ---------------- |
| `profile`     | Hero, Navbar, Contact, Footer | Identité, coordonnées, CV. |
| `about`       | À propos | Paragraphes + atouts. |
| `stats`       | Statistiques | Compteurs animés. |
| `timeline`    | Parcours | Chronologie verticale. |
| `skillGroups` | Compétences | Catégories de technologies. |
| `services`    | Services | Grille de prestations. |
| `projects`    | Projets | Cartes détaillées. |
| `experiences` | Expérience | Postes occupés. |
| `education`   | Formation | Diplômes. |
| `languages`   | À propos | Langues parlées. |

---

## 1. Identité et coordonnées : `profile`

```ts
export const profile = {
  name: "Mame Bou FALL",
  title: "Ingénieur IA & Big Data",
  subtitle: "Constructeur de solutions IA en production",
  roles: ["Développeur Full Stack", "Ingénieur IA & Big Data", /* ... */],
  pitch: "Je conçois, développe et déploie...",
  location: "Malika Plage, Dakar, Sénégal",
  email: "mameboufall21@gmail.com",
  phone: "+221 77 795 49 21",
  linkedin: "https://www.linkedin.com/in/mameboufall",
  linkedinHandle: "@mameboufall",
  cvPath: "/CV_Mame_Bou_FALL.pdf",
  photo: "/profile.jpg",
};
```

- **`roles`** : liste des intitulés qui défilent automatiquement dans le Hero.
  Ajoutez ou retirez des lignes librement.
- **`linkedin`** : mettez ici l'**URL complète** de votre profil (à vérifier).
- **`cvPath`** et **`photo`** : chemins relatifs au dossier `public/`
  (voir sections dédiées plus bas).

---

## 2. À propos : `about`

```ts
export const about = {
  paragraphs: [ "Premier paragraphe…", "Deuxième…", "Troisième…" ],
  atouts: ["Esprit analytique", "Rigueur mathématique", /* ... */],
};
```

Chaque chaîne de `paragraphs` devient un paragraphe. Chaque `atout` devient une
pastille.

---

## 3. Statistiques : `stats`

Chaque entrée est un compteur animé.

```ts
export const stats = [
  { value: 4, suffix: "+", label: "Années d'expérience" },
  { value: 15, suffix: "+", label: "Projets & produits livrés" },
  { value: 999, prefix: "0.", label: "AUC ROC du pipeline biométrique", isMetric: true },
  { value: 100, suffix: "%", label: "Passion" },
];
```

- **`value`** : nombre cible (le compteur s'anime de 0 jusqu'à cette valeur).
- **`prefix`** / **`suffix`** : texte optionnel avant/après (ex. `0.` → « 0.999 »,
  `+`, `%`).
- **`label`** : légende sous le chiffre.

---

## 4. Parcours : `timeline`

```ts
{ year: "2024 – 2026", title: "Master IA & Big Data",
  org: "École Supérieure Polytechnique de Dakar", icon: BrainCircuit },
```

Le champ **`icon`** est une icône importée en haut du fichier depuis
`lucide-react`. Pour utiliser une autre icône, ajoutez son nom à la ligne
d'import (voir « Ajouter une icône » plus bas).

---

## 5. Compétences : `skillGroups`

```ts
{ name: "Intelligence Artificielle",
  items: ["Machine Learning", "PyTorch", "ArcFace / InsightFace", /* ... */] },
```

Un objet = une carte de catégorie. `items` = les technologies affichées en
pastilles.

---

## 6. Services : `services`

```ts
{ title: "Computer Vision",
  desc: "Détection, classification, tracking et pipelines vidéo temps réel.",
  icon: ScanFace },
```

---

## 7. Projets : `projects`

Le bloc le plus riche. Chaque projet :

```ts
{
  name: "Pointage biométrique · Trésor Public",
  tagline: "Reconnaissance faciale de production pour une institution d'État",
  description: "Pipeline biométrique complet…",
  highlights: [ "AUC ROC de 0,999…", "Identification en quelques secondes…" ],
  tech: ["Python", "PyTorch", "OpenCV", "ArcFace", "YOLO", "Docker"],
  status: "En production",
  link: "https://vbs.services",   // optionnel : affiche une flèche cliquable
  accent: "#22C55E",               // couleur du halo de la carte
}
```

- **`status`** : badge en haut de carte (« En production », « En ligne », etc.).
- **`link`** : facultatif. S'il est présent, une icône de lien externe apparaît.
- **`accent`** : code couleur hex du halo décoratif.

Pour **ajouter un projet**, copiez un objet existant et modifiez ses champs.

---

## 8. Expérience & Formation : `experiences`, `education`

```ts
// experiences
{ role: "Full Stack Engineer · IA & Data", company: "Trésor Public, Dakar",
  period: "Août 2025 – Fév. 2026",
  points: [ "Conception d'un pipeline biométrique…", "AUC ROC 0,999…" ] },

// education
{ degree: "Master en IA & Big Data",
  school: "École Supérieure Polytechnique de Dakar", period: "2024 – 2026" },
```

---

## Remplacer la photo de profil

1. Préparez une image **carrée** (idéalement 640×640 px ou plus), au format JPG.
2. Nommez-la `profile.jpg` et placez-la dans `public/` (écrasez l'existante).

Pour utiliser un autre nom/format, mettez à jour `profile.photo` dans
`portfolio.ts`, par ex. `photo: "/moi.png"`.

---

## Remplacer le CV

1. Placez votre PDF dans `public/`.
2. Si le nom diffère de `CV_Mame_Bou_FALL.pdf`, mettez à jour `profile.cvPath`,
   par ex. `cvPath: "/mon-cv.pdf"`.

Le bouton « Télécharger mon CV » (Hero, Navbar, Contact) pointe automatiquement
vers ce fichier.

---

## Ajouter une icône (lucide-react)

En haut de `portfolio.ts`, la ligne d'import liste les icônes utilisées :

```ts
import { Code2, Boxes, BrainCircuit, ScanFace, /* … */ } from "lucide-react";
```

Pour employer une nouvelle icône, ajoutez son nom à cette liste puis référencez-la
dans un objet (`icon: NouvelleIcone`). Catalogue complet : <https://lucide.dev/icons>.

---

## Changer les liens de navigation

Le menu du haut est défini dans [`src/components/Navbar.tsx`](../src/components/Navbar.tsx),
tableau `links`. Chaque entrée `{ href: "#projets", label: "Projets" }` pointe vers
l'`id` d'une section. Si vous renommez un `id` de section dans `page.tsx`, mettez
le `href` à jour en conséquence.

---

[Chapitre suivant → Système de design](./04-design-system.md)
