---
title: 5.5 Validación y envío
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.5. Validación y envío

La persona puede dejar el nombre vacío, escribir letras donde se espera un número o no aceptar las condiciones. **Validar en el cliente** avisa en el momento y evita un envío inútil. El criterio **f)** pide hacer esa comprobación **con eventos**, en la práctica con `submit`.

Esa comprobación no sustituye a la del servidor. Quien quiera puede desactivar JavaScript o enviar la petición a mano. El servidor tiene que volver a mirar los datos.

Del [5.4](apariencia-comportamiento.md) importa esto: el evento `submit` solo corre si el envío es el de un botón `type="submit"` o el de `requestSubmit()`. `form.submit()` se lo salta, y con él se saltaría también todo este apartado.

Hay dos caminos. El primero lo escribes tú y encaja con el temario clásico (`return false`, `alert`). El segundo lo hace el navegador con `required` y la API de restricción. Los dos se pueden juntar. Las expresiones regulares, para el formato fino del DNI o del teléfono, son el [apartado 5.6](expresiones-regulares.md).

## 5.5.1. El evento `submit` decide si se envía

El manejador va en el `<form>`, no en el botón. Si la función dice que no es válido, `preventDefault()` corta el envío. La página no cambia y la URL no recibe los datos.

En código antiguo el corte iba en el propio HTML. Si `validar` devuelve `false`, el navegador no envía:

```html
<form id="alta" method="get" onsubmit="return validar()">
```

```javascript
function validar() {
  return false;
}
```

`onsubmit="validar()"` sin `return` llama a la función y envía igual, aunque la función devuelva `false`. El `return` del atributo es el que el navegador consulta.

En el script, el equivalente es el evento. `validar` devuelve `true` o `false`. Solo se cancela cuando toca:

```javascript
const form = document.querySelector("#alta");

form.addEventListener("submit", (event) => {
  if (!validar(form)) {
    event.preventDefault();
  }
});
```

Con `method="get"`, cancelar se ve en la barra de direcciones: no aparece `?nombre=…`. Si `action` apuntara a un servidor, la pestaña *Network* de DevTools tampoco mostraría la petición. La tecla Intro dentro de un campo también dispara `submit`: pruébala, no solo el botón.

## 5.5.2. Las comprobaciones del temario

Esta es la página. El aviso sale en `#errores`, no en un `alert`, para que se pueda leer junto al campo. `alert` vale para un ejercicio corto: en vez de escribir en el párrafo, se llama a `alert(mensaje)` y se hace `return false`. El resto de la función no cambia.

`trim()` (UT3) quita espacios de los extremos. Un nombre de tres espacios no cuenta como relleno. `textContent` escribe el aviso. `focus()` coloca el cursor en el campo que ha fallado.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Alta</title>
  </head>
  <body>
    <form id="alta" method="get" novalidate>
      <p>
        <label for="nombre">Nombre</label>
        <input id="nombre" name="nombre" type="text">
      </p>
      <p>
        <label for="edad">Edad</label>
        <input id="edad" name="edad" type="text">
      </p>
      <p>
        <label for="dia">Día</label>
        <input id="dia" name="dia" type="text" size="2">
        <label for="mes">Mes</label>
        <input id="mes" name="mes" type="text" size="2">
        <label for="ano">Año</label>
        <input id="ano" name="ano" type="text" size="4">
      </p>
      <p>
        <label>
          <input id="condiciones" name="condiciones" type="checkbox" value="si">
          Acepto las condiciones
        </label>
      </p>
      <p id="errores"></p>
      <button type="submit">Enviar</button>
    </form>
    <script src="alta.js"></script>
  </body>
</html>
```

`novalidate` (apartado 5.3) apaga la comprobación automática del navegador. Así el `submit` siempre llega a tu función y el mensaje lo decides tú. Sin ese atributo, un `required` vacío ni siquiera entra en el manejador: el navegador lo frena antes.

Cada función mira un control y devuelve `true` o `false`. `validar` las encadena. A la primera que falle, se para y el formulario no se envía.

```javascript
function mostrarError(campo, mensaje) {
  const caja = document.querySelector("#errores");
  caja.textContent = mensaje;
  campo.focus();
}

