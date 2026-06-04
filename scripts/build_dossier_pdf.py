"""Convertit docs/09-dossier-projet/dossier-scoolize.md en PDF mis en page.

Utilise markdown (extensions toc/tables/fenced_code/meta) + weasyprint.
Le PDF résultant est écrit dans docs/09-dossier-projet/dossier-scoolize.pdf.

Usage :
    python scripts/build_dossier_pdf.py
"""
from __future__ import annotations

import re
from pathlib import Path

import markdown
from weasyprint import HTML, CSS

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "09-dossier-projet" / "dossier-scoolize.md"
OUT = ROOT / "docs" / "09-dossier-projet" / "dossier-scoolize.pdf"

CSS_TEMPLATE = """
@page {
  size: A4;
  margin: 2cm 2cm 2.4cm 2cm;
  @bottom-right {
    content: counter(page) " / " counter(pages);
    font-family: "Inter", "Helvetica Neue", sans-serif;
    font-size: 9pt;
    color: #71717a;
  }
  @bottom-left {
    content: "Scoolize — Dossier projet";
    font-family: "Inter", "Helvetica Neue", sans-serif;
    font-size: 9pt;
    color: #71717a;
  }
}
@page :first {
  @bottom-right { content: none; }
  @bottom-left { content: none; }
}

* { box-sizing: border-box; }

body {
  font-family: "Inter", "Helvetica Neue", -apple-system, "Segoe UI", sans-serif;
  font-size: 10.5pt;
  line-height: 1.5;
  color: #0a0a0a;
  margin: 0;
}

h1 {
  font-size: 22pt;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0a0a0a;
  margin-top: 0;
  margin-bottom: 0.5em;
  page-break-before: always;
  border-bottom: 2px solid #4263eb;
  padding-bottom: 8pt;
}
h1:first-of-type { page-break-before: avoid; }

h2 {
  font-size: 14pt;
  font-weight: 700;
  color: #0a0a0a;
  margin-top: 1.6em;
  margin-bottom: 0.4em;
}

h3 {
  font-size: 11.5pt;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 1.2em;
  margin-bottom: 0.3em;
}

p { margin: 0.5em 0; }

a { color: #4263eb; text-decoration: none; }

ul, ol { margin: 0.4em 0 0.8em 1.2em; }
li { margin: 0.2em 0; }

blockquote {
  margin: 0.8em 0;
  padding: 0.4em 0.8em;
  border-left: 3px solid #4263eb;
  background: #f5f7ff;
  color: #3a3a3a;
  font-style: italic;
}

code, kbd {
  font-family: "Geist Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;
  background: #f4f4f5;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  padding: 10pt;
  overflow-x: auto;
  font-size: 9pt;
  line-height: 1.4;
}
pre code { background: none; padding: 0; }

table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.8em 0;
  font-size: 9.5pt;
}
th, td {
  border: 1px solid #e4e4e7;
  padding: 6pt 8pt;
  text-align: left;
  vertical-align: top;
}
th { background: #f4f4f5; font-weight: 600; }

/* Cover page */
.cover {
  page-break-after: always;
  text-align: center;
  padding: 4cm 0;
}
.cover .badge {
  display: inline-block;
  font-size: 9pt;
  color: #4263eb;
  border: 1px solid #4263eb;
  border-radius: 999px;
  padding: 4pt 12pt;
  margin-bottom: 1.5em;
}
.cover h1.title {
  font-size: 36pt;
  border: none;
  padding: 0;
  margin: 0 0 0.2em 0;
  letter-spacing: -0.03em;
}
.cover .subtitle { font-size: 14pt; color: #71717a; margin-bottom: 4em; }
.cover .meta { font-size: 11pt; color: #3a3a3a; line-height: 1.8; }

/* TOC */
nav.toc { page-break-after: always; }
nav.toc h2 { margin-top: 0; }
nav.toc ul { list-style: none; padding-left: 0; }
nav.toc li { margin: 0.3em 0; padding-left: 0; }
nav.toc ul ul { margin-top: 0.2em; padding-left: 1em; font-size: 9.5pt; color: #71717a; }
nav.toc a { color: #0a0a0a; }

hr { border: none; border-top: 1px solid #e4e4e7; margin: 1.5em 0; }
"""

COVER_TEMPLATE = """
<div class="cover">
  <div class="badge">L'orientation post-bac, enfin lisible</div>
  <h1 class="title">Scoolize</h1>
  <div class="subtitle">Dossier projet</div>
  <div class="meta">
    <div>Paul-Adrien Desplechin · Hugo · Nino</div>
    <div>Juin 2026</div>
    <div style="margin-top: 1em; font-size: 9pt;">Plateforme d'orientation post-bac</div>
  </div>
</div>
"""


def strip_front_matter(text: str) -> str:
    """Retire le bloc YAML --- ... --- en début de fichier."""
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :].lstrip("\n")
    return text


def main() -> None:
    raw = SRC.read_text(encoding="utf-8")
    body_md = strip_front_matter(raw)

    md = markdown.Markdown(
        extensions=["toc", "tables", "fenced_code", "attr_list"],
        extension_configs={"toc": {"title": "Sommaire", "permalink": False}},
    )
    body_html = md.convert(body_md)
    toc_html = md.toc

    full_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Scoolize — Dossier projet</title>
</head>
<body>
  {COVER_TEMPLATE}
  <nav class="toc">{toc_html}</nav>
  {body_html}
</body>
</html>
"""

    HTML(string=full_html, base_url=str(ROOT)).write_pdf(
        target=str(OUT), stylesheets=[CSS(string=CSS_TEMPLATE)]
    )
    size_kb = OUT.stat().st_size / 1024
    print(f"PDF généré : {OUT}")
    print(f"Taille    : {size_kb:.1f} Ko")


if __name__ == "__main__":
    main()
