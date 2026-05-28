import shutil
from pathlib import Path

import pytest

from ocr import (
    extract_grades_from_bytes,
    extract_grades_from_pdf,
    parse_grades_from_text,
)

SAMPLE_DIR = Path(__file__).resolve().parents[1].parent / "data" / "sample_bulletins"


def test_parse_basic_french_format():
    text = """BULLETIN SCOLAIRE
    Mathématiques 14,5 11,2 Bien
    Physique-Chimie 13,0 10,8 Assez bien
    Anglais 15 12 Bon niveau
    Moyenne générale 13,8
    """
    grades = parse_grades_from_text(text)
    assert grades["Mathématiques"] == 14.5
    assert grades["Physique-Chimie"] == 13.0
    assert grades["LV1 Anglais"] == 15.0
    assert "Moyenne générale" not in grades


def test_parse_handles_dot_slash20_and_uppercase():
    text = "MATHEMATIQUES: 16.5/20\nSVT 11,0/20\nPHILOSOPHIE 9\n"
    grades = parse_grades_from_text(text)
    assert grades["Mathématiques"] == 16.5
    assert grades["SVT"] == 11.0
    assert grades["Philosophie"] == 9.0


def test_parse_ignores_nonsubjects_and_out_of_range():
    text = "Effectif 35\nMathématiques 14,0\nAbsences 2 demi-journées\n"
    grades = parse_grades_from_text(text)
    assert grades == {"Mathématiques": 14.0}


def test_extract_from_bytes_is_graceful():
    assert extract_grades_from_bytes(b"") == {}
    assert extract_grades_from_bytes(b"ceci n'est pas un pdf") == {}


def _ocr_available() -> bool:
    try:
        import pdf2image  # noqa: F401
        import pytesseract  # noqa: F401
    except ImportError:
        return False
    return bool(shutil.which("tesseract") and shutil.which("pdftoppm"))


@pytest.mark.skipif(not _ocr_available(), reason="Tesseract/poppler indisponibles")
def test_extract_real_bulletin():
    pdf = SAMPLE_DIR / "bulletin_lea_martin.pdf"
    if not pdf.exists():
        pytest.skip("Bulletin d'exemple absent (lancer scripts/generate_bulletins.py)")
    grades = extract_grades_from_pdf(pdf)
    assert grades, "aucune note extraite du bulletin"
    assert grades.get("Mathématiques") == pytest.approx(18.0, abs=1.0)
    assert "Physique-Chimie" in grades
    assert all(0.0 <= v <= 20.0 for v in grades.values())
