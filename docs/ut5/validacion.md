---
title: 5.5 Validación y envío
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.5. Validación y envío

El usuario puede escribir un código postal donde se espera un número, dejar un campo vacío o no aceptar las condiciones. **Validar en el cliente** evita envíos inútiles y da feedback inmediato. El criterio **f)** pide validar formularios **usando eventos** (sobre todo `submit`).

La validación en el navegador **no sustituye** a la del servidor: se puede desactivar JavaScript o enviar la petición a mano.

## Estructura clásica: `onsubmit="return validar()"`

El PDF asocia la validación al envío:

```html
<form action="alta.php" method="post" onsubmit="return validar(event)">
```

Si `validar` devuelve `false`, el formulario **no** se envía.

En código actual el equivalente es el evento `submit` + `preventDefault()`:

```javascript
const form = document.querySelector("#alta");

form.addEventListener("submit", (event) => {
  if (!validar(form)) {
    event.preventDefault();
  }
});
```

## Validaciones habituales (temario)

### Campo obligatorio

```javascript
function campoObligatorio(id, mensaje) {
  const valor = document.querySelector(id).value.trim();
  if (valor.length === 0) {
    alert(mensaje);
    return false;
  }
  return true;
}

function validar(form) {
  return campoObligatorio("#nombre", "El nombre no puede estar vacío");
}
```

`trim()` evita aceptar solo espacios. El atributo HTML `required` hace lo mismo sin JavaScript.

### Campo numérico

```javascript
function validaNumero(id) {
  const valor = document.querySelector(id).value.trim();
  if (valor === "" || Number.isNaN(Number(valor))) {
    alert("El campo tiene que ser numérico");
    return false;
  }
  return true;
}
```

`isNaN(" ")` es `false` en JavaScript clásico (convierte a 0). Por eso se comprueba la cadena vacía y se usa `Number(...)`. Mejor aún: `<input type="number">` o un patrón regex (apartado [5.6](expresiones-regulares.md)).

### Fecha

Construir un `Date` a partir de día, mes y año **y comprobar que no se ha “corregido”** (el 31 de febrero no existe):

```javascript
function validaFecha(dia, mes, ano) {
  const d = Number(dia);
  const m = Number(mes);
  const a = Number(ano);
  const fecha = new Date(a, m - 1, d); // mes 0–11

  const ok =
    fecha.getFullYear() === a &&
    fecha.getMonth() === m - 1 &&
    fecha.getDate() === d;

  if (!ok) {
    alert("La fecha no es correcta");
    return false;
  }
  return true;
}
```

Hoy es más simple `<input type="date">`: el valor es `YYYY-MM-DD` o cadena vacía.

### Checkbox (condiciones de uso)

```javascript
function validaCheck(id) {
  const elemento = document.querySelector(id);
  if (!elemento.checked) {
    alert("Debes aceptar las condiciones");
    return false;
  }
  return true;
}
```

## Validación HTML5 y Constraint Validation API

El navegador valida `required`, `type="email"`, `min`/`max`, `pattern`, etc. **antes** de disparar tu lógica si el form es inválido… salvo que uses `novalidate` o `form.noValidate = true`.

```html
<input
  id="cp"
  name="cp"
  type="text"
  required
  pattern="\d{5}"
  title="Cinco dígitos"
>
```

Desde JavaScript:

```javascript
const cp = document.querySelector("#cp");

cp.checkValidity();           // true / false
cp.validity.patternMismatch;  // no cumple pattern
cp.setCustomValidity("");     // limpia error propio
cp.setCustomValidity("CP no válido para esta provincia");
cp.reportValidity();          // muestra el globo del navegador
```

Ejemplo combinado: HTML5 + mensaje propio + evento `submit`.

```javascript
form.addEventListener("submit", (event) => {
  const dni = form.elements.dni;
  dni.setCustomValidity("");

  if (!esDniValido(dni.value)) {
    dni.setCustomValidity("DNI incorrecto (número o letra)");
  }

  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
  }
});
```

`setCustomValidity("")` hay que llamarlo cuando el dato **ya es válido**; si no, el campo permanece en error.

## Mensajes en la página (sin `alert`)

`alert` está en el temario y vale para prácticas cortas. En una interfaz usable muestra el error junto al campo:

```javascript
function mostrarError(input, texto) {
  const caja = document.querySelector("#errores");
  caja.textContent = texto;
  input.setAttribute("aria-invalid", "true");
  input.focus();
}
```

!!! tip "Probar (criterio h)"
    Casos mínimos: vacío, correcto, formato mal, checkbox sin marcar, envío con tecla :kbd:`Enter`. Mira la pestaña *Network* de DevTools: si has hecho `preventDefault()`, **no** debe haber petición HTTP.
