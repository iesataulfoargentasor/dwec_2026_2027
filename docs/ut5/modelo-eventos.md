---
title: 5.1 Modelo de gestión de eventos
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.1. Modelo de gestión de eventos

Para registrar un evento hace falta el elemento. Los métodos (`getElementById`, `querySelector` y el resto) están resumidos en [Localizar elementos del DOM](localizar-dom.md).

Una página de solo HTML se muestra y se queda quieta. Un **evento** es el aviso del navegador de que ha pasado algo: un clic, una tecla, el envío de un formulario, el fin de la carga. Tu script no está mirando el ratón todo el rato. Registras una función y el navegador la llama cuando llega ese aviso.

Esa función es el **manejador** (*handler*). El criterio **a)** pide reconocer cómo el HTML engancha el manejador en la propia etiqueta. El **b)** pide la vía de JavaScript: `addEventListener`, el objeto `event` y el recorrido del evento por el árbol. El **d)** pide escribir ese código. En ejercicios nuevos se usa `addEventListener`. Las otras dos formas se estudian para leer código antiguo y para no mezclarlas.

Hay tres sitios donde puede vivir el manejador:

| Forma | Dónde se escribe | Cuántos manejadores caben |
| --- | --- | --- |
| Atributo HTML | `onclick="…"` en la etiqueta | Uno |
| Propiedad del elemento | `boton.onclick = función` en el script | Uno: el segundo pisa al primero |
| `addEventListener` | En el script, sobre el elemento | Varios, y se pueden quitar |

## Las palabras de este apartado

| Palabra | Qué es |
| --- | --- |
| Evento | El aviso. El navegador lo fabrica en el momento del clic, de la tecla, etc. |
| Tipo | El nombre del aviso, en una cadena: `"click"`, `"submit"`. Sin el prefijo `on`. |
| Destino (*target*) | El elemento en el que ocurrió. Si pulsas un botón, el destino es ese botón. |
| Manejador | La función tuya que se ejecuta. |
| Registrar | Decirle al elemento: «cuando veas este tipo, llama a esta función». |

Los tipos concretos (ratón, teclado, carga, formulario) están en el [apartado 5.2](tipos-eventos.md). Aquí el tipo de trabajo es `"click"`, porque basta para ver el modelo.

## El script va detrás del elemento

`document.querySelector` (UT3) busca en el HTML que **ya se ha leído**. Si el `<script>` está en el `<head>` y el botón está en el `<body>`, la búsqueda ocurre antes de que el botón exista y devuelve `null`. La línea siguiente, `null.addEventListener(…)`, lanza `TypeError`.

En este apartado el `<script>` va al final del `<body>`, después de los elementos que usa:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Eventos</title>
  </head>
  <body>
    <button type="button" id="aviso">Avisar</button>
    <p id="salida"></p>

    <script>
      const boton = document.querySelector("#aviso");
      const salida = document.querySelector("#salida");
      console.log(boton); // el botón, no null
    </script>
  </body>
</html>
```

Guarda el archivo como `eventos.html` y ábrelo en el navegador. En cada ejemplo de abajo se añade código dentro de ese `<script>`, o se enseña el fragmento nuevo. `type="button"` deja el botón como un botón: dentro de un formulario, un `<button>` sin tipo envía el formulario (apartado 5.3).

`textContent` (UT3) escribe en el párrafo. Así se ve el resultado en la página. `console.log` deja el rastro en DevTools (:kbd:`F12`, pestaña *Consola*), y hace falta cuando hay varios mensajes en orden.

!!! tip "Otras formas de esperar al HTML"
    El atributo `defer` en `<script src="…">` también espera a tener el HTML. Esperar al evento `DOMContentLoaded` se ve en el [apartado 5.2](tipos-eventos.md#eventos-de-documento-y-ventana). Mientras tanto, el script al final del `body` evita el `null`.

## 5.1.1. El atributo en el HTML

El atributo se llama con el prefijo `on` y el tipo: `onclick`, `onchange`, `onsubmit`, `onload`. Su valor es **código JavaScript**, escrito entre comillas, que el navegador ejecuta cuando ocurre el evento.

```html
<button type="button" onclick="alert('Clic en el botón');">Avisar</button>
```

Al pulsar, sale el cuadro de `alert`. El código está en la etiqueta, no en el `<script>`.

Si el manejador tiene varias líneas, o lo vas a reutilizar, la etiqueta solo **llama** a una función. La función se declara en el script, como en la UT4:

```html
<button type="button" onclick="saludar()">Saludar</button>

