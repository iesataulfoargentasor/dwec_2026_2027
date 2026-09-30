---
title: 3.2 El objeto String
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.2. El objeto `String`

Las cadenas son primitivos. Al usar un método, JavaScript las trata como objeto `String` de forma temporal.

```javascript
const txt = "DWEC";
console.log(txt.length); // 4
```

`new String("hola")` crea un objeto: evítalo. Las plantillas (acento grave) ya las viste en la UT2.

## Propiedad esencial

`length` es la longitud. El primer carácter está en el índice `0`.

## Métodos que sí usamos

| Método | Qué hace |
| --- | --- |
| `charAt(i)` / `txt[i]` | Carácter en la posición `i` |
| `includes(trozo)` | ¿Contiene ese texto? |
| `startsWith` / `endsWith` | Prefijo / sufijo |
| `indexOf` / `lastIndexOf` | Primera / última aparición (−1 si no está) |
| `slice(inicio, fin)` | Extrae un trozo (`fin` no incluido) |
| `split(separador)` | Parte la cadena en trozos (esa lista se trabaja en la UT4) |
| `replace` / `replaceAll` | Sustituye |
| `toLowerCase` / `toUpperCase` | Mayúsculas y minúsculas |
| `trim()` | Quita espacios en los extremos |
| `padStart` / `padEnd` | Rellena hasta una longitud |
| `repeat(n)` | Repite |

`substring` existe; en código nuevo suele preferirse `slice` (acepta índices negativos).

`substr` está **obsoleto**: no lo uses.

Los métodos HTML del material antiguo (`bold()`, `italics()`, `fontcolor()`, `blink()`, `anchor()`, `link()`…) están obsoletos. El aspecto se cambia con **HTML + CSS**, no generando etiquetas desde el `String`.

## Ejemplo: palíndromo

Se lee la cadena del final al principio con un `for` (UT2) y `charAt`. Todavía no hace falta una función, ni expresiones regulares, ni métodos de array: eso llega en la UT4 y en la UT5.

```javascript
const frase = "Ana";
const normalizada = frase.toLowerCase().trim();
let reves = "";

for (let i = normalizada.length - 1; i >= 0; i -= 1) {
  reves += normalizada.charAt(i);
}

console.log(reves); // "ana"
if (normalizada === reves) {
  console.log(frase + " es un palindromo");
} else {
  console.log(frase + " no es un palindromo");
}
```

!!! example "Prueba en consola"
    Carga un `script` al final del `body` y abre DevTools (:kbd:`F12`). No hace falta `alert` para ver el resultado.
