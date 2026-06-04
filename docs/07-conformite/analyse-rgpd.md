# Analyse d'impact RGPD (AIPD simplifiée) — Scoolize

**Version 1.0 · Dernière mise à jour : 4 juin 2026**

L'Analyse d'Impact relative à la Protection des Données (AIPD ou
*PIA — Privacy Impact Assessment*) formalise l'évaluation des risques
liés au traitement de données personnelles par Scoolize, conformément
à l'**article 35 du RGPD**. Le traitement implique des données
relatives à des **mineurs** et à leur scolarité, ce qui le place
explicitement dans le périmètre d'AIPD obligatoire (CNIL, liste des
traitements soumis à AIPD).

## 1. Description du traitement

### Finalités

- Aide à l'orientation post-bac : matching personnalisé.
- Estimation de probabilité d'admission.
- Suivi des candidatures et restitution côté établissement.

### Données traitées

| Catégorie | Sensibilité |
|-----------|-------------|
| Identité (prénom, nom, email) | Standard |
| Scolarité (lycée, filière, spécialités) | Standard |
| Notes et bulletins | **Standard mais sensibles pour le mineur** (susceptibles d'affecter son orientation) |
| Logs techniques | Standard |

### Populations concernées

- Élèves de Terminale (15-18 ans, **dont mineurs**).
- Étudiants en réorientation (majeurs).
- Personnel des CEV (commissions d'examen des vœux) des établissements.

### Flux de données

```
Élève → upload PDF bulletin → OCR Tesseract → notes extraites
                                                   ↓
                                              base SQL (chiffrée TLS)
                                                   ↓
Élève ← matching ← algorithme ← base SQL
       (validation humaine puis candidature)
                                                   ↓
                                       Établissement choisi (et seulement lui)
```

## 2. Nécessité et proportionnalité

| Question | Analyse |
|----------|---------|
| **Données strictement nécessaires ?** | Oui. Les notes et la filière sont indispensables au matching. Le PDF source est **détruit après extraction**. |
| **Durées de conservation justifiées ?** | Oui. Profil : 6 mois après la campagne (cycle de phase complémentaire). Compte : 3 ans (réorientation). Logs : 12 mois (sécurité). |
| **Décisions automatisées ?** | **Non au sens strict de l'art. 22** : le score Scoolize est une aide à la décision ; la candidature est un acte volontaire de l'utilisateur. |
| **Profilage ?** | Limité au calcul du score. Pas de scoring social ni de profil comportemental. |

## 3. Identification des risques

| Risque | Probabilité | Gravité | Score initial |
|--------|:-----------:|:-------:|:-------------:|
| **R1 — Accès non autorisé** aux notes d'un élève (compromission de compte) | Moyenne | Élevée | **Important** |
| **R2 — Fuite massive** des bulletins (vol de base) | Faible | Très élevée | **Important** |
| **R3 — Ré-identification** depuis des statistiques agrégées | Faible | Moyenne | Modéré |
| **R4 — Détournement de finalité** (utilisation à des fins commerciales) | Faible | Élevée | Modéré |
| **R5 — Erreur OCR ayant un impact** sur le matching (mauvaise note extraite) | Moyenne | Faible (validation humaine) | Faible |
| **R6 — Décision défavorable** prise par un établissement sur la base d'une donnée erronée fournie via Scoolize | Faible | Élevée | Modéré |
| **R7 — Atteinte à la vie privée** d'un mineur (révélation à un parent non titulaire de l'autorité) | Faible | Élevée | Modéré |

## 4. Mesures techniques (art. 32 RGPD)

| Mesure | Implémentation Scoolize |
|--------|--------------------------|
| Chiffrement en transit | TLS 1.3 obligatoire (HSTS activé). |
| Chiffrement au repos | Volumes Render chiffrés. Base PostgreSQL chiffrée. |
| Hachage des mots de passe | PBKDF2-HMAC-SHA256, 200 000 itérations, salt 16 octets (`backend/app/security.py`). |
| Authentification | JWT signé HS256, secret ≥ 32 octets, expiration 24 h. |
| Contrôle d'accès | Dépendance FastAPI `get_owned_student` : un étudiant ne peut accéder qu'à ses propres ressources (`backend/app/deps.py`). |
| CORS strict | Domaines en *whitelist*. Pas de wildcard en production. |
| Minimisation | Le PDF du bulletin **n'est pas conservé** après extraction OCR. |
| Logs de sécurité | Connexions, modifications de notes, candidatures — conservés 12 mois. |
| Tests automatisés | 21 tests pytest, dont 2 tests d'isolation (étudiant A ne peut pas modifier les notes de B). |
| CI | GitHub Actions sur PR : lint + tests obligatoires. |

## 5. Mesures organisationnelles

| Mesure | Implémentation Scoolize |
|--------|--------------------------|
| Délégué à la protection des données | Désigné, contact public `dpo@scoolize.fr`. |
| Registre des traitements | Tenu et actualisé (art. 30 RGPD). |
| Formation de l'équipe | Onboarding RGPD obligatoire à l'arrivée + rappel annuel. |
| Sous-traitants | Contrats art. 28 RGPD avec Vercel et Render. |
| Procédure de violation de données | Notification CNIL sous 72 h (art. 33), information des personnes si risque élevé (art. 34). |
| Consentement parental (mineurs < 15 ans) | Case à cocher dédiée à l'inscription + page d'information parent. |
| Procédure d'exercice des droits | Email `dpo@scoolize.fr` — réponse sous 1 mois. |
| Politique de confidentialité accessible | Lien permanent dans le pied de page de toutes les pages. |

## 6. Risque résiduel (après mesures)

| Risque | Score résiduel | Commentaire |
|--------|:--------------:|-------------|
| R1 — Accès non autorisé | Modéré | JWT + ownership check ; rotation des secrets recommandée tous les 90 jours. |
| R2 — Fuite massive | Faible | Chiffrement + minimisation + segmentation. |
| R3 — Ré-identification | Faible | Statistiques publiées à granularité élevée uniquement (≥ 30 individus par cellule). |
| R4 — Détournement de finalité | Faible | Règle d'or « pas de revente, pas d'usage commercial des données utilisateur » écrite dans les CGU. |
| R5 — Erreur OCR | Très faible | Validation humaine obligatoire des notes extraites avant matching. |
| R6 — Décision défavorable établissement | Faible | Le score n'est pas transmis aux établissements lors d'une candidature : seul l'établissement choisi reçoit les notes validées. |
| R7 — Atteinte vie privée mineur | Faible | Consentement parental documenté ; pas de notification automatique aux parents sans demande. |

**Conclusion AIPD** : le traitement est **proportionné** aux finalités
poursuivies. Les mesures techniques et organisationnelles ramènent
l'ensemble des risques à un niveau **acceptable**. L'AIPD doit être
revue à chaque évolution majeure du traitement (nouvelle finalité,
nouvelle catégorie de données, nouveau sous-traitant) et au minimum
**tous les 2 ans**.

## 7. Validation

| Rôle | Signataire | Date |
|------|------------|------|
| Responsable de traitement | — | — |
| DPO | — | — |
| Direction technique | — | — |

> *Cette AIPD est un document vivant. Le tableau ci-dessus est signé
> à chaque révision.*
