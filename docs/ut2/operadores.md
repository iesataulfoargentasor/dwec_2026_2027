---
title: 2.6 Operadores
tags:
  - JavaScript
  - DWEC
  - RA2
---

# 2.6. Operadores

Los operadores combinan o modifican valores. En el documento original este apartado iba numerado como 2.1; aquí sigue **después de las variables**, que es el orden en el que se necesitan.

## 2.6.1. Operadores aritméticos

Suma `+`, resta `-`, multiplicación `*`, división `/`, resto `%` y potencia `**`.

```javascript
const numero1 = 10;
const numero2 = 5;

console.log(numero1 / numero2); // 2
console.log(3 + numero1);       // 13
console.log(numero2 - 4);       // 1
console.log(numero1 * numero2); // 50
console.log(2 ** 3);            // 8
```

El **módulo** `%` es el resto de la división entera, no un tanto por ciento:

```javascript
console.log(10 % 5); // 0
console.log(9 % 5);  // 4
```

### Asignación combinada

```javascript
let numero1 = 5;
numero1 += 3; // 8
numero1 -= 1; // 7
numero1 *= 2; // 14
numero1 /= 2; // 7
numero1 %= 3; // 1
numero1 **= 2; // 1
```

### Incremento y decremento

`++` y `--` solo tienen sentido con variables numéricas que puedas reasignar (`let`).

```javascript
let numero = 5;
++numero;
console.log(numero); // 6
```

Equivalente a `numero = numero + 1`.

**Prefijo** (`++numero`): incrementa *antes* de usar el valor.  
**Sufijo** (`numero++`): usa el valor *y después* incrementa.

```javascript
let numero1 = 5;
const numero2 = 2;

let numero3 = numero1++ + numero2;
// numero3 = 7, numero1 = 6

numero1 = 5;
numero3 = ++numero1 + numero2;
// numero3 = 8, numero1 = 6
```

!!! tip "En bucles"
    Prefiere `i += 1` o el `i++` del `for` clásico. Evita mezclar `++` dentro de expresiones largas: cuesta leerlo y se examina mal.

## 2.6.2. Operadores lógicos

### Negación `!`

Invierte el valor **booleano**. Si el operando no es booleano, JavaScript lo convierte (truthy / falsy) y luego niega.

```javascript
const visible = true;
console.log(!visible); // false

let cantidad = 0;
console.log(!cantidad); // true  (0 es falsy)

cantidad = 2;
console.log(!cantidad); // false

let mensaje = "";
console.log(!mensaje);  // true  (cadena vacía)

mensaje = "hola mundo";
console.log(!mensaje);  // false
```

| `variable` | `!variable` |
| --- | --- |
| `true` | `false` |
| `false` | `true` |

### AND `&&` y OR `||`

`&&` es `true` solo si **ambos** operandos son truthy.  
`||` es `true` si **alguno** es truthy.

Además, en JavaScript **devuelven un operando**, no necesariamente `true`/`false`. Se evalúan en cortocircuito: `&&` no evalúa la derecha si la izquierda es falsy; `||` no evalúa la derecha si la izquierda es truthy.

```javascript
const valor1 = true;
const valor2 = false;

console.log(valor1 && valor2); // false
console.log(valor1 || valor2); // true
```

| A | B | A `&&` B | A `\|\|` B |
| --- | --- | --- | --- |
| true | true | true | true |
| true | false | false | true |
| false | true | false | true |
| false | false | false | false |

### Nulo: `??`

El **nullish coalescing** `??` solo sustituye `null` o `undefined`. No trata `0` ni `""` como “vacío”, a diferencia de `||`.

```javascript
const contador = 0;
console.log(contador || 10); // 10  ← suele ser un bug
console.log(contador ?? 10); // 0   ← correcto
```

## 2.6.3. Operadores de asignación

`=` asigna. No confundir con `==` ni con `===`.

```javascript
const numero1 = 3;
const variable1 = "hola mundo";
```

## 2.6.4. Operadores relacionales

`>`, `<`, `>=`, `<=`, igualdad abstracta `==`, desigualdad `!=`, **idéntico** `===` y **no idéntico** `!==`.

El resultado es siempre un booleano.

```javascript
const numero1 = 3;
const numero2 = 5;

console.log(numero1 > numero2);  // false
console.log(numero1 < numero2);  // true
console.log(5 >= 5);             // true
console.log(5 === 5);            // true
console.log(5 !== 5);            // false
```

### La trampa de `=` frente a `===`

```javascript
let numero1 = 5;
const resultadoMal = (numero1 = 3); // asigna 3; resultadoMal es 3
const resultadoBien = numero1 === 3; // compara; true o false
```

### `==` contra `===`

`==` **convierte tipos** antes de comparar. `===` compara valor **y** tipo, sin conversión.

```javascript
const variable1 = 10;
const variable2 = "10";

console.log(variable1 == variable2);  // true  ← coerción
console.log(variable1 === variable2); // false ← tipos distintos
```

!!! failure "Regla de esta unidad"
    Compara siempre con `===` y `!==`. Si necesitas comparar un string de `prompt` con un número, convierte tú: `Number(texto) === 10`.

Las cadenas se comparan lexicográficamente (Unicode). Mayúsculas van antes que minúsculas: `A < B < … < Z < a < b < …`.

```javascript
const texto1 = "hola";
const texto2 = "hola";
const texto3 = "adios";

console.log(texto1 === texto3); // false
console.log(texto1 === texto2); // true
```

## 2.6.5. Operador condicional (ternario)

`condición ? valorSiTrue : valorSiFalse` es un `if`/`else` en forma de **expresión** (devuelve un valor).

```javascript
const bruto = prompt("Introduce un número:");
const numero = Number(bruto);

const texto =
  numero < 10
    ? "El número introducido es menor que 10"
    : "El número introducido es igual o mayor que 10";

console.log(texto);
```

Equivalente:

```javascript
if (numero < 10) {
  console.log("El número introducido es menor que 10");
} else {
  console.log("El número introducido es igual o mayor que 10");
}
```

## 2.6.6. Encadenamiento opcional `?.`

Si un valor puede ser `null` o `undefined`, `?.` evita el error al acceder a una propiedad:

```javascript
const usuario = null;
console.log(usuario?.nombre); // undefined, no TypeError
```

Lo usarás más con objetos y el DOM; de momento basta saber que existe.

!!! example "Prioridad"
    Los operadores tienen precedencia (`**` antes que `*`, `*` antes que `+`, etc.). En caso de duda, **usa paréntesis**. El código claro vale más que ahorrarse dos caracteres.
