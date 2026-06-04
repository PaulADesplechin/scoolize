# Plan de soutenance — 15 minutes

Découpage slide-par-slide avec **timing**, **clés de message**,
**qui parle**, **transitions**. Le rythme cible est de **1 à 2
slides par minute**.

> Notation : 🅿 = Paul-Adrien · 🅷 = Hugo · 🅽 = Nino

---

## Slide 1 — Pitch d'ouverture (00:00 → 00:30)

🅿
- Variante choisie de `pitch-ouverture.md`.
- Pas de slide chargée : juste le **titre Scoolize** + un sous-titre.
- Regarder le jury, pas l'écran.

**Transition** : *« On commence par le problème. »*

---

## Slide 2 — Le problème (00:30 → 02:00)

🅿
- 3 chiffres clés (900 000 candidats / 21 000 formations / ~7M vœux).
- 3 frictions (opacité, anxiété, saisie fastidieuse).
- Citation extraite des personas (variante C ou rappel).

**Transition** : *« Pour qui ? Cinq personnes typiques. »*

---

## Slide 3 — Personas (02:00 → 03:30)

🅷
- 5 personas en grille (3 étudiants + 2 écoles).
- Insister sur Léa et Mme Bernard (les plus emblématiques).
- Souligner les inégalités d'accompagnement (Aïcha — première
  génération étudiante).

**Transition** : *« De ces vrais besoins, on a dérivé le produit. »*

---

## Slide 4 — La proposition Scoolize (03:30 → 04:30)

🅷
- Deux faces : **Predict** (étudiant) et **Prepare** (école).
- Quatre promesses : OCR, score expliqué, intervalle de confiance,
  distinction sélectif / non-sélectif.

**Transition** : *« Démo, on vous montre. »*

---

## Slide 5 — Démo (04:30 → 09:30, 5 minutes)

🅷 puis 🅽
- Plein écran, navigateur, suivre [`demo-script.md`](demo-script.md).
- 🅷 fait la partie Predict (création profil → upload → notes → résultats).
- 🅽 prend la main pour la partie Prepare (dashboard → candidats → export).

**Plan B** (si l'OCR plante) : basculer sur saisie manuelle, expliquer
calmement *« c'est exactement le fallback prévu »*.
**Plan C** (si tout plante) : couper le live, lancer la vidéo de backup
(préenregistrée).

**Transition** : *« Sous le capot, qu'est-ce qui se passe ? »*

---

## Slide 6 — Architecture (09:30 → 10:30)

🅿
- Schéma mermaid (frontend Next 14 → API FastAPI → OCR Tesseract +
  Matching scikit-learn → base PostgreSQL).
- L'algo en une formule : `100 · (0,5·p_admission + 0,4·affinité + 0,1·géo)`.
- Mentionner les 21 tests automatisés.

**Transition** : *« Et au-delà du produit, on a posé les briques
non-techniques. »*

---

## Slide 7 — Métriques de qualité (10:30 → 11:00)

🅿
- OCR : 3/3 bulletins extraits parfaitement.
- Matching : profil excellent → prépas scientifiques (~93/100), profil
  faible → licences non-sélectives.
- 21 tests verts (API + OCR + matching).

**Transition** : *« Côté produit et déploiement, on a aussi posé le
cadre. »*

---

## Slide 8 — Vision produit et business (11:00 → 12:00)

🅽
- 3 modèles économiques, recommandation : hybride freemium (~1 M€
  subvention MESR + abonnements Premium écoles).
- Marge brute ~47 % en année 3.
- **Règle d'or** : ranking jamais influencé par le statut payant
  d'une école — écrit dans les CGU.

**Transition** : *« Et l'adoption, comment on la pilote ? »*

---

## Slide 9 — Conduite du changement (12:00 → 13:00)

🅽
- Modèle **ADKAR** résumé (Awareness, Desire, Knowledge, Ability,
  Reinforcement).
- **RGPD** : consentement explicite, conservation 6 mois, droit à
  l'oubli, pas de décision 100 % automatisée.
- Roadmap : coexistence Parcoursup → Scoolize sur **2 ans**.

**Transition** : *« Pour finir, ce qu'on a appris du rattrapage. »*

---

## Slide 10 — Rétrospective (13:00 → 14:00)

🅿
- Assumer les 4 reproches du 1er rendu (OCR absent, prévisions
  imprécises, pas de distinction, manque de vision).
- Adresser chacun par un changement concret (OCR Tesseract, modèle
  logistique, branches d'algo, 11 livrables produit).
- Mentionner les 3 leçons individuelles (priorisation produit, honnêteté
  de l'évaluation, communication équipe).

**Transition** : *« On vous remercie. Place à vos questions. »*

---

## Slide 11 — Équipe et Q&A (14:00 → 15:00)

🅿 🅷 🅽 (les 3 ensemble debout)
- Trombinoscope : 3 noms, 3 rôles, 3 contacts.
- Liens utiles : repo GitHub, démo en ligne, dossier PDF complet.
- *« Merci. À vos questions. »*

---

## Ressources d'urgence pendant la soutenance

| Situation | Réaction |
|-----------|----------|
| L'OCR plante en démo | Bascule sur saisie manuelle, dis *« c'est exactement le fallback prévu »*. |
| Le wifi tombe | Active le hotspot téléphone. Backup local du frontend dispo dans `frontend/.next/standalone` (si tu as `next export` avant). |
| Une question te déstabilise | *« C'est une excellente question, je note. »* + reprends 2 secondes. Si tu ne sais pas : *« Bonne question, on n'a pas testé. Voici ce qu'on ferait : … »*. |
| Tu perds le fil | Regarde [`cheatsheet.md`](cheatsheet.md) plié dans ta poche. |

---

## Conseils répétition

- Répéter **5 fois en intégralité**, dont :
  - 2 fois seul, à voix haute.
  - 2 fois en équipe complète (les 3 ensemble, transitions
    incluses).
  - 1 fois devant **quelqu'un d'extérieur** (parent, ami non-tech).
- Chronométrer chaque fois. Au-delà de **14 minutes**, couper du
  contenu, pas accélérer.
