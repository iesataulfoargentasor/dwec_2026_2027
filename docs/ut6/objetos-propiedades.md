---
title: 6.2 Objetos, propiedades y métodos
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.2. Objetos del modelo: propiedades y métodos

Cuando el navegador ha construido el árbol, cada pieza es un **nodo**. El criterio **b)** pide identificar **objetos**, **propiedades** y **métodos**.

La propiedad `nodeType` es un número. Hay **12 tipos** clásicos en el DOM; en HTML diario usas sobre todo documento, elemento, texto, comentario y, a veces, fragmento.

## 6.2.1. Objetos del modelo

Según el W3C / WHATWG, los más importantes:

| Tipo | Rol |
| --- | --- |
| **Document** | Raíz del modelo. De él cuelga todo. En el navegador: `document` |
| **DocumentType** | El `<!DOCTYPE …>`. En HTML5 es simplemente `html` |
| **Element** | Una etiqueta (`<p>…</p>`, `<br>`). Puede tener hijos y atributos |
| **Attr** | Un atributo (`id`, `href`…). Hoy se manipula más con `getAttribute` / `setAttribute` que como nodo suelto |
| **Text** | El texto dentro de un elemento |
| **CDATASection** | `<![CDATA[ … ]]>`: relevante en XML, casi nunca en HTML |
| **Comment** | Un comentario `<!-- … -->` |
| **DocumentFragment** | Un contenedor ligero en memoria; al insertarlo, se “desenvuelven” sus hijos (apartado [6.4](crear-modificar.md)) |

```javascript
console.log(document.nodeType);                 // 9  Document
console.log(document.documentElement.nodeType); // 1  Element (<html>)
console.log(document.doctype.nodeType);         // 10 DocumentType
```

## 6.2.2. La interfaz `Node`

JavaScript expone el objeto **`Node`** con constantes para no memorizar números:

| Constante | Valor |
| --- | --- |
| `Node.ELEMENT_NODE` | 1 |
| `Node.ATTRIBUTE_NODE` | 2 |
| `Node.TEXT_NODE` | 3 |
| `Node.CDATA_SECTION_NODE` | 4 |
| `Node.ENTITY_REFERENCE_NODE` | 5 |
| `Node.ENTITY_NODE` | 6 |
| `Node.PROCESSING_INSTRUCTION_NODE` | 7 |
| `Node.COMMENT_NODE` | 8 |
| `Node.DOCUMENT_NODE` | 9 |
| `Node.DOCUMENT_TYPE_NODE` | 10 |
| `Node.DOCUMENT_FRAGMENT_NODE` | 11 |
| `Node.NOTATION_NODE` | 12 |

Las entidades, notaciones e instrucciones de procesamiento importan en XML. En HTML de aula casi no aparecen.

```javascript
console.log(document.nodeType === Node.DOCUMENT_NODE); // true
console.log(document.body.nodeType === Node.ELEMENT_NODE); // true
```

El PDF avisaba que **IE7 y anteriores** no tenían estas constantes. Hoy Chrome, Edge, Firefox y Safari sí. No hace falta el *polyfill* salvo que el enunciado pida código legado (apartado [6.6](diferencias-navegadores.md)).

### Propiedades de `Node`

| Propiedad | Qué devuelve |
| --- | --- |
| `nodeName` | Nombre del nodo (`"#document"`, `"DIV"`, `"#text"`…). En elementos HTML va en **mayúsculas** |
| `nodeValue` | Valor: el texto en nodos `Text`/`Comment`; `null` en `Element` |
| `nodeType` | Una de las 12 constantes |
| `ownerDocument` | El `document` al que pertenece |
| `parentNode` / `parentElement` | Padre (el segundo solo si el padre es un elemento) |
| `childNodes` | `NodeList` de **todos** los hijos (incluye textos y comentarios) |
| `children` | Solo hijos **elemento** (`HTMLCollection`) |
| `firstChild` / `lastChild` | Primer / último hijo (cualquier tipo) |
| `firstElementChild` / `lastElementChild` | Primer / último hijo que es elemento |
| `previousSibling` / `nextSibling` | Hermano anterior / siguiente |
| `previousElementSibling` / `nextElementSibling` | Hermanos que son elementos |
| `attributes` | Mapa de atributos (`NamedNodeMap`) en un `Element` |
| `textContent` | Todo el texto descendiente (lectura y escritura) |

### Métodos de `Node` (temario)

| Método | Efecto |
| --- | --- |
| `hasChildNodes()` | `true` si hay al menos un hijo |
| `appendChild(nodo)` | Añade al final de `childNodes` (si el nodo ya estaba en el árbol, **se mueve**) |
| `removeChild(nodo)` | Quita un hijo |
| `replaceChild(nuevo, viejo)` | Sustituye un hijo |
| `insertBefore(nuevo, referencia)` | Inserta `nuevo` antes de `referencia` |

Formas actuales equivalentes (más legibles): `append`, `prepend`, `before`, `after`, `replaceWith`, `remove()` (apartado [6.4](crear-modificar.md)).

```javascript
const parrafo = document.querySelector("p");
console.log(parrafo.nodeName);       // "P"
console.log(parrafo.nodeValue);      // null (es Element)
console.log(parrafo.firstChild.nodeValue); // texto del párrafo, si el primer hijo es Text
console.log(parrafo.hasChildNodes());
```

`nodeName` y `tagName` en un elemento HTML coinciden (`"P"`). Para comparar etiquetas, `element.matches("p")` o `element.tagName === "P"` evitan sorpresas.

!!! note "XML frente a HTML"
    La tabla del PDF es la API **genérica** (XML). Los navegadores tratan HTML **como si** fuera un árbol DOM. HTML añade atajos: `document.body`, `element.className`, `element.id`, colecciones `forms` / `images` / `links`.
