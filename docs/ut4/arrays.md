---
title: 4.3 Arrays
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.3. Arrays (matrices)

Un **array** es una colección **ordenada** de valores bajo un solo nombre. El acceso es por **índice** (posición). El primero es el **0**.

Características de JavaScript:

- **Dinámico:** crece y mengua; no fijas el tamaño de antemano.
- **Heterogéneo:** puede mezclar números, cadenas, objetos, otros arrays.
- Es un **objeto** (`typeof [] === "object"`). Para distinguirlo: `Array.isArray(x)`.

## Crear y acceder

```javascript
const coches = ["Seat", "Audi", "Renault"]; // literal (preferido)
const vacio = [];
const conHuecos = new Array(3); // 3 posiciones vacías: casi nunca lo quieras

console.log(coches[0]);      // "Seat"
console.log(coches.length);  // 3
coches[1] = "BMW";
```

Si asignas un índice **más allá** del final, el array se expande y `length` pasa a `índice + 1`. Las posiciones intermedias quedan *huecos* (`undefined`). Evítalo en ejercicios: rellena en orden o usa `push`.

```javascript
const ciudades = ["Santander", "Torrelavega"];
ciudades[4] = "Laredo";
console.log(ciudades.length); // 5
console.log(ciudades[2]);     // undefined
```

## Recorrer

```javascript
for (let i = 0; i < coches.length; i += 1) {
  console.log(i, coches[i]);
}

for (const coche of coches) {
  console.log(coche);
}
```

`for...of` recorre **valores**. `for...in` recorre claves (y puede incluir propiedades extra): no lo uses para arrays.

## Añadir y quitar

| Método | Efecto |
| --- | --- |
| `push(...x)` | Añade al **final**. Devuelve la nueva `length` |
| `pop()` | Quita el **último** |
| `unshift(...x)` | Añade al **principio** |
| `shift()` | Quita el **primero** |
| `splice(inicio, cuantos, ...nuevos)` | Quita y/o inserta en el medio |

```javascript
const cola = ["A", "B"];
cola.push("C");        // ["A", "B", "C"]
cola.shift();          // quita "A" → ["B", "C"]
cola.splice(1, 0, "X"); // inserta "X" en el índice 1 → ["B", "X", "C"]
```

!!! warning "`delete array[i]`"
    Deja un hueco `undefined` y **no** reduce `length`. Para borrar de verdad usa `splice`.

## Copiar y combinar (sin romper el original)

| Método | Efecto |
| --- | --- |
| `concat(otro)` | Une y **devuelve un array nuevo** |
| `slice(inicio, fin)` | Copia un trozo (`fin` no incluido) |
| `[...arr]` | Copia superficial (spread) |
| `join(sep)` | Convierte a cadena |
| `reverse()` / `sort()` | **Mutan** el array original |

```javascript
const a = [1, 2];
const b = [3, 4];
const juntos = a.concat(b); // a y b intactos
const copia = a.slice();

const nombres = ["Zoe", "Ana", "Luis"];
const ordenados = [...nombres].sort((x, y) => x.localeCompare(y, "es"));
```

`sort()` sin función compara **como texto** (`10` queda antes que `2`). Para números: `.sort((a, b) => a - b)`.

## Arrays de arrays (multidimensionales)

JavaScript no tiene matrices “nativas” de dos dimensiones: usas **arrays cuyos elementos son arrays**.

```javascript
const notas = [
  [7, 8, 9],
  [6, 5, 8],
];
console.log(notas[1][2]); // 8  → fila 1, columna 2
```

## Lo que no es un array

- `edades["Juan"] = 20` no crea un array asociativo: añade una **propiedad** a un objeto. Para clave/valor usa un **objeto** `{}` o un `Map`.
- `document.forms` / `document.images` son `HTMLCollection`: tienen `length` e índices, pero **no** todos los métodos de `Array`. Conviertes con `Array.from(document.images)`.

```javascript
console.log(Array.isArray(coches));          // true
console.log(Array.isArray({ 0: "a", length: 1 })); // false
```
