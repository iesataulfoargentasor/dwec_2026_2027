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

En `prompt("Tu nombre:", "")`, el primer argumento es el mensaje y el segundo es el texto inicial del campo. `""` deja el campo vacío; `"Ana"` lo rellenaría con Ana, pero la persona puede cambiarlo. El segundo argumento es opcional. Aceptar con el campo vacío devuelve `""`, mientras que Cancelar devuelve `null`.

En `alert(mensaje)` y `confirm(mensaje)`, el argumento es el texto del cuadro. `confirm` no borra ni cambia datos por sí mismo: solo devuelve la decisión para que el programa actúe.

Al aceptar, `prompt` devuelve texto, aunque el usuario escriba `18`. Si el caso necesita un número, conviértelo explícitamente y valida, como ya viste en la UT2 y en [3.1](objetos-nativos.md).

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

`setTimeout(funcion, retraso)` programa una ejecución; `setInterval(funcion, intervalo)` programa repeticiones. El primer argumento es la función que se ejecutará después. El segundo es un tiempo en **milisegundos**: `1000` equivale a un segundo y `2000`, a dos. No es una hora del reloj ni una garantía de puntualidad.

En `() => { ... }`, los paréntesis indican que la función no recibe parámetros y las llaves contienen sus instrucciones. Aquí solo necesitas reconocer esa sintaxis; se desarrolla en la UT4.


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

`id` y `repetir` guardan los identificadores devueltos por el navegador. `clearTimeout(id)` cancela la ejecución pendiente y `clearInterval(repetir)` detiene las repeticiones: su argumento es el identificador, no el tiempo. Las líneas que empiezan por `//` son comentarios; para detener el intervalo debes ejecutar `clearInterval(repetir)`.

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

Consultar una propiedad no es lo mismo que llamar a un método: `window.innerHeight` lee la altura visible; `window.scrollTo(...)` pide al navegador que desplace la página. Las distancias de estos ejemplos se expresan en **píxeles CSS**.

### Dos números: horizontal y vertical

```javascript
window.scrollTo(0, 300);
window.scrollBy(0, 300);
```

- En `scrollTo(x, y)` los argumentos son la **posición de destino**: `0` sitúa el borde izquierdo al inicio y `300` sitúa el borde superior a 300 píxeles del inicio del documento.
- En `scrollBy(x, y)` son el **desplazamiento desde la posición actual**: `0` no cambia la posición horizontal y `300` baja otros 300 píxeles. Un valor vertical negativo sube.
- Si estás en Y = 500, `scrollTo(0, 300)` intenta llevarte a Y = 300; `scrollBy(0, 300)` intenta llevarte a Y = 800. El recorrido queda limitado por el espacio desplazable de la página.

### Un objeto de opciones: ¿qué significa cada parte?

```javascript
window.scrollTo({ top: 0, behavior: "smooth" });
```

La llamada recibe **un solo argumento**, el objeto situado entre `{ }`. Dentro hay parejas `nombre: valor` separadas por comas. No son dos argumentos ni un bloque de instrucciones: son opciones que lee el método.

| Opción | Significado en `scrollTo` |
| --- | --- |
| `top: 0` | Destino vertical: volver al principio del documento |
| `left: 0` | Destino horizontal: volver al borde izquierdo |
| `behavior: "smooth"` | Animar el recorrido de forma suave, en lugar de un salto brusco |

`top` y `behavior` son nombres de propiedades. `0` es un número y `"smooth"` es una cadena con un valor reconocido por el navegador; debe escribirse entre comillas. No es una variable que tengas que declarar. Al omitir `left` se conserva la posición horizontal actual.

`behavior` indica **cómo** desplazarse, no hasta dónde ni durante cuántos segundos:

| Valor | Efecto |
| --- | --- |
| `"smooth"` | Desplazamiento animado; el navegador decide la duración |
| `"instant"` | Salto inmediato a la posición indicada |
| `"auto"` | Sigue el valor CSS de `scroll-behavior`; no significa siempre salto inmediato |

Si omites `behavior` se utiliza `"auto"`. Para volver arriba y a la izquierda con animación puedes escribir:

```javascript
window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
```

`scrollBy` admite las mismas opciones, pero `top` y `left` representan **cantidades que se suman** a la posición actual:

```javascript
window.scrollBy({ top: 300, left: 0, behavior: "smooth" }); // bajar 300
window.scrollBy({ top: -150, left: 0, behavior: "instant" }); // subir 150
```

Prueba cada línea por separado en una página larga. Espera a que termine un movimiento antes de ejecutar el siguiente. Si todo el contenido cabe en la ventana, o ya estás en el límite solicitado, no apreciarás movimiento.

