---
title: 5.6 Expresiones regulares
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.6. Expresiones regulares

Una **expresión regular** describe un patrón: «exactamente nueve dígitos», «tiene una arroba», «ocho cifras y la letra que corresponde». El criterio **g)** pide usarla para validar. En el [apartado 5.5](validacion.md) el DNI solo se miraba por longitud. Aquí se comprueba el formato y, en el DNI, la letra.

En JavaScript el patrón va entre barras:

```javascript
const soloNueveDigitos = /^\d{9}$/;

console.log(soloNueveDigitos.test("942123456")); // true
console.log(soloNueveDigitos.test("942-12-34")); // false
console.log(soloNueveDigitos.test("9421234567")); // false: sobra un dígito
```

`test` devuelve `true` o `false`. Es el método de este apartado. `cadena.match(patrón)` devuelve las coincidencias o `null`, y `cadena.replace(patrón, nuevo)` sustituye. El `replace` de la UT3, con un texto, sigue siendo válido; con una barra acepta un patrón.

También se puede construir desde una cadena, `new RegExp("^\\d{9}$")`. Dentro de las comillas la barra invertida se escribe dos veces, porque la cadena se queda con una. En los ejercicios se usa el literal entre barras.

## 5.6.1. Leer el patrón

El ejemplo de arriba se lee de izquierda a derecha:

| Trozo | Qué exige |
| --- | --- |
| `^` | El patrón empieza en el primer carácter. No vale un texto que solo contenga el número |
| `\d` | Un dígito, del 0 al 9 |
| `{9}` | El elemento anterior, nueve veces |
| `$` | Después no puede haber nada |

Sin `^` y `$`, `/\d{9}/` acepta `"tel 942123456 ext"`, porque el número aparece por el medio. Con los dos anclajes, la cadena entera tiene que ser el número.

El punto es un carácter cualquiera. Para exigir un punto de verdad se escribe `\.`:

```javascript
console.log(/a.b/.test("axb")); // true
console.log(/a\.b/.test("a.b")); // true
console.log(/a\.b/.test("axb")); // false
```

### Los símbolos que salen en las validaciones

| Símbolo | Significado |
| --- | --- |
| `^` `$` | Principio y fin de la cadena |
| `\d` | Un dígito |
| `\w` | Letra, dígito o `_` |
| `\s` | Espacio, tab o salto de línea |
| `.` | Cualquier carácter, salvo un salto de línea |
| `\.` | Un punto literal |
| `+` | Lo anterior, una o más veces |
| `*` | Lo anterior, cero o más veces |
| `?` | Lo anterior, cero veces o una |
| `{n}` | Lo anterior, exactamente *n* veces |
| `{n,}` | Lo anterior, *n* veces o más |
| `[abc]` | Uno de esos caracteres |
| `[a-z]` | Un carácter del rango |
| `[^abc]` | Un carácter que no esté en la lista |
| `x\|y` | `x` o `y` |
| `(abc)` | Agrupa, para aplicar `+`, `*` o `?` a varios caracteres a la vez |

Detrás de la barra de cierre puede ir una letra, la bandera:

| Bandera | Efecto |
| --- | --- |
| `i` | No distingue mayúsculas de minúsculas |
| `g` | Sustituye o busca todas las coincidencias, no solo la primera |

```javascript
console.log(/daw/.test("DAW2")); // false
console.log(/daw/i.test("DAW2")); // true

console.log("612 34-56".replace(/[\s.-]/g, "")); // "6123456"
```

`g` va bien en un `replace` que limpia el teléfono. No la pongas en un patrón que luego uses con `test` varias veces: el patrón recuerda por dónde se quedó y la segunda llamada puede devolver `false` con un texto que sí encaja.

Otros símbolos (`\D`, `\W`, `\b`, `m`, `u`) existen. Con los de la tabla se cubren el correo, el DNI, el teléfono y el código postal de este apartado.

## 5.6.2. El atributo `pattern`

El mismo patrón puede ir en el HTML, **sin** las barras. El navegador lo ancla solo, como si llevara `^` y `$`. `title` es la frase del globo:

```html
<label for="cp">Código postal</label>
<input id="cp" name="cp" type="text" pattern="[0-9]{5}" title="Cinco dígitos">
```

Eso es la comprobación automática del [apartado 5.5](validacion.md). Si el formulario lleva `novalidate`, el navegador no aplica `pattern` al enviar: hay que llamar a `test` en el `submit`. Si no lleva `novalidate`, un valor que no encaja muestra el globo y tu manejador de `submit` no llega a ejecutarse.

## 5.6.3. Validar datos concretos

Cada función recibe el texto del campo y devuelve `true` o `false`. El patrón se guarda en una constante: se crea una vez, no en cada tecla.

### Teléfono

Nueve dígitos, sin espacios:

```javascript
function validaTelefono(valor) {
  return /^\d{9}$/.test(valor.trim());
}

console.log(validaTelefono("942123456")); // true
console.log(validaTelefono("942 123 456")); // false
```

Para aceptar espacios, guiones y el prefijo `+34`, primero se limpia y luego se mira. `[6-9]` es el primer dígito de un móvil español. `\d{8}` son los ocho que faltan. `(\+34)?` es el prefijo, cero veces o una. El `+` va escapado porque solo, fuera del grupo, significaría «una o más»:

```javascript
function validaTelefonoFlexible(valor) {
  const limpio = valor.replace(/[\s.-]/g, "");
  return /^(\+34)?[6-9]\d{8}$/.test(limpio);
}

console.log(validaTelefonoFlexible("612 34-56-78")); // true
console.log(validaTelefonoFlexible("+34 612 345 678")); // true
console.log(validaTelefonoFlexible("512345678")); // false: no empieza por 6, 7, 8 ni 9
```

### Código postal

Los dos primeros dígitos son la provincia, del 01 al 52. Los tres últimos, el resto. No sirve cualquier bloque de cinco cifras: `00000` y `53000` no son provincias.

| Trozo | Provincias |
| --- | --- |
| `0[1-9]` | 01 a 09 |
| `[1-4]\d` | 10 a 49 |
| `5[0-2]` | 50, 51 y 52 |

La barra vertical elige uno de esos tres trozos. Luego `\d{3}`:

```javascript
function validaCP(valor) {
  return /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(valor.trim());
}

console.log(validaCP("39001")); // true
console.log(validaCP("53000")); // false
```

### Correo

Esta expresión es didáctica. Acepta los correos de clase y rechaza los que no tienen arroba o dominio. No cubre todas las direcciones reales, y no hace falta buscar «el patrón perfecto»: en un alta de verdad se junta `type="email"` con la comprobación del servidor.

Se lee así:

1. `^` y `$`: la cadena entera.
2. `\w+`: una o más letras, dígitos o `_`. Es el nombre.
3. `([.+-]\w+)*`: cero o más veces, un punto, un `+` o un guion, y otra palabra. Así entra `alex.martin` o `alex+clase`.
4. `@`.
5. `\w+`: el dominio.
6. `([.-]\w+)*`: trozos extra, como `.aula`.
7. `\.\w{2,}`: un punto y al menos dos caracteres (`es`, `com`).

```javascript
function validaEmail(valor) {
  const patron = /^\w+([.+-]\w+)*@\w+([.-]\w+)*\.\w{2,}$/;
  return patron.test(valor.trim());
}

console.log(validaEmail("alex.martin@aula.es")); // true
console.log(validaEmail("alex@aula")); // false: falta el punto y el dominio largo
console.log(validaEmail("alex aula.es")); // false: no hay @
```

### DNI

Ocho dígitos y una letra. La letra no es libre: es el carácter que ocupa, en esta cadena, la posición `número % 23`. El resto `%` es el de la UT2. `slice` y `charAt` son los de la UT3. `toUpperCase` admite que escriban la letra en minúscula.

