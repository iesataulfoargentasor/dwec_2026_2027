---
title: 6.6 Diferencias entre navegadores
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.6. Diferencias en las implementaciones del modelo

El criterio **f)** pide **identificar** que el DOM **no se comportó igual** en todos los navegadores, y qué queda de eso hoy.

## La “guerra de navegadores” (contexto del PDF)

En los 2000, Netscape e **Internet Explorer** añadían extensiones propias. IE tenía un modelo de eventos distinto (`attachEvent`, `window.event`), colecciones raras y lagunas respecto al W3C. El programador escribía **dos caminos** o usaba una librería.

El PDF señala un caso concreto: **IE7 y anteriores** no definían las constantes `Node.ELEMENT_NODE`, etc.

```javascript
// Histórico: polyfill del temario (no lo necesitas en Chrome/Edge/Firefox/Safari actuales)
if (typeof Node === "undefined") {
  globalThis.Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12,
  };
}

console.log(Node.DOCUMENT_NODE); // 9
console.log(Node.ELEMENT_NODE);  // 1
```

Otras diferencias clásicas que debes **saber nombrar** (aunque ya no las programes):

| Tema | Qué pasaba |
| --- | --- |
| Eventos | W3C: `addEventListener` + objeto `event`. IE antiguo: `attachEvent` y `window.event` |
| `innerText` vs `textContent` | IE popularizó `innerText`; el estándar es `textContent` (ambos existen hoy, con matices de CSS) |
| Atributos vs propiedades | `getAttribute("checked")` frente a `input.checked` (booleano) |
| Espacios en `childNodes` | Un navegador podía insertar más nodos de texto que otro según el HTML |

## Qué ocurre ahora

Los navegadores de escritorio y móvil que usas en clase son **evergreen** (se actualizan solos): Chrome, Edge, Firefox, Safari. El HTML DOM de consulta, creación de nodos y `addEventListener` es **el mismo**.

Las diferencias actuales suelen ser:

- Una API **nueva** que Safari aún no tiene (o al revés).
- Prefijos antiguos (`webkit`) en casos residuales.
- Modo **quirks** si falta `<!DOCTYPE html>`: el árbol y el CSS se interpretan “como IE5”. Por eso el doctype HTML5 es obligatorio.
- Extensiones de **desarrollador** o políticas (`file://`, cookies, `localStorage` en iframes).

Herramientas para **identificar** el hueco (sin instalar IE Collection):

- [MDN](https://developer.mozilla.org/) → tabla de compatibilidad de cada método.
- [Can I use](https://caniuse.com/) → soporte por versión.
- DevTools de cada navegador (Elements + consola).

!!! warning "No husmees el `userAgent` para ramificar el DOM"
    `navigator.userAgent` se falsifica y se queda viejo. El criterio **g)** se cubre con **detección de características** ([6.7](compatibilidad.md)), no con `if (esInternetExplorer)`.

!!! note "Internet Explorer"
    IE11 está fuera de soporte. En DWEC no es un objetivo de las prácticas actuales. Sí puede salir en un examen como **pregunta de contexto**: “¿por qué existían librerías *cross-browser*?”
