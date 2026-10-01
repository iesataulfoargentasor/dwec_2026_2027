---
title: 4.2 Funciones definidas por el usuario
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.2. Funciones definidas por el usuario

Una función es un **bloque con nombre** (o anónimo) que encapsula una tarea y se puede **llamar** las veces que haga falta.

En JavaScript no se pone `var` / `let` / `const` delante de los parámetros.

## Declaración clásica

```javascript
function saludar(nombre) {
  return `Hola, ${nombre}`;
}

console.log(saludar("Alex")); // "Hola, Alex"
```

`return` devuelve un valor y **termina** la función. Si no hay `return`, el resultado es `undefined`.

Las declaraciones `function nombre()` se **elevan** (*hoisting*): puedes llamarlas antes de la línea donde están escritas. Las constantes con función, no.

## Expresión y flecha

```javascript
const sumar = function (a, b) {
  return a + b;
};

const restar = (a, b) => a - b; // return implícito
const avisar = (msg) => {
  console.log(msg);
};
```

La **flecha** (`=>`) es la forma habitual en código actual para callbacks cortos. **No** tiene `this` propio (lo hereda del entorno): eso importa en métodos de objeto (apartado 4.7).

## Parámetros

```javascript
function ficha(nombre, grupo = "DAW2") {
  return `${nombre} (${grupo})`;
}

function media(...notas) {
  let suma = 0;
  let cuantas = 0;
  for (const n of notas) {
    suma += n;
    cuantas += 1;
  }
  if (cuantas === 0) {
    return 0;
  }
  return suma / cuantas;
}

console.log(ficha("Luis"));           // grupo por defecto
console.log(media(7, 8, 9, 6));
```

- **Valor por defecto:** `grupo = "DAW2"`.
- **Rest** (`...notas`): agrupa los argumentos que sobran. Se recorren con `for...of`, como la lista de la UT2. `length`, `push` y el resto de métodos del array están en el [apartado 4.3](arrays.md). El [spread](arrays.md) (`[...nombres]`) hace el camino contrario: despliega una lista en elementos sueltos.
- Un número o una cadena se pasan **por valor**: la función no cambia la variable de fuera. Un array sí se puede modificar desde la función; el ejemplo está junto a `push`, en el apartado 4.3.

## Ámbito y anidamiento

Dentro de la función, `const` / `let` son **locales**. Sin declaración, en modo no estricto se crea una global: **prohibido**.

```javascript
function exterior(x) {
  function interior(y) {
    return x + y; // cierra sobre x (closure)
  }
  return interior(10);
}

console.log(exterior(5)); // 15
```

Una función anidada puede usar las variables de la función que la envuelve: **cierre** (*closure*). Es la base de varios [patrones](patrones.md).

## Documentar (criterio k)

```javascript
/**
 * Calcula el IVA de un importe.
 * @param {number} base - Importe sin IVA
 * @param {number} [tipo=0.21] - Tipo impositivo
 * @returns {number} Importe con IVA
 */
function conIva(base, tipo = 0.21) {
  return base * (1 + tipo);
}
```

!!! warning "Nombres"
    No empieces el identificador por un dígito (`5Calculos` es `SyntaxError`). No reutilices el mismo nombre para una variable y una función en el mismo ámbito.
