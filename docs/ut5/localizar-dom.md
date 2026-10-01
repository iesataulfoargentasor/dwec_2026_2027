---
title: Localizar elementos del DOM
tags:
  - JavaScript
  - DWEC
  - RA5
---

# Localizar elementos del DOM

`addEventListener` no se llama sobre la página entera: se llama **sobre un elemento**. Antes de registrar el clic hay que conseguir ese elemento. Si la búsqueda no lo encuentra, devuelve `null` y la línea del evento lanza `TypeError`. Por eso estos métodos van delante del [modelo de eventos](modelo-eventos.md).

El DOM es el árbol de la página. En la [UT3](../ut3/document.md) ya entraste por `document`. El recorrido del árbol, las colecciones en vivo y el resto de la API están en la [UT6, apartado 6.3](../ut6/acceso-documento.md). Aquí solo hace falta **llegar al nodo** para poder escucharlo.

El `<script>` va al final del `<body>`, cuando las etiquetas de arriba ya existen. Si va en el `<head>`, la búsqueda ocurre demasiado pronto y el resultado es `null`.

## Los métodos

Partimos de este HTML:

```html
<button type="button" id="aviso" class="principal" name="avisar">Avisar</button>
<p class="nota">Primera nota</p>
<p class="nota">Segunda nota</p>
```

| Método | Qué le pasas | Qué devuelve |
| --- | --- | --- |
| `getElementById("aviso")` | El `id`, **sin** `#` | Ese elemento, o `null` si no está |
| `getElementsByClassName("nota")` | La clase, **sin** `.` | Los que tengan esa clase. Es una colección: `length` y `[0]` |
| `getElementsByTagName("p")` | El nombre de la etiqueta | Todas las de ese tipo, también en colección |
| `getElementsByName("avisar")` | El atributo `name` | Los controles con ese `name`. Encaja con formularios |
| `querySelector("#aviso")` | Un selector CSS: `#id`, `.clase`, `p`, `button.principal` | **El primero** que coincida, o `null` |
| `querySelectorAll(".nota")` | El mismo tipo de selector | **Todos** los que coincidan |

```javascript
const boton = document.getElementById("aviso");
const notas = document.getElementsByClassName("nota");
const parrafos = document.getElementsByTagName("p");
const porNombre = document.getElementsByName("avisar");

const elMismoBoton = document.querySelector("#aviso");
const primeraNota = document.querySelector(".nota");
const todasLasNotas = document.querySelectorAll(".nota");

console.log(boton);              // el botón
console.log(notas.length);       // 2
console.log(parrafos[0]);        // el primer <p>
console.log(porNombre[0]);       // el botón, porque name="avisar"
console.log(elMismoBoton);       // el mismo botón
console.log(primeraNota);        // solo el primer <p class="nota">
console.log(todasLasNotas.length); // 2
```

`getElementById` pide el identificador tal como está en el HTML. `querySelector("#aviso")` pide un selector: la almohadilla forma parte de la cadena. `getElementById("#aviso")` busca un id que empiece por `#` y devuelve `null`.

El `id` es único en la página. La clase se repite: por eso los métodos de clase y de etiqueta devuelven varios, y hay que entrar por `[0]` o recorrerlos. `querySelector` se queda con el primero aunque haya más.

La misma búsqueda puede hacerse **dentro** de un elemento, no en todo el documento. El manejador queda limitado a ese trozo de página:

```javascript
const zona = document.getElementById("ficha");
const botonDeLaFicha = zona.querySelector("button");
```

## Por qué importa al tratar el evento

El elemento que obtienes es el que **recibe** el manejador. Un clic en otro botón no lo dispara.

```javascript
const boton = document.getElementById("aviso");

boton.addEventListener("click", () => {
  console.log("Clic en Avisar");
});
```

El modelo del manejador, el objeto `event` y la burbuja están en el [apartado 5.1](modelo-eventos.md). Aquí el punto es el anterior: sin `boton`, no hay dónde registrar el `"click"`.

Si hay varios y todos deben reaccionar, se recorre la lista. `for...of` es el de la UT2:

```javascript
const botones = document.querySelectorAll(".principal");

for (const boton of botones) {
  boton.addEventListener("click", () => {
    console.log("Clic");
  });
}
```

`querySelector` y `getElementById` bastan en casi todos los ejercicios de esta unidad. `querySelectorAll` entra cuando el mismo evento va en varios elementos. Los cuatro `getElements…` / `getElementById` son los del temario clásico: hay que reconocerlos al leer código.

## Errores frecuentes

| Qué se ve | Qué ha pasado |
| --- | --- |
| `TypeError: Cannot read properties of null` | La búsqueda devolvió `null` y se llamó a `addEventListener`. El `id` no coincide, sobra un `#`, o el script está antes del elemento |
| `getElementById(".nota")` no encuentra nada | El punto y la almohadilla son de `querySelector`. En `getElementById` y `getElementsByClassName` no se ponen |
| Solo reacciona el primer párrafo | Se usó `querySelector(".nota")`, que devuelve uno. Para todos, `querySelectorAll` y un `for` |
| `notas.addEventListener` falla | `getElementsByClassName` devuelve la colección, no un elemento. El evento se registra en `notas[0]` o en cada uno del recorrido |

!!! example "Prueba en el navegador"
    Crea la página con el botón y los dos párrafos, el script al final del `body`, y el `click` sobre `#aviso`. Pulsa el botón: la consola escribe el mensaje. Cambia el `id` del HTML y recarga: tiene que aparecer el `TypeError`, que es la señal de que el evento no tenía elemento.
