# 05 · Référence des composants

[← Retour au sommaire](./README.md)

---

Tous les composants sont dans [`src/components/`](../src/components/). Ceux marqués
**client** portent la directive `"use client"` (interactivité / animation) ; les
autres sont rendus côté serveur.

| Composant | Type | Rôle |
| --------- | ---- | ---- |
| `Navbar` | client | Barre de navigation fixe, devient vitrée au scroll, menu mobile. |
| `ScrollProgress` | client | Fine barre de progression de lecture en haut de page. |
| `Hero` | client | Section d'accueil : titre, rotation des rôles, CTAs, fond `NeuralMesh`. |
| `NeuralMesh` | client | Canvas animé (signature visuelle). Voir [chapitre 04](./04-design-system.md#la-signature-visuelle--neuralmesh). |
| `Stats` | client | Compteurs animés à l'entrée dans le viewport. |
| `About` | client | Photo, biographie, atouts, langues. |
| `Timeline` | client | Chronologie verticale du parcours. |
| `Skills` | client | Compétences groupées par catégorie. |
| `Services` | client | Grille de prestations avec survol. |
| `Projects` | client | Cartes de projets détaillées. |
| `Experience` | client | Postes + diplômes (deux colonnes). |
| `Contact` | client | Bloc d'appel à l'action + coordonnées. |
| `Footer` | serveur | Citation, liens sociaux, mention de copyright. |
| `SectionHeading` | serveur | En-tête réutilisable (numéro, eyebrow, titre, description). |
| `Reveal` | client | Enveloppe d'animation au scroll. |

---

## Composants réutilisables

### `SectionHeading`

En-tête standard de chaque section.

```tsx
<SectionHeading
  index="05"
  eyebrow="Projets"
  title="Des produits qui tournent en production"
  description="Texte optionnel sous le titre."
/>
```

| Prop | Type | Requis | Rôle |
| ---- | ---- | ------ | ---- |
| `index` | string | oui | Numéro affiché (ex. `"01"`). |
| `eyebrow` | string | oui | Petit intitulé au-dessus du titre. |
| `title` | string | oui | Titre de section. |
| `description` | string | non | Paragraphe d'introduction. |

### `Reveal`

Anime l'apparition de son contenu au scroll.

```tsx
<Reveal delay={0.1}>
  <p>Contenu qui apparaît en fondu…</p>
</Reveal>
```

| Prop | Type | Défaut | Rôle |
| ---- | ---- | ------ | ---- |
| `delay` | number | `0` | Délai (s) avant l'animation. |
| `y` | number | `24` | Décalage vertical initial (px). |
| `className` | string | - | Classes CSS transmises. |

---

## Ordre d'assemblage

L'ordre des sections est décidé dans
[`src/app/page.tsx`](../src/app/page.tsx). Pour **réordonner** ou **retirer** une
section, déplacez ou supprimez la balise correspondante :

```tsx
<main>
  <Hero />
  <Stats />
  <About />
  <Timeline />
  <Skills />
  <Services />
  <Projects />
  <Experience />
  <Contact />
</main>
```

> Si vous retirez une section reliée au menu (ex. `Projects` → `#projets`),
> pensez à retirer aussi son lien dans `Navbar.tsx`.

---

## Ajouter une nouvelle section

1. Créez `src/components/MaSection.tsx` (copiez un composant existant comme
   `Services.tsx` pour partir d'une base saine).
2. Donnez à la balise `<section>` un `id` unique (ex. `id="temoignages"`).
3. Importez et placez `<MaSection />` dans `page.tsx`.
4. (Optionnel) Ajoutez `{ href: "#temoignages", label: "Témoignages" }` au
   tableau `links` de `Navbar.tsx`.
5. Si la section affiche du contenu variable, ajoutez le bloc de données
   correspondant dans `portfolio.ts`.

---

[Chapitre suivant → Déploiement](./06-deploiement.md)