<script>
  function saludar() {
    alert("Clic en el botón");
  }
</script>
```

`onclick="saludar()"` llama a la función. `onclick="saludar"`, sin paréntesis, nombra la función y no la ejecuta: el clic no hace nada visible.

Las comillas se reparten. El atributo HTML va entre comillas dobles y el texto de JavaScript, entre simples:

```html
<button type="button" onclick="alert('hola')">Hola</button>
```

`onclick="alert("hola")"` se rompe: la segunda comilla doble cierra el atributo y el HTML deja de ser válido.

Otros atributos del mismo modelo, para reconocerlos cuando aparezcan. El detalle de cada tipo está en el apartado 5.2:

| Atributo | Se dispara cuando… |
| --- | --- |
| `onclick` | Se pulsa el elemento |
| `onchange` | Cambia el valor de un control y se abandona |
| `onsubmit` | Se envía un formulario |
| `onload` | Termina de cargar la página o una imagen |

Un elemento tiene un solo `onclick`. No se acumulan dos atributos iguales.

!!! warning "Para el criterio a), no para el código nuevo"
    El atributo mezcla HTML y JavaScript, solo admite un manejador y las comillas estorban en cuanto el código crece. Sirve para leer páginas antiguas y para reconocer la captura desde el lenguaje de marcas. En los ejercicios de esta unidad el manejador va en el script, con `addEventListener`.

## 5.1.2. La propiedad `onclick`

La misma idea, escrita en JavaScript. El elemento tiene una propiedad por cada atributo `on…`. Le asignas la función:

```javascript
const boton = document.querySelector("#aviso");

boton.onclick = () => {
  console.log("A");
};
```

La flecha es la de la UT4. Al pulsar se escribe `A` en la consola.

La propiedad guarda **una** función. Una segunda asignación sustituye a la primera:

```javascript
boton.onclick = () => {
  console.log("A");
};

boton.onclick = () => {
  console.log("B");
};
```

Al pulsar solo sale `B`. `A` ya no está enganchado. Para dejar el elemento sin manejador: `boton.onclick = null`.

Esta forma ya separa el HTML del script. Sigue sin permitir dos reacciones al mismo clic. Por eso el código actual usa el método siguiente.

## 5.1.3. `addEventListener`

`elemento.addEventListener(tipo, manejador)` registra el manejador.

- El **tipo** es la cadena `"click"`, `"submit"`, etc. Sin `on`. `"onclick"` no es un tipo: el navegador no avisa de un evento con ese nombre y la función no se llama.
- El **manejador** es la función. Puede ser una flecha o una función con nombre.

Con la página del principio:

```javascript
const boton = document.querySelector("#aviso");
const salida = document.querySelector("#salida");

boton.addEventListener("click", () => {
  salida.textContent = "Has pulsado el botón";
});
```

Al pulsar, el párrafo pasa a mostrar esa frase. El HTML del botón no lleva `onclick`.

### Varios manejadores en el mismo elemento

Cada llamada **añade**. No pisa a la anterior. Se ejecutan en el orden en que se registraron:

```javascript
boton.addEventListener("click", () => {
  console.log("primero");
});

boton.addEventListener("click", () => {
  console.log("segundo");
});
```

Un clic escribe `primero` y después `segundo`. Con la propiedad `onclick`, el segundo habría borrado al primero.

### Quitar un manejador

`removeEventListener(tipo, manejador)` quita el registro. El segundo argumento tiene que ser **la misma función** que se pasó a `addEventListener`, no una función nueva con el mismo texto.

```javascript
function avisar() {
  console.log("Clic");
}

