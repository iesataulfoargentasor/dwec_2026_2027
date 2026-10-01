---
title: 5.2 Tipos de eventos
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.2. Tipos de eventos

En el [apartado 5.1](modelo-eventos.md) está el modelo: registrar un manejador con `addEventListener`, leer el objeto `event` y dejar que el aviso suba por el árbol. Aquí cambia la pregunta. El criterio **c)** pide **distinguir el tipo**: de dónde sale el aviso y qué dato trae.

El temario los agrupa en cuatro orígenes:

| Grupo | Sale de… | Ejemplos |
| --- | --- | --- |
| Ratón | El puntero | `click`, `mouseover`, `mousemove` |
| Teclado | Una tecla | `keydown`, `keyup` |
| Documento, ventana y controles | La página, `window` o un campo | `DOMContentLoaded`, `load`, `input`, `change`, `submit` |
| Cambios en el DOM | Un script que modifica el árbol | `MutationObserver` |

El atributo HTML sigue siendo `on` + tipo (`onclick`, `onkeydown`). En el script el tipo va sin `on`: `"click"`, `"keydown"`. El `<script>` sigue al final del `<body>`, como en el 5.1.

`event.type` confirma el nombre. El resto de propiedades depende del grupo: un clic trae coordenadas; una tecla trae `event.key`; un campo trae el texto en `value`.

## 5.2.1. Eventos del ratón

Se producen con el puntero: ratón, trackpad o, en muchos móviles, el primer toque.

| Evento | Atributo HTML | Cuándo ocurre |
| --- | --- | --- |
| `click` | `onclick` | Se pulsa y se suelta el botón principal sobre el elemento |
| `dblclick` | `ondblclick` | Doble clic |
| `mousedown` | `onmousedown` | Se pulsa un botón, antes de soltarlo |
| `mouseup` | `onmouseup` | Se suelta el botón |
| `mouseover` | `onmouseover` | El puntero entra en el elemento |
| `mouseout` | `onmouseout` | El puntero sale del elemento |
| `mousemove` | `onmousemove` | El puntero se mueve dentro del elemento |

Un `click` es la pareja `mousedown` + `mouseup` sobre el mismo elemento. Si pulsas dentro y sueltas fuera, hay `mousedown` y no hay `click`.

`style.backgroundColor` es el mismo mecanismo de la UT3. Aquí solo cambia el color para ver el evento:

```html
<div id="lienzo">Pasa el puntero y haz clic</div>

<script>
  const zona = document.querySelector("#lienzo");

  zona.addEventListener("click", () => {
    console.log("Clic");
  });

  zona.addEventListener("mouseover", () => {
    zona.style.backgroundColor = "crimson";
  });

  zona.addEventListener("mouseout", () => {
    zona.style.backgroundColor = "";
  });
</script>
```

Al entrar, el fondo pasa a carmesí. Al salir, vuelve al color de la hoja. Cada clic escribe `Clic` en la consola.

### Dónde está el puntero

Un clic es un `MouseEvent`. Además de `type`, `target` y `currentTarget`, trae la posición y qué botón fue:

| Propiedad | Qué es |
| --- | --- |
| `clientX`, `clientY` | Píxeles desde la esquina superior izquierda de la ventana |
| `button` | `0` principal, `1` rueda, `2` secundario |

```javascript
zona.addEventListener("click", (event) => {
  console.log(event.clientX, event.clientY, "botón", event.button);
});
```

`mousemove` se dispara muchas veces por segundo mientras el puntero se mueve. Sirve para una coordenada en pantalla. No sirve para un cálculo pesado: la página se entrecorta.

!!! info "Pantallas táctiles"
    Con el dedo o el lápiz, la API pensada para eso es `pointerdown`, `pointerup` y `pointermove`. En las prácticas de DWEC bastan `click` y los eventos de esta tabla: cubren el criterio **c)**.

## 5.2.2. Eventos del teclado

El aviso lo produce una tecla, normalmente con el foco en un campo o en la página.

| Evento | Atributo HTML | Cuándo ocurre |
| --- | --- | --- |
| `keydown` | `onkeydown` | Se pulsa una tecla. Si se mantiene, el aviso se repite |
| `keyup` | `onkeyup` | Se suelta la tecla |
| `keypress` | `onkeypress` | Obsoleto. No lo uses |

