---
title: 5.3 Utilización de formularios
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.3. Utilización de formularios desde código

Un **formulario** recoge datos en la página y, si no lo detienes, el navegador los **envía** a una URL. El criterio **e)** pide reconocer cómo el HTML define esos controles y cómo JavaScript los lee y los escribe.

Del apartado 5.2 ya tienes los tipos `input`, `change`, `submit` y `reset`, y la propiedad `value` de un campo. `preventDefault()` (apartado 5.1) sirve aquí para leer los datos sin abandonar la página. Comprobar si son correctos, y los mensajes del navegador, es el apartado 5.5.

## 5.3.1. La etiqueta `<form>`

Todo lo que se envía junto va dentro de un `<form>`. Dos atributos deciden el envío:

| Atributo | Qué fija |
| --- | --- |
| `action` | La URL que recibe los datos. Si falta, se envían a la misma página |
| `method` | `get` o `post` |

`get` añade los datos a la URL, detrás de `?`. Con nombre Alex y curso `daw2` la barra de direcciones queda así:

```text
alta.html?nombre=Alex&curso=daw2
```

Se puede guardar en un marcador y se ve a simple vista. Sirve para una búsqueda. No sirve para una contraseña ni para un fichero: la URL no puede llevar un archivo, y el texto queda a la vista.

`post` no toca la URL. Los datos van en el cuerpo de la petición. Es el método de un alta, un cambio o una foto.

```html
<form id="alta" name="alta" action="alta.html" method="get">
  <!-- controles -->
</form>
```

`id` sirve para `querySelector("#alta")` y para el atributo `for` de un `<label>`. `name` sirve para el acceso clásico `document.forms.alta` y es independiente del `id`. En los ejemplos de este apartado los dos coinciden, para no memorizar dos palabras.

Otros atributos del `<form>`:

| Atributo | Cuándo se usa |
| --- | --- |
| `enctype` | `multipart/form-data` si el formulario lleva un `<input type="file">`. Sin eso, el fichero no viaja |
| `novalidate` | El navegador no aplica las comprobaciones HTML5. Se usa cuando las haces tú, en el apartado 5.5 |
| `autocomplete` | `on` u `off`. Pide al navegador que recuerde, o no, lo que la persona escribió |

## 5.3.2. Cada control

El control más usado es `<input>`. `type` decide qué se ve y qué dato guarda. El texto que lo nombra es un `<label>`. Hay dos formas válidas. Las dos hacen que un clic en el texto lleve el foco al campo.

Por `id`, cuando el texto y el campo no están pegados:

```html
<label for="nombre">Nombre</label>
<input id="nombre" name="nombre" type="text">
```

`for` y `id` tienen que ser la misma cadena. Envolviendo el control, cuando el texto va al lado:

```html
<label><input name="modulos" type="checkbox" value="dwec"> DWEC</label>
```

### Atributos que cambian el dato

| Atributo | Qué hace |
| --- | --- |
| `name` | Nombre con el que el dato viaja. Un control sin `name` se ve en la página y **no se envía** |
| `value` | Valor inicial. En un botón, es el texto del botón |
| `checked` | La casilla o el radio empiezan marcados |
| `maxlength` / `minlength` | Tope de caracteres. `maxlength` no deja seguir escribiendo |
| `size` | Anchura aproximada del cuadro, en caracteres. No limita lo que se puede escribir |
| `placeholder` | Texto gris de ayuda. Desaparece al escribir. No sustituye al `<label>` |
| `required` | El navegador no envía el formulario si el campo está vacío. El mensaje propio se trabaja en el 5.5 |
| `disabled` | No se puede usar y **no se envía** |
| `readonly` | Se ve y se envía, y no se puede editar |
| `src` / `alt` | Solo en `type="image"`: la imagen del botón y su texto alternativo |

`disabled` y `readonly` se parecen en la pantalla y no se parecen en el envío. Un campo desactivado no aparece entre los datos. Uno de solo lectura sí, con el `value` que tenga.

### Tipos del temario

| `type` | Qué ve la persona | Qué se envía |
| --- | --- | --- |
| `text` | Un cuadro de texto | El texto |
| `password` | El texto oculto con puntos | El texto igual, solo cambia el aspecto |
| `checkbox` | Una casilla | El `value`, y solo si está marcada. Si no lo está, ese `name` no viaja |
| `radio` | Una opción de un grupo | El `value` de la opción marcada. El grupo es el conjunto de radios con el **mismo** `name` |
| `submit` | Un botón que envía | El formulario completo |
| `reset` | Un botón que restaura | No envía datos: devuelve cada control a su valor inicial |
| `file` | Un selector de fichero | El archivo, si el `method` es `post` y el `enctype` es `multipart/form-data` |
| `hidden` | Nada | El `value`. Sirve para un dato que la persona no tiene que ver |
| `image` | Una imagen que envía | Además, las coordenadas del clic |
| `button` | Un botón que no envía | Nada, hasta que tú le pongas un `click` |

