---
title: 4.4 Map y Set
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.4. `Map` y `Set`

Un [array](arrays.md) es una lista **ordenada por índice**: `coches[0]`, `coches.length`, un `for`. No resuelve otras dos necesidades:

- «¿Qué nota tiene Alex?» si la clave es el nombre, no la posición.
- «¿Ya he visto este valor?» sin guardar duplicados.

Para eso están `Map` y `Set`. Son objetos nativos, como `Date` o `JSON` (UT3), pero se entienden mejor **después** del array: se comparan con él.

## Cuándo usar cada uno

| Quieres… | Usas |
| --- | --- |
| Una lista ordenada, acceso por posición `0`, `1`, `2`… | **Array** |
| Una ficha con propiedades conocidas (`alumno.nombre`) | **Objeto** `{}` |
| Un diccionario cuyas claves aparecen en tiempo de ejecución | **`Map`** |
| Saber si un valor está, sin duplicados | **`Set`** |

`edades["Juan"] = 20` sobre un array **no** crea un array asociativo: añade una propiedad al objeto. Si las claves van a ir y venir, es un `Map`.

## 4.4.1. `Map`

Un **`Map`** asocia **claves** con **valores**. Se crea con `new Map()` y se maneja con métodos, no con la notación de punto.

Un objeto `{}` también guarda pares, pero sus claves acaban siendo cadenas (o símbolos). En un `Map` la clave puede ser un número, una cadena o un objeto, y se recuerda el orden en que se insertaron. El tamaño es `.size`, no `.length`.

| Método | Qué hace |
| --- | --- |
| `set(clave, valor)` | Añade o sustituye. Devuelve el propio `Map` |
| `get(clave)` | Devuelve el valor, o `undefined` si no está |
| `has(clave)` | ¿Existe esa clave? |
| `delete(clave)` | Quita el par. Devuelve `true` si existía |
| `clear()` | Vacía el mapa |

```javascript
const notas = new Map();
notas.set("Alex", 8);
notas.set("Luis", 6);
console.log(notas.get("Alex")); // 8
console.log(notas.has("Nora")); // false
console.log(notas.size);        // 2

notas.set("Alex", 9);           // sustituye: no hay dos "Alex"
console.log(notas.get("Alex")); // 9
```

`notas[0]` no es el primer elemento. No es un array: `Array.isArray(notas)` es `false`.

`for...of` recorre pares `[clave, valor]`, en el mismo orden en que se añadieron:

```javascript
for (const [nombre, nota] of notas) {
  console.log(nombre, nota);
}
```

`JSON.stringify` (UT3) **no** guarda las entradas: un `Map` sale como `{}`. Para persistirlo se pasa antes a una lista de pares y, al leer, se reconstruye:

```javascript
const texto = JSON.stringify([...notas]);
const recuperado = new Map(JSON.parse(texto));
console.log(recuperado.get("Luis")); // 6
```

`[...notas]` usa el [spread](arrays.md): despliega el `Map` en un array de pares, `[["Alex", 9], ["Luis", 6]]`. El array sí entra en JSON.

## 4.4.2. `Set`

Un **`Set`** es una colección de **valores únicos**. No hay clave ni índice: cada valor está o no está, una sola vez. Sirve para quitar duplicados de un array o para preguntar «¿ya lo he visto?» sin recorrer la lista.

Se crea con `new Set()`. Si le pasas un array, se queda con la primera aparición de cada valor y conserva ese orden. El tamaño también es `.size`.

| Método | Qué hace |
| --- | --- |
| `add(valor)` | Inserta. Si ya estaba, el conjunto no cambia |
| `has(valor)` | ¿Está ese valor? |
| `delete(valor)` | Lo quita. Devuelve `true` si estaba |
| `clear()` | Vacía el conjunto |

La igualdad es la de `===`: `5` y `"5"` cuentan como dos valores. `NaN` es la excepción: en un `Set` solo entra una vez.

```javascript
const vistos = new Set();
vistos.add("index.html");
vistos.add("app.js");
vistos.add("index.html");
console.log(vistos.size);          // 2
console.log(vistos.has("app.js")); // true
```

Quitar duplicados y volver a un array:

```javascript
const conDuplicados = ["Ana", "Luis", "Ana", "Nora"];
const unicos = [...new Set(conDuplicados)]; // spread: el Set vuelve a ser array
console.log(unicos); // ["Ana", "Luis", "Nora"]
```

`for...of` recorre los valores. Igual que el `Map`, `JSON.stringify(vistos)` no sirve: antes se convierte a array (`[...vistos]`) y al leer se hace `new Set(array)`.
