---
title: 6.1 El modelo de objetos del documento
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.1. El modelo de objetos del documento (DOM)

El **DOM** es un estándar (hoy mantenido sobre todo en [WHATWG DOM](https://dom.spec.whatwg.org/) y HTML; el W3C publicó las versiones clásicas) que define **cómo acceder** a documentos estructurados: HTML, XML y similares.

Es una **API**: un conjunto de objetos, propiedades y métodos para que un script **lea y actualice** el contenido, la estructura y el estilo del documento.

El criterio **a)** pide reconocer ese modelo en una página web concreta: no es “el HTML del archivo”, es el **árbol vivo** que el navegador construye tras parsear el marcado.

## 6.1.1. Tipos de modelos DOM

El PDF distingue tres capas que siguen siendo útiles para pensar:

| Modelo | Qué describe |
| --- | --- |
| **DOM Core** | Nodos genéricos de cualquier documento estructurado (`Node`, `Document`, `Element`…) |
| **XML DOM** | Objetos y reglas de un documento XML |
| **HTML DOM** | El mismo núcleo aplicado a HTML: cómo **obtener, modificar, añadir o eliminar** elementos de una página |

En el navegador trabajas con el **HTML DOM**: `document` es un `HTMLDocument`, los nodos de etiqueta son `HTMLElement` (o subtipos: `HTMLInputElement`, `HTMLDivElement`…).

!!! info "Relación con la UT3"
    `window.document` (BOM) y el DOM son **el mismo objeto**. La [UT3](../ut3/document.md) lo usa para título, URL y estilo; esta unidad entra en el **árbol de nodos**.

## 6.1.2. Estructura del árbol DOM

El navegador convierte el HTML en un árbol. Cada pieza (documento, etiqueta, texto, comentario, atributo) es un **nodo**.

HTML5 de partida (el PDF usaba XHTML 1.0 Transitional):

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Página sencilla</title>
  </head>
  <body>
    <p>Esta página es <strong>muy sencilla</strong></p>
  </body>
</html>
```

Árbol simplificado:

```text
Document
└── html (Element)
    ├── head (Element)
    │   ├── meta (Element)
    │   └── title (Element)
    │       └── "Página sencilla" (Text)
    └── body (Element)
        └── p (Element)
            ├── "Esta página es " (Text)
            └── strong (Element)
                └── "muy sencilla" (Text)
```

Reglas del árbol (las mismas del temario):

- El nodo superior es **`document`**: la **raíz** del modelo (el elemento `<html>` es `document.documentElement`, no el `Document` en sí).
- Todo nodo, salvo esa raíz, tiene **un padre** (`parentNode` / `parentElement`).
- Un nodo puede tener **cualquier número de hijos**.
- Una **hoja** es un nodo **sin hijos** (un texto suele serlo).
- Los nodos con el mismo padre son **hermanos** (`previousSibling` / `nextSibling`).

En DevTools, la pestaña **Elements** muestra ese árbol. Es la forma más directa de **reconocer** el modelo de una página real.

!!! tip "Espacios en blanco"
    Entre etiquetas el parser a menudo crea nodos de **texto** con saltos de línea. Por eso `html.firstChild` puede **no** ser `<head>`. En el apartado [6.3](acceso-documento.md) usamos `children` y `firstElementChild` para quedarnos con elementos.
