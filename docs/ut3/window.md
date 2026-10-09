---
title: 3.4 El objeto Window
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.4. El objeto `window`

`window` es la **ventana** (o pestaña) donde corre la página. Es el objeto global del navegador: desde él se llega al documento, a la URL, al historial, a los diálogos y a otras APIs del BOM.

```javascript
console.log(window.document.title);
console.log(window.location.href);
console.log(window.navigator.language);
```

Como `window` es global, normalmente puedes omitirlo:

```javascript
console.log(document.title);
console.log(location.href);
console.log(navigator.language);
```

Las dos versiones son equivalentes. Escribir `window.` resulta útil cuando estudias el BOM o quieres dejar claro que no estás usando una variable creada por ti.

Si hay `<iframe>`, hay un `window` para la página padre y otro para cada marco.

!!! info "Global no significa «úsalo para todo»"
    En un script clásico, un `var` global acaba como propiedad de `window`; `const` y `let` globales no se comportan igual. En esta unidad usamos `const` y `let` y evitamos crear globales propias: que exista `window` no es una invitación a llenar el programa de nombres compartidos.

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

### Pestaña, *viewport* y navegador completo

| Propiedad | Mide | Cambia si… |
| --- | --- | --- |
| `innerWidth` / `innerHeight` | Área donde se ve la página (*viewport*) | Redimensionas la ventana o abres DevTools |
| `outerWidth` / `outerHeight` | Ventana incluyendo pestañas, barra de direcciones y bordes | Cambia el tamaño de la ventana |
| `screen.width` / `screen.height` | Pantalla física | Cambias de pantalla o la resolución |
| `scrollX` / `scrollY` | Desplazamiento actual de la página | Haces *scroll* |

No uses `outerWidth` para maquetar ni `screen.width` para decidir si una página es móvil: el CSS adaptable es la herramienta principal. Estas propiedades resultan útiles para aprender qué está viendo la persona y para diagnósticos.

```javascript
console.log("Viewport:", window.innerWidth, "×", window.innerHeight);
console.log("Ventana completa:", window.outerWidth, "×", window.outerHeight);
console.log("Desplazamiento:", window.scrollX, window.scrollY);
```

## Diálogos (interacción con el usuario)

`alert`, `confirm` y `prompt` son métodos de `window`. Siguen existiendo y cubren el criterio **e)** del RA3. Son **modales**: bloquean el hilo de JavaScript hasta que la persona responde. Por eso son buenos para practicar condiciones, pero no para diseñar la interfaz final de una aplicación.

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

Cada uno devuelve (o no devuelve) algo diferente:

| Método | Muestra | Resultado |
| --- | --- | --- |
| `alert(mensaje)` | Aviso con un botón | `undefined`: solo informa |
| `confirm(mensaje)` | Aceptar / Cancelar | `true` o `false` |
| `prompt(mensaje, valorInicial)` | Campo de texto | Texto escrito o `null` al cancelar |

`prompt` **siempre** devuelve texto, aunque el usuario escriba `18`. Si el caso necesita un número, conviértelo explícitamente y valida, como ya viste en la UT2 y en [3.1](objetos-nativos.md).

```javascript
const bruto = prompt("¿Cuántas copias?", "1");
const copias = Number(bruto);

if (bruto === null) {
  console.log("Cancelado");
} else if (bruto.trim() === "" || Number.isNaN(copias)) {
  console.log("Escribe un número válido");
} else {
  console.log("Copias solicitadas:", copias);
}
```

En interfaces reales se sustituyen por HTML (modales, formularios). En esta unidad son válidos para practicar; no uses una secuencia larga de `alert`: frustra a quien navega y bloquea la página.

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

### Una espera no detiene la página

`setTimeout` no “congela” JavaScript durante esos milisegundos. Registra una tarea para que se ejecute **cuando haya pasado al menos** el tiempo indicado y el hilo esté libre.

```javascript
console.log("A");
setTimeout(() => {
  console.log("C");
}, 1000);
console.log("B");

// Sale A, luego B y, aproximadamente un segundo después, C.
```

`setTimeout` devuelve un identificador. Guárdalo si puedes necesitar cancelar la tarea antes de que se ejecute:

```javascript
const avisoPendiente = setTimeout(() => {
  console.log("Este aviso no llegará a mostrarse");
}, 5000);

clearTimeout(avisoPendiente);
```

`setInterval` intenta repetir una tarea. También devuelve identificador y debe detenerse con `clearInterval` cuando deje de tener sentido:

```javascript
const reloj = setInterval(() => {
  console.log(new Date().toLocaleTimeString("es-ES"));
}, 1000);

// Más tarde: clearInterval(reloj);
```

