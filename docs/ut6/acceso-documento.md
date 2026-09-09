---
title: 6.3 Acceso al documento desde código
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.3. Acceso al documento desde código

Cuando el árbol ya está construido, puedes llegar a **cualquier nodo**. El criterio **c)** pide escribir y **comprobar** ese acceso (consola y pestaña *Elements*).

## Recorrer desde la raíz

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>TituloDOM</title>
  </head>
  <body>
    <p>ParrafoDOM</p>
    <p>ParrafoDOM segundo</p>
    <p>ParrafoDOM tres</p>
  </body>
</html>
```

El PDF subía por `document.documentElement` y luego `firstChild` / `lastChild` o `childNodes[i]`. Eso **falla** si hay nodos de texto por el formato del archivo.

```javascript
const html = document.documentElement;

// Frágil: puede ser un Text, no <head>
html.firstChild;

// Fiable: solo elementos
const cabeza = html.firstElementChild; // <head>
const cuerpo = html.lastElementChild;  // <body>

const hijosElemento = html.children;   // HTMLCollection
console.log(hijosElemento.length);     // 2
console.log(html.children[0], html.children[1]);
```

`childNodes` cuenta **todos** los tipos; `children` solo etiquetas. `NodeList` y `HTMLCollection` se parecen a un array (`length`, `[i]`), pero no tienen `map` / `filter` a menos que las conviertas: `[...html.children]`.

## 6.3.1. Acceso al tipo de nodo

```javascript
console.log(document.nodeType); // 9 → Node.DOCUMENT_NODE
console.log(document.documentElement.nodeType); // 1 → Node.ELEMENT_NODE

console.log(document.nodeType === Node.DOCUMENT_NODE); // true
console.log(document.documentElement.nodeType === Node.ELEMENT_NODE); // true
```

No memorices los números: usa las constantes `Node.*`.

## 6.3.2. Acceso directo a los nodos

El temario lista tres métodos clásicos. Hoy se suman los selectores CSS.

| Método | Qué selecciona | Devuelve |
| --- | --- | --- |
| `getElementById("pie")` | El único elemento con ese `id` | Elemento o `null` |
| `getElementsByTagName("div")` | Todas las etiquetas `div` | `HTMLCollection` **en vivo** |
| `getElementsByName("primero")` | Controles con ese `name` (pensado para formularios) | `NodeList` |
| `getElementsByClassName("aviso")` | Clase CSS | `HTMLCollection` en vivo |
| `querySelector("div.aviso")` | **El primero** que cumple el selector CSS | Elemento o `null` |
| `querySelectorAll("p")` | **Todos** los que cumplen | `NodeList` **estática** |

```javascript
const divs = document.getElementsByTagName("div");
const porNombre = document.getElementsByName("primero");
const pie = document.getElementById("pie");

const primero = document.querySelector("main p");
const todos = document.querySelectorAll("main p");
```

`getElementsByName` encaja con `<input name="…">`. En un `<div name="primero">` el atributo `name` **no** es el identificador habitual: usa `id` o una clase.

!!! warning "Colección en vivo"
    `getElementsByTagName` se **actualiza** si añades o quitas nodos. Un `for` que modifica el DOM mientras recorre esa colección puede saltarse elementos. `querySelectorAll` captura la lista **en el momento** de la llamada: es más predecible.

En código nuevo, el hábito es `querySelector` / `querySelectorAll`. `getElementById` sigue siendo correcto y rápido.

Otros métodos útiles (añadidos al temario):

```javascript
const item = document.querySelector("li.activo");
item.closest("ul");     // ancestro más cercano que cumple el selector
item.matches("li");     // true
document.contains(item); // ¿está en este documento?
```

## 6.3.3. Atributos de un elemento

`element.attributes` es un `NamedNodeMap`. El PDF citaba `getNamedItem`, `setNamedItem`, `removeNamedItem` e `item(pos)` (en el original aparecen como `getNameItem` / `removeNameItem`: el nombre estándar es **`getNamedItem`**).

En la práctica usas los atajos del elemento:

```javascript
const enlace = document.querySelector("#imagen");

enlace.getAttribute("href");
enlace.setAttribute("href", "https://example.com");
enlace.removeAttribute("target");
enlace.hasAttribute("download"); // true / false
```

Equivalencias del temario:

| Directo | Vía `attributes` |
| --- | --- |
| `getAttribute("id")` | `attributes.getNamedItem("id").value` |
| `setAttribute("id", "x")` | crear/asignar el `Attr` y `setNamedItem` |
| `removeAttribute("id")` | `attributes.removeNamedItem("id")` |

Propiedades reflejadas (más cómodas cuando existen):

```javascript
enlace.id = "imagen";
enlace.href;           // URL absoluta resuelta
enlace.className = "destacado";
enlace.hidden = true;
```

**`classList`** es la forma actual de clases CSS (criterio **h)** del apartado [6.8](tres-capas.md)):

```javascript
enlace.classList.add("destacado");
enlace.classList.remove("destacado");
enlace.classList.toggle("destacado");
enlace.classList.contains("destacado");
```

Datos propios: `data-*` → `dataset`:

```html
<li data-id="42">Tarea</li>
```

```javascript
const li = document.querySelector("li");
console.log(li.dataset.id); // "42"
li.dataset.id = "43";
```

!!! tip "Verificar el acceso"
    En la consola: `document.querySelector("p")`. Si sale `null`, el script se ejecutó **antes** de que existiera el nodo, o el selector está mal. Espera a `DOMContentLoaded` ([6.5](eventos-dom.md)) o coloca el `<script>` al final del `body` con `defer`.
