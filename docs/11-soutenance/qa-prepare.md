# Q&A préparées — Soutenance Scoolize

20 questions probables du jury, classées en 5 catégories. Pour chacune :

- **Réponse** (30-45 s) à voix haute.
- **Mots-clés** à retenir si tu bloques.
- **À éviter** (piège classique).

> Règle d'or : *« C'est une bonne question. »* avant **TOUT**, ça te
> donne 2 secondes de réflexion. Mais ne le dis pas à toutes — sinon
> ça sonne faux.

---

## Catégorie 1 — Questions techniques (5)

### Q1 — *« Pourquoi Tesseract et pas une API plus précise comme Google Vision ou Azure Document Intelligence ? »*

**Réponse** — Tesseract a trois avantages dans notre contexte : **gratuit
et open source** (pas de coût par requête, important pour un produit
gratuit pour les étudiants), **exécutable en local** (donc on peut
garder le bulletin sur les serveurs européens, ce qui matche notre
politique RGPD), et **suffisamment précis** pour le format français
quand on travaille un peu le parsing. Sur nos bulletins de test, on a
100 % d'extraction. Google Vision serait pertinent si on visait des
bulletins étrangers ou très dégradés.
**Mots-clés** : gratuit · local · RGPD · 100 % sur tests · open source.
**À éviter** : *« Parce qu'on n'avait pas les moyens »* (registre
défensif).

---

### Q2 — *« Comment vous gérez la fraude aux notes ? »*

**Réponse** — Trois niveaux. D'abord, l'OCR lit le **PDF original** que
l'étudiant a téléversé — c'est plus difficile à falsifier qu'une
saisie manuelle. Ensuite, le **bulletin source** est conservé pour
audit côté établissement si une candidature est déposée. Enfin, les
**CGU mentionnent** la fraude comme motif de résiliation immédiate.
On n'a pas mis en place de détection automatique de PDF manipulé,
parce que ça suppose un investissement disproportionné par rapport au
risque réel sur cette catégorie d'utilisateurs.
**Mots-clés** : PDF original · audit · CGU · pas de scoring auto.
**À éviter** : *« On ne gère pas »* (faux ; voir CGU section 4).

---

### Q3 — *« Et si l'OCR se trompe d'une note ? »*

**Réponse** — C'est précisément pourquoi l'étape **« Vérifiez vos
notes »** existe entre l'upload et le matching. L'OCR **propose**, mais
**aucune note ne va dans l'algorithme sans validation humaine**. C'est
documenté dans la politique de confidentialité comme une garantie :
pas de décision sur des données non confirmées. Le coût d'erreur est
donc transféré à l'utilisateur, qui voit ses notes avant de candidater.
**Mots-clés** : validation humaine · pas de décision auto · confiance
inversée.
**À éviter** : *« L'OCR ne se trompe jamais »* (faux).

---

### Q4 — *« Pourquoi pas de deep learning pour l'algo de matching ? »*

**Réponse** — Trois raisons. D'abord, **l'explicabilité** : on veut
que l'utilisateur comprenne pourquoi son score est ce qu'il est, ce
qui est très difficile avec un réseau de neurones. Ensuite, **la taille
de l'historique** réel d'admissions Parcoursup, par formation, ne
justifie pas la complexité d'un modèle deep — la régression logistique
fait le travail. Enfin, **le coût d'entraînement et de maintenance**
d'un modèle deep est sans rapport avec le bénéfice marginal.
**Mots-clés** : explicabilité · échelle des données · coût.
**À éviter** : *« Parce que c'est trop compliqué »* (registre défensif).

---

### Q5 — *« Comment vous évaluez la précision de vos prévisions ? »*

**Réponse** — Actuellement, sur des **profils types** générés (excellent
scientifique, profil moyen, profil faible) et sur les 50 formations
seedées, on observe une **discrimination cohérente** : le profil
excellent matche les écoles d'ingé / BUT scientifiques (90+),
le profil faible matche les licences non-sélectives (60+), et les
profils mixtes matchent leur domaine. On n'a pas encore validé sur
des **données réelles d'admission Parcoursup** — c'est explicitement
identifié dans notre rétrospective comme un livrable de la suite.
**Mots-clés** : profils typés · cohérence qualitative · pas encore de
ground truth réelle.
**À éviter** : *« On a 95 % de précision »* (chiffre non vérifié).

---

## Catégorie 2 — Questions produit (4)

### Q6 — *« Quelle est votre vraie différenciation vs Parcoursup ? »*

**Réponse** — Trois différenciations claires. **Un**, on dit à un
candidat *sa* probabilité d'être pris, pas le taux historique de la
formation. **Deux**, on lui explique le score (matières clés
pondérées, marge au seuil) au lieu de le laisser face à un nombre
opaque. **Trois**, on traite **différemment** les formations
sélectives et non-sélectives — Parcoursup les met dans le même
guichet, alors que la logique d'admission est radicalement
différente.
**Mots-clés** : individuel · expliqué · deux logiques.

