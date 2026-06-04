# Business model et étude concurrentielle — Scoolize

Scoolize est positionnée comme une plateforme d'orientation post-bac
commandée par le **Ministère de l'Enseignement supérieur et de la
Recherche** (MESR) pour rendre lisibles les chances d'admission là où
Parcoursup affiche des taux historiques sans personnalisation. Ce
document formalise le **Business Model Canvas**, l'analyse
concurrentielle, **trois scénarios économiques** chiffrés en ordres de
grandeur, et les **KPIs** de pilotage.

---

## Partie A — Business Model Canvas

| Bloc | Contenu |
|------|---------|
| **1. Segments clients** | • Étudiants (lycéens terminale + bacheliers en réorientation) — segment principal ~900 000/an.<br>• Familles (relais d'information et de décision).<br>• Lycées (CIO, professeurs principaux, référents orientation).<br>• Établissements publics (universités, IUT, CPGE) — recrutent sans dépendre de Scoolize mais y trouvent un canal de présentation.<br>• Établissements privés (écoles d'ingé, de commerce post-bac) — gain de visibilité qualifié.<br>• MESR — commanditaire et garant. |
| **2. Propositions de valeur** | • **Étudiant** : top 10 de formations personnalisé, probabilité d'admission expliquée, OCR du bulletin, intervalle de confiance, distinction sélectif/non-sélectif claire.<br>• **Famille** : un seul tableau de bord lisible, vocabulaire simple, pas d'opacité algorithmique.<br>• **Établissement** : déclaration formalisée des critères, dashboard candidats matchés, export CSV pour la CEV.<br>• **MESR** : transparence accrue, suivi des indicateurs d'inégalités, complémentarité de Parcoursup. |
| **3. Canaux** | • Site web responsive (acquisition organique + SEO).<br>• Partenariats lycées (CIO, professeurs principaux) — onboarding terrain.<br>• Diffusion par le **MESR** via les ENT (espaces numériques de travail).<br>• Salons étudiants (l'Étudiant, Studyrama).<br>• Réseaux sociaux courts (Instagram, TikTok) pour la sensibilisation. |
| **4. Relations client** | • **Étudiant** : self-service guidé, hotline pendant les pics (mars–juin), chat communautaire optionnel.<br>• **Établissement** : *account management* léger (mail + visio), webinaires de prise en main, support écrit.<br>• **Familles** : ressources pédagogiques (FAQ vidéo, infographies). |
| **5. Sources de revenus** | Voir Partie C — trois scénarios chiffrés (service public 100 %, hybride freemium, B2B). |
| **6. Ressources clés** | • Équipe **tech** (backend FastAPI/OCR/ML, frontend Next.js) — 3 à 5 ETP.<br>• Équipe **produit + UX** — 1 à 2 ETP.<br>• **Données ouvertes** Parcoursup (data.gouv.fr), annuaire éducation.<br>• Partenariats institutionnels (MESR, Onisep, lycées pilotes).<br>• **DPO** + conseil juridique pour la conformité RGPD. |
| **7. Activités clés** | • Maintenir et améliorer l'algorithme de matching (test sur historiques réels).<br>• OCR : robustesse, accessibilité, langues.<br>• Support utilisateur (étudiants + écoles), pic mars–juin.<br>• Conformité RGPD continue (AIPD, registre, droits).<br>• Pédagogie : kits de prise en main, vidéos, FAQ. |
| **8. Partenaires clés** | • **MESR** — commanditaire, garant institutionnel, canal de diffusion.<br>• **Onisep** — contenus d'orientation, complémentarité éditoriale.<br>• **Lycées pilotes** — beta-tests réels, retours qualitatifs.<br>• **Éditeurs scolaires** (Hachette, Nathan) — distribution annexe.<br>• **Hébergeurs** (Vercel, Render, OVH sur option souveraineté). |
| **9. Structure de coûts** | • **Masse salariale** ~75 % : 5 à 8 ETP en année 1 (dev, produit, support, juridique).<br>• **Infra cloud** ~5 % : ~30–60 k€/an (Vercel + Render + base PostgreSQL managée).<br>• **Conformité et juridique** ~5 % : DPO partagé, AIPD, mises à jour CGU.<br>• **Marketing et com** ~10 % : salons, contenus, partenariats lycées.<br>• **Support** ~5 % : hotline + outillage. |

---

## Partie B — Positionnement stratégique

### Analyse concurrentielle

| Acteur | Modèle économique | Cible principale | Force | Faiblesse |
|--------|--------------------|------------------|-------|-----------|
| **Parcoursup** (MESR) | Service public 100 % | Tous les bacheliers | Universalité, obligatoire de fait | Opacité algorithmes locaux, anxiogène, UX datée |
| **Onisep** (gouv.) | Service public | Lycéens, parents | Légitimité, contenus exhaustifs | Pas d'estimation personnalisée des chances |
| **Diplomeo** | Freemium (gratuit étudiant, payant écoles) | Étudiants en réorientation | Catalogue large, mise en relation | Biais commercial, registre commercial vs académique |
| **Studyrama** | Événementiel + média (B2B salons) | Étudiants et écoles | Force terrain, salons | Pas de matching personnalisé |
| **l'Étudiant** | Média + classements (publicité) | Étudiants et familles | Notoriété, classements connus | Modèle publicitaire, peu d'individualisation |
| **MonOrientationEnLigne** | Service public (coaching) | Étudiants en doute | Accompagnement humain | Capacité limitée, file d'attente |
| **Scoolize** | Voir Partie C | Étudiants + écoles | Matching expliqué, OCR bulletin, transparence | Démarrage à zéro, pas encore d'historique réel |

### Carte de positionnement

Axes choisis :

- **Horizontal** — *Transparence du raisonnement de matching* (de
  opaque à entièrement expliqué).
- **Vertical** — *Personnalisation aux données réelles de l'élève* (de
  contenu générique à profil individuel).