boton.addEventListener("click", avisar);
boton.removeEventListener("click", avisar);
```

Después de la segunda línea, un clic ya no escribe `Clic`.

Una flecha escrita otra vez es otra función. Este par **no** desregistra nada: el `removeEventListener` no encuentra el manejador que se añadió.

```javascript
boton.addEventListener("click", () => {
  console.log("Clic");
});

boton.removeEventListener("click", () => {
  console.log("Clic");
});
```

Si más adelante vas a quitar el manejador, declara la función con nombre y pasa ese nombre a los dos métodos.

## 5.1.4. El objeto `event`

Al llamar al manejador, el navegador le pasa un argumento: el objeto del evento. El nombre del parámetro lo eliges tú. El habitual es `event`.

```javascript
boton.addEventListener("click", (event) => {
  console.log(event.type); // "click"
});
```

Si la función no declara el parámetro, el aviso existe igual: simplemente no lo usas. Hace falta declararlo cuando vas a leer el tipo, el destino o a cancelar la acción por defecto.

| Propiedad / método | Qué aporta en este apartado |
| --- | --- |
| `type` | La cadena del tipo: `"click"` |
| `target` | El elemento donde ocurrió el suceso |
| `currentTarget` | El elemento que tiene **este** manejador |
| `preventDefault()` | Cancela la acción por defecto del navegador |
| `stopPropagation()` | Corta el recorrido que le falta al evento por el árbol |

Un clic trae también la posición del puntero, y una tecla trae qué tecla fue. Esos datos van con el tipo de evento, en el apartado 5.2. Aquí bastan las cinco filas de la tabla.

### `target` y `currentTarget`

No siempre coinciden. El manejador puede estar en un padre, y el clic en un hijo.

```html
<div id="caja">
  <button type="button" id="aviso">Avisar</button>
</div>
```

```javascript
const caja = document.querySelector("#caja");

caja.addEventListener("click", (event) => {
  console.log("target", event.target);
  console.log("currentTarget", event.currentTarget);
});
```

- Clic en el **botón**: `target` es el botón (ahí ocurrió) y `currentTarget` es `#caja` (ahí está el manejador).
- Clic en el **hueco del `div`**, fuera del botón: los dos son `#caja`.

`currentTarget` es el elemento sobre el que llamaste a `addEventListener`. `target` es el elemento de más adentro que recibió el clic.

## 5.1.5. La acción por defecto: `preventDefault`

Algunos eventos traen una acción del propio navegador, además de tu manejador:

- un enlace abre la URL de `href`;
- un formulario se envía y la página se recarga (eso se trabaja en el apartado 5.5).

`preventDefault()` cancela **esa** acción. Tu manejador sí se ejecuta. Los demás manejadores del mismo elemento también.

```html
<a id="enlace" href="otra.html">Ir a otra página</a>
```

```javascript
const enlace = document.querySelector("#enlace");

enlace.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("El enlace no abre otra.html");
});
```

Sin `preventDefault()`, la consola puede llegar a escribir la frase y, a continuación, el navegador abre `otra.html`. Con la llamada, te quedas en la misma página.

En un formulario se usa igual, sobre el evento `submit`, para revisar los datos sin recargar. El ejemplo completo está en el [apartado 5.5](validacion.md).

## 5.1.6. El recorrido por el árbol

El HTML es un árbol. Un clic en un botón no ocurre solo «en el botón»: el botón está dentro de un `div`, el `div` dentro del `body`, el `body` dentro del documento.

```text
document
  └── div#caja
        └── button#aviso
```

El aviso hace dos viajes:

1. **Captura.** Baja desde `window` hasta el botón.
2. **Burbuja.** Sube desde el botón hasta `window`.

`addEventListener(tipo, manejador)` escucha en la **subida**. Es lo que usaremos casi siempre. El tercer argumento `true` escucha en la **bajada**.