!!! warning "La animación no detiene el script"
    Después de llamar a `scrollTo` con `"smooth"`, JavaScript continúa. Leer `scrollY` en la línea siguiente no garantiza obtener la posición final. Para registrar el punto de partida, guarda `scrollX` y `scrollY` **antes** de desplazar. Un diálogo modal abierto durante la animación puede interferir con su visualización.

Referencia: [opciones de scrollTo en MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo).

### Otros métodos de la ventana

Estos métodos afectan a la ventana del navegador, no al desplazamiento del documento:

| Método | Argumentos y efecto |
| --- | --- |
| `moveTo(x, y)` | Intenta colocar la ventana en unas coordenadas de la pantalla |
| `moveBy(dx, dy)` | Intenta moverla una cantidad horizontal y vertical desde su posición actual |
| `resizeTo(ancho, alto)` | Intenta fijar las dimensiones exteriores de la ventana, en píxeles |
| `resizeBy(deltaAncho, deltaAlto)` | Intenta aumentar o reducir esas dimensiones; los valores negativos reducen |
| `print()` | Sin argumentos: abre el diálogo de impresión del documento actual; no imprime sin intervención del usuario |
| `focus()` | Sin argumentos: solicita el foco para la ventana |
| `blur()` | Sin argumentos: solicita retirar el foco; es un método desaconsejado y puede no tener efecto |

Mover o redimensionar ventanas está restringido: normalmente solo puede intentarse con ventanas abiertas por script, y aun así el navegador puede impedirlo. El foco también está sujeto a restricciones. No bases una práctica en que funcionen en una pestaña normal. La apertura de ventanas se estudia en el apartado 3.8.

!!! tip "Depuración"
    En la consola, `window` es el global. Escribe `location` o `innerWidth` y pulsa Intro. En **Sources** puedes poner un punto de interrupción dentro del `setTimeout`.

## Caso práctico resuelto: iniciar una sesión de lectura

!!! example "Prueba el scroll en una página preparada"
    [Abrir el laboratorio de scroll](laboratorio-scroll.html). El HTML incluye contenido largo y el script de este caso resuelto.

    Abre la consola con **F12**, pulsa **«Ir a la zona de prueba»** y después **«Ejecutar el caso resuelto»**. Introduce tu nombre, acepta el inicio y cierra el último aviso: observarás el regreso suave al principio. La consola conserva la posición inicial.

    El botón permite ejecutar el ejemplo cuando ya estás abajo. Su evento es solo un soporte de demostración; no forma parte de los conceptos exigidos en este caso. Puedes repetir la prueba sin recargar y consultar el código dentro del propio laboratorio.

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
      const desplazamientoInicialX = window.scrollX;
      const desplazamientoInicialY = window.scrollY;

      console.log("================================");
      console.log(" SESIÓN DE LECTURA INICIADA ");
      console.log("================================");
      console.log(`Alumno/a: ${nombre}`);
      console.log(`Hora de inicio: ${hora}:${minutos}`);
      console.log(`Zona de lectura: ${window.innerWidth} × ${window.innerHeight}`);
      console.log(`Desplazamiento inicial: X=${desplazamientoInicialX}, Y=${desplazamientoInicialY}`);
      console.log("Si necesitas una copia en papel, usa el menú del navegador o window.print().");

      alert(`Sesión iniciada, ${nombre}. Revisa la consola para ver el resumen.`);
      // Después de cerrar el diálogo: destino vertical 0, recorrido animado.
      window.scrollTo({ top: 0, behavior: "smooth" });
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
- `window.scrollTo({ top: 0, behavior: "smooth" })` vuelve al principio vertical con una animación y conserva la posición horizontal. Se ejecuta después de cerrar el aviso para que el diálogo no interrumpa el movimiento. En una página ya arriba apenas se apreciará el cambio.
- Las constantes `desplazamientoInicialX` y `desplazamientoInicialY` guardan la posición anterior al movimiento. El resumen no confunde el inicio con una lectura tomada durante la animación.
- `innerWidth` e `innerHeight` muestran el tamaño de la zona donde se lee el contenido, no el de la pantalla completa.
- El caso **no ejecuta** `window.print()` automáticamente: abrir un diálogo de impresión nada más cargar sería intrusivo. La línea informa de que existe; el método se prueba manualmente desde consola.

Prueba cuatro recorridos: Cancelar el primer diálogo, escribir solo espacios, pulsar Cancelar en la confirmación y aceptar. Cada uno termina en una rama distinta sin necesitar eventos ni funciones de usuario.

## Ejercicio propuesto: preparar una sesión de repaso

### Contexto

Antes de repasar la UT3, quieres que una página de apuntes pregunte tu nombre, confirme el inicio y prepare la zona de lectura. Crea un archivo `sesion-repaso.js` tomando como referencia el caso resuelto.

La práctica mantiene los mismos conceptos, pero permite elegir entre volver al principio con una animación o con un salto inmediato. El resultado se muestra en la consola, sin modificar el HTML mediante JavaScript.

