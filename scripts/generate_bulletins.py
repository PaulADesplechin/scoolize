"""Génère des bulletins scolaires PDF d'exemple (data/sample_bulletins/) pour tester l'OCR.

Les profils reprennent 3 étudiants du seed (Léa, Noah, Lina) pour une démo cohérente.

Usage :
    python scripts/generate_bulletins.py
"""
from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = Path(__file__).resolve().parents[1] / "data" / "sample_bulletins"

BULLETINS = [
    {
        "fichier": "bulletin_lea_martin.pdf",
        "lycee": "Lycée Louis-le-Grand",
        "eleve": "Léa MARTIN",
        "classe": "Terminale Générale",
        "trimestre": "2e trimestre",
        "annee": "2024-2025",
        "notes": [
            ("Mathématiques", "18,0", "12,5", "Excellent, continuez ainsi"),
            ("Physique-Chimie", "17,0", "11,8", "Très bon trimestre"),
            ("NSI", "16,5", "13,0", "Très bonne maîtrise"),
            ("Français", "14,0", "11,5", "Bon travail à l'écrit"),
            ("Histoire-Géographie", "13,5", "11,0", "Sérieux et appliqué"),
            ("Anglais", "15,0", "12,5", "Bon niveau"),
            ("Philosophie", "15,0", "10,5", "Réflexion de qualité"),
        ],
        "moyenne": "15,6",
    },
    {
        "fichier": "bulletin_noah_petit.pdf",
        "lycee": "Lycée du Parc",
        "eleve": "Noah PETIT",
        "classe": "Terminale Générale",
        "trimestre": "2e trimestre",
        "annee": "2024-2025",
        "notes": [
            ("Mathématiques", "12,0", "11,5", "Des efforts à poursuivre"),
            ("SES", "12,5", "11,0", "Correct dans l'ensemble"),
            ("Anglais", "11,5", "12,0", "Peut mieux faire"),
            ("Français", "11,0", "11,5", "Travail irrégulier"),
            ("Histoire-Géographie", "12,0", "11,2", "Assez bien"),
            ("Physique-Chimie", "10,5", "10,8", "Tout juste"),
        ],
        "moyenne": "11,6",
    },
    {
        "fichier": "bulletin_lina_moreau.pdf",
        "lycee": "Lycée Faidherbe",
        "eleve": "Lina MOREAU",
        "classe": "Terminale Générale",
        "trimestre": "2e trimestre",
        "annee": "2024-2025",
        "notes": [
            ("SVT", "9,5", "11,0", "En difficulté"),
            ("Physique-Chimie", "8,5", "10,5", "Doit se ressaisir"),
            ("Mathématiques", "8,0", "11,0", "Lacunes importantes"),
            ("Français", "10,0", "11,2", "Passable"),
            ("Anglais", "9,5", "12,0", "Insuffisant"),
            ("Histoire-Géographie", "10,5", "11,0", "Moyen"),
        ],
        "moyenne": "9,3",
    },
]


def build(bulletin: dict) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / bulletin["fichier"]
    doc = SimpleDocTemplate(
        str(path), pagesize=A4, topMargin=2 * cm, bottomMargin=2 * cm
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("bulletin_title", parent=styles["Title"], fontSize=16)

    elements = [
        Paragraph(f"BULLETIN SCOLAIRE — {bulletin['trimestre']}", title_style),
        Spacer(1, 0.4 * cm),
        Paragraph(
            f"<b>{bulletin['lycee']}</b><br/>"
            f"Élève : {bulletin['eleve']}<br/>"
            f"Classe : {bulletin['classe']}<br/>"
            f"Année scolaire : {bulletin['annee']}",
            styles["Normal"],
        ),
        Spacer(1, 0.6 * cm),
    ]

    rows = [["Matière", "Moy. élève", "Moy. classe", "Appréciation"]]
    rows += [[s, n, c, a] for (s, n, c, a) in bulletin["notes"]]
    table = Table(rows, colWidths=[4.5 * cm, 2.5 * cm, 2.5 * cm, 6 * cm])
    table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 11),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#eef2ff")]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    elements.append(table)
    elements.append(Spacer(1, 0.5 * cm))
    elements.append(
        Paragraph(
            f"<b>Moyenne générale : {bulletin['moyenne']} / 20</b>", styles["Normal"]
        )
    )
    doc.build(elements)
    return path


def main() -> None:
    for bulletin in BULLETINS:
        print(f"Généré : {build(bulletin)}")


if __name__ == "__main__":
    main()
