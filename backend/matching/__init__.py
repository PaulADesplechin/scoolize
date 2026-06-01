"""Algorithme de matching étudiant ↔ formation.

Combine quatre signaux :
  - adéquation aux matières clés (moyenne pondérée de l'élève sur ces matières) ;
  - probabilité d'admission (régression logistique scikit-learn) ;
  - capacité résiduelle de la formation ;
  - proximité géographique (région).

Deux branches distinctes :
  - SÉLECTIF : seuil d'éligibilité + probabilité d'admission (position du dossier
    face aux admis historiques, estimée par le modèle) ;
  - NON-SÉLECTIF : pertinence du projet (adéquation matières) + capacité résiduelle.

Renvoie un score /100, un intervalle de confiance, la catégorie et l'éligibilité.
"""
from __future__ import annotations

from functools import lru_cache

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

_DEFAULT_THRESHOLD = 12.0  # seuil de référence si la formation n'en déclare pas


def _train_admission_model():
    """Modèle probabiliste entraîné sur un historique d'admissions synthétique.

    Variables : marge (moyenne élève − seuil, en points /20) et sélectivité
    (1 − taux d'admission). Règle latente bruitée : on est admis lorsque la marge
    dépasse une exigence qui croît avec la sélectivité. Graine fixe = reproductible.
    """
    rng = np.random.default_rng(42)
    n = 6000
    margin = rng.normal(0.0, 3.0, n)
    selectivity = rng.uniform(0.0, 1.0, n)
    logit = 1.3 * margin - 4.5 * selectivity + 0.6
    prob = 1.0 / (1.0 + np.exp(-logit))
    admitted = (rng.uniform(0.0, 1.0, n) < prob).astype(int)
    features = np.column_stack([margin, selectivity])
    model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
    model.fit(features, admitted)
    return model


@lru_cache(maxsize=1)
def _admission_model():
    """Charge le modèle paresseusement : pas de coût à l'import, entraîné au 1er appel."""
    return _train_admission_model()


def _grades_by_subject(student) -> dict[str, float]:
    return {g.subject: g.value for g in getattr(student, "grades", [])}


def _weighted_average(
    grades: dict[str, float], key_subjects: dict[str, float]
) -> tuple[float, float]:
    """Renvoie (moyenne pondérée sur les matières clés, taux de couverture 0..1)."""
    overall = sum(grades.values()) / len(grades) if grades else 10.0
    if not key_subjects:
        return overall, (1.0 if grades else 0.0)
    num = den = 0.0
    matched = 0
    for subject, weight in key_subjects.items():
        if subject in grades:
            num += grades[subject] * weight
            den += weight
            matched += 1
    if den == 0.0:
        return overall, 0.0
    return num / den, matched / len(key_subjects)


def _geo_factor(student, program) -> float:
    region = getattr(getattr(student, "school", None), "region", None)
    if region and program.region and region == program.region:
        return 1.0
    return 0.6


def _admission_probability(weighted_avg: float, program) -> float:
    threshold = (
        program.min_average if program.min_average is not None else _DEFAULT_THRESHOLD
    )
    selectivity = 1.0 - (
        program.admission_rate if program.admission_rate is not None else 0.5
    )
    margin = weighted_avg - threshold
    proba = _admission_model().predict_proba([[margin, selectivity]])[0, 1]
    return float(proba)


def _confidence_margin(coverage: float, n_grades: int) -> float:
    """Plus on connaît de matières clés de l'élève, plus l'intervalle est resserré."""
    margin = 4.0 + (1.0 - coverage) * 11.0
    if n_grades < 3:
        margin += 3.0
    return margin


def compute_match_score(student, program) -> dict:
    grades = _grades_by_subject(student)
    key_subjects = program.key_subjects or {}
    weighted_avg, coverage = _weighted_average(grades, key_subjects)
    affinity = min(weighted_avg / 20.0, 1.0)
    # Pénalise les formations dont on ne connaît aucune des matières clés de l'élève
    # (sinon le repli sur la moyenne générale gonfle des formations hors-sujet).
    affinity_adj = affinity * (0.7 + 0.3 * coverage)
    geo = _geo_factor(student, program)

    if program.type == "selective":
        threshold = program.min_average
        eligible = weighted_avg >= threshold if threshold is not None else True
        proba = _admission_probability(weighted_avg, program)
        score = 100.0 * (0.5 * proba + 0.4 * affinity_adj + 0.1 * geo)
        if not eligible:
            score *= 0.6
        rationale = (
            f"Probabilité d'admission estimée à {proba * 100:.0f}% — "
            f"moyenne matières clés {weighted_avg:.1f}/20"
            + (f" (seuil indicatif {threshold:.0f})." if threshold is not None else ".")
        )
    else:  # non_selective
        eligible = True
        comfort = program.admission_rate if program.admission_rate is not None else 0.7
        score = 100.0 * (0.6 * affinity_adj + 0.25 * comfort + 0.15 * geo)
        rationale = (
            f"Bonne adéquation ({weighted_avg:.1f}/20 sur les matières clés), "
            f"capacité {'large' if comfort > 0.7 else 'limitée'}."
        )

    score = round(max(0.0, min(100.0, score)), 1)
    margin = _confidence_margin(coverage, len(grades))
    return {
        "score": score,
        "confidence_low": round(max(0.0, score - margin), 1),
        "confidence_high": round(min(100.0, score + margin), 1),
        "category": program.type,
        "eligible": bool(eligible),
        "rationale": rationale,
    }
