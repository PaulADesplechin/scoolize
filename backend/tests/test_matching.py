from types import SimpleNamespace

from matching import compute_match_score


def _student(grades: dict[str, float], region: str = "Île-de-France"):
    return SimpleNamespace(
        grades=[SimpleNamespace(subject=s, value=v) for s, v in grades.items()],
        school=SimpleNamespace(region=region),
        school_id=1,
    )


def _program(type_, *, min_average=None, admission_rate=None, key_subjects=None, region="Île-de-France"):
    return SimpleNamespace(
        type=type_,
        min_average=min_average,
        admission_rate=admission_rate,
        key_subjects=key_subjects or {},
        region=region,
        name="Formation",
        institution="Établissement",
    )


EXCELLENT = {"Mathématiques": 18, "Physique-Chimie": 17, "NSI": 16}
AVERAGE = {"Mathématiques": 12, "Physique-Chimie": 11, "NSI": 12}
WEAK = {"Mathématiques": 8, "Physique-Chimie": 9, "NSI": 8}

CPGE = _program(
    "selective", min_average=15.5, admission_rate=0.10,
    key_subjects={"Mathématiques": 0.5, "Physique-Chimie": 0.3, "NSI": 0.2},
)
LICENCE = _program(
    "non_selective", admission_rate=0.85,
    key_subjects={"Mathématiques": 0.4, "NSI": 0.4, "Physique-Chimie": 0.2},
)


def test_scores_bounded_and_interval_ordered():
    for profile in (EXCELLENT, AVERAGE, WEAK):
        for program in (CPGE, LICENCE):
            r = compute_match_score(_student(profile), program)
            assert 0.0 <= r["confidence_low"] <= r["score"] <= r["confidence_high"] <= 100.0
            assert r["category"] == program.type
            assert isinstance(r["rationale"], str) and r["rationale"]


def test_selective_ranks_students_by_level():
    pe = compute_match_score(_student(EXCELLENT), CPGE)["score"]
    pa = compute_match_score(_student(AVERAGE), CPGE)["score"]
    pw = compute_match_score(_student(WEAK), CPGE)["score"]
    assert pe > pa > pw


def test_weak_not_eligible_but_excellent_is_on_demanding_cpge():
    assert compute_match_score(_student(WEAK), CPGE)["eligible"] is False
    assert compute_match_score(_student(EXCELLENT), CPGE)["eligible"] is True


def test_non_selective_always_eligible_and_rewards_fit():
    assert compute_match_score(_student(WEAK), LICENCE)["eligible"] is True
    strong = compute_match_score(_student(EXCELLENT), LICENCE)["score"]
    weak = compute_match_score(_student(WEAK), LICENCE)["score"]
    assert strong > weak


def test_subject_fit_drives_score():
    sci_program = _program(
        "non_selective", admission_rate=0.8,
        key_subjects={"Mathématiques": 0.6, "Physique-Chimie": 0.4},
    )
    lit_program = _program(
        "non_selective", admission_rate=0.8,
        key_subjects={"Français": 0.5, "Philosophie": 0.5},
    )
    sci_student = _student(
        {"Mathématiques": 17, "Physique-Chimie": 16, "Français": 10, "Philosophie": 9}
    )
    on_sci = compute_match_score(sci_student, sci_program)["score"]
    on_lit = compute_match_score(sci_student, lit_program)["score"]
    assert on_sci > on_lit


def test_geographic_proximity_bonus():
    near = _program("non_selective", admission_rate=0.8, key_subjects={"Mathématiques": 1.0}, region="Île-de-France")
    far = _program("non_selective", admission_rate=0.8, key_subjects={"Mathématiques": 1.0}, region="Occitanie")
    student = _student({"Mathématiques": 14}, region="Île-de-France")
    assert compute_match_score(student, near)["score"] >= compute_match_score(student, far)["score"]


def test_confidence_interval_tighter_with_more_coverage():
    full = _student({"Mathématiques": 14, "Physique-Chimie": 13, "NSI": 12})
    partial = _student({"Mathématiques": 14})
    r_full = compute_match_score(full, CPGE)
    r_partial = compute_match_score(partial, CPGE)
    width_full = r_full["confidence_high"] - r_full["confidence_low"]
    width_partial = r_partial["confidence_high"] - r_partial["confidence_low"]
    assert width_full < width_partial
