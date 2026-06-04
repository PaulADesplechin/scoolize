# Politique de confidentialité — Scoolize

**Version 1.0 · Dernière mise à jour : 4 juin 2026**

La présente politique décrit comment Scoolize collecte, utilise et
protège les données personnelles des utilisateurs de la plateforme,
conformément au **Règlement Général sur la Protection des Données**
(*RGPD*, règlement UE 2016/679) et à la **loi Informatique et
Libertés** modifiée.

> **Public mineur — point d'attention.** Scoolize s'adresse en priorité
> à des élèves de Terminale, dont une partie sont mineurs. Lorsqu'un
> utilisateur a moins de 15 ans, le **consentement des titulaires de
> l'autorité parentale** est requis (art. 8 RGPD).

## 1. Responsable de traitement

- **Responsable de traitement** : Ministère de l'Enseignement supérieur
  et de la Recherche (MESR), commanditaire de la plateforme Scoolize.
- Dans le contexte du projet pédagogique : *EPI'Gency Digital — projet
  école Scoolize*, responsable de traitement pour la durée du projet.
- **Contact DPO** : `dpo@scoolize.fr` (adresse de démonstration).

## 2. Données collectées

| Catégorie | Données | Source |
|-----------|---------|--------|
| Identité | Prénom, nom, email, mot de passe (haché) | Saisie utilisateur |
| Scolarité | Lycée, filière, spécialités, notes par matière | Saisie + OCR du bulletin |
| Utilisation | Formations consultées, candidatures envoyées, journaux d'accès | Génération automatique |
| Bulletins (transitoire) | Fichier PDF du bulletin | Upload utilisateur, **non conservé** après extraction |

## 3. Finalités et bases légales

| Finalité | Base légale (art. 6 RGPD) |
|----------|----------------------------|
| Création du profil étudiant et matching personnalisé | **Consentement explicite** (art. 6.1.a) et exécution d'une mission d'intérêt public (art. 6.1.e) |
| OCR du bulletin et extraction des notes | **Consentement explicite** au moment de l'upload (art. 6.1.a) |
| Affichage des formations matchées et candidatures | Exécution d'une mission d'intérêt public (art. 6.1.e) |
| Statistiques agrégées (sans réidentification) | Intérêt légitime de l'évaluation du dispositif (art. 6.1.f) |
| Sécurité, lutte contre la fraude | Intérêt légitime (art. 6.1.f) et obligation légale (art. 6.1.c) |

## 4. Durées de conservation

| Donnée | Durée | Justification |
|--------|-------|---------------|
| Fichier PDF du bulletin | **Non conservé après extraction** | Minimisation (art. 5.1.c) |
| Notes extraites et profil | **6 mois après la campagne** d'orientation | Cycle complet jusqu'à la phase complémentaire |
| Compte utilisateur (identité, email) | **3 ans** à compter de la dernière connexion | Réorientation possible année suivante |
| Logs techniques (sécurité) | **12 mois** glissants | Investigations sécurité |
| Statistiques agrégées et anonymisées | Indéfinie (anonymes) | Pilotage du dispositif |

## 5. Destinataires des données

- Les **formations** auxquelles l'étudiant choisit explicitement de
  candidater (et **uniquement** ces formations) reçoivent : identité,
  lycée, filière, notes du bulletin validé, score de matching de la
  candidature.
- Aucune donnée n'est cédée à des tiers à des fins commerciales.
- L'**hébergeur** (cf. mentions légales) traite les données pour
  l'exécution du service uniquement, sous contrat conforme à
  l'art. 28 RGPD.

## 6. Droits de l'utilisateur

Conformément aux articles 15 à 22 du RGPD, l'utilisateur dispose des
droits suivants :

- **Accès** (art. 15) : obtenir une copie de ses données.
- **Rectification** (art. 16) : corriger des données inexactes.
- **Effacement** / droit à l'oubli (art. 17) : suppression du compte
  et des données associées, effective sous 30 jours.
- **Limitation** (art. 18) : restreindre le traitement pendant une
  contestation.
- **Portabilité** (art. 20) : récupérer ses données dans un format
  structuré (JSON).
- **Opposition** (art. 21) : s'opposer au traitement à des fins de
  statistiques.
- **Pas de décision entièrement automatisée** (art. 22) : le score
  Scoolize est une aide à la décision, la candidature reste un acte
  volontaire de l'utilisateur.

**Exercice des droits** : par mail à `dpo@scoolize.fr` ; réponse
sous **1 mois** maximum.

**Réclamation** : auprès de la **CNIL** (https://www.cnil.fr).

## 7. Cookies et traceurs

Scoolize utilise uniquement des **cookies techniques** strictement
nécessaires au fonctionnement (session, préférences locales). Aucun
cookie publicitaire, aucun traceur tiers, aucun pixel de réseau
social. Pas de bandeau de consentement requis dans ce périmètre.

## 8. Cas particulier des mineurs

- Pour les utilisateurs **âgés de moins de 15 ans**, la création du
  compte requiert l'**accord d'un titulaire de l'autorité parentale**.
  Une case à cocher spécifique est présentée à l'inscription.
- Une page parent dédiée explique les finalités et les droits.

## 9. Sécurité des données

Voir [`analyse-rgpd.md`](analyse-rgpd.md) pour le détail des mesures
techniques et organisationnelles (art. 32 RGPD).

## 10. Évolutions de la politique

Toute modification substantielle de la politique sera notifiée par
email aux utilisateurs au moins **30 jours** avant son entrée en
vigueur. La version applicable à la dernière connexion fait foi.