La tecla se lee en **`event.key`**. Es una cadena:

| Pulso | `event.key` |
| --- | --- |
| Letra a | `"a"` (o `"A"` si Mayús está pulsado) |
| Intro | `"Enter"` |
| Escape | `"Escape"` |
| Flecha izquierda | `"ArrowLeft"` |

`value` es el texto del campo, el mismo dato que ya leíste en un `<select>` en la UT3.

```html
<label for="busqueda">Buscar</label>
<input id="busqueda" type="text">
<p id="eco"></p>

<script>
  const campo = document.querySelector("#busqueda");
  const eco = document.querySelector("#eco");

  campo.addEventListener("keydown", (event) => {
    console.log(event.key);

    if (event.key === "Enter") {
      eco.textContent = "Buscar: " + campo.value;
    }
  });
</script>
```

Cada tecla escribe su nombre en la consola. Intro, además, copia el texto del campo al párrafo. Intro también llega a `keydown`: no es un caso aparte.

`keydown` avisa de **cualquier** tecla, incluidas Mayús, Ctrl y las flechas. `keyCode` y `which` son números antiguos de la misma tecla: están obsoletos. Lee `event.key`.

## 5.2.3. Eventos de documento, ventana y controles {: #eventos-de-documento-y-ventana }

No salen del puntero ni de una tecla. Salen de la página, de la ventana o de un control de formulario.

| Evento | Atributo HTML | Cuándo ocurre |
| --- | --- | --- |
| `DOMContentLoaded` | — | El HTML ya está leído. No espera a las imágenes |
| `load` | `onload` | En `window`: la página completa, imágenes incluidas. En un `<img>`: esa imagen ya cargó |
| `error` | `onerror` | Falló la carga de un recurso, por ejemplo una imagen |
| `resize` | `onresize` | Cambia el tamaño de la ventana |
| `scroll` | `onscroll` | Se mueve el scroll de la página o de un elemento |
| `focus` | `onfocus` | El elemento recibe el foco (clic o tabulador) |
| `blur` | `onblur` | El elemento pierde el foco |
| `input` | `oninput` | El valor del control cambia: cada tecla, un pegado, un dictado |
| `change` | `onchange` | El valor cambió y el control pierde el foco. En un `<select>`, al elegir la opción |
| `select` | `onselect` | Se selecciona texto dentro de un campo |
| `submit` | `onsubmit` | Se envía el formulario |
| `reset` | `onreset` | Se restablecen los valores iniciales del formulario |
| `abort` | `onabort` | Se interrumpe la carga de un recurso. Hoy casi no se usa |

`resize` y `scroll` se repiten mientras dura el gesto, igual que `mousemove`. Un `console.log` dentro sirve para verlos una vez; dejarlo puesto llena la consola.

`unload` (la página que se va) está restringido en los navegadores actuales. Para avisar antes de salir existe `beforeunload`, y el navegador decide el texto del diálogo. No hace falta usarlo en las prácticas.

### `DOMContentLoaded` y `load`

Son dos momentos distintos. Con un `<script>` al final del `<body>` los elementos de arriba ya existen, así que para un botón no hace falta esperar. Hace falta cuando el script está en el `<head>`, o cuando quieres distinguir «el HTML está» de «las imágenes también».

```javascript
document.addEventListener("DOMContentLoaded", () => {
  console.log("HTML listo");
});

window.addEventListener("load", () => {
  console.log("Página e imágenes cargadas");
});
```

El orden en la consola es ese: primero `HTML listo`, después `Página e imágenes cargadas`. El segundo puede tardar si hay imágenes grandes.

Registra `DOMContentLoaded` en el script inicial. Si lo registras dentro de un clic, cuando la persona ya está usando la página, ese momento ya pasó y el manejador no se ejecuta.

### `input` y `change`

Los dos avisan de que un campo cambió. No avisan en el mismo instante.

```html
<label for="nombre">Nombre</label>
<input id="nombre" type="text">

<script>
  const nombre = document.querySelector("#nombre");

  nombre.addEventListener("input", () => {
    console.log("Mientras escribe:", nombre.value);
  });

  nombre.addEventListener("change", () => {
    console.log("Al salir del campo:", nombre.value);
  });
</script>
```

