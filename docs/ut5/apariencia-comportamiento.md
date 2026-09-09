---
title: 5.4 Apariencia y comportamiento
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.4. Modificación de apariencia y comportamiento

Los formularios tienen un aspecto y una acción **por defecto**. Puedes cambiar ambos: el primero con HTML/CSS; el segundo con JavaScript (criterio **e)**).

## 5.4.1. Apariencia: `fieldset` y `legend`

`<fieldset>` agrupa controles relacionados. `<legend>` pone el título del grupo. Mejora la lectura y la accesibilidad (lectores de pantalla anuncian el grupo).

```html
<form>
  <fieldset>
    <legend>Datos personales</legend>
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" type="text">
    <label for="email">Email</label>
    <input id="email" name="email" type="email">
  </fieldset>
</form>
```

El resto de la apariencia (márgenes, colores, validación visible) es **CSS**. En DWEC no hace falta un diseño elaborado; sí conviene que cada control tenga `label`.

`disabled` en el `fieldset` desactiva **todos** los controles del grupo.

## 5.4.2. Comportamiento: cambiar `action` y enviar

Puedes decidir la URL de destino **según lo que marque el usuario** y luego llamar a `submit()`.

```html
<form id="gestion" method="post">
  <label>
    <input type="checkbox" name="alta" id="alta">
    Es un alta (si no, es una baja)
  </label>
  <button type="button" id="enviar">Enviar</button>
</form>
```

```javascript
const form = document.querySelector("#gestion");
const alta = document.querySelector("#alta");
const boton = document.querySelector("#enviar");

boton.addEventListener("click", () => {
  form.action = alta.checked ? "paginas/alta.html" : "paginas/baja.html";
  form.submit();
});
```

`HTMLFormElement.submit()` envía el formulario **sin** disparar el evento `submit`. Si necesitas que corra tu validación, dispara el envío con el botón `type="submit"` o llama tú a la función de validar **antes** de `submit()`.

```javascript
function enviarSiEsValido(form) {
  if (!form.checkValidity()) {
    form.reportValidity(); // muestra los mensajes HTML5
    return;
  }
  form.submit();
}
```

Otras propiedades útiles del formulario:

| Propiedad / método | Efecto |
| --- | --- |
| `form.action` | URL de destino (lectura y escritura) |
| `form.method` | `"get"` o `"post"` |
| `form.submit()` | Envío programático (no lanza `submit`) |
| `form.reset()` | Restaura valores iniciales (sí puede usarse junto al evento `reset`) |
| `form.elements` | Colección de controles |

!!! tip "Botón que no envía"
    Un `<button>` dentro de un form es `type="submit"` **por defecto**. Si solo debe cambiar el `action` o abrir un diálogo, pon `type="button"` y el `click` como en el ejemplo.
