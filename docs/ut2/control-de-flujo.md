---
title: 2.7 Estructuras de control de flujo
tags:
  - JavaScript
  - DWEC
  - RA2
---

# 2.7. Estructuras de control de flujo

En el documento original este apartado iba como 2.2. Aquí cierra la unidad: ya tienes tipos, variables y operadores; ahora **decides** y **repites**.

1. **Decisión:** qué sentencias se ejecutan (`if`, `switch`).
2. **Bucles:** repetir un número determinado o no (`while`, `do...while`, `for`, `for...of`).

## 2.7.1. Sentencia `if`

```javascript
if (condicion) {
  // código si es true
} else {
  // código si es false (opcional)
}
```

La condición se convierte a booleano. Escribe condiciones **explícitas** (`===`, `Number.isNaN`, `>`) en lugar de confiar en truthy/falsy, salvo que sepas muy bien qué estás comprobando.

```javascript
const nombre = prompt("Introduzca su nombre, por favor", "");

if (nombre === "Alicia") {
  console.log(`Hola ${nombre}`);
} else {
  console.log("¿Has visto a Alicia?");
}
```

Puedes encadenar `else if`:

```javascript
if (nota >= 9) {
  console.log("Sobresaliente");
} else if (nota >= 5) {
  console.log("Aprobado");
} else {
  console.log("Suspenso");
}
```

Las llaves `{ }` son **obligatorias en esta unidad** aunque el cuerpo tenga una sola línea. Evitas el error clásico de añadir una segunda sentencia y que quede fuera del `if`.

## 2.7.2. Sentencia `switch`

Cuando comparas **la misma expresión** con varios valores concretos, `switch` se lee mejor que un `if` anidado.

`switch` en JavaScript compara con **`===`** (identidad).

```javascript
const nombre = prompt("Introduzca su nombre por favor", "");

switch (nombre) {
  case "Alicia":
    console.log("Hola Alicia");
    break;
  case "Lewis":
    console.log("Hola Lewis");
    break;
  default:
    console.log(`Hola ${nombre}`);
}
```

`break` evita el *fall-through*: sin él, se ejecutarían también los `case` siguientes. A veces se omite a propósito para agrupar casos; si lo haces, coméntalo.

```javascript
switch (dia) {
  case "sábado":
  case "domingo":
    console.log("Fin de semana");
    break;
  default:
    console.log("Día laborable");
}
```

## 2.7.3. Bucle `while`

```javascript
while (condicion) {
  // código
}
```

Primero se evalúa la condición. Si parte siendo `false`, el cuerpo **no se ejecuta ni una vez**.

```javascript
let i = 0;
while (i < 5) {
  console.log(i);
  i += 1;
}
```

### `do...while`

El cuerpo se ejecuta **al menos una vez**; la condición se mira al final.

```javascript
let i = 0;
do {
  console.log(i);
  i += 1;
} while (i < 5);
```

### `break` y `continue`

- `break`: sale del bucle (o del `switch`).
- `continue`: salta al siguiente ciclo.

Úsalos con moderación: un bucle con varias salidas cuesta seguirlo en un examen y en una revisión de código.

## 2.7.4. Bucle `for`

```javascript
for (let i = inicio; i < limite; i += 1) {
  // código
}
```

1. Se inicializa el contador (`let i = 0`).
2. Se evalúa la condición.
3. Si es true, se ejecuta el cuerpo y se actualiza el contador.
4. Se vuelve al paso 2 hasta que la condición sea false.

```javascript
let m = "";
for (let i = 0; i < 5; i += 1) {
  m += `vuelta ${i}\n`;
}
console.log(m);
// console.log(i); // ReferenceError: i es de bloque
```

En el material antiguo `i` se declaraba (o ni eso) y **seguía existiendo** después del `for` por culpa de `var`. Con `let`, el contador muere con el bucle. Es lo que queremos.

## 2.7.5. `for...of` (recorrer valores)

Para recorrer **los valores** de una cadena o de un array, `for...of` es la forma actual. No necesitas un índice.

```javascript
const letras = "JS";
for (const letra of letras) {
  console.log(letra); // J , S
}

const numeros = [10, 20, 30];
for (const n of numeros) {
  console.log(n);
}
```

!!! warning "`for...in` no es lo mismo"
    `for...in` recorre **claves** de un objeto (y puede incluir propiedades heredadas). No lo uses para arrays en esta unidad. Si ves `for...in` sobre `[1,2,3]`, cámbialo a `for...of` o a un `for` con índice.

## Mini patrón: validar un número (consola + `prompt`)

Une tipos, operadores y `if`. Es el esqueleto del ejercicio clásico de lectura de números, actualizado.

```javascript
const bruto = prompt("Escribe un número");
const n = Number(bruto);

if (bruto === null) {
  console.log("Cancelado");
} else if (bruto.trim() === "") {
  console.log("No es un número");
} else if (Number.isNaN(n)) {
  console.log("No es un número");
} else {
  console.log("Es un número:", n);
}
```

## Cómo depurar estos bloques

1. Abre DevTools (`F12`) → **Console** y **Sources**.
2. Pon un `console.log` justo **antes** de la condición y **dentro** de cada rama.
3. En Sources puedes colocar un **breakpoint** en la línea del `if` o del `for` y ejecutar paso a paso (`F10`).

!!! success "Al terminar la UT2"
    Debes ser capaz de escribir un script con `const`/`let`, tipos bien identificados, comparaciones `===`, un `if` o `switch`, un bucle, comentarios y comprobarlo en la consola del navegador (y, si se pide, con `node archivo.js`).
