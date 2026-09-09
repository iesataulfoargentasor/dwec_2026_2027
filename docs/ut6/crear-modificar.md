---
title: 6.4 Crear y modificar elementos
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.4. Creación y modificación de elementos

El criterio **d)** pide **crear** nodos nuevos y **cambiar** los que ya existen. El PDF lo planteaba con `createElement`, `createTextNode` y los métodos de `Node`. Esa vía sigue siendo la base; el HTML DOM añade atajos más claros.

## Métodos `document.create…` (temario)

| Método | Qué crea |
| --- | --- |
| `createElement("li")` | Un elemento |
| `createTextNode("Hola")` | Un nodo de texto |
| `createComment("nota")` | Un comentario |
| `createAttribute("id")` | Un `Attr` (hoy es más simple `setAttribute`) |
| `createDocumentFragment()` | Un fragmento para insertar varios hijos de una vez |
| `createCDATASection` / `createProcessingInstruction` / `createEntityReference` | XML; no los uses en HTML de aula |

```javascript
const lista = document.querySelector("#tareas");

const item = document.createElement("li");
const texto = document.createTextNode("Estudiar el DOM");
item.appendChild(texto);
lista.appendChild(item);
```

Equivalente actual (menos ruido):

```javascript
const item = document.createElement("li");
item.textContent = "Estudiar el DOM";
lista.append(item);
```

`textContent` sustituye a “crear un `Text` y hacer `appendChild`” en la mayoría de ejercicios.

## Insertar, mover y borrar

| Clásico (`Node`) | Actual |
| --- | --- |
| `padre.appendChild(nodo)` | `padre.append(nodo)` (acepta varios; también texto) |
| `padre.insertBefore(nodo, ref)` | `ref.before(nodo)` / `padre.prepend(nodo)` |
| `padre.removeChild(nodo)` | `nodo.remove()` |
| `padre.replaceChild(nuevo, viejo)` | `viejo.replaceWith(nuevo)` |

```javascript
const aviso = document.createElement("p");
aviso.textContent = "Guardado";
lista.after(aviso);

item.remove();
```

Si pasas a `appendChild` un nodo **que ya está** en el documento, **cambia de sitio**: no se duplica.

### `DocumentFragment`

Útil para no reflow a cada `append` en un bucle:

```javascript
const fragmento = document.createDocumentFragment();
for (const titulo of ["UT4", "UT5", "UT6"]) {
  const li = document.createElement("li");
  li.textContent = titulo;
  fragmento.append(li);
}
lista.append(fragmento);
```

Al insertar el fragmento, sus hijos pasan al padre y el fragmento queda vacío.

### `<template>`

HTML5 permite marcar HTML **inerte** y clonarlo:

```html
<template id="tpl-item">
  <li><span class="titulo"></span></li>
</template>
```

```javascript
const plantilla = document.querySelector("#tpl-item");
const copia = plantilla.content.cloneNode(true);
copia.querySelector(".titulo").textContent = "UT6";
lista.append(copia);
```

## Modificar lo que ya existe

```javascript
const titulo = document.querySelector("h1");
titulo.textContent = "U.T. 6 · DOM";
titulo.id = "titulo-ut6";
titulo.setAttribute("tabindex", "-1");
titulo.classList.add("destacado");
titulo.hidden = false;
```

| Quieres… | Usa |
| --- | --- |
| Cambiar **texto** (seguro) | `textContent` |
| Cambiar **HTML** que controlas tú | `innerHTML` o `createElement` |
| Una clase visual | `classList` (no concatenar `className` a mano) |
| Un estilo puntual | mejor una clase CSS; `element.style` solo si es dinámico de verdad |
| Vaciar un contenedor | `element.replaceChildren()` |

```javascript
const app = document.querySelector("#app");
app.replaceChildren(); // quita todos los hijos
```

!!! danger "`innerHTML` y XSS"
    `innerHTML` **interpreta** etiquetas. Nunca lo uses con texto de `prompt`, de un formulario o de un servidor sin sanitizar. Para datos de usuario: `textContent`.

```javascript
// HTML que escribes tú, fijo en el código:
app.innerHTML = "<p class='aviso'>Listo</p>";

// Dato externo:
const nombre = prompt("Nombre:");
const p = document.createElement("p");
p.textContent = nombre; // no innerHTML
app.append(p);
```

## Ejemplo unido (crear + modificar)

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");

  const etiqueta = document.createElement("label");
  etiqueta.htmlFor = "color";
  etiqueta.textContent = "Color de fondo:";

  const select = document.createElement("select");
  select.id = "color";

  for (const [valor, texto] of [
    ["crimson", "Rojo"],
    ["navy", "Azul"],
    ["seagreen", "Verde"],
  ]) {
    const opcion = document.createElement("option");
    opcion.value = valor;
    opcion.textContent = texto;
    select.append(opcion);
  }

  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = "Aplicar";
  boton.addEventListener("click", () => {
    document.body.className = `fondo-${select.value}`;
  });

  app.append(etiqueta, select, boton);
});
```

El estilo del fondo va en CSS (`.fondo-crimson { background: crimson; }`): es el criterio **h)** aplicado a este ejemplo. El mismo ejercicio con `document.write` está en [3.7](../ut3/generar-html.md) como lo que **ya no** se hace.
