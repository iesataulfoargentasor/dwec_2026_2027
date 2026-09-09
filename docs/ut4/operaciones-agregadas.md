---
title: 4.4 Operaciones agregadas
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.4. Operaciones agregadas sobre colecciones

El criterio **e)** pide manejar la información de una colección con **operaciones agregadas**: en lugar de un `for` que lo hace todo, aplicas una función a **cada elemento** y obtienes un resultado (otra lista, un sí/no, un acumulado).

En JavaScript actual eso son métodos de `Array`. Reciben una **función callback**.

```javascript
const notas = [7, 4, 9, 5, 10];
```

## Recorrer: `forEach`

Ejecuta la función por cada elemento. **No** construye un array nuevo.

```javascript
notas.forEach((n, i) => {
  console.log(`#${i}: ${n}`);
});
```

## Transformar: `map`

Devuelve un **array nuevo** con el mismo número de elementos, transformados.

```javascript
const conCiento = notas.map((n) => n * 10);
console.log(conCiento); // [70, 40, 90, 50, 100]
```

## Filtrar: `filter`

Devuelve un array nuevo solo con los que cumplen la condición.

```javascript
const aprobados = notas.filter((n) => n >= 5);
console.log(aprobados); // [7, 9, 5, 10]
```

## Reducir: `reduce`

Acumula un único valor (suma, objeto, cadena…).

```javascript
const suma = notas.reduce((acum, n) => acum + n, 0);
const media = suma / notas.length;
console.log(media);
```

El segundo argumento de `reduce` (`0`) es el **valor inicial** del acumulador. Sin él, el primer elemento hace de inicial y el bucle empieza en el segundo: en arrays vacíos fallaría.

## Consultar

| Método | Resultado |
| --- | --- |
| `find(fn)` | Primer elemento que cumple, o `undefined` |
| `findIndex(fn)` | Índice, o `-1` |
| `some(fn)` | `true` si **alguno** cumple |
| `every(fn)` | `true` si **todos** cumplen |
| `includes(valor)` | ¿Está ese valor (`===`)? |

```javascript
console.log(notas.find((n) => n >= 9));   // 9
console.log(notas.some((n) => n < 5));    // true
console.log(notas.every((n) => n >= 0));  // true
console.log(notas.includes(10));          // true
```

## Encadenar

Las operaciones se combinan. El array original **no cambia** si usas `map`/`filter` (son inmutables en ese sentido).

```javascript
const mediaAprobados = notas
  .filter((n) => n >= 5)
  .reduce((acum, n, _, arr) => acum + n / arr.length, 0);

console.log(mediaAprobados);
```

## Ejemplo con objetos

```javascript
const grupo = [
  { nombre: "Alex", nota: 8 },
  { nombre: "Luis", nota: 4 },
  { nombre: "Mar", nota: 9 },
];

const nombresAprobados = grupo
  .filter((a) => a.nota >= 5)
  .map((a) => a.nombre);

console.log(nombresAprobados); // ["Alex", "Mar"]
```

!!! tip "Depurar un encadenamiento"
    En DevTools, pon un punto de interrupción **dentro** del callback, o parte la cadena en constantes intermedias (`const filtrados = …`) y haz `console.table(filtrados)`.