---

### Q7 — *« Comment vous embarquez les écoles ? »*

**Réponse** — Trois canaux. **Un**, partenariat MESR — diffusion via
les ENT des établissements. **Deux**, démarchage commercial direct
sur les écoles privées qui ont un budget marketing. **Trois**, modèle
freemium : la déclaration d'une formation est gratuite, ce qui
abaisse la barrière d'entrée à zéro. Côté école, le ROI est rapide :
moins de temps en CEV grâce à l'export CSV.
**Mots-clés** : MESR · démarchage · freemium · ROI CEV.

---

### Q8 — *« Et les étudiants sans ordinateur ou sans bonne connexion ? »*

**Réponse** — La plateforme est **mobile-first**, donc utilisable
depuis un smartphone. Et l'OCR utilise une photo de bulletin
(extension future), pas obligatoirement un scan. Pour les profils
sans équipement personnel, l'usage envisagé est via les CIO et les
postes en lycée — **distribution institutionnelle**. Ça ne résout
pas le fossé numérique, mais ça ne l'aggrave pas non plus.
**Mots-clés** : mobile-first · CIO · postes lycée · pas
d'aggravation.
**À éviter** : *« Tout le monde a un ordi »* (faux).

---

### Q9 — *« Vous gérez la phase complémentaire ? »*

**Réponse** — Pas dans cette V1. La phase complémentaire est un
**périmètre suivant**, déjà identifié dans la roadmap. La logique de
matching y est différente : on raisonne par **place disponible** et
**proximité d'un projet**, pas par **adéquation × probabilité**. On
préfère bien faire la phase principale d'abord.
**Mots-clés** : V1 · roadmap · logique différente.

---

## Catégorie 3 — Questions business (3)

### Q10 — *« Qui paye Scoolize ? »*

**Réponse** — Modèle hybride. Une part **service public** financée
par le MESR à hauteur d'environ 1 million d'euros par an, qui couvre
l'usage gratuit pour les étudiants et les lycées. Et une part
**Premium pour les établissements** de l'enseignement supérieur (5
à 15 k€ par an et par établissement), qui finance la R&D continue.
**Cible** : 200 établissements payants en année 3.
**Mots-clés** : hybride · 1 M€ MESR · 5-15 k€ écoles · 200 cibles
an 3.

---

### Q11 — *« Pourquoi le Ministère financerait alors qu'ils ont déjà Parcoursup ? »*

