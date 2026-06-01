"""Extraction OCR des notes depuis un bulletin scolaire (PDF).

Pipeline : PDF --(poppler/pdf2image)--> images --(Tesseract/pytesseract)--> texte
           --(parser regex format français)--> {matière: note}

Les dépendances lourdes (pdf2image, pytesseract) et les binaires système
(tesseract, poppler) sont optionnels : en leur absence, l'extraction renvoie un
dictionnaire vide et journalise un avertissement, sans jamais planter l'API.
"""
from __future__ import annotations

import logging
import re
import unicodedata
from pathlib import Path

logger = logging.getLogger(__name__)

# Intitulés bruts (sans accents, en minuscules) -> forme canonique.
_SUBJECT_ALIASES = {
    "mathematiques": "Mathématiques",
    "maths": "Mathématiques",
    "physique-chimie": "Physique-Chimie",
    "physique chimie": "Physique-Chimie",
    "sciences de la vie et de la terre": "SVT",
    "svt": "SVT",
    "numerique et sciences informatiques": "NSI",
    "nsi": "NSI",
    "francais": "Français",
    "philosophie": "Philosophie",
    "histoire-geographie": "Histoire-Géographie",
    "histoire geographie": "Histoire-Géographie",
    "histoire-geo": "Histoire-Géographie",
    "sciences economiques et sociales": "SES",
    "ses": "SES",
    "anglais": "LV1 Anglais",
    "lv1 anglais": "LV1 Anglais",
    "espagnol": "LV2 Espagnol",
    "hggsp": "HGGSP",
    "hlp": "HLP",
    "education physique et sportive": "EPS",
    "eps": "EPS",
}

# Nom de matière (commence par une lettre) + PREMIÈRE note de la ligne.
# Convention de nos bulletins : la moyenne de l'élève est la 1re valeur.
_LINE_RE = re.compile(
    r"^\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9'’.\- ]*?)[\s:.]+"
    r"(\d{1,2}(?:[.,]\d{1,2})?)\s*(?:/\s*20)?\b"
)


def _strip_accents(text: str) -> str:
    return "".join(
        c
        for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )


def _canonical_subject(raw: str) -> str | None:
    key = re.sub(r"\s+", " ", _strip_accents(raw).lower().strip())
    if key in _SUBJECT_ALIASES:
        return _SUBJECT_ALIASES[key]
    # L'OCR ajoute parfois des mots autour : on cherche un alias en mot entier.
    for alias, canonical in _SUBJECT_ALIASES.items():
        if re.search(rf"\b{re.escape(alias)}\b", key):
            return canonical
    return None


def parse_grades_from_text(text: str) -> dict[str, float]:
    """Extrait {matière canonique: note/20} d'un texte de bulletin (format français)."""
    grades: dict[str, float] = {}
    for line in text.splitlines():
        match = _LINE_RE.match(line)
        if not match:
            continue
        subject = _canonical_subject(match.group(1))
        if subject is None or subject in grades:
            continue
        value = float(match.group(2).replace(",", "."))
        if 0.0 <= value <= 20.0:
            grades[subject] = value
    return grades


def _ocr_image(image, lang: str | None) -> str:
    """Lit une image via Tesseract — renvoie '' si Tesseract échoue."""
    import pytesseract

    try:
        if lang:
            return pytesseract.image_to_string(image, lang=lang)
        return pytesseract.image_to_string(image)
    except Exception as exc:
        logger.warning("Tesseract a échoué (lang=%s) : %s", lang, exc)
        return ""


def extract_text_from_pdf(pdf_bytes: bytes, lang: str = "fra") -> str:
    """PDF -> texte (poppler + Tesseract). Renvoie '' si une dépendance manque."""
    try:
        import pytesseract  # noqa: F401
        from pdf2image import convert_from_bytes
    except ImportError as exc:
        logger.warning("OCR indisponible (dépendances Python manquantes : %s)", exc)
        return ""

    try:
        images = convert_from_bytes(pdf_bytes, dpi=300)
    except Exception as exc:  # poppler absent ou PDF illisible
        logger.warning("Conversion PDF -> image échouée : %s", exc)
        return ""

    chunks: list[str] = []
    for image in images:
        text = _ocr_image(image, lang)
        if not text and lang:
            text = _ocr_image(image, None)  # repli sans langue
        chunks.append(text)
    return "\n".join(chunks)


def extract_grades_from_pdf(pdf_path: str | Path) -> dict[str, float]:
    """Extrait les notes d'un bulletin sur disque."""
    return extract_grades_from_bytes(Path(pdf_path).read_bytes())


def extract_grades_from_bytes(
    content: bytes, filename: str | None = None
) -> dict[str, float]:
    """Point d'entrée de l'API. Toujours robuste : renvoie {} en cas d'échec."""
    if not content:
        return {}
    text = extract_text_from_pdf(content)
    if not text.strip():
        return {}
    return parse_grades_from_text(text)