function limpiarError() {
  document.querySelector("#errores").textContent = "";
}

function campoObligatorio(campo, mensaje) {
  if (campo.value.trim().length === 0) {
    mostrarError(campo, mensaje);
    return false;
  }
  return true;
}

function validaNumero(campo) {
  const valor = campo.value.trim();
  if (valor.length === 0 || Number.isNaN(Number(valor))) {
    mostrarError(campo, "La edad tiene que ser un número");
    return false;
  }
  return true;
}

function validaFecha(dia, mes, ano) {
  const d = Number(dia);
  const m = Number(mes);
  const a = Number(ano);
  const fecha = new Date(a, m - 1, d);

  const ok =
    fecha.getFullYear() === a &&
    fecha.getMonth() === m - 1 &&
    fecha.getDate() === d;

  return ok;
}

function validaCheck(campo) {
  if (!campo.checked) {
    mostrarError(campo, "Debes aceptar las condiciones");
    return false;
  }
  return true;
}

function validar(form) {
  limpiarError();

  if (!campoObligatorio(form.elements.nombre, "El nombre no puede estar vacío")) {
    return false;
  }
  if (!validaNumero(form.elements.edad)) {
    return false;
  }
  if (!validaFecha(form.elements.dia.value, form.elements.mes.value, form.elements.ano.value)) {
    mostrarError(form.elements.dia, "La fecha no existe");
    return false;
  }
  if (!validaCheck(form.elements.condiciones)) {
    return false;
  }
  return true;
}

document.querySelector("#alta").addEventListener("submit", (event) => {
  const form = event.currentTarget;
  if (!validar(form)) {
    event.preventDefault();
  }
});
```

Qué está comprobando cada una:

- **Nombre.** Después de `trim`, la longitud 0 es vacío.
- **Edad.** `Number("")` y `Number(" ")` valen `0`, no `NaN`. Por eso el vacío se mira antes. `Number("20")` es `20`. `Number("veinte")` es `NaN`, y `Number.isNaN` (UT3) lo detecta. Un `<input type="number">` hace esta criba en el navegador; aquí el campo es `text` para ver la función.
- **Fecha.** `new Date(año, mes, día)` «arregla» los días imposibles: el 31 de febrero pasa a ser marzo. El mes del constructor empieza en 0 (UT3), por eso se resta 1. Si al leer la fecha el año, el mes o el día no coinciden con lo escrito, esa fecha no existía. `validaFecha("31", "2", "2026")` devuelve `false`. `validaFecha("28", "2", "2026")` devuelve `true`.
- **Condiciones.** Se mira `checked`, no `value`. Desmarcada, el envío se corta.

Si las cuatro pasan, `validar` devuelve `true`, no hay `preventDefault()` y el `get` sigue. La URL lleva `nombre`, `edad`, `dia`, `mes`, `ano` y `condiciones=si`.

Con `<input type="date">` el navegador ya no deja elegir un 31 de febrero, y `value` es la cadena `"2026-02-28"` o `""` (apartado 5.3). La función de los tres cuadros hace falta cuando el día, el mes y el año son campos separados.

## 5.5.3. Lo que el navegador comprueba solo

Sin `novalidate`, y con el botón `type="submit"` o con `requestSubmit()`, el navegador revisa antes de llamar a tu `submit`:

| Atributo o tipo | Qué exige |
| --- | --- |
| `required` | Que no esté vacío |
| `type="email"` | Un formato básico de correo |
| `min` / `max` | El número dentro del tramo, en un `type="number"` |
| `minlength` / `maxlength` | La longitud del texto |

Si falla, muestra su globo y **tu manejador no se ejecuta**. Para combinar el globo con un mensaje tuyo se usa la API de restricción, en el apartado siguiente. El atributo `pattern` es una expresión regular: se ve en el 5.6.

Estas propiedades leen el resultado. No muestran el globo:

| Propiedad | `true` cuando… |
| --- | --- |
| `campo.checkValidity()` | El control cumple todo lo que tiene puesto |
| `campo.validity.valueMissing` | Está vacío y es `required` |
| `campo.validity.typeMismatch` | No encaja con el `type` (`email`, `number`…) |
| `campo.validity.rangeUnderflow` / `rangeOverflow` | Está por debajo de `min` o por encima de `max` |
| `campo.validity.tooShort` / `tooLong` | No llega a `minlength` o se pasa de `maxlength` |
| `form.checkValidity()` | Todos los controles del formulario cumplen |

`reportValidity()` hace la misma comprobación y, si falla, enseña el globo.

## 5.5.4. Un mensaje propio en el globo

`setCustomValidity(texto)` marca el control como inválido y guarda ese texto. `setCustomValidity("")` lo limpia. Hay que limpiarlo **al empezar** cada envío: si el texto se queda de la vez anterior, el campo sigue en error aunque ahora sea correcto.

El DNI, de momento, se mira por longitud: 8 cifras y una letra son 9 caracteres. La letra que corresponde al número es el apartado 5.6.

El formulario **sigue con** `novalidate`. Ese atributo solo apaga el freno automático; `checkValidity()` y `reportValidity()` siguen funcionando. Si quitas `novalidate`, un DNI vacío no entra en tu manejador y no puedes poner el mensaje propio. Añade el campo:

```html
<p>
  <label for="dni">DNI</label>
  <input id="dni" name="dni" type="text" required minlength="9" maxlength="9">
