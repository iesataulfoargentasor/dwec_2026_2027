# Desarrollo Web en Entorno Cliente (DWEC)

Apuntes del módulo **Desarrollo Web en Entorno Cliente** (CFGS DAW), publicados con [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) en [GitHub Pages](https://pages.github.com/).

**URL para alumnos:** https://iesataulfoargentasor.github.io/dwec_2026_2027/

## Contenido actual

- **UT2. Manejo de la sintaxis del lenguaje** — JavaScript actual (ECMAScript), manteniendo la estructura del material original.

Las entregas evaluables continúan en el aula Moodle.

## Desarrollo local

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve
```

Abre http://127.0.0.1:8000/dwec_2026_2027/ para previsualizar.

## Publicación

El workflow `.github/workflows/pages.yml` publica el sitio en cada push a `main`.

En el repositorio: **Settings → Pages → Source: GitHub Actions**.
