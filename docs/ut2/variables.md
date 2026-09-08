---
title: 2.5 Variables
tags:
  - JavaScript
  - DWEC
  - RA2
---

# 2.5. Variables

Una variable es un nombre asociado a un valor. En JavaScript actual se declaran con **`const`** o **`let`**. `var` existe por historia del lenguaje; en código nuevo no lo usamos.

## 2.5.1. Declaración

```javascript
let variable1;
const variable2 = 10;
let variable3, variable4;
```

- **`const`**: no puedes reasignar el identificador. Es la opción **por defecto**.
- **`let`**: el valor puede cambiar. Úsalo solo cuando de verdad necesites reasignar (contadores, acumuladores).

```javascript
const iva = 0.21;
let total = 0;
total = 100 * (1 + iva);
```

`const` no hace “inmutable” el contenido de un objeto: impide `objeto = otro`, pero no `objeto.precio = 9`. Eso se verá con objetos.

### Nombres

- Empiezan por letra, `_` o `$`.
- Siguen letras, dígitos, `_` o `$`.
- camelCase: `nombreCompleto`, no `nombre_completo` (salvo convención de constantes “de verdad”: `const MAX_INTENTOS = 3`).

## 2.5.2. Inicialización

Con `let` puedes declarar sin valor (queda `undefined`). Con `const` **hay que** inicializar en la misma sentencia.

```javascript
let pendiente;
console.log(pendiente); // undefined

const fijo = 16;
// const error; // SyntaxError
```

### Lo que ya no hacemos: variables implícitas

En el material antiguo, asignar a un identificador no declarado creaba una **variable global**. En modo estricto (módulos y `"use strict"`) eso lanza `ReferenceError`. Aunque no uses modo estricto, **está prohibido** en esta unidad:

```javascript
"use strict";

function demo() {
  // mensaje = "hola"; // ReferenceError
  const mensaje = "hola";
  console.log(mensaje);
}
```

## 2.5.3. Ámbito (scope)

El ámbito es la zona del programa donde el identificador existe.

JavaScript actual distingue:

| Declaración | Ámbito |
| --- | --- |
| `const` / `let` | **Bloque** `{ ... }` (también función, `if`, `for`…) |
| `var` | **Función** (o global si está fuera). Ignora el bloque. |
| sin declaración | Global (prohibido) |

### Variable local de función / bloque

```javascript
function muestraMensaje() {
  const mensaje = "Mensaje de prueba";
  console.log(mensaje); // funciona
}

muestraMensaje();
console.log(mensaje); // ReferenceError: mensaje is not defined
```

`mensaje` solo existe dentro de la función.

### Variable global (del script)

Un `const` o `let` en el nivel superior del archivo es global **a ese script** (en el navegador, no se cuelga en `window` como hacía `var`).

```javascript
const mensaje = "Mensaje de prueba";

function muestraMensaje() {
  console.log(mensaje); // "Mensaje de prueba"
}
```

Cualquier función del mismo archivo puede leerla. Abusar de globales acopla el código: si una función solo necesita un valor, pásalo como **parámetro**.

### Sombra de nombres (shadowing)

Si hay colisión, **dentro del bloque gana la declaración local**:

```javascript
const mensaje = "gana la de fuera";

function muestraMensaje() {
  const mensaje = "gana la de dentro";
  console.log(mensaje); // gana la de dentro
}

console.log(mensaje); // gana la de fuera
muestraMensaje();
console.log(mensaje); // gana la de fuera
```

Si **reasignas** sin declarar dentro, modificas la de fuera (solo si era `let`, no `const`):

```javascript
let mensaje = "gana la de fuera";

function muestraMensaje() {
  mensaje = "gana la de dentro"; // toca la global
  console.log(mensaje);
}

console.log(mensaje); // gana la de fuera
muestraMensaje();
console.log(mensaje); // gana la de dentro
```

### Ámbito de bloque: `if` y `for`

Esta es la diferencia práctica con `var`:

```javascript
if (true) {
  const secreto = 42;
}
// console.log(secreto); // ReferenceError

for (let i = 0; i < 3; i++) {
  console.log(i);
}
// console.log(i); // ReferenceError  (con var, i seguiría existiendo)
```

### Zona muerta temporal (TDZ)

`let` y `const` no se pueden usar **antes** de su línea de declaración en ese bloque. No hay “hoisting usable” como con `var`.

```javascript
console.log(x); // ReferenceError
let x = 1;
```

!!! success "Regla de oro"
    1. `const` por defecto.  
    2. `let` si reasignas.  
    3. Nunca `var`.  
    4. Nunca crear identificadores sin `const`/`let`.  
    5. Declara las variables lo más cerca posible de su uso, en el bloque más pequeño que tenga sentido.