### Requisitos obligatorios

1. Pide el nombre con `window.prompt`. Usa como segundo argumento una cadena vacía para que el campo aparezca vacío.
2. Si se pulsa Cancelar, escribe «Repaso cancelado» en consola y no continúes con los demás diálogos ni desplaces la página.
3. Elimina los espacios de los extremos con `trim`. Si el nombre queda vacío, muestra un único `alert` que indique el error y no inicies la sesión.
4. Solicita confirmación con `window.confirm`, incluyendo el nombre en el mensaje. Si la respuesta es `false`, informa en consola de que la sesión no se ha iniciado y no hagas más preguntas.
5. Si se acepta, crea la fecha y hora del inicio con `Date`. Muestra la hora como `HH:MM`, usando `String` y `padStart`.
6. Guarda `window.scrollX` y `window.scrollY` antes de mover la página. Muestra una cabecera, el nombre limpio, la fecha, la hora, `innerWidth`, `innerHeight` y el desplazamiento inicial.
7. Pregunta mediante otro `confirm`: «¿Quieres volver al principio con una animación? Aceptar: suave. Cancelar: salto inmediato». En este diálogo, Cancelar **elige el salto inmediato**, no cancela la sesión.
8. Usa `window.scrollTo` con un objeto de opciones para volver arriba y a la izquierda:

    - `top` y `left` deben valer `0`: indican el destino.
    - Si se acepta la última pregunta, usa `behavior: "smooth"`.
    - Si se cancela esa pregunta, usa `behavior: "instant"`.

9. Informa en consola del tipo de movimiento solicitado. No afirmes que la animación ya ha terminado ni abras otro diálogo después de iniciarla.
10. Muestra una instrucción para probar `window.print()` manualmente desde la consola. No ejecutes la impresión automáticamente: el método no recibe argumentos y abre el diálogo de impresión de la página actual.

!!! warning "Límites del ejercicio"
    No uses funciones de usuario, temporizadores, arrays, DOM, eventos, `location`, `history`, almacenamiento ni apertura de ventanas. Basta con variables, condiciones, plantillas, `Date`, `String` y los miembros de `window` explicados en este apartado.

### Pistas de diseño

1. Comprueba `null` antes de llamar a `trim`. Un nombre vacío y Cancelar son situaciones diferentes.
2. Organiza el programa con bloques `if` / `else` para que las ramas canceladas no alcancen las instrucciones de inicio. No necesitas un `return` fuera de una función.
3. Guarda cada respuesta de `confirm` en una constante con un nombre distinto: una decide si se inicia y otra el tipo de desplazamiento.
4. Toma la fecha después de aceptar el inicio para que corresponda al momento de empezar.
5. Lee la posición inicial antes de llamar a `scrollTo`. No uses una lectura inmediata posterior como prueba de que el movimiento suave ha finalizado.
6. Recuerda que `{ top: 0, left: 0, behavior: "smooth" }` es un solo argumento de tipo objeto, con tres propiedades. No necesitas crear una función ni una clase para usarlo.

### Casos que debes probar

| Entrada o decisión | Resultado esperado |
| --- | --- |
| Cancelar el nombre | Mensaje de cancelación, sin más diálogos ni movimiento |
| Nombre vacío o solo espacios | Aviso de error; no se inicia el repaso |
| ` Ana ` y Cancelar el inicio | No se inicia; no se pregunta por la animación |
| ` Ana `, aceptar el inicio y aceptar la animación | Resumen con `Ana` y vuelta suave al principio |
| Nombre válido, aceptar el inicio y cancelar la animación | Sesión iniciada y salto inmediato al principio |
| Página situada a mitad del documento | El resumen conserva el desplazamiento anterior al movimiento |
| Página ya al principio o sin contenido suficiente para desplazar | La sesión funciona, aunque no se observe movimiento |

Para observar el efecto, utiliza un HTML con suficiente contenido para hacer scroll. Puedes ejecutar el contenido del script desde la consola después de desplazarte hacia abajo; recarga entre pruebas para evitar redeclarar constantes. Prueba también el archivo enlazado al final del `body`. Si se ejecuta al cargar y la página ya está arriba, no habrá recorrido visible.

### Entrega

Entrega `sesion-repaso.js` y dos capturas de consola: una sesión iniciada y una cancelada. Añade una explicación breve de:

- qué devuelve cada uno de los dos `confirm` y qué significa Cancelar en cada caso;
- qué hacen `top`, `left` y `behavior`;
- en qué se diferencian `"smooth"` e `"instant"`;
- por qué la posición inicial se guarda antes de desplazar.

La corrección valora las ramas de cancelación, el tratamiento del nombre, la claridad del resumen y que puedas explicar los argumentos de los métodos utilizados. No se pide entregar una solución con funciones o eventos de unidades posteriores.