```javascript
const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";

function validaDNI(valor) {
  const dni = valor.trim().toUpperCase();
  if (!/^\d{8}[A-Z]$/.test(dni)) {
    return false;
  }
  const numero = Number(dni.slice(0, 8));
  const letra = dni.charAt(8);
  return LETRAS_DNI.charAt(numero % 23) === letra;
}

console.log(validaDNI("12345678Z")); // true
console.log(validaDNI("12345678z")); // true: se pasa a mayúsculas
console.log(validaDNI("12345678A")); // false: la letra no corresponde
console.log(validaDNI("1234567Z")); // false: faltan cifras, no pasa el patrón
```

`12345678 % 23` es 14, y el carácter 14 de `LETRAS_DNI` es `Z`. Por eso `12345678A` falla aunque tenga ocho cifras y una letra. Esto sustituye la comprobación de «longitud 9» del apartado 5.5.

Un NIE empieza por `X`, `Y` o `Z`, sigue con siete dígitos y cierra con letra. Se valida igual que el DNI después de cambiar la inicial: `X` por `0`, `Y` por `1`, `Z` por `2`.

```javascript
function validaNIE(valor) {
  const nie = valor.trim().toUpperCase();
  if (!/^[XYZ]\d{7}[A-Z]$/.test(nie)) {
    return false;
  }
  let inicial = nie.charAt(0);
  if (inicial === "X") {
    inicial = "0";
  } else if (inicial === "Y") {
    inicial = "1";
  } else {
    inicial = "2";
  }
  return validaDNI(inicial + nie.slice(1));
}

console.log(validaNIE("X1234567L")); // true
console.log(validaNIE("X1234567A")); // false
```

## 5.6.4. Engancharlo al `submit`

El formulario es el del apartado 5.5: `method="get"`, `novalidate`, un párrafo `#errores` y el botón `type="submit"`. Los campos nuevos:

```html
<p>
  <label for="email">Correo</label>
  <input id="email" name="email" type="email">
</p>
<p>
  <label for="dni">DNI</label>
  <input id="dni" name="dni" type="text">
</p>
```

```javascript
form.addEventListener("submit", (event) => {
  const caja = document.querySelector("#errores");
  const email = form.elements.email.value.trim();
  const dni = form.elements.dni.value;
  caja.textContent = "";

  if (!validaEmail(email)) {
    event.preventDefault();
    caja.textContent = "El correo no tiene un formato reconocible";
    form.elements.email.focus();
    return;
  }
  if (!validaDNI(dni)) {
    event.preventDefault();
    caja.textContent = "El DNI no es válido";
    form.elements.dni.focus();
  }
});
```

`return` después del correo evita seguir y pintar el aviso del DNI encima. Si los dos pasan, no hay `preventDefault()` y el `get` sigue. Un `alert` en lugar del párrafo también cumple el temario; el párrafo deja el mensaje en la página, como en el 5.5.

## Errores frecuentes

| Qué se ve | Qué ha pasado |
| --- | --- |
| Un teléfono con espacios delante o detrás no pasa | El patrón está anclado. Hay que hacer `trim()` antes de `test` |
| Un texto largo con un número dentro se da por bueno | Faltan `^` y `$` |
| `validaEmail("alex@aula")` sale `true` | El patrón no exige `\.` y el dominio. El de este apartado sí lo exige |
| El DNI `12345678A` pasa | Solo se miró la longitud, como en el 5.5. Falta el resto `% 23` |
| La segunda llamada a `test` falla con un texto válido | El patrón lleva `g`. Quítala si solo preguntas sí o no |
| El `pattern` del HTML no avisa | El formulario tiene `novalidate`. Comprueba con `test` en el `submit`, o quita `novalidate` si quieres el globo automático |
| El `submit` no llega a `validaDNI` | Sin `novalidate`, otro campo `required` vacío frena antes. Es el caso del 5.5 |

!!! example "Prueba en el navegador"
    Pega en la consola `validaDNI("12345678Z")` y `validaDNI("12345678A")`: tienen que salir `true` y `false`. En el formulario, envía `alex@aula` y un DNI bueno: el párrafo habla del correo y la URL no cambia. Corrige el correo, deja el DNI en `12345678A` y envía: el aviso pasa a ser el DNI. Con los dos bien, la URL lleva `email` y `dni`.
