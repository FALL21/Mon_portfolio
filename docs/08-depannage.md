# 08 · Dépannage & FAQ

[← Retour au sommaire](./README.md)

---

## Problèmes fréquents

### Le port 3000 est déjà utilisé

Symptôme : `EADDRINUSE` ou « port is already allocated ».

- **Node** : lancez sur un autre port → `PORT=3001 npm run dev`.
- **Docker** : changez le mappage dans `docker-compose.yml`, ex. `"3001:3000"`,
  puis `docker compose up -d`.
- Ou libérez le port : identifiez le processus (`lsof -i :3000` sous Linux/macOS)
  et arrêtez-le.

### `npm install` échoue

- Vérifiez la version de Node : **20 ou 22** (`node --version`).
- Supprimez et réinstallez : `rm -rf node_modules package-lock.json && npm install`.
  (Le `package-lock.json` fourni garantit des versions reproductibles ; ne le
  supprimez qu'en dernier recours.)

### Le build Docker est très long

Normal au premier build (téléchargement de l'image de base + `npm ci` + build).
Les builds suivants réutilisent le cache. Si vous ne modifiez que le contenu,
seule la couche de build est refaite.

### Les polices ou styles ne s'affichent pas correctement

- Faites un build propre : `rm -rf .next && npm run build`.
- En Docker : `docker compose build --no-cache && docker compose up -d`.

### Modifications invisibles après changement de contenu

- **Mode dev** : la page devrait se recharger seule ; sinon, rafraîchissez.
- **Docker** : l'image doit être reconstruite → `docker compose up -d --build`.
  (Le conteneur exécute une build figée ; il ne « voit » pas les fichiers modifiés
  tant qu'on ne rebuild pas.)

### Erreur TypeScript au build

Le message indique le fichier et la ligne. Le plus souvent : un champ manquant ou
mal orthographié dans `portfolio.ts` (ex. un objet `project` sans `name`).
Rétablissez la structure attendue décrite au
[chapitre 03](./03-personnalisation.md).

### Le healthcheck Docker reste « unhealthy »

- Consultez les logs : `docker compose logs -f`.
- Vérifiez que rien d'autre n'occupe le port 3000 dans le conteneur.
- Laissez le `start_period` (15 s) s'écouler après le lancement.

---

## Questions fréquentes

**Puis-je modifier le contenu sans savoir coder ?**
Oui, pour l'essentiel. Éditez les **valeurs** (texte entre guillemets) dans
`src/data/portfolio.ts` en gardant la ponctuation et la structure. Voir
[chapitre 03](./03-personnalisation.md).

**Où changer les couleurs ?**
Dans `tailwind.config.ts` (clé `colors`) et les variables de `globals.css`. Voir
[chapitre 04](./04-design-system.md).

**Comment ajouter/retirer une section ?**
Dans `src/app/page.tsx`, en ajoutant/retirant la balise du composant. Pensez au
menu de `Navbar.tsx`. Voir [chapitre 05](./05-composants.md).

**Le site fonctionne-t-il sans connexion Internet au build ?**
Oui. Les polices sont auto-hébergées et il n'y a aucun appel réseau obligatoire
au moment de la construction.

**Puis-je désactiver le fond animé du Hero ?**
Oui : dans `src/components/Hero.tsx`, retirez le bloc `<NeuralMesh />`. Le Hero
reste fonctionnel avec sa grille et son halo.

**Comment ajouter un formulaire de contact fonctionnel ?**
La section Contact propose actuellement des liens directs (e-mail, téléphone,
LinkedIn). Pour un vrai formulaire, intégrez un service tiers (Formspree, Resend,
etc.) dans un nouveau composant client ; un fichier `.env.example` est fourni pour
y placer d'éventuelles clés.

**Sur quel domaine le SEO est-il configuré ?**
Sur `https://mameboufall.dev` (valeur d'exemple). Remplacez-la dans `layout.tsx`,
`robots.ts` et `sitemap.ts`. Voir [chapitre 07](./07-seo-performance.md).

---

## Où trouver quoi (aide-mémoire)

| Je veux… | Fichier |
| -------- | ------- |
| Changer un texte, un projet, une compétence | `src/data/portfolio.ts` |
| Changer la photo | `public/profile.jpg` |
| Changer le CV | `public/CV_Mame_Bou_FALL.pdf` |
| Changer les couleurs | `tailwind.config.ts` + `src/app/globals.css` |
| Réordonner les sections | `src/app/page.tsx` |
| Modifier le menu | `src/components/Navbar.tsx` |
| Régler le SEO / domaine | `src/app/layout.tsx`, `robots.ts`, `sitemap.ts` |
| Ajuster le fond animé | `src/components/NeuralMesh.tsx` |
| Config Docker | `Dockerfile`, `docker-compose.yml` |

---

[← Retour au sommaire](./README.md)
