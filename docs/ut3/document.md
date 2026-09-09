---
title: 3.5 El objeto Document
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.5. El objeto `document`

`document` es el **documento HTML** cargado en la ventana. Es la puerta al **DOM**. En el PDF se avisaba “no confundir con Document de DOM”: hoy es **el mismo objeto**. El BOM te da `window.document`; el DOM es lo que hay dentro.

## Propiedades útiles

| Propiedad | Significado |
| --- | --- |
| `title` | Texto de `<title>` (se puede asignar) |
| `URL` | URL completa del documento |
| `referrer` | Página de origen (puede ir vacía) |
| `lastModified` | Fecha de modificación que envía el servidor |
| `cookie` | Cadena de cookies (ver [almacenamiento](almacenamiento.md)) |
| `documentElement` | El elemento `<html>` |
| `body` | El `<body>` |
| `forms`, `images`, `links` | Colecciones clásicas (hoy se usa más `querySelector`) |

```javascript
console.log(document.title);
document.title = "DWEC · UT3";

console.log(document.URL);
console.log("Referrer:", document.referrer);
```

## Cambiar el aspecto del documento

El material antiguo asignaba `document.bgColor = "red"` y colores `fgColor`, `linkColor`, `alinkColor`, `vlinkColor`. Esas propiedades son **legado de HTML 4**. El aspecto se cambia con **CSS**.

```javascript
document.body.style.backgroundColor = "crimson";
document.body.style.color = "white";
```

Mejor aún: clases, para no mezclar diseño en el script:

```css
body.tema-oscuro {
  background-color: #111;
  color: #eee;
}
```

```javascript
document.body.classList.add("tema-oscuro");
document.body.classList.toggle("tema-oscuro");
```

Eso cubre el criterio **c)**: cambiar el aspecto del documento con objetos del lenguaje, de forma actual.

## Colecciones `forms` / `images` / `links`

Siguen existiendo. Un formulario con `id="alta"`:

```javascript
const formulario = document.querySelector("#alta");
// equivalente clásico si tiene name="alta":
// document.forms.alta
```

En esta unidad puedes usar `querySelector` / `querySelectorAll` (estándar DOM). `getElementById` también es correcto.

!!! failure "`document.write`"
    `document.write("Hola")` solo es seguro **mientras** el HTML se está parseando. Si lo llamas después, **borra la página**. No lo uses para actualizar la interfaz. El apartado [3.7](generar-html.md) muestra las alternativas.