**Réponse** — Parce que Scoolize ne **remplace** pas Parcoursup, elle
**rend lisible** ce que Parcoursup ne peut pas faire structurellement
(la personnalisation par profil et l'estimation des chances). C'est
une couche de service public **en amont** de la candidature
officielle. La Cour des comptes l'a dit dans son rapport 2020 :
l'opacité algorithmique reste un problème non résolu. Scoolize y
répond sans casser ce qui marche.
**Mots-clés** : amont · complément · Cour des comptes · opacité non
résolue.

---

### Q12 — *« Combien ça coûte par étudiant ? »*

**Réponse** — En régime de croisière, avec 150 000 étudiants actifs
et 1,7 M€ de coûts annuels, ça fait **environ 11 € par étudiant et
par an**. À comparer avec le coût d'un mauvais aiguillage d'orientation
(redoublement, abandon en L1) — l'étude SIES estime ce coût à
plusieurs milliers d'euros par cas évité.
**Mots-clés** : 11 € / étudiant / an · vs cas évité.

---

## Catégorie 4 — Questions équipe et rattrapage (4)

### Q13 — *« Pourquoi le 1er rendu était insuffisant selon vous ? »*

**Réponse** — Trois raisons assumées. **Un**, on a sous-estimé le
scope produit — on a investi sur le frontend avant la vision. **Deux**,
on a sous-priorisé les fondations de l'algorithme (pas de distinction
sélectif/non-sélectif, pas d'OCR). **Trois**, on a sous-investi la
documentation produit — le code parlait, mais il n'y avait ni audit,
ni personas, ni vision business. Les retours du jury ont été précis
et c'est ce qui a permis le rattrapage ciblé.
**Mots-clés** : scope · fondations · doc produit · retours utiles.
**À éviter** : *« Le jury n'a pas compris »* (suicide).

---

### Q14 — *« Qu'est-ce qui a changé dans votre méthode ? »*

**Réponse** — On a inversé l'ordre des choses. **Avant** : on code,
on documente après. **Maintenant** : on cadre la vision (audit
Parcoursup, personas), on définit l'expérience attendue (insights),
puis on code en sachant pourquoi. Concrètement : 7 livrables produit
en plus des livrables techniques, et 21 tests automatisés qui
verrouillent les régressions.
**Mots-clés** : ordre inversé · vision d'abord · livrables produit
· tests.

---

### Q15 — *« Comment vous vous êtes répartis le travail à 3 ? »*

**Réponse** — *(Honnêteté importante ici)* Paul-Adrien sur le
backend (API, OCR, algo de matching, intégration). Hugo sur le
frontend Predict (parcours étudiant). Nino sur le frontend Prepare
(parcours école). Le découpage est visible dans le repo via les
branches dédiées. Côté livrables produit, on a co-construit l'audit,
les personas et le business model.
**Mots-clés** : trois rôles distincts · visible en Git · co-construction
sur les docs produit.

---

### Q16 — *« Vous avez utilisé de l'IA pour développer le projet ? »*

**Réponse** — Oui, l'équipe a utilisé **Claude Code** comme
assistant de développement, et c'est tracé de manière transparente
dans l'historique Git via le trailer **Co-Authored-By: Claude** sur
les commits. Ça nous a permis de produire plus vite, mais la **vision
produit, les choix d'architecture et la responsabilité du résultat
nous appartiennent**. On peut défendre chaque ligne de code et chaque
décision parce qu'on comprend ce qui a été fait.
**Mots-clés** : transparence · trailer Git · vision et responsabilité
nôtres · on défend chaque ligne.
**À éviter** : nier l'usage de l'IA (l'historique Git le contredit).
*(Adapte cette réponse à ta vérité et à la politique d'Epitech.)*

---

## Catégorie 5 — Questions piège (4)

### Q17 — *« Est-ce qu'on peut pas dire que Scoolize creuse les inégalités en formalisant encore plus les critères ? »*

**Réponse** — Question légitime. Notre conviction est l'inverse :
**l'opacité actuelle creuse plus** que la formalisation. Les
candidats qui ont un capital culturel élevé (lycée prestigieux,
parents diplômés du sup) connaissent déjà les codes informels du
classement. Ceux qui n'ont pas ce capital sont laissés face à des
*attendus* opaques. Scoolize rend ces critères **lisibles pour tous**.
La condition est de garder l'algorithme **explicable** et
**transparent**, sinon le risque inverse existe effectivement.
**Mots-clés** : opacité plus inégalitaire · lisibilité pour tous ·
explicabilité comme garantie.
**À éviter** : *« On ne creuse pas »* sans démontrer pourquoi.

---

### Q18 — *« Vous avez parlé avec le Ministère ? »*

**Réponse** — Honnêtement : non, pas dans le cadre de ce projet
école. Le MESR figure comme **commanditaire de référence** parce
qu'il est le responsable de traitement plausible pour ce type
d'outil. Une vraie discussion institutionnelle est la **prochaine
étape** si le projet trouve un sponsor académique.
**Mots-clés** : pas de discussion réelle · plausibilité · prochaine
étape.
**À éviter** : *« On a parlé avec X au Ministère »* (faux et
vérifiable).

---

### Q19 — *« Combien de bulletins vous avez testés ? »*

**Réponse** — Trois bulletins générés, qui couvrent 3 profils
distincts : excellent scientifique, moyen, en difficulté. C'est peu,
on l'assume — la robustesse face aux bulletins réels (formats
différents par académie, OCR sur scan dégradé, photo) est un
chantier de la V2. Le code est en revanche conçu pour fallback
gracieux en cas d'échec d'OCR, ce qui ne casse pas l'expérience.
**Mots-clés** : 3 bulletins · 3 profils · V2 robustesse · fallback.

---

### Q20 — *« Pourquoi vous êtes vous-mêmes confiants que ce rattrapage est suffisant ? »*

**Réponse** — On ne dit pas qu'on est confiants : on dit qu'on a
**adressé chacun des reproches** précisément. OCR : intégré.
Prévisions imprécises : régression logistique avec intervalle de
confiance. Distinction sélectif / non-sélectif : deux branches
d'algorithme. Vision produit : 11 livrables documentés. Si le jury
identifie une autre lacune aujourd'hui, on l'écoutera avec la même
attention.
**Mots-clés** : adressé chaque reproche · ouverts aux retours.
**À éviter** : *« On a tout résolu »* (pas crédible).

---

## Comment t'entraîner aux Q&A

1. **Lis les 20 réponses** à voix haute, une par une.
2. Demande à Hugo / Nino de te poser les questions **dans le
   désordre**, sans que tu prépares.
3. **Filme-toi**. Repère les *« euh »*, les détours, les phrases
   trop longues.
4. **Coupe** toutes les réponses qui dépassent 45 s.
5. La veille de la soutenance, refais **5 questions tirées au
   hasard** sans préparation. Si tu réponds bien, tu es prêt.