```
                 Personnalisation forte
                          ↑
                          |
                          |
        Scoolize ★        |    
                          |
   Diplomeo ●             |          (idéal théorique)
                          |
                          |
                          |
─── opaque ───────────────┼─────────── expliqué ──→
                          |
   l'Étudiant ●           |
   Studyrama ●            |
                          |    ● Onisep
                          |    ● Parcoursup
                          |    ● MonOrientationEnLigne
                          |
                          ↓
                 Personnalisation faible
```

Scoolize se positionne dans le **quadrant supérieur droit** —
personnalisation forte (matching sur données individuelles) **et**
explication transparente (score décomposé, intervalle de confiance,
matières clés visibles).

### Différenciation en 3 points

1. **Matching expliqué et chiffré, pas un score noir** — l'élève voit
   à la fois sa probabilité d'admission, les matières clés pondérées,
   et l'intervalle de confiance.
2. **OCR bulletin natif** — fin de la saisie manuelle, accessible aux
   profils peu outillés.
3. **Distinction sélectif/non-sélectif explicite** — deux discours,
   deux scoring (probabilité d'admission *vs* affinité × capacité).

---

## Partie C — Modèle économique

> Trois scénarios sont explorés. Les chiffres sont des **ordres de
> grandeur** réalistes pour une plateforme française à l'échelle
> nationale, à affiner avec une étude de marché réelle.

### Scénario 1 — Service public 100 %

**Hypothèses**

- Financement intégral par le **MESR**, mission de service public.
- Gratuit pour étudiants et établissements.
- Pas de publicité, pas de monétisation indirecte.

**Sources de revenus**

- Subvention annuelle MESR : **~3 M€/an** en régime de croisière.

**Coûts annuels estimés**

| Poste | Coût (k€) |
|-------|-----------|
| Masse salariale (5 ETP en année 1 → 8 ETP en année 3) | 600 → 900 |
| Infrastructure cloud | 60 |
| Conformité, juridique, audits | 80 |
| Marketing, partenariats, salons | 150 |
| Support utilisateur (pics) | 100 |
| **Total** | **990 → 1 290** |

**Avantages**

- Universel, équitable, aligné sur la mission de service public.
- Aucune incitation à biaiser l'algorithme dans un sens commercial.
- Cohérent avec la commande politique.

**Risques**

- Dépendance budgétaire au cycle politique.
- Difficulté à attirer les talents tech contre des salaires marché.
- Risque d'enlisement administratif si rattaché à un opérateur
  existant (Parcoursup, Onisep) sans autonomie.

---

### Scénario 2 — Hybride freemium

**Hypothèses**

- **Gratuit pour les étudiants et les lycées** (mission de service
  public partielle).
- **Freemium** pour les établissements de l'enseignement supérieur :
  - **Basic gratuit** : déclaration d'une formation, tableau de bord
    candidats, export CSV.
  - **Premium payant** : analytics avancés (suivi des désistements,
    benchmarks avec autres formations comparables, API d'import vers
    les outils CEV internes), support prioritaire, slots de webinaires
    de présentation candidats.

**Sources de revenus**

| Type | Prix | Volume cible année 3 | Revenus année 3 |
|------|------|----------------------|-----------------|
| Subvention MESR (part service public) | — | — | **1.0 M€** |
| Abonnement Premium école | **5–15 k€/an** par établissement | 200 établissements payants | **2.0 M€** |
| Webinaires et services associés | 2 k€ / session | 100 / an | **0.2 M€** |
| **Total** | | | **3.2 M€** |

**Coûts annuels estimés (année 3)**

| Poste | Coût (k€) |
|-------|-----------|
| Masse salariale (8 ETP) | 900 |
| Sales et account management | 250 |
| Infrastructure cloud | 80 |
| Conformité, juridique | 100 |
| Marketing | 200 |
| Support | 150 |
| **Total** | **1 680** |

**Marge brute estimée** : ~47 % en année 3.

**Avantages**

- **Autonomie financière partielle** : moins dépendant du seul budget MESR.
- **Pression positive** sur la qualité produit : les écoles paient,
  donc l'outil doit leur rendre service.
- **Modèle scalable** : ajout d'écoles à coût marginal faible.

**Risques**

- **Conflit d'intérêts perçu** : un étudiant peut craindre que les
  écoles « payantes » soient mises en avant. *Mitigation* : règle
  d'or — le **ranking n'est jamais influencé** par le statut payant
  d'une école. À écrire dans les CGU et auditer publiquement.
- **Cycle de vente long** côté écoles publiques (cycle budgétaire).
- **Risque de cannibalisation** par Parcoursup si le ministère préfère
  intégrer les features.

---

### Scénario 3 — B2B uniquement

**Hypothèses**

- **Gratuit étudiant** (toujours).
- **Payant école**, à partir de la déclaration d'une formation
  (5–25 k€/an selon la taille).
- Pas de subvention publique structurelle (au mieux, marchés publics
  ponctuels).

**Sources de revenus**

| Type | Prix | Volume cible année 3 | Revenus année 3 |
|------|------|----------------------|-----------------|
| Abonnement standard | 5 k€/an | 300 écoles | **1.5 M€** |
| Abonnement premium | 25 k€/an | 50 écoles | **1.25 M€** |
| Marchés publics (audit, conseil) | — | quelques-uns | **0.3 M€** |
| **Total** | | | **3.05 M€** |

**Coûts annuels estimés** : similaires au scénario 2 (~1.6–1.8 M€).

**Avantages**

- Indépendance totale vis-à-vis du MESR.
- Liberté de pivot, de tarification, d'évolution produit.

**Risques**

- **Risque de légitimité** : sans label public, attirer les
  établissements publics (universités) est très difficile.
- **Concurrence directe** avec Parcoursup et Onisep côté étudiant —
  pas de canal de diffusion massif.
- **Cycle de vente très long** côté écoles publiques.

---

### Recommandation

Le **scénario 2 (hybride freemium)** est recommandé.

**Pourquoi** :

1. La **part service public** préserve la mission d'équité d'accès et
   donne la légitimité institutionnelle indispensable.
2. La **part freemium école** crée une discipline produit (les payants
   donnent du feedback exigeant) et finance la R&D continue (algorithme,
   accessibilité).
3. La **règle d'or** d'indépendance du ranking, écrite dans les CGU et
   auditable, élimine le conflit d'intérêts perçu — *à la condition
   stricte* qu'elle soit appliquée et démontrée.
4. La structure de coûts converge vers une **marge ~45–50 %** en
   année 3, ce qui rend l'outil **soutenable sans renoncer à sa
   mission**.

---

## Partie D — KPIs et projections

### KPIs produit (étudiant)

| KPI | Définition | Cible an 1 | Cible an 3 |
|-----|------------|-----------|-----------|
| Étudiants inscrits | Comptes créés | 5 000 | 150 000 |
| Taux d'activation | Comptes ayant uploadé ou saisi des notes | 60 % | 75 % |
| Taux de candidature | Comptes actifs ayant cliqué « candidater » sur ≥ 1 formation | 30 % | 50 % |
| NPS étudiants | Score auto-déclaré post-usage | 30 | 50 |

### KPIs produit (école)

| KPI | Définition | Cible an 1 | Cible an 3 |
|-----|------------|-----------|-----------|
| Formations déclarées | Formations actives sur Scoolize | 50 | 1 500 |
| Taux d'export CSV | % d'écoles déclarantes exportant au moins une fois | 40 % | 80 % |
| NPS écoles | Score auto-déclaré post-usage | 25 | 55 |
| Établissements payants Premium | Nombre d'abonnements actifs | 5 | 200 |

### KPIs business

| KPI | Définition | Cible an 1 | Cible an 3 |
|-----|------------|-----------|-----------|
| ARR (Annual Recurring Revenue) | Revenus abonnements écoles | 25 k€ | 2.0 M€ |
| CAC école | Coût d'acquisition d'une école payante | 4 k€ | 2 k€ |
| Marge brute Premium | (ARR Premium − coûts directs) / ARR | 50 % | 70 % |
| Cash burn mensuel | Trésorerie consommée par mois | 100 k€ | équilibre |

### Projections financières (scénario 2 — hybride)

| | Année 1 | Année 2 | Année 3 |
|------|---------|---------|---------|
| **Revenus** | 0.4 M€ | 1.4 M€ | 3.2 M€ |
| Subvention MESR | 0.4 | 0.8 | 1.0 |
| Abonnements écoles | 0.025 | 0.5 | 2.0 |
| Services associés | 0 | 0.1 | 0.2 |
| **Coûts** | 1.0 M€ | 1.3 M€ | 1.7 M€ |
| **Résultat net** | **− 0.6 M€** | **+ 0.1 M€** | **+ 1.5 M€** |

> Lecture : un investissement net cumulé de l'ordre de **0.6 M€** la
> première année est nécessaire avant équilibre dès l'année 2. Le
> retour sur investissement intervient en année 3, sous réserve de la
> traction commerciale Premium auprès des établissements.

### Hypothèses critiques

- **Adoption MESR** : sans diffusion via les ENT, l'acquisition étudiante
  reste sous 10 000 inscrits → modèle non viable.
- **Conversion Premium** : 5 % des établissements adressables, soit
  ~200 sur ~4 000. Hypothèse modérée à valider sur un pilote 6 mois.
- **Pas de pivot tech** majeur (OCR, matching) en cours de route.
- **Cadre RGPD** stabilisé (cf. [`07-conformite/analyse-rgpd.md`](07-conformite/analyse-rgpd.md)).

---

## Sources

- **MESR** — notes annuelles sur Parcoursup, statistiques publiques.
- **data.gouv.fr** — datasets Parcoursup et annuaire éducation.
- **Cour des comptes** — rapport public *Parcoursup et le baccalauréat 2021*.
- **Études secteur** — analyses de cabinets sur l'EdTech française
  (Galileo Global Education, IONIS, Stations F EdTech reports).
- **Études IGÉSR / DEPP** sur l'insertion post-bac.
- Comparaisons internationales : **Studielink** (Pays-Bas), **UCAS**
  (Royaume-Uni), **Hochschulstart** (Allemagne) — modèles publics
  comparables, partiellement transposables.