Un `<button>` dentro del formulario, si no lleva `type`, es `type="submit"`. Para un botón que solo hace un `click` (apartado 5.1) hay que escribir `type="button"`.

Casillas y radios. Cada casilla es independiente, aunque compartan `name`: se pueden marcar las dos. Los radios del mismo `name` se excluyen: al marcar uno, se desmarca el otro.

```html
<p>Módulos</p>
<label><input name="modulos" type="checkbox" value="dwec"> DWEC</label>
<label><input name="modulos" type="checkbox" value="daw"> DAW</label>

<p>Turno</p>
<label><input type="radio" name="turno" value="manana" checked> Mañana</label>
<label><input type="radio" name="turno" value="tarde"> Tarde</label>
```

`<fieldset>` agrupa controles y `<legend>` pone el título del grupo. El aspecto y el `disabled` de todo el grupo se ven en el [apartado 5.4](apariencia-comportamiento.md). Para leer el dato no hace falta: lo que importa es el `name`.

### Tipos HTML5

El navegador cambia el teclado en el móvil y, en algunos tipos, hace una comprobación básica. El formato fino (DNI, teléfono) es una expresión regular, en el apartado 5.6.

| `type` | Qué aporta | Cómo queda `value` en JavaScript |
| --- | --- | --- |
| `email` | Teclado de correo y una comprobación básica de que hay una `@` | El texto del campo |
| `tel` | Teclado de teléfono. No comprueba el número | El texto |
| `number` | Flechas y, si los pones, `min`, `max` y `step` | El número, leído como texto: `"2"` |
| `date`, `time`, `datetime-local` | Un calendario o un reloj | Una cadena: `"2026-10-01"`. No es un objeto `Date` |
| `url` | Comprueba que parezca una URL | El texto |
| `search` | Un cuadro de búsqueda | El texto |
| `range` | Un deslizador | El número, otra vez como texto |
| `color` | Un selector de color | Un color en hexadecimal: `"#ff0000"` |

```html
<label for="edad">Edad</label>
<input id="edad" name="edad" type="number" min="16" max="80" step="1">

<label for="fecha">Fecha de la prueba</label>
<input id="fecha" name="fecha" type="date">
```

`min`, `max` y `step` los aplica el navegador al enviar. Vacío se lee `""`. Una fecha elegida se lee `"2026-10-01"`, no con `getFullYear()`: para eso hay que construir un `Date` con esa cadena, y es el objeto de la UT3.

### Lista, texto largo y botones

Un `<select>` ofrece opciones fijas. El `value` que viaja es el de la `<option>` elegida, no el texto visible. `selected` marca la opción inicial.

```html
<label for="curso">Curso</label>
<select id="curso" name="curso">
  <option value="">Elige</option>
  <option value="daw1">1º DAW</option>
  <option value="daw2">2º DAW</option>
</select>
```

Si la persona deja «Elige», `value` es `""`. Si elige 2º DAW, `value` es `"daw2"`.

`<textarea>` es un texto de varias líneas. No usa `value` en el HTML: el texto inicial va entre la etiqueta de apertura y la de cierre. En JavaScript se lee igual que un campo, con `.value`.

```html
<label for="comentarios">Comentarios</label>
<textarea id="comentarios" name="comentarios"></textarea>
```

`<button type="submit">` y `<button type="reset">` hacen lo mismo que `<input type="submit">` y `<input type="reset">`. El `<button>` cabe un texto más largo y es el que usamos.

## 5.3.3. Un formulario para abrir

Guárdalo como `alta.html`. El `method` es `get` y no hay script: al enviar, mira la barra de direcciones. Tienen que aparecer `nombre`, `curso`, `turno` y, solo si están marcados, los módulos.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Alta</title>
  </head>
  <body>
    <form id="alta" name="alta" method="get">
      <p>
        <label for="nombre">Nombre</label>
        <input id="nombre" name="nombre" type="text" maxlength="30" required>
      </p>

      <p>
        <label for="curso">Curso</label>
        <select id="curso" name="curso">
          <option value="">Elige</option>
          <option value="daw1">1º DAW</option>
          <option value="daw2">2º DAW</option>
        </select>
      </p>

      <p>Módulos</p>
      <label><input name="modulos" type="checkbox" value="dwec"> DWEC</label>
      <label><input name="modulos" type="checkbox" value="daw"> DAW</label>

      <p>Turno</p>
      <label><input type="radio" name="turno" value="manana" checked> Mañana</label>
      <label><input type="radio" name="turno" value="tarde"> Tarde</label>

      <p>
        <label for="comentarios">Comentarios</label>
        <textarea id="comentarios" name="comentarios"></textarea>
      </p>

      <button type="submit">Enviar</button>
      <button type="reset">Borrar</button>
    </form>
  </body>