Escribe tres letras y luego pulsa Tab o haz clic fuera del campo.

- `input` escribe en la consola **en cada letra**.
- `change` escribe **una vez**, al abandonar el campo, si el texto no es el que había al entrar.

En un `<select>`, `change` salta al elegir otra opción, sin esperar a que el control pierda el foco.

`submit` y `reset` se escuchan en el `<form>`, no en el botón. Cancelar el envío con `preventDefault()` para validar es el apartado 5.5. Aquí basta reconocer el tipo.

### Foco

```javascript
nombre.addEventListener("focus", () => {
  nombre.style.backgroundColor = "lightyellow";
});

nombre.addEventListener("blur", () => {
  nombre.style.backgroundColor = "";
});
```

Al entrar en el campo el fondo cambia. Al salir, vuelve al de la hoja. Es el mismo par que `mouseover` / `mouseout`, aplicado al foco del teclado y del clic, no al simple paso del puntero.

## 5.2.4. Cambios en el DOM

El material de 2013 citaba `DOMSubtreeModified`, `DOMNodeInserted` y `DOMNodeRemoved`. Esos eventos están obsoletos. No se registran y no se piden en la práctica.

Lo que se usa es **`MutationObserver`**. Le pasas una función y el nodo que quieres vigilar. Cuando el árbol cambia, el navegador llama a la función con la lista de cambios. Cada cambio tiene:

| Propiedad | Qué es |
| --- | --- |
| `type` | `"childList"` si entraron o salieron hijos; `"attributes"` si cambió un atributo |
| `addedNodes` | Los nodos que se acaban de añadir. `length` dice cuántos |

`createElement`, `textContent` y `append` son los de la UT3. El observador no crea el elemento: solo avisa de que alguien lo ha metido en el árbol.

Opciones de `observe`, en el objeto que va en el segundo argumento:

| Opción | Pide aviso cuando… |
| --- | --- |
| `childList: true` | Se añade o se quita un hijo directo |
| `attributes: true` | Cambia un atributo (`class`, `style`, `hidden`…) |
| `subtree: true` | El cambio está en un descendiente, no solo en el nodo vigilado |

```html
<ul id="tareas"></ul>
<button type="button" id="anadir">Añadir</button>

<script>
  const lista = document.querySelector("#tareas");
  const boton = document.querySelector("#anadir");

  const observador = new MutationObserver((cambios) => {
    for (const cambio of cambios) {
      console.log(cambio.type, cambio.addedNodes.length, "nodos añadidos");
    }
  });

  observador.observe(lista, { childList: true });

  boton.addEventListener("click", () => {
    const item = document.createElement("li");
    item.textContent = "Nueva tarea";
    lista.append(item);
  });
</script>
```

Cada clic en «Añadir» crea un `<li>`, lo cuelga de la lista y la consola escribe `childList 1 nodos añadidos`. Sin el `append`, el observador no dice nada: vigila el árbol, no el botón.

`observador.disconnect()` deja de vigilar. Se llama cuando la lista ya no importa, para no seguir recibiendo avisos.

## Cómo clasificarlos

En un examen o en la defensa de la práctica se nombra el grupo, el evento y el método de escucha.

| Si el suceso es… | Grupo | Evento que encaja | Escucha |
| --- | --- | --- | --- |
| Pulsar un botón con el ratón | Ratón | `click` | `elemento.addEventListener("click", manejador)` |
| Leer Intro en un campo | Teclado | `keydown` y `event.key === "Enter"` | En el `<input>` |
| Esperar a que el HTML exista | Documento | `DOMContentLoaded` | En `document` |
| Enterarse de cada letra escrita | Control | `input` | En el campo. `change` sería al salir |
| Ver que un script ha metido un nodo | DOM | `MutationObserver` | `observador.observe(nodo, { childList: true })` |

!!! example "Prueba en el navegador"
    Monta el lienzo, el campo de búsqueda y la lista en la misma página. Pasa el puntero, pulsa Intro dentro del campo y añade una tarea. En la consola tienen que salir, por ese orden de gestos, el color del lienzo, la cadena de `event.key` y la línea `childList`.
