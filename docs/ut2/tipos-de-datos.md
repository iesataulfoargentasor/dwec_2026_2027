---
title: 2.4 Tipos de datos
tags:
  - JavaScript
  - DWEC
  - RA2
---

# 2.4. Tipos de datos

Los tipos indican qué valores puede guardar una variable y qué operaciones tienen sentido con ella.

JavaScript distingue **tipos primitivos** y **objetos**.

| Categoría | Tipos |
| --- | --- |
| Primitivos | `number`, `bigint`, `string`, `boolean`, `undefined`, `null`, `symbol` |
| Objetos | todo lo demás: `Object`, `Array`, `Function`, `Date`, `Map`, `Set`… |

`typeof` consulta el tipo. Ojo con dos peculiaridades históricas que siguen vigentes:

```javascript
typeof 12;            // "number"
typeof 12.3;          // "number"
typeof "Hola";        // "string"
typeof true;          // "boolean"
typeof undefined;     // "undefined"
typeof null;          // "object"  ← peculiaridad del lenguaje
typeof { nombre: "David" }; // "object"
typeof [1, 2, 3];     // "object"
typeof console.log;   // "function"
```

!!! info "`typeof null === \"object\"`"
    Es un fallo del diseño original que ya no se corrige (rompería la web). Para comprobar `null` se usa `valor === null`.

## 2.4.1. Números (`number`)

Un único tipo IEEE-754 de **64 bits** cubre enteros y decimales. El separador decimal es el **punto**.

```javascript
const enteros = 10;
const pi = 3.14159265;
```

Literales en otras bases (la forma antigua `034` **está prohibida** en modo estricto):

```javascript
const decimal = 10;
const binario = 0b1010;      // 10
const octal = 0o34;          // 28
const hexadecimal = 0xA3;    // 163
```

### Valores especiales

- `Infinity` y `-Infinity`: desbordamiento o división por cero.
- `NaN` (*Not a Number*): el resultado de una operación numérica que no tiene sentido.

```javascript
console.log(3 / 0);          // Infinity
console.log(Number("hola")); // NaN
```

`NaN` no es igual a sí mismo (`NaN === NaN` es `false`). Para detectarlo usa **`Number.isNaN()`**, no el `isNaN()` clásico (este último convierte a número antes y da sorpresas).

```javascript
Number.isNaN(3);        // false
Number.isNaN(NaN);      // true
Number.isNaN("hola");   // false  ← no es el número NaN

isNaN("hola");          // true   ← conversión previa; evítalo
```

Enteros seguros: entre `Number.MIN_SAFE_INTEGER` y `Number.MAX_SAFE_INTEGER` (±(2<sup>53</sup> − 1)). Fuera de ese rango, usa `bigint`.

### Constantes de `Math`

| Constante | Significado |
| --- | --- |
| `Math.PI` | π |
| `Math.E` | Número e |
| `Math.LN2` / `Math.LN10` | Logaritmo natural de 2 y de 10 |
| `Math.SQRT2` | Raíz cuadrada de 2 |

```javascript
const radio = 4;
const area = Math.PI * radio ** 2;
```

`**` es la potencia (más claro que `Math.pow`).

## 2.4.2. Enteros grandes (`bigint`)

Para enteros que no caben en `number`. El literal lleva `n`:

```javascript
const grande = 9007199254740993n;
console.log(grande + 2n);
```

No se mezclan `bigint` y `number` en la misma operación: hay que convertir.

## 2.4.3. Cadenas de texto (`string`)

Una sucesión de caracteres Unicode. El primer carácter está en la posición `0`.

Comillas simples, dobles o **plantilla** (acento grave):

```javascript
const a = "hola";
const b = 'mundo';
const c = `hola ${b}`; // "hola mundo"
```

Las plantillas (`template literals`) permiten interpolación y saltos de línea reales:

```javascript
const frase = `hola mundo, esta es
una frase más larga`;
```

### Caracteres de escape (cuando usas `"..."` o `'...'`)

| Si quieres incluir… | Escribes |
| --- | --- |
| Nueva línea | `\n` |
| Tabulador | `\t` |
| Comilla simple | `\'` |
| Comilla doble | `\"` |
| Barra invertida | `\\` |

```javascript
const variable = "hola mundo, esta es\nuna frase más larga";
const mezclada = "hola 'mundo', esta es una \"frase\" más larga";
```

Con plantillas, las comillas simples y dobles no chocan:

```javascript
const mezclada = `hola 'mundo', esta es una "frase" más larga`;
```

## 2.4.4. Booleanos

Solo dos valores: `true` y `false`. No son cadenas ni números.

Al convertir un valor a booleano (por ejemplo con `Boolean(x)` o en un `if`):

| Se convierte a `false` (falsy) | Se convierte a `true` (truthy) |
| --- | --- |
| `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN` | Cualquier otro valor (`"0"`, `[]`, `{}`, `"hola"`…) |

```javascript
Boolean(0);      // false
Boolean(2);      // true
Boolean("");     // false
Boolean("hola"); // true
```

## 2.4.5. `undefined` y `null`

- **`undefined`**: ausencia de valor por defecto (variable declarada sin asignar, parámetro no pasado, propiedad que no existe).
- **`null`**: ausencia de valor **intencionada**. Lo asignas tú.

```javascript
let pendiente;
console.log(pendiente); // undefined

const vacio = null;
console.log(vacio);     // null
```

## 2.4.6. Conversiones entre tipos

JavaScript **coacciona** tipos con facilidad. Es una peculiaridad del lenguaje (criterio de evaluación del RA2) y la fuente habitual de bugs.

```javascript
"10" + 2;     // "102"  concatenación
"10" - 2;     // 8      el - fuerza número
Number("10"); // 10
Number("hola"); // NaN
String(12);   // "12"
Boolean(0);   // false
```

Regla de esta unidad: **convierte de forma explícita** (`Number`, `String`, `Boolean`) y compara con `===`. No dependas de que el motor “adivine”.

```javascript
const bruto = prompt("Escribe un número:");
const n = Number(bruto);

if (Number.isNaN(n)) {
  console.log("No es un número");
} else {
  console.log("Es un número:", n);
}
```

!!! warning "`prompt` siempre devuelve string (o `null`)"
    Si la persona pulsa Cancelar, obtienes `null`. `Number(null)` es `0`. Valida primero: `if (bruto === null) { ... }`.
