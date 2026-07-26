# 07 · SEO & performance

[← Retour au sommaire](./README.md)

---

## Métadonnées

Définies dans [`src/app/layout.tsx`](../src/app/layout.tsx) via l'API `metadata`
de Next.js :

- **Titre** et **description** de la page.
- **Mots-clés** (`keywords`).
- **Open Graph** (`openGraph`) : aperçu enrichi sur Facebook, LinkedIn, etc.
- **Twitter Cards** (`twitter`) : aperçu enrichi sur X/Twitter.
- **`robots`** : indexation autorisée (`index: true, follow: true`).
- **`metadataBase`** : URL de base du site.

Pour personnaliser, modifiez les constantes `url` et `desc` en tête de
`layout.tsx`, ainsi que l'objet `metadata`.

---

## Données structurées (JSON-LD)

`layout.tsx` injecte un script **JSON-LD de type `Person`** (schema.org) : nom,
intitulé de poste, e-mail, localisation, profils liés. Cela aide les moteurs de
recherche à comprendre qu'il s'agit d'une page de personne et peut enrichir
l'affichage dans les résultats.

Les champs sont dérivés de `profile` (dans `portfolio.ts`), donc mettre à jour vos
coordonnées met aussi à jour le JSON-LD.

---

## robots.txt & sitemap.xml

Générés dynamiquement par Next.js :

- [`src/app/robots.ts`](../src/app/robots.ts) → `/robots.txt` (autorise
  l'indexation, référence le sitemap).
- [`src/app/sitemap.ts`](../src/app/sitemap.ts) → `/sitemap.xml`.

Les deux utilisent l'URL `https://mameboufall.dev`. **Remplacez-la par votre
domaine** dans ces fichiers (et dans `layout.tsx`).

---

## Favicon

[`src/app/icon.svg`](../src/app/icon.svg) est un monogramme « MB » vectoriel.
Next.js le sert automatiquement comme favicon. Pour le changer, remplacez ce
fichier SVG (ou déposez un `icon.png` / `favicon.ico` dans `src/app/`).

---

## Performances

Le portfolio est optimisé par défaut :

| Levier | Détail |
| ------ | ------ |
| Rendu statique | La page d'accueil est pré-rendue à la compilation (HTML servi directement). |
| JS minimal | ~160 kB de JavaScript au premier chargement, découpé automatiquement. |
| Polices locales | Aucune requête vers Google Fonts ; chargement `swap` (pas de texte invisible). |
| Images | Servies depuis `public/` ; la photo passe par le composant `next/image` (optimisation, dimensions fixées). |
| Animations | Basées sur `transform`/`opacity` (accélérées GPU) ; coupées si `prefers-reduced-motion`. |

### Bonnes pratiques pour garder de bons scores

- Gardez la photo de profil raisonnablement légère (l'actuelle fait ~40 Ko).
- Si vous ajoutez des images de projets, préférez le format **WebP** et passez-les
  par `next/image`.
- Évitez d'ajouter des bibliothèques d'animation lourdes en plus de Framer Motion.

### Mesurer

Dans Chrome : **DevTools → Lighthouse → Analyze**. Ou en ligne de commande :

```bash
npx lighthouse http://localhost:3000 --view
```

Visez > 90 sur Performance, Accessibilité, Bonnes pratiques et SEO.

---

[Chapitre suivant → Dépannage & FAQ](./08-depannage.md)
