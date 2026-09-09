---
title: 5.3 Utilización de formularios
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.3. Utilización de formularios desde código

Un **formulario** recoge datos en el cliente y, salvo que lo detengas con JavaScript, los **envía** a una URL. El criterio **e)** pide reconocer cómo HTML y JavaScript gestionan esos controles.

Cada control guarda un valor o dispara una acción (`submit`, `reset`, un botón propio).

## 5.3.1. Estructura de un formulario

La etiqueta principal es `<form>`. Dos atributos clásicos:

- **`action`:** URL de destino de los datos.
- **`method`:** `get` (query string, visible, cacheable) o `post` (cuerpo de la petición).

```html
<form action="alta.php" method="post">
  <!-- controles -->
</form>
```

Si no hay `action`, el formulario se envía a la **misma URL** de la página. En ejercicios solo de cliente puedes omitir `action` y cancelar el envío con `preventDefault()` (apartado [5.5](validacion.md)).

Otros atributos útiles:

| Atributo | Uso |
| --- | --- |
| `name` | Nombre del formulario (acceso clásico: `document.forms.alta`) |
| `enctype` | `multipart/form-data` si hay `<input type="file">` |
| `novalidate` | Desactiva la validación HTML5 (útil si validas tú por completo) |
| `autocomplete` | `on` / `off` a nivel de formulario o de campo |

## 5.3.2. Controles: `input` y compañía

El control más habitual es `<input>`. El atributo **`type`** decide el aspecto y el dato.

Asocia siempre un **`<label>`** (accesibilidad y clic en el texto enfoca el campo):

```html
<label for="nombre">Nombre</label>
<input id="nombre" name="nombre" type="text">
```

### Atributos comunes de `input`

| Atributo | Función |
| --- | --- |
| `type` | Tipo de control |
| `name` | Nombre que viaja al servidor. **Sin `name` el campo no se envía** |
| `value` | Valor inicial (en botones, el texto visible) |
| `size` | Anchura aproximada en caracteres (`text` / `password`) |
| `maxlength` / `minlength` | Límites de longitud |
| `checked` | Marca inicial en `checkbox` y `radio` |
| `disabled` | Control inactivo; **no se envía** |
| `readonly` | Visible pero no editable (sí se envía) |
| `required` | Obligatorio (validación HTML5) |
| `placeholder` | Texto de ayuda dentro del campo |
| `src` / `alt` | En `type="image"`: imagen del botón y texto alternativo |

`size` no limita cuántos caracteres caben: eso es `maxlength`.

### Tipos clásicos (temario)

| `type` | Qué es |
| --- | --- |
| `text` | Cuadro de texto |
| `password` | Texto oculto (puntos o asteriscos) |
| `checkbox` | Casilla independiente |
| `radio` | Opción excluyente: **mismo `name`** agrupa |
| `submit` | Envía el formulario |
| `reset` | Restaura valores iniciales |
| `file` | Selección de fichero |
| `hidden` | No visible; sí se envía (`name` + `value`) |
| `image` | Envío con imagen (`src`) |
| `button` | Botón **sin** enviar el form; le asocias tú el evento |

```html
<p>Colores favoritos</p>
<label><input name="colores" type="checkbox" value="rojo"> Rojo</label>
<label><input name="colores" type="checkbox" value="azul"> Azul</label>

<fieldset>
  <legend>Género</legend>
  <label><input type="radio" name="genero" value="M"> Hombre</label>
  <label><input type="radio" name="genero" value="F"> Mujer</label>
  <label><input type="radio" name="genero" value="X"> Otro / prefiero no decirlo</label>
</fieldset>
```

### Tipos HTML5 (añadidos al temario)

El navegador ofrece teclado adecuado en móvil y validación básica:

| `type` | Uso típico |
| --- | --- |
| `email` | Correo; valida formato básico |
| `tel` | Teléfono (no valida el número por sí solo) |
| `number` | Número; `min`, `max`, `step` |
| `date` / `time` / `datetime-local` | Fecha y hora |
| `url` | URL |
| `search` | Campo de búsqueda |
| `range` | Deslizador |
| `color` | Selector de color |

También: `<textarea>`, `<select>` + `<option>`, `<button type="submit|reset|button">` (preferible a `<input type="button">` si el contenido no es solo texto).

## Ejemplo reunido

```html
<form id="ficha" action="guardar.php" method="post" enctype="multipart/form-data">
  <label for="nombre">Nombre</label>
  <input id="nombre" name="nombre" type="text" maxlength="30" required>

  <label for="dni">DNI</label>
  <input id="dni" name="dni" type="text" maxlength="9" required>

  <fieldset>
    <legend>Sexo</legend>
    <label><input type="radio" name="sexo" value="hombre" checked> Hombre</label>
    <label><input type="radio" name="sexo" value="mujer"> Mujer</label>
  </fieldset>

  <label for="foto">Incluir mi foto</label>
  <input id="foto" name="foto" type="file" accept="image/*">

  <label>
    <input name="publicidad" type="checkbox" value="si" checked>
    Enviar publicidad
  </label>

  <button type="submit">Guardar cambios</button>
  <button type="reset">Borrar los datos introducidos</button>
</form>
```

## Acceso desde JavaScript

```javascript
const form = document.querySelector("#ficha");

console.log(form.elements.nombre.value);
console.log(form.nombre.value); // atajo si hay name="nombre"

form.nombre.value = "Alex";

const datos = new FormData(form);
console.log(datos.get("nombre"));
```

`FormData` recoge los campos con `name` (incluidos ficheros). Es la forma actual de leer o enviar el formulario por `fetch` sin recargar la página.
