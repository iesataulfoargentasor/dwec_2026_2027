---
title: 5.2 Tipos de eventos
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.2. Tipos de eventos

La especificación clásica del DOM agrupa los eventos según su **origen**. El criterio **c)** pide diferenciarlos. Aquí se mantienen los cuatro grupos del temario y se actualizan las APIs que han cambiado.

## 5.2.1. Eventos del ratón

Se producen por el puntero (ratón, trackpad o, en muchos casos, el primer toque en táctil).

| Evento | Manejador HTML | Cuándo ocurre |
| --- | --- | --- |
| `click` | `onclick` | Pulsación del botón principal |
| `dblclick` | `ondblclick` | Doble clic |
| `mousedown` | `onmousedown` | Se pulsa un botón |
| `mouseup` | `onmouseup` | Se suelta un botón |
| `mouseover` | `onmouseover` | El puntero **entra** en el elemento |
| `mouseout` | `onmouseout` | El puntero **sale** del elemento |
| `mousemove` | `onmousemove` | El puntero se mueve **dentro** del elemento (se dispara muchas veces) |

```javascript
const zona = document.querySelector("#lienzo");

zona.addEventListener("click", () => {
  console.log("Clic");
});

zona.addEventListener("mouseover", () => {
  zona.style.outline = "2px solid crimson";
});

zona.addEventListener("mouseout", () => {
  zona.style.outline = "";
});
```

!!! info "Pointer events"
    En interfaces táctiles y lápiz óptico, la API moderna es `pointerdown` / `pointerup` / `pointermove`. Para las prácticas de DWEC, `click` y los eventos de ratón cubren el criterio. `mousemove` es costoso: no hagas trabajo pesado en cada movimiento.

`MouseEvent` aporta, entre otras, `clientX` / `clientY` (posición respecto al viewport) y `button` (0 = principal, 1 = rueda, 2 = secundario).

## 5.2.2. Eventos del teclado

| Evento | Manejador HTML | Cuándo ocurre |
| --- | --- | --- |
| `keydown` | `onkeydown` | Se pulsa una tecla. Si se mantiene, se **repite** |
| `keyup` | `onkeyup` | Se suelta la tecla |
| `keypress` | `onkeypress` | **Obsoleto.** No lo uses en código nuevo |

```javascript
const campo = document.querySelector("#busqueda");

campo.addEventListener("keydown", (event) => {
  console.log(event.key); // "a", "Enter", "Escape"…
  if (event.key === "Enter") {
    console.log("Buscar:", campo.value);
  }
});
```

Usa **`event.key`** (cadena: `"Enter"`, `"ArrowLeft"`, `"a"`). Las propiedades `keyCode` y `which` están **obsoletas**.

`keydown` se dispara para **cualquier** tecla (incluidas modificadoras y especiales). El antiguo `keypress` solo cubría caracteres y ya no forma parte del estándar vivo.

## 5.2.3. Eventos HTML (documento, ventana y controles) {: #eventos-de-documento-y-ventana }

Son eventos ligados a la página, a `window` o a controles de formulario.

| Evento | Manejador HTML | Cuándo ocurre |
| --- | --- | --- |
| `load` | `onload` | `window`: página **completa** (imágenes incluidas). También en `<img>` al cargar |
| `DOMContentLoaded` | — | El HTML ya está parseado; **no** espera imágenes. Preferible para iniciar scripts |
| `error` | `onerror` | Fallo al cargar un recurso (`<img>`) o error de script en `window` |
| `resize` | `onresize` | Cambia el tamaño de la ventana |
| `scroll` | `onscroll` | Cambia el scroll del documento o de un elemento |
| `focus` / `blur` | `onfocus` / `onblur` | El elemento gana o pierde el foco |
| `input` | `oninput` | El valor del control **cambia** (cada tecla, pegado, etc.) |
| `change` | `onchange` | El valor cambió y el control **pierde el foco** (`<select>`: al elegir opción) |
| `select` | `onselect` | Se selecciona texto en un campo |
| `submit` | `onsubmit` | Se envía el formulario |
| `reset` | `onreset` | Se restablece el formulario |
| `abort` | `onabort` | El usuario interrumpe la carga de un recurso (poco usado hoy) |

`unload` / `onunload` (página que desaparece) está **restringido** en navegadores actuales. Para avisar antes de salir se usa `beforeunload`, y con cuidado: el navegador decide el texto del diálogo.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM listo; ya puedes consultar elementos");
});

window.addEventListener("load", () => {
  console.log("Página e imágenes cargadas");
});
```

Diferencia práctica **`input` vs `change`**:

```javascript
const nombre = document.querySelector("#nombre");

nombre.addEventListener("input", () => {
  console.log("Mientras escribe:", nombre.value);
});

nombre.addEventListener("change", () => {
  console.log("Al salir del campo:", nombre.value);
});
```

## 5.2.4. Cambios en el DOM

El PDF de 2013 listaba eventos de mutación (`DOMSubtreeModified`, `DOMNodeInserted`, `DOMNodeRemoved`…). **Están obsoletos** y no deben usarse.

La API actual es **`MutationObserver`**: observas un nodo y recibes un lote de cambios.

```javascript
const lista = document.querySelector("#tareas");

const observador = new MutationObserver((mutaciones) => {
  for (const m of mutaciones) {
    console.log(m.type, m.addedNodes.length, "nodos añadidos");
  }
});

observador.observe(lista, { childList: true });

lista.append(document.createElement("li"));
```

Opciones habituales: `childList` (hijos añadidos/quitados), `attributes`, `subtree` (también descendientes). Llama a `observador.disconnect()` cuando ya no haga falta.

!!! note "Criterio c)"
    En un examen o práctica, clasifica el evento: **ratón**, **teclado**, **documento/formulario** o **mutación del DOM**. Nombra el evento concreto (`click`, `keydown`, `submit`…) y el método de escucha (`addEventListener`).
