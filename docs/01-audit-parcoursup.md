# Audit Parcoursup

> Document de cadrage pour le projet **Scoolize**, plateforme d'orientation
> commandée par le Ministère de l'Éducation pour améliorer Parcoursup.
> L'audit synthétise l'état du dispositif actuel, ses frictions documentées et
> les opportunités produit qui justifient l'existence de Scoolize.

---

## 1. Synthèse exécutive

Parcoursup est, depuis 2018, le portail unique d'inscription dans
l'enseignement supérieur français : environ **900 000 candidats** y formulent
chaque année près de **7 millions de vœux** vers plus de **21 000 formations**
(ordres de grandeur MESR, à vérifier sur les notes d'information annuelles).
L'outil a réglé une partie des défauts d'APB (notamment le tirage au sort en
filières en tension) mais en a fait émerger d'autres : **opacité des
algorithmes locaux** de classement de chaque formation, **anxiété massive**
liée à l'attente et au manque de visibilité sur les chances réelles, **saisie
manuelle fastidieuse** des notes, **distinction floue** entre formations
sélectives et non-sélectives côté usager. Plusieurs rapports publics — dont
celui de la Cour des comptes — ont pointé ces limites sans qu'elles soient
toutes résolues. Scoolize se positionne comme **couche de lisibilité en amont
de Parcoursup** : OCR des bulletins, score de correspondance par formation,
probabilité d'admission estimée avec intervalle de confiance, et logique
explicite sélectif/non-sélectif.

---

## 2. Historique : d'APB à Parcoursup

### Avant Parcoursup : APB (2009 — 2017)

APB (*Admission Post-Bac*) a été le premier guichet unique numérique
d'inscription dans le supérieur en France. Le système permettait aux
candidats de hiérarchiser leurs vœux, mais s'est rapidement heurté à un
problème devenu emblématique : pour les filières **en tension** (PACES,
STAPS, psychologie, droit, parfois licences scientifiques), un **tirage au
sort** départageait les candidats dépassant la capacité d'accueil. Cette
mécanique a été jugée inéquitable et a déclenché plusieurs recours en justice.

### Naissance de Parcoursup (2018)

La **loi ORE** (*Orientation et Réussite des Étudiants*) du **8 mars 2018**
fonde Parcoursup. Trois principes structurants :

- **Suppression du tirage au sort** au profit d'un examen des dossiers par
  chaque formation.
- Possibilité pour les universités, sur les licences en tension, de
  **classer les candidats** (système de *commissions d'examen des vœux* /
  *CEV*).
- Introduction des **« attendus »** : compétences et connaissances
  recommandées par filière, publiées sur le portail.

Côté usager, plusieurs changements majeurs :

- Plus de hiérarchisation des vœux : tous les vœux sont équivalents
  (jusqu'à **10 vœux** principaux + sous-vœux).
- Apparition de la **phase complémentaire** (juillet–septembre) pour les
  candidats sans proposition.
- Saisie d'une **fiche Avenir** par les lycées et de **lettres de
  motivation** (« projet de formation motivé ») pour les filières
  sélectives.

### Évolutions majeures depuis 2018

| Année | Évolution |
|------:|-----------|
| 2019 | Affinement des règles de sous-vœux (jusqu'à 20 sous-vœux dans certaines licences). |
| 2020 | Renforcement du calendrier de la phase complémentaire et amélioration du suivi des candidats sans proposition. |
| 2021 | Intégration des nouveaux résultats du baccalauréat réformé (épreuves de spécialité, contrôle continu). |
| 2022 | Publication par chaque formation des **taux d'accès** historiques (transparence accrue). |
| 2023 | Apparition de filières spécifiques (PASS/L.AS pour la santé) sur le portail. |
| 2024 | Améliorations annoncées sur la transparence des algorithmes locaux (en cours d'application). |

---

## 3. Chiffres clés actuels

> Les valeurs ci-dessous sont des **ordres de grandeur** annuels récents,
> compatibles avec les notes d'information publiées par le MESR et les
> datasets ouverts sur data.gouv.fr. Une vérification précise à la
> dernière campagne reste recommandée.

| Indicateur | Ordre de grandeur | Source / qualificateur |
|------------|-------------------|------------------------|
| Candidats inscrits | ≈ 900 000 | MESR, notes annuelles |
| Formations proposées | ≈ 21 000 | Parcoursup *open data* |
| Vœux confirmés (total) | ≈ 7 millions | Parcoursup *open data* |
| Vœux moyens par candidat | ≈ 8–9 | Calcul dérivé |
| Taux de candidats recevant ≥ 1 proposition en phase principale | ≈ 90–94 % | MESR (variable selon profil et bac) |
| Candidats encore sans proposition fin août | ≈ 1–3 % | MESR |
| Délai moyen avant 1ʳᵉ proposition | quelques jours à plusieurs semaines | Variable selon classement et filière |

**Lectures complémentaires** :

- La part des **bacheliers professionnels et technologiques** sans
  proposition reste supérieure à celle des bacheliers généraux —
  signal d'inégalité d'orientation documenté.
- Les filières les plus sélectives (CPGE, écoles d'ingénieurs et de
  commerce post-bac, doubles licences, IFSI, ENS) concentrent les
  écarts de chances entre profils.

---

## 4. Parcours utilisateur étudiant — étape par étape

| # | Étape | Période | Friction principale |
|---|-------|---------|---------------------|
| 1 | Inscription, création de dossier | janvier | Multiplicité des justificatifs ; lycée doit aussi remplir la fiche Avenir. |
| 2 | Formulation des vœux et sous-vœux | janvier → mars | Choisir **sans visibilité sur ses chances** ; complexité des sous-vœux (licences). |
| 3 | Rédaction des lettres de motivation | janvier → mars | Une lettre par vœu sélectif — **charge lourde** pour des candidats peu accompagnés. |
| 4 | Confirmation et saisie des notes | avril | **Saisie manuelle** des notes du dossier (1ʳᵉ et terminale) — source d'erreurs et de stress. |
| 5 | Attente des réponses | mai → juin | Stress quotidien : chaque jour, des places se libèrent et la liste d'attente bouge. |
| 6 | Réponses du candidat | mai → juillet | Hiérarchiser ses préférences en temps réel, sous pression. |
| 7 | Phase complémentaire | juillet → septembre | Vécue comme **déclassante** ; choix réduit aux places restantes. |

### Frictions saillantes

- **Opacité des chances** : Parcoursup publie les taux d'accès historiques
  mais ne dit pas à un candidat *donné* s'il a une chance réelle d'être pris
  dans la formation qu'il vise. Sur les formations sélectives, la décision
  dépend du **classement local** de la formation, jamais publié.
- **Anxiété de l'attente** : la mécanique de propositions multiples crée un
  flux quotidien d'événements (proposition, mise sur liste d'attente, rang).
  Plusieurs études et témoignages parlent de **dégradation de la santé mentale**
  des candidats sur la période avril–juillet.
- **Inégalités d'accompagnement** : un candidat issu d'un lycée prestigieux,
  bien encadré, avec un réseau familial dans le supérieur, n'aborde pas les
  vœux comme un primo-accédant. Parcoursup formalise les critères mais
  n'effectue **pas de péréquation sociale** de l'accompagnement.

---

## 5. Parcours côté formation / école

| # | Étape | Période | Friction principale |
|---|-------|---------|---------------------|
| 1 | Définition des critères et attendus | janvier — février | Formalisation difficile ; vocabulaire technique imposé par le portail. |
| 2 | Réception des dossiers | mars | Volume élevé : certaines licences en tension dépassent **1 000 dossiers** pour quelques centaines de places. |
| 3 | Examen et classement | mars — avril | Travail des **commissions d'examen des vœux** ; outils internes hétérogènes (Excel maison, scripts ad hoc). |
| 4 | Envoi des propositions et liste d'attente | mai — juin | Pas de communication directe avec le candidat ; gestion des désistements en aveugle. |
| 5 | Phase complémentaire | juillet — septembre | Pourvoi des places restantes dans l'urgence, avec un public souvent moins préparé. |

### Frictions saillantes

- **Critères opaques côté candidat, lourds à formaliser côté école.** Le
  portail Parcoursup impose des champs structurés (« attendus »,
  « critères généraux d'examen des vœux ») dont le vocabulaire est jargonneux
  et redondant.
- **Outils internes vieillissants.** Beaucoup de formations classent encore
  les dossiers via des **fichiers Excel** voire des **scripts SAS/SQL**
  développés *ad hoc*. La maintenance et la traçabilité de l'algorithme
  local en pâtissent.
- **Pas de feedback en boucle.** Les CEV ne reçoivent pas, par défaut, le
  signal des candidats qui se sont désistés *parce que* la formation leur
  paraissait inaccessible : l'auto-sélection précoce est invisible.

---

## 6. Points de douleur, classés par sévérité

### Sévérité **critique**

1. **Opacité des algorithmes locaux** — chaque formation classe ses
   candidats avec un algorithme propre. La transparence a progressé
   (publication des critères généraux, taux d'accès) mais le **code** ou
   la **pondération précise** ne sont pas systématiquement publics.
2. **Anxiété et santé mentale** — abondamment documentée dans la presse
   et par les associations étudiantes (UNEF, FAGE) ; risque de
   décrochage psychologique pour les candidats sans proposition fin juin.
3. **Inégalités sociales et territoriales** — les bacheliers issus de
   lycées défavorisés, de milieux populaires ou de territoires
   ultramarins ont une probabilité plus élevée d'arriver en phase
   complémentaire (cf. rapports DEPP).

### Sévérité **élevée**

4. **Saisie manuelle des notes** — fastidieuse, source d'erreurs,
   inégalitaire (un candidat peu autonome peut mal renseigner son dossier).
5. **Charge des lettres de motivation** — une lettre par vœu sélectif,
   sans accompagnement institutionnel garanti.
6. **Délais d'attente longs** — la phase principale s'étire de mai à
   juillet, parfois jusqu'à fin août pour les listes d'attente vives.
7. **Absence de visibilité sur ses chances** — le candidat ne dispose pas
   d'une estimation personnalisée de probabilité d'admission.

### Sévérité **moyenne**

8. **Limite des 10 vœux** + complexité des **sous-vœux** dans certaines
   filières (jusqu'à ~20 sous-vœux en licence droit ou psycho).
9. **Distinction sélectif / non-sélectif floue** — les deux logiques
   d'admission coexistent sans être présentées de manière différenciée
   au candidat.
10. **UX vieillissante** du portail — interface dense, peu mobile-first,
    navigation lourde.

### Sévérité **faible**

11. **Calendrier serré** entre la formulation des vœux (mars) et les
    épreuves de spécialité du bac.
12. **Phase complémentaire vécue comme déclassante**, alors qu'elle est
    une seconde chance utile.

---

## 7. Tentatives de réforme et critiques publiques

- **Cour des comptes** — *Parcoursup et le bac 2021* (rapport public) :
  pointe l'opacité des algorithmes locaux, la lourdeur de la procédure
  pour les candidats et les inégalités d'accès.
- **IGÉSR** — plusieurs rapports d'inspection sur le bon fonctionnement
  des CEV et la qualité des **attendus** publiés par les formations.
- **DEPP** (Direction de l'évaluation, de la prospective et de la
  performance) — études récurrentes sur le devenir des bacheliers
  après Parcoursup (taux d'inscription effectif, abandon en L1).
- **Syndicats étudiants** — UNEF et FAGE en tête, critiques persistantes
  sur la « machine à trier », demande de réintroduction d'une forme de
  hiérarchisation des vœux et d'un droit explicite à l'accompagnement.
- **Presse spécialisée** — couverture régulière par *Le Monde*,
  *Libération*, *La Croix*, *L'Étudiant*, *Le Figaro Étudiant*,
  notamment au moment de l'ouverture du portail (janvier) et de
  l'envoi des premières propositions (mai).

Les réformes effectives depuis 2018 portent surtout sur **la
transparence des taux d'accès** (publication des historiques) et
l'**amélioration des outils internes** (fiabilisation du moteur). Les
critiques structurelles — opacité des algos locaux, charge
psychologique, inégalités — persistent.

---

## 8. Opportunités pour Scoolize

Scoolize ne se positionne pas en remplacement de Parcoursup mais en
**couche de lisibilité** en amont du dépôt des vœux. Quatre opportunités
concrètes, alignées sur les points de douleur identifiés :

### a) Estimation transparente des chances (sévérité critique → résolue)

Scoolize affiche, pour chaque formation, un **score de correspondance**
sur 100 et une **probabilité d'admission** assortie d'un intervalle de
confiance, calculés à partir d'un modèle quantitatif (régression
logistique sur historique synthétique) et **expliqués** au candidat
(matières clés pondérées, marge au seuil, sélectivité). C'est
exactement ce que le portail Parcoursup ne fournit pas.

### b) OCR du bulletin (sévérité élevée → résolue)

L'étudiant **dépose son bulletin PDF** ; Scoolize en extrait les notes
via Tesseract et les lui propose à la validation. La saisie manuelle
disparaît, l'erreur de transcription aussi, et l'expérience devient
**accessible** (un candidat peu à l'aise avec les saisies fastidieuses
n'est plus pénalisé).

### c) Distinction explicite sélectif / non-sélectif (sévérité moyenne)

L'interface Scoolize **badge** chaque formation et adapte le discours :
côté sélectif, focus sur la **probabilité d'admission** et le **seuil
indicatif** ; côté non-sélectif, focus sur **l'adéquation** et la
**capacité résiduelle**. Le candidat comprend enfin **deux logiques
distinctes**.

### d) Aide à l'orientation pour profils non outillés (sévérité critique)

L'enjeu d'équité passe par un **accompagnement gratuit**, **utilisable
en autonomie**, avec une logique **expliquée**. Scoolize peut être
distribué auprès des CIO, des familles de premiers accédants, des
lycées en éducation prioritaire — combler partiellement le déficit
d'accompagnement structurel.

---

## 9. Sources et bibliographie

### Données ouvertes

- **data.gouv.fr** — collection *Parcoursup* (vœux, taux d'accès,
  formations) : https://www.data.gouv.fr/fr/datasets/?q=parcoursup
- **data.gouv.fr** — *Annuaire de l'éducation* (lycées, codes UAI) :
  https://www.data.gouv.fr/fr/datasets/annuaire-de-leducation/
- **DEPP** — notes d'information annuelles :
  https://www.education.gouv.fr/depp

### Rapports institutionnels

- **Cour des comptes**, *Parcoursup et le baccalauréat 2021*, rapport
  public.
- **IGÉSR** — rapports thématiques sur le fonctionnement des CEV et
  la qualité des attendus.
- **MESR** — notes annuelles d'évaluation de Parcoursup.
- **Loi ORE** — loi n° 2018-166 du 8 mars 2018 relative à
  l'orientation et à la réussite des étudiants.

### Presse et études

- *Le Monde Campus*, *Libération Étudiant*, *La Croix*, *L'Étudiant*,
  *Le Figaro Étudiant* — couverture régulière.
- Études de l'**Observatoire de la vie étudiante (OVE)**.
- Sondages **UNEF** et **FAGE** sur le vécu de la procédure.

### Précision méthodologique

Les chiffres cités dans cet audit sont des **ordres de grandeur récents**.
Ils doivent être actualisés à la dernière campagne au moment du rendu
final, en allant chercher la note d'information publiée chaque année
par le MESR et en croisant avec les datasets data.gouv.fr.

---

## 10. Méthodologie

L'audit a été produit en deux temps.

**(a) Cadrage** — relecture du brief Scoolize et des reproches précis
formulés par le jury sur le premier rendu (OCR absent, prévisions
imprécises, indistinction sélectif/non-sélectif, manque de vision
produit). Ces reproches ont orienté la sélection des points de douleur.

**(b) Synthèse documentaire** — consolidation de la connaissance
publique sur Parcoursup à partir des sources listées en section 9 :
rapports institutionnels, données ouvertes, couverture presse. Lorsque
le chiffre exact d'une métrique n'a pas été vérifié à la source au
moment de la rédaction, le qualificateur **« ordre de grandeur »** ou
**« selon X »** est utilisé explicitement plutôt que de l'omettre.

Les chiffres et les rapports cités sont à **vérifier et à actualiser**
avant la soutenance — la majorité est accessible publiquement sur
data.gouv.fr et sur le site du ministère.
