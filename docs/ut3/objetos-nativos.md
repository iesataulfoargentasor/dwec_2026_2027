---
title: 3.1 Objetos nativos
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.1. Objetos nativos de JavaScript

Los objetos **nativos** los define ECMAScript. No dependen de Chrome o Firefox: los usas igual en el navegador y en Node.js.

Los de esta unidad: **`Date`**, **`Math`**, **`Number`** y **`JSON`**, más **`String`** en el apartado siguiente. **`Array`**, **`Map`** y **`Set`** se trabajan en la UT4, cuando ya tienes la lista con índice.

No hace falta `new Object()` para trabajar con ellos. Un número o una cadena **primitivos** se “envuelven” automáticamente cuando llamas a un método (`(3.14).toFixed(1)`). Evita `new Number()` y `new String()`: complican las comparaciones con `===`.

```javascript
const ahora = new Date();
console.log(Math.PI);
console.log((12.348).toFixed(2)); // "12.35"
```

## 3.1.1. El objeto `Date`

Representa un instante (milisegundos desde el 1 de enero de 1970 UTC, el *epoch* Unix).

```javascript
const ahora = new Date();                 // instante actual
const concreta = new Date(2026, 8, 9);    // 9 de septiembre de 2026 (el mes es 0-11)
const iso = new Date("2026-09-09T12:00:00");
```

!!! warning "El mes empieza en 0"
    `getMonth()` y el constructor `new Date(año, mes, día)` usan **0 = enero** y **11 = diciembre**. Es la trampa clásica de `Date`.

`Date` no tiene propiedades de instancia útiles; se trabaja con **métodos**.

| Método | Qué devuelve |
| --- | --- |
| `getFullYear()` | Año de cuatro cifras |
| `getMonth()` | Mes (0–11) |
| `getDate()` | Día del mes (1–31) |
| `getDay()` | Día de la semana (0 = domingo … 6 = sábado) |
| `getHours()`, `getMinutes()`, `getSeconds()`, `getMilliseconds()` | Hora local |
| `getTime()` | Milisegundos desde el epoch |
| `toISOString()` | Cadena ISO 8601 en UTC |
| `toLocaleDateString("es-ES")` | Fecha según la configuración regional |

Los `setFullYear`, `setMonth`, `setDate`, `setHours`… modifican el instante. Prefiere `getFullYear()`; `getYear()` está **obsoleto**. Igual con `toUTCString()` frente a `toGMTString()`.

```javascript
function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, "0");
  const min = String(fecha.getMinutes()).padStart(2, "0");
  const seg = String(fecha.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${anio} ${hora}:${min}:${seg}`;
}

const ahora = new Date();
console.log("Hoy es", formatearFecha(ahora));
```

Para mostrar fechas “como en España” sin reinventar el formato:

```javascript
const ahora = new Date();
console.log(
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(ahora)
);
```

## 3.1.2. El objeto `Math`

`Math` **no se instancia**. Todas las constantes y funciones se llaman sobre `Math` directamente.

Constantes habituales: `Math.PI`, `Math.E`, `Math.SQRT2`, `Math.LN10`…

| Método | Uso |
| --- | --- |
| `abs(x)` | Valor absoluto |
| `ceil(x)` / `floor(x)` / `round(x)` / `trunc(x)` | Redondeos |
| `max(...)` / `min(...)` | Mayor / menor |
| `pow(x, y)` | Potencia (equivalente a `x ** y`) |
| `sqrt(x)` | Raíz cuadrada |
| `random()` | Pseudoaleatorio en `[0, 1)` |

```javascript
const num = 27.6;
console.log(num);
console.log("floor:", Math.floor(num)); // 27
console.log("ceil:", Math.ceil(num));   // 28
console.log("round:", Math.round(num)); // 28
console.log("trunc:", Math.trunc(num)); // 27

console.log("Aleatorio [0, 1):", Math.random());
console.log("Entero 0–10:", Math.floor(Math.random() * 11));
console.log("PI:", Math.PI);
console.log("abs(-55):", Math.abs(-55));
```

## 3.1.3. El objeto `Number`

En el día a día usas literales (`const n = 6.257`). El objeto `Number` aporta **constantes** y **métodos de conversión/formato**.

| Miembro | Para qué |
| --- | --- |
| `Number.MAX_SAFE_INTEGER` | Entero seguro más grande |
| `Number.isNaN(x)` | ¿Es el valor `NaN`? (mejor que `isNaN`) |
| `Number.isFinite(x)` | ¿Es un número finito? |
| `Number.parseInt(texto, 10)` | Entero (siempre indica la base) |
| `Number.parseFloat(texto)` | Decimal |
| `n.toFixed(k)` | Cadena con `k` decimales |
| `n.toString(base)` | Cadena en esa base |

```javascript
const count1 = 6.257;
const count2 = 6.258;

if (count1.toFixed(2) === count2.toFixed(2)) {
  console.log("Iguales en las dos primeras cifras decimales");
}
```

`new Number(valor)` crea un **objeto**, no un primitivo. `new Number(6) === 6` es `false`. No lo uses en esta unidad.

## 3.1.4. `JSON`

**JSON** (*JavaScript Object Notation*) es un **formato de texto** para guardar o enviar datos: un objeto, una lista, un número, una cadena, un booleano o `null`. No es el objeto de JavaScript. Es la cadena que lo representa, la que viaja en una API o la que cabe en `localStorage` (solo admite texto; lo verás en el apartado 3.9).

El objeto nativo `JSON` **no se instancia**. Tiene dos métodos:

| Método | Qué hace |
| --- | --- |
| `JSON.stringify(valor)` | Pasa un valor de JavaScript a texto JSON |
| `JSON.parse(texto)` | Lee ese texto y recupera el valor |

```javascript
const alumno = { nombre: "Alex", grupo: "DAW2", nota: 8 };
const texto = JSON.stringify(alumno);
console.log(texto);          // '{"nombre":"Alex","grupo":"DAW2","nota":8}'
console.log(typeof texto);   // "string"

const copia = JSON.parse(texto);
console.log(copia.grupo);    // "DAW2"
console.log(copia === alumno); // false: es otro objeto, con los mismos datos
```

No todo valor de JavaScript cabe en JSON:

| En JavaScript | Al hacer `stringify` |
| --- | --- |
| `undefined`, funciones | Se **omiten** si son una propiedad; la raíz `undefined` pasa a `undefined` (no a texto) |
| `NaN`, `Infinity` | Se convierten en `null` |
| `Date` | Pasa a cadena ISO (`toISOString()`). Al leerlo vuelve una **cadena**, no un `Date` |
| `Map`, `Set` (UT4) | Salen como `{}`: JSON no tiene tipo para ellos |

Las claves de un objeto JSON van **siempre entre comillas dobles**. Un bloque `{ nombre: "Alex" }` es JavaScript; el texto `'{"nombre":"Alex"}'` es JSON. `JSON.parse` lanza `SyntaxError` si el texto no es JSON válido.

```javascript
const fecha = new Date("2026-09-09T12:00:00");
const guardado = JSON.stringify({ cuando: fecha });
const leido = JSON.parse(guardado);
console.log(typeof leido.cuando); // "string"
```

!!! tip "Node.js"
    `Date`, `Math`, `Number` y `JSON` funcionan igual en `node archivo.js`. `document` y `window` no. `Map` y `Set` también, pero se explican en la UT4.
