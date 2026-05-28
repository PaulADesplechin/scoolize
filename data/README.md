# Données Scoolize

Ce dossier contient les jeux de données utilisés pour peupler la base de
démonstration via [`scripts/seed.py`](../scripts/seed.py).

## Fichiers

| Fichier | Contenu |
|---------|---------|
| `lycees.csv` | 20 lycées français (Île-de-France + grandes villes) avec code UAI, ville, région |
| `formations.csv` | 50 formations post-bac, sélectives et non-sélectives, avec critères d'admission |
| `sample_bulletins/` | Bulletins PDF d'exemple pour tester l'OCR (générés à l'étape 4) |

## Schéma `formations.csv`

```
name,institution,type,domain,city,region,capacity,admission_rate,min_average,key_subjects
```

- `type` : `selective` (CPGE, BUT, écoles d'ingé/commerce, Sciences Po) ou `non_selective` (licences universitaires).
- `admission_rate` : taux d'admission historique (0–1). Plus il est bas, plus la formation est sélective.
- `min_average` : moyenne indicative d'éligibilité (/20). Vide pour les formations non-sélectives.
- `key_subjects` : matières clés pondérées, au format `Matière:poids;Matière:poids`.

## Sources

Données **illustratives** inspirées des jeux open data publics :

- **Annuaire de l'éducation** (noms de lycées, codes UAI) —
  <https://www.data.gouv.fr/fr/datasets/annuaire-de-leducation/>
- **Parcoursup — vœux de poursuite d'études et réponses des établissements** —
  <https://www.data.gouv.fr/fr/datasets/parcoursup-2023-voeux-de-poursuite-detudes-et-de-reorientation-dans-lenseignement-superieur-et-reponses-des-etablissements/>

> ⚠️ Les valeurs chiffrées (capacités, taux d'admission, moyennes minimales) sont
> **plausibles mais construites à la main** pour la démo : elles ne proviennent pas
> d'un import automatisé des CSV officiels. Les noms d'établissements sont réels ;
> les codes UAI sont au bon format mais à considérer comme indicatifs.
