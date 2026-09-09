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
| `split(separador)` | Parte en un array |
| `replace` / `replaceAll` | Sustituye |
| `toLowerCase` / `toUpperCase` | Mayúsculas y minúsculas |
| `trim()` | Quita espacios en los extremos |
| `padStart` / `padEnd` | Rellena hasta una longitud |
| `repeat(n)` | Repite |

`substring` existe; en código nuevo suele preferirse `slice` (acepta índices negativos).

`substr` está **obsoleto**: no lo uses.

Los métodos HTML del material antiguo (`bold()`, `italics()`, `fontcolor()`, `blink()`, `anchor()`, `link()`…) están obsoletos. El aspecto se cambia con **HTML + CSS**, no generando etiquetas desde el `String`.

## Ejemplo: palíndromo

Misma idea que el apunte original, con `const`, `replace` y `console.log`.

```javascript
function palindromo(cadena) {
  const normalizada = cadena
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita tildes
    .replace(/[^a-z0-9]/g, "");     // quita espacios y signos

  const reves = [...normalizada].reverse().join("");
  const esPal = normalizada === reves;

  return esPal
    ? `La cadena "${cadena}" es un palíndromo`
    : `La cadena "${cadena}" no es un palíndromo`;
}

console.log(palindromo("La ruta nos aporto otro paso natural"));
console.log(palindromo("Esta frase no se parece a ningun palindromo"));
```

`[...cadena]` parte en caracteres (mejor que `split("")` con emojis). En ejercicios de clase, `split("")` basta.

!!! example "Prueba en consola"
    Carga un `script` al final del `body` y abre DevTools (:kbd:`F12`). No hace falta `alert` para ver el resultado.
