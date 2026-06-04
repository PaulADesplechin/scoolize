# Engagements de service (SLA) — Scoolize

**Version 1.0 · Dernière mise à jour : 4 juin 2026**

Le présent document décrit les engagements de niveau de service
(Service Level Agreement) de Scoolize. Il est applicable au service
en production une fois déployé. Le périmètre projet école/MVP s'y
réfère comme **objectif de référence**, sans engagement contractuel
formel.

## 1. Périmètre

Le SLA couvre :

- l'**accès au site** Scoolize (frontend) ;
- l'**API** backend (endpoints `/api/*` et `/health`) ;
- les **services métier** : OCR du bulletin, matching, candidatures.

## 2. Disponibilité

| Période | Engagement |
|---------|------------|
| **Période Parcoursup** (1ᵉʳ janvier — 31 août) | **99,0 %** sur le mois |
| Hors période Parcoursup | **97,5 %** sur le mois |

Une indisponibilité de moins de **5 minutes** consécutives n'est pas
comptée.

### Plages de maintenance programmée

- Mardi et jeudi de **04 h 00 à 05 h 00 UTC** (06 h–07 h heure de
  Paris).
- Préavis aux utilisateurs **24 h à l'avance** par bandeau et email
  pour toute maintenance prévue à fort impact.

## 3. Temps de réponse

| Endpoint | Cible médiane (p50) | Cible p95 |
|----------|:-------------------:|:---------:|
| `GET /health` | 50 ms | 200 ms |
| `GET /api/programs` (paginé) | 100 ms | 500 ms |
| `GET /api/match/{id}` | 300 ms | 1 500 ms |
| `POST /api/students/{id}/upload` (OCR ≤ 3 pages) | 4 s | 12 s |
| `POST /api/applications` | 150 ms | 500 ms |

Les temps mesurés excluent la latence réseau client.

## 4. Support utilisateur

| Canal | Disponibilité | Délai de première réponse |
|-------|---------------|----------------------------|
| Email `support@scoolize.fr` | 7 j / 7 (réponse pendant heures ouvrées) | **8 h ouvrées** |
| Hotline téléphonique (période Parcoursup uniquement) | Lundi-vendredi 09 h - 18 h | Réponse directe |
| Status page publique | 24 / 7 | Mise à jour en temps réel |

## 5. Gestion des incidents

### 5.1 Niveaux de gravité

| Niveau | Définition | Délai de prise en charge |
|--------|------------|--------------------------|
| **P0 — Critique** | Service inaccessible pour la majorité des utilisateurs | **< 30 min** (astreinte 24/7 en période Parcoursup) |
| **P1 — Majeur** | Fonction clé indisponible (ex. OCR ne fonctionne plus) | **< 2 h ouvrées** |
| **P2 — Mineur** | Fonction secondaire dégradée | **< 8 h ouvrées** |
| **P3 — Cosmétique** | Bug d'affichage sans impact fonctionnel | **< 5 jours ouvrés** |

### 5.2 Procédure

1. **Détection** — monitoring automatique + signalement utilisateur.
2. **Triage** — classification de la gravité par l'astreinte.
3. **Communication** — mise à jour de la *status page* publique dans
   les 15 minutes pour les incidents P0/P1.
4. **Résolution** — correction et déploiement.
5. **Post-mortem** — pour tout incident P0 ou P1, post-mortem publié
   sous 7 jours, sans recherche de coupable, avec **plan d'action
   préventif**.

### 5.3 Notification de violation de données

En cas de violation de données personnelles susceptible d'engendrer
un risque pour les droits et libertés des personnes, le DPO notifie
la **CNIL sous 72 heures** (art. 33 RGPD) et informe les personnes
concernées si le risque est élevé (art. 34).

## 6. Sauvegardes et reprise

| Mesure | Cible |
|--------|-------|
| Fréquence des sauvegardes de la base PostgreSQL | **Toutes les heures** (incrémental) + 1 sauvegarde complète quotidienne |
| Conservation des sauvegardes | **30 jours** glissants |
| RPO (Recovery Point Objective) | **1 heure** |
| RTO (Recovery Time Objective) | **4 heures** |
| Test de restauration | **Trimestriel**, documenté dans le journal d'exploitation |

## 7. Exclusions

Les engagements ci-dessus ne s'appliquent pas en cas de :

- force majeure (catastrophe naturelle, panne majeure de
  l'opérateur télécom, etc.) ;
- attaque de déni de service distribuée (DDoS) d'une ampleur
  exceptionnelle ;
- maintenance programmée notifiée dans les délais ;
- défaillance d'un sous-traitant hors du périmètre Scoolize, après
  documentation.

## 8. Reporting

Un **rapport mensuel** de disponibilité, temps de réponse et
incidents est publié sur la status page publique.

## 9. Évolution

Ce SLA est revu **chaque année** et après chaque post-mortem P0.