Los temporizadores necesitan una **función de devolución** (*callback*): una instrucción que el navegador guardará para ejecutar después. La sintaxis de funciones se trabaja formalmente en la UT4; aquí basta reconocer que el bloque entre `() => { ... }` es el código que se ejecutará más tarde. No uses texto como primer argumento (`setTimeout("...", 1000)`): evalúa código y está obsoleto.

## Tamaño y desplazamiento

```javascript
console.log("Viewport:", window.innerWidth, window.innerHeight);
window.scrollTo({ top: 0, behavior: "smooth" });
```

`scrollTo` mueve la página a una posición concreta. `scrollBy` desplaza una cantidad respecto a la posición actual:

```javascript
window.scrollTo(0, 0); // arriba a la izquierda
window.scrollBy(0, 300); // 300 píxeles hacia abajo
```

La forma con objeto permite explicar la intención:

```javascript
window.scrollTo({ top: 0, behavior: "smooth" });
```

`moveTo`, `moveBy`, `resizeTo` y `resizeBy` **solo funcionan** en ventanas abiertas por script, y muchos navegadores los ignoran. No cuentes con ellos en una pestaña normal.

`print()` abre el diálogo de impresión: `window.print()`.

`focus()` / `blur()` cambian el foco; úsalos con cuidado (accesibilidad).

!!! tip "Depuración"
    En la consola, `window` es el global. Escribe `location` o `innerWidth` y pulsa Intro. En **Sources** puedes poner un punto de interrupción dentro del `setTimeout`.

## Caso práctico resuelto: iniciar una sesión de lectura

Una página de apuntes quiere preparar una sesión de lectura sin tocar el HTML. Al cargarse, el script pregunta el nombre, solicita confirmación para comenzar y muestra en consola un resumen de la sesión:

1. Nombre de la persona (o cancelación).
2. Fecha y hora de inicio.
3. Tamaño de la zona de lectura.
4. Estado inicial de desplazamiento.
5. Confirmación antes de empezar.
6. Salto suave arriba de la página y posibilidad de imprimir desde el navegador.

El caso usa `prompt`, `confirm`, `alert`, `window`, `Date`, `String`, plantillas, `if` y los operadores de la UT2. **No usa temporizadores**, porque su código diferido necesita funciones de devolución, que se desarrollan formalmente en la UT4. Tampoco usa DOM, eventos, arrays ni `location`/`history`.

```javascript
const nombreBruto = prompt("¿Cómo te llamas?", "");
const ahora = new Date();
const hora = String(ahora.getHours()).padStart(2, "0");
const minutos = String(ahora.getMinutes()).padStart(2, "0");

if (nombreBruto === null) {
  console.log("Sesión no iniciada: se ha pulsado Cancelar.");
} else {
  const nombre = nombreBruto.trim();

  if (nombre === "") {
    alert("Escribe un nombre para iniciar la sesión.");
  } else {
    const empezar = confirm(`Hola, ${nombre}. ¿Quieres iniciar la sesión de lectura?`);

    if (empezar) {
      window.scrollTo({ top: 0, behavior: "smooth" });

      console.log("================================");
      console.log(" SESIÓN DE LECTURA INICIADA ");
      console.log("================================");
      console.log(`Alumno/a: ${nombre}`);
      console.log(`Hora de inicio: ${hora}:${minutos}`);
      console.log(`Zona de lectura: ${window.innerWidth} × ${window.innerHeight}`);
      console.log(`Desplazamiento inicial: X=${window.scrollX}, Y=${window.scrollY}`);
      console.log("Si necesitas una copia en papel, usa el menú del navegador o window.print().");

      alert(`Sesión iniciada, ${nombre}. Revisa la consola para ver el resumen.`);
    } else {
      console.log(`${nombre} ha decidido no iniciar la sesión.`);
    }
  }
}
```

### Lectura del resultado

- `prompt` devuelve texto o `null`; por eso se comprueba Cancelar antes de llamar a `trim`.
- `trim` evita aceptar como nombre una cadena formada solo por espacios.
- `confirm` devuelve un booleano: el bloque de inicio se ejecuta solo cuando vale `true`.
- `window.scrollTo` utiliza el desplazamiento de la página. En una página ya arriba apenas se apreciará el cambio.
- `innerWidth` e `innerHeight` muestran el tamaño de la zona donde se lee el contenido, no el de la pantalla completa.
- El caso **no ejecuta** `window.print()` automáticamente: abrir un diálogo de impresión nada más cargar sería intrusivo. La línea informa de que existe; el método se prueba manualmente desde consola.

Prueba cuatro recorridos: Cancelar el primer diálogo, escribir solo espacios, pulsar Cancelar en la confirmación y aceptar. Cada uno termina en una rama distinta sin necesitar eventos ni funciones de usuario.
