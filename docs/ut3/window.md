---
title: 3.4 El objeto Window
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.4. El objeto `window`

`window` es la **ventana** (o pestaña) donde corre la página. Es el objeto global: una variable global en un script clásico acaba como propiedad de `window`.

Si hay `<iframe>`, hay un `window` para la página padre y otro para cada marco.

## Propiedades que debes conocer

| Propiedad | Significado |
| --- | --- |
| `document` | Documento cargado |
| `location` | URL actual |
| `history` | Historial de la pestaña |
| `navigator` / `screen` | Navegador y pantalla |
| `innerWidth` / `innerHeight` | Área de contenido (viewport) |
| `outerWidth` / `outerHeight` | Ventana incluyendo cromo del navegador |
| `scrollX` / `scrollY` | Desplazamiento (antes `pageXOffset` / `pageYOffset`) |
| `localStorage` / `sessionStorage` | Almacenamiento web |
| `name` | Nombre de la ventana (poco usado) |
| `opener` | Ventana que abrió esta con `window.open` |
| `parent` / `top` / `self` | Jerarquía de marcos |

`status` y `defaultStatus` (barra de estado) ya no son útiles: los navegadores no dejan que la página escriba ahí.

## Diálogos (interacción con el usuario)

Siguen existiendo y cubren el criterio **e)** del RA3. Bloquean el hilo hasta que la persona responde.

```javascript
alert("Operación completada");

const seguro = confirm("¿Borrar el borrador?");
if (seguro) {
  console.log("Confirmado");
}

const nombre = prompt("Tu nombre:", "");
if (nombre !== null) {
  console.log(`Hola, ${nombre}`);
}
```

En interfaces reales se sustituyen por HTML (modales, formularios). En esta unidad son válidos para practicar.

## Temporizadores

```javascript
const id = setTimeout(() => {
  console.log("Han pasado 2 segundos");
}, 2000);

// clearTimeout(id);

const repetir = setInterval(() => {
  console.log("tick", new Date().toLocaleTimeString("es-ES"));
}, 1000);

// clearInterval(repetir);
```

Pasa **una función**, no una cadena (`setTimeout("Mover()", 100)` evalúa código: inseguro y obsoleto).

## Tamaño y desplazamiento

```javascript
console.log("Viewport:", window.innerWidth, window.innerHeight);
window.scrollTo({ top: 0, behavior: "smooth" });
```

`moveTo`, `moveBy`, `resizeTo` y `resizeBy` **solo funcionan** en ventanas abiertas por script, y muchos navegadores los ignoran. No cuentes con ellos en una pestaña normal.

`print()` abre el diálogo de impresión: `window.print()`.

`focus()` / `blur()` cambian el foco; úsalos con cuidado (accesibilidad).

!!! tip "Depuración"
    En la consola, `window` es el global. Escribe `location` o `innerWidth` y pulsa Intro. En **Sources** puedes poner un punto de interrupción dentro del `setTimeout`.
