---
title: 5.6 Expresiones regulares
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.6. Expresiones regulares

Una **expresión regular** (*regex*) describe un **patrón**: “empieza por dígitos”, “parece un email”, “ocho números y una letra”. El criterio **g)** pide usarlas para facilitar la validación.

En JavaScript el literal va entre **barras**: `/^\d{9}$/`. También: `new RegExp("^\\d{9}$")`.

## 5.6.1. Metacaracteres

| Símbolo | Significado |
| --- | --- |
| `^` | Inicio de la cadena |
| `$` | Fin de la cadena |
| `*` | El elemento anterior **0 o más** veces |
| `+` | El elemento anterior **1 o más** veces |
| `?` | El elemento anterior **0 o 1** vez |
| `.` | Cualquier carácter (salvo salto de línea) |
| `x\|y` | `x` **o** `y` |
| `{n}` | Exactamente *n* veces |
| `{n,m}` | Entre *n* y *m* veces |
| `{n,}` | *n* o más veces |
| `[abc]` | Un carácter de la lista |
| `[^abc]` | Un carácter **que no** esté en la lista |
| `[a-z]` | Un rango |
| `\d` | Dígito `[0-9]` |
| `\D` | No dígito |
| `\w` | Letra, dígito o `_` |
| `\W` | No alfanumérico (según `\w`) |
| `\s` | Espacio en blanco (espacio, tab, salto…) |
| `\S` | No blanco |
| `\b` | Límite de palabra |
| `\B` | No límite de palabra |
| `\n` `\t` `\r` `\f` | Salto de línea, tab, retorno de carro, salto de página |

Para que un metacarácter sea **literal**, se escapa: `\.` es un punto, `\(` un paréntesis.

`^` y `$` anclan **toda** la cadena: `/^\d{9}$/` no acepta `" 123456789"` ni `"1234567890"`.

## Cómo se usa en JavaScript

```javascript
const soloNueveDigitos = /^\d{9}$/;

soloNueveDigitos.test("942123456");  // true
soloNueveDigitos.test("942-12-34");  // false

"DAW2".search(/daw/i);               // 0 (flag i = ignore case)
"hola 2026".match(/\d+/);            // ["2026"]
```

Métodos:

- **`regex.test(cadena)`:** `true` / `false` (el más usado en validación).
- **`cadena.match(regex)`:** coincidencias o `null`.
- **`cadena.replace(regex, nuevo)`:** sustituir.

Flags habituales detrás de la barra: `i` (mayúsculas/minúsculas), `g` (todas las coincidencias), `m` (`^`/`$` por línea), `u` (Unicode).

El atributo HTML **`pattern`** usa la misma sintaxis **sin** las barras y el navegador ancla solo (como si hubiera `^` y `$`):

```html
<input name="cp" pattern="[0-9]{5}" title="Cinco dígitos">
```

## 5.6.2. Validar un formulario con regex

### Correo electrónico

Una comprobación **didáctica** (no cubre todos los emails reales RFC):

```javascript
function validaEmail(valor) {
  const patron = /^\w+([.+-]\w+)*@\w+([.-]\w+)*\.\w{2,}$/;
  return patron.test(valor);
}
```

En producción combina `type="email"` con una comprobación en servidor. No intentes “el regex perfecto del email”.

### DNI español

Ocho dígitos y una letra; la letra se calcula con el resto de dividir el número entre 23.

```javascript
const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";

function validaDNI(valor) {
  const dni = valor.trim().toUpperCase();
  if (!/^\d{8}[A-Z]$/.test(dni)) {
    return false;
  }
  const numero = Number(dni.slice(0, 8));
  const letra = dni.charAt(8);
  return LETRAS_DNI[numero % 23] === letra;
}
```

NIE (X/Y/Z + 7 dígitos + letra) se valida igual tras sustituir X→0, Y→1, Z→2.

### Teléfono (9 dígitos)

```javascript
function validaTelefono(valor) {
  return /^\d{9}$/.test(valor.trim());
}
```

Variante más realista (espacios o guiones opcionales, prefijo +34):

```javascript
function validaTelefonoFlexible(valor) {
  const limpio = valor.replace(/[\s.-]/g, "");
  return /^(\+34)?[6-9]\d{8}$/.test(limpio);
}
```

### Código postal español

```javascript
function validaCP(valor) {
  return /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(valor.trim());
}
```

## Encaje con el evento `submit`

```javascript
form.addEventListener("submit", (event) => {
  const email = form.elements.email.value.trim();
  const dni = form.elements.dni.value;

  if (!validaEmail(email) || !validaDNI(dni)) {
    event.preventDefault();
    alert("Revisa el email y el DNI");
  }
});
```

!!! warning "Rendimiento y claridad"
    Compila el regex **una vez** (constante de módulo), no dentro de un `input` que se dispara en cada tecla, salvo que el patrón sea trivial. Nombra la función (`validaDNI`) y documenta qué acepta (criterio **h)**).