### Burbuja

```javascript
const caja = document.querySelector("#caja");
const boton = document.querySelector("#aviso");

caja.addEventListener("click", () => {
  console.log("caja");
});

boton.addEventListener("click", () => {
  console.log("boton");
});
```

Clic en el botón. La consola muestra:

```text
boton
caja
```

Primero el manejador del destino, después el del padre. El clic «sube». Clic en el hueco de `#caja`, sin tocar el botón: solo sale `caja`. El manejador del botón no se ejecuta, porque el suceso no ocurrió en el botón.

Por eso un manejador en el padre ve los clics de sus hijos. `event.target` dice cuál fue el hijo. `event.currentTarget` sigue siendo el padre.

### Captura

El tercer argumento `true` registra el manejador en la bajada:

```javascript
caja.addEventListener("click", () => {
  console.log("1. caja, bajando");
}, true);

boton.addEventListener("click", () => {
  console.log("2. boton");
});

caja.addEventListener("click", () => {
  console.log("3. caja, subiendo");
});
```

Clic en el botón. El orden es el de los números: primero la caja, de camino hacia abajo; luego el botón; luego la caja, de camino hacia arriba. El mismo `div` puede tener un manejador en cada fase.

En las prácticas el tercer argumento no se pone: interesa la burbuja. Hay que reconocer `true` cuando aparezca en un código.

### `stopPropagation`

Corta el viaje **que aún no se ha hecho**. No deshace los manejadores que ya se ejecutaron en la bajada.

```javascript
boton.addEventListener("click", (event) => {
  console.log("boton");
  event.stopPropagation();
});

caja.addEventListener("click", () => {
  console.log("caja");
});
```

Clic en el botón: solo sale `boton`. La burbuja no llega a `#caja`.

`preventDefault()` y `stopPropagation()` hacen cosas distintas. Conviene no cambiar uno por el otro:

| Método | Qué corta |
| --- | --- |
| `preventDefault()` | La acción del navegador (abrir el enlace, enviar el formulario) |
| `stopPropagation()` | El aviso a los ascendientes que todavía no han recibido el evento |

## Las tres formas, juntas

| Forma | Ejemplo | Qué recordar |
| --- | --- | --- |
| Atributo HTML | `onclick="saludar()"` | Criterio **a)**. Un solo manejador, código dentro de la etiqueta |
| Propiedad | `boton.onclick = saludar` | Un solo manejador. La segunda asignación sustituye a la primera |
| `addEventListener` | `boton.addEventListener("click", saludar)` | Forma de trabajo. Varios manejadores. El tipo va sin `on` |

```javascript
const boton = document.querySelector("#aviso");

function saludar() {
  console.log("hola");
}

boton.addEventListener("click", saludar);
```

## Errores frecuentes

| Qué se ve | Qué ha pasado |
| --- | --- |
| `TypeError: Cannot read properties of null` | `querySelector` no encontró el elemento. El script está antes del botón, o el `id` no coincide |
| El clic no hace nada y no hay error | El tipo se escribió `"onclick"` en `addEventListener`, o el atributo dice `onclick="saludar"` sin `()` |
| Solo se ejecuta el último manejador | Se usó `boton.onclick = …` dos veces. Hay que usar `addEventListener` |
| `removeEventListener` no quita nada | Se pasó otra función, aunque el texto sea igual. Hay que pasar el mismo nombre |
| Sale el mensaje del hijo y también el del padre | Es la burbuja. Para quedarse en el hijo, `stopPropagation()` dentro de su manejador |
| El enlace cambia de página después del `console.log` | Falta `event.preventDefault()` |

!!! example "Prueba en el navegador"
    Monta `eventos.html` con `#caja`, el botón y el enlace. Registra los tres `console.log` de la captura y pulsa el botón: el orden tiene que ser bajada, botón, subida. Quita el tercer argumento `true` y vuelve a pulsar. Abre la consola antes de pulsar, que los mensajes no esperan.