</html>
```

`required` en el nombre impide el envío si ese cuadro está vacío. El navegador muestra su propio aviso. Personalizarlo es el apartado 5.5.

Un fichero no cabe en este `get`. Va en otro formulario:

```html
<form action="guardar.php" method="post" enctype="multipart/form-data">
  <label for="foto">Foto</label>
  <input id="foto" name="foto" type="file" accept="image/*">
  <button type="submit">Subir</button>
</form>
```

`accept="image/*"` filtra el selector hacia imágenes. Sigue siendo una ayuda: el servidor tiene que comprobar el fichero. Desde JavaScript no se puede hacer `foto.value = "C:\foto.png"`: el navegador lo impide, para que una página no lea el disco a escondidas.

## 5.3.4. Leer y escribir desde JavaScript

El formulario es un elemento más. Se busca por el `id` y cada control, por su `name`, dentro de `elements`.

```javascript
const form = document.querySelector("#alta");

console.log(form.elements.nombre.value);
console.log(form.nombre.value); // el mismo campo, atajo por name
console.log(document.forms.alta.nombre.value); // hace falta name="alta" en el form
```

Las tres líneas leen el mismo cuadro. `form.nombre` funciona porque hay un solo control con ese `name` y porque `nombre` no es una propiedad del formulario (`action`, `method` y `submit` sí lo son: no llames así a un campo).

Escribir es asignar `value`. En un grupo de radios, asignar `value` marca la opción que tiene ese `value`:

```javascript
form.nombre.value = "Alex";
form.curso.value = "daw2";
form.turno.value = "tarde";
form.comentarios.value = "Sin incidencias";
```

Una casilla suelta se lee y se marca con `checked`, que es `true` o `false`. El `value` (`"dwec"`) es lo que viajaría, no si está marcada.

```html
<label><input id="dwec" name="dwec" type="checkbox" value="si"> Curso DWEC</label>
```

```javascript
const dwec = document.querySelector("#dwec");
console.log(dwec.checked); // false hasta que se marque
dwec.checked = true;
```

Varias casillas con el mismo `name` no son un solo elemento. `FormData` las recoge todas, más abajo.

### Leer al enviar, sin salir de la página

El evento `submit` salta en el formulario, no en el botón. `preventDefault()` evita el `get` y la página no se recarga, así la consola no se borra.

```javascript
const form = document.querySelector("#alta");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log(form.nombre.value);
  console.log(form.curso.value);
  console.log(form.turno.value);
  console.log(form.comentarios.value);
});
```

Con nombre Alex, 2º DAW y turno de tarde, la consola muestra `Alex`, `daw2`, `tarde` y el texto del área. `turno` sale en una sola cadena: es el `value` del radio marcado, no los dos.

### `FormData`

`FormData` construye la lista de lo que el navegador enviaría: controles con `name`, con valor, y no desactivados. Una casilla sin marcar no entra. Un fichero sí, si el formulario lo tiene.

`get(nombre)` devuelve el primer valor de ese nombre. `getAll(nombre)` devuelve un array con todos, y hace falta cuando varias casillas comparten `name`.

```javascript
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const datos = new FormData(form);

  console.log(datos.get("nombre"));
  console.log(datos.get("turno"));
  console.log(datos.getAll("modulos"));
});
```

Si están marcadas DWEC y DAW, `getAll("modulos")` escribe `["dwec", "daw"]`. Si no hay ninguna, escribe `[]`. `get("modulos")` solo vería la primera casilla marcada: para este grupo se usa `getAll`.

## Errores frecuentes

| Qué se ve | Qué ha pasado |
| --- | --- |
| La URL no lleva el campo | El control no tiene `name`, está `disabled` o es una casilla sin marcar |
| `form.nombre` es `undefined` | El `name` del control no es `nombre`, o hay un fallo de mayúsculas |
| Al enviar, `form.curso.value` es `""` | Sigue elegida la `<option value="">` |
| La fecha no tiene `getFullYear` | `value` de `type="date"` es la cadena `"2026-10-01"` |
| El fichero no sale del ordenador | Falta `method="post"` o `enctype="multipart/form-data"` |
| Un botón de «calcular» envía el formulario | Es un `<button>` sin `type`. Hay que poner `type="button"` |
| `document.forms.alta` es `undefined` | El `<form>` no tiene `name="alta"`. El `id` solo no basta para `document.forms` |

!!! example "Prueba en el navegador"
    Abre `alta.html`, envía una vez sin script y lee la URL. Añade el `submit` con `preventDefault` y `FormData`, marca los dos módulos y vuelve a enviar. La página se queda, y la consola muestra el nombre, el turno y el array de módulos.