</p>
```

Este manejador sustituye al del apartado anterior si quieres el globo del navegador en lugar del párrafo `#errores`. Dentro, puedes seguir llamando a `validar(form)` antes de mirar el DNI.

```javascript
form.addEventListener("submit", (event) => {
  const dni = form.elements.dni;
  dni.setCustomValidity("");

  if (dni.value.trim().length !== 9) {
    dni.setCustomValidity("El DNI tiene 8 números y una letra");
  }

  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
  }
});
```

Orden de una pulsación:

1. Con `novalidate`, el `submit` siempre llega a esta función.
2. Se borra el mensaje propio de la vez anterior.
3. Longitud distinta de 9: el control queda inválido con tu frase. Longitud 9: se queda limpio, y `required` sigue contando dentro de `checkValidity()`.
4. Si algún control falla, `preventDefault()` evita el `get` y `reportValidity()` enseña el globo. Si todos pasan, el `get` sigue.

Un DNI vacío o de 8 caracteres no cambia la página. Uno de 9 caracteres, con el resto del formulario válido, sí se envía. Que esas 9 posiciones sean cifras y una letra de verdad se completa en el 5.6.

## Errores frecuentes

| Qué se ve | Qué ha pasado |
| --- | --- |
| El formulario se envía aunque `validar` devuelva `false` | El atributo es `onsubmit="validar()"` sin `return`, o en el script falta `preventDefault()` |
| Tu `submit` no llega con un campo `required` vacío | Falta `novalidate`. Sin él, el navegador frena antes del manejador y no puedes poner ni el párrafo ni `setCustomValidity` |
| El nombre `"   "` pasa la prueba | Falta `trim()` |
| La edad `0` o un cuadro vacío cuela como número | `Number("")` es `0`. Hay que mirar la cadena vacía antes de `Number.isNaN` |
| El 31 de febrero se da por bueno | No se ha comparado el `Date` con el día, el mes y el año escritos |
| El DNI sigue en error después de corregirlo | No se ha llamado a `setCustomValidity("")` al empezar el envío |
| `form.submit()` se salta toda la validación | Es el método del 5.4. El envío de este apartado es el botón `type="submit"` o `requestSubmit()` |

!!! example "Prueba en el navegador"
    Abre `alta.html`. Envía vacío: el párrafo tiene que decir que el nombre falta y la URL no cambia. Rellena nombre y edad, deja la fecha en 31, 2 y 2026, y marca las condiciones: el aviso es la fecha. Corrige a 28, 2 y 2026 y envía: la URL lleva los cuatro datos. Repite el vacío pulsando Intro dentro del nombre.
