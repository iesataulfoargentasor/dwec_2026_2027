---
title: 3.1 Objetos nativos
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.1. Objetos nativos de JavaScript

Los objetos **nativos** los define ECMAScript, el estándar de JavaScript. No los añade Chrome, Firefox ni una librería externa: por eso los usas igual en el navegador y en Node.js.

Un objeto reúne información y operaciones relacionadas. Ya has visto la notación de punto:

```javascript
objeto.propiedad;
objeto.metodo(argumentos);
```

Por ejemplo, `Math.PI` consulta una propiedad (el valor de π), mientras que `Math.floor(4.8)` llama a un método (calcular el entero inferior).

Los objetos de esta unidad son **`Date`**, **`Math`**, **`Number`** y **`JSON`**; **`String`** tiene su apartado siguiente. **`Array`**, **`Map`** y **`Set`** se trabajan en la UT4, cuando ya tienes listas e índices.

No hace falta `new Object()` para trabajar con ellos. Un número o una cadena **primitivos** se “envuelven” temporalmente cuando llamas a un método:

```javascript
const ahora = new Date();
console.log(Math.PI);
console.log((12.348).toFixed(2)); // "12.35"
```

`Date` sí representa una fecha concreta y se crea con `new`. En cambio, `Math`, `Number` y `JSON` son objetos ya preparados: **no** escribas `new Math()`, `new JSON()` ni `new Number()`.

Evita también `new Number()` y `new String()`: crean objetos envoltorio que complican las comparaciones con `===`.

```javascript
const correcto = 6;
const confuso = new Number(6);

console.log(correcto === 6); // true
console.log(confuso === 6);  // false: objeto frente a número
```

## Antes de empezar: ¿un método modifica el valor?

Conviene distinguir dos comportamientos:

- Un **primitivo** (`number`, `string`, `boolean`) no cambia “por dentro”. `toFixed`, por ejemplo, devuelve un **texto nuevo**.
- Un objeto como `Date` puede cambiar si llamas a uno de sus métodos `set...`.
- `Math`, `Number` y `JSON` son utilidades: llamas a sus métodos y obtienes un resultado.

```javascript
const precio = 12.5;
const precioTexto = precio.toFixed(2);

console.log(precio);       // 12.5
console.log(precioTexto);  // "12.50"
console.log(typeof precioTexto); // "string"
```

No confundas “mostrar dos decimales” con “convertir el número en otro número”: `toFixed` prepara **texto** para mostrar.

## 3.1.1. El objeto `Date`

`Date` representa un **instante**, no solo una fecha escrita en calendario. Internamente lo guarda como milisegundos desde el 1 de enero de 1970 UTC: el *epoch* Unix. Esa forma permite comparar, sumar o restar momentos.

Hay tres formas habituales de crear una fecha:

```javascript
const ahora = new Date();                 // instante actual
const concreta = new Date(2026, 8, 9);    // 9 de septiembre de 2026 (el mes es 0-11)
const iso = new Date("2026-09-09T12:00:00");
```

!!! warning "El mes empieza en 0"
    `getMonth()` y el constructor `new Date(año, mes, día)` usan **0 = enero** y **11 = diciembre**. Es la trampa clásica de `Date`.

La forma con números usa la **hora local** del equipo. La forma ISO (`"2026-09-09T12:00:00"`) se entiende como fecha y hora local si no añade zona horaria. Cuando intercambies fechas con un servidor verás textos con `Z`, por ejemplo `"2026-09-09T10:00:00.000Z"`: esa `Z` indica UTC.

`Date` se consulta con **métodos**:

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

`getDate()` y `getDay()` no responden a la misma pregunta:

```javascript
const fechaClase = new Date(2026, 8, 9);

console.log(fechaClase.getDate()); // 9: día del mes
console.log(fechaClase.getDay());  // 3: miércoles (domingo es 0)
```

Los `setFullYear`, `setMonth`, `setDate`, `setHours`… modifican el objeto `Date`. Si conservas una fecha inicial, crea una copia antes de cambiarla:

```javascript
const apertura = new Date(2026, 8, 9);
const cierre = new Date(apertura.getTime());

cierre.setDate(cierre.getDate() + 7);
console.log(apertura.toLocaleDateString("es-ES")); // 9/9/2026
console.log(cierre.toLocaleDateString("es-ES"));   // 16/9/2026
```

`getTime()` permite calcular una diferencia. El resultado está en milisegundos; un día tiene `24 * 60 * 60 * 1000` milisegundos.

```javascript
const inicio = new Date(2026, 8, 9);
const fin = new Date(2026, 8, 12);
const milisegundosPorDia = 24 * 60 * 60 * 1000;
const dias = (fin.getTime() - inicio.getTime()) / milisegundosPorDia;

console.log(dias); // 3
```

Prefiere `getFullYear()`; `getYear()` está **obsoleto**. Igual con `toUTCString()` frente a `toGMTString()`.

`getMonth()` empieza en 0: enero es `0` y diciembre es `11`. Para mostrarlo como calendario se suma 1. El cero a la izquierda se pone con el operador ternario de la UT2. `padStart`, que hace lo mismo sobre una cadena, está en el apartado 3.2.

```javascript
const ahora = new Date();
const dia = ahora.getDate();
const mes = ahora.getMonth() + 1;
const anio = ahora.getFullYear();
const diaTexto = dia < 10 ? "0" + dia : String(dia);
const mesTexto = mes < 10 ? "0" + mes : String(mes);

console.log("Hoy es " + diaTexto + "/" + mesTexto + "/" + anio);
console.log(ahora.toLocaleDateString("es-ES"));
```

## 3.1.2. El objeto `Math`

`Math` **no se instancia**. Es una caja de constantes y métodos matemáticos; todas las operaciones se llaman sobre `Math` directamente.

Constantes habituales: `Math.PI`, `Math.E`, `Math.SQRT2`, `Math.LN10`…

| Método | Uso |
| --- | --- |
| `abs(x)` | Valor absoluto |
| `ceil(x)` / `floor(x)` / `round(x)` / `trunc(x)` | Redondeos |
| `max(a, b)` / `min(a, b)` | Mayor / menor |
| `pow(x, y)` | Potencia (equivalente a `x ** y`) |
| `sqrt(x)` | Raíz cuadrada |
| `random()` | Pseudoaleatorio en `[0, 1)` |

Los cuatro redondeos no hacen lo mismo, especialmente con números negativos:

| Expresión | Resultado | Idea |
| --- | --- | --- |
| `Math.floor(4.8)` | `4` | Hacia abajo |
| `Math.ceil(4.2)` | `5` | Hacia arriba |
| `Math.round(4.5)` | `5` | Al entero más próximo |
| `Math.trunc(-4.8)` | `-4` | Quita la parte decimal |

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

### Aleatorio no significa imprevisible

`Math.random()` genera un número **pseudoaleatorio**. Sirve para un ejercicio, un color o una pregunta al azar, pero **no** para contraseñas, sorteos con garantías ni códigos de seguridad.

La regla para un entero entre `minimo` y `maximo`, ambos incluidos, es:

```javascript
const minimo = 3;
const maximo = 7;
const dado = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;

console.log(dado); // 3, 4, 5, 6 o 7
```

`Math.random()` nunca llega a `1`. Por eso, para obtener de 0 a 10 se multiplica por `11` y se aplica `floor`.

## 3.1.3. El objeto `Number`

En el día a día usas literales (`const n = 6.257`). El objeto `Number` aporta **constantes**, comprobaciones y métodos de conversión/formato.

| Miembro | Para qué |
| --- | --- |
| `Number.MAX_SAFE_INTEGER` | Entero seguro más grande |
| `Number.isNaN(x)` | ¿Es el valor `NaN`? (mejor que `isNaN`) |
| `Number.isFinite(x)` | ¿Es un número finito? |
| `Number.parseInt(texto, 10)` | Entero (siempre indica la base) |
| `Number.parseFloat(texto)` | Decimal |
| `n.toFixed(k)` | Cadena con `k` decimales |
| `n.toString(base)` | Cadena en esa base |

El texto que devuelve `prompt` no es un número. Convierte de forma explícita y comprueba el resultado:

```javascript
const bruto = prompt("¿Cuántas entradas?");
const entradas = Number(bruto);

if (bruto === null) {
  console.log("Operación cancelada");
} else if (bruto.trim() === "" || Number.isNaN(entradas)) {
  console.log("Escribe un número válido");
} else if (!Number.isFinite(entradas)) {
  console.log("El número debe ser finito");
} else {
  console.log("Entradas:", entradas);
}
```

`Number.parseInt("18.7", 10)` obtiene `18`; `Number.parseFloat("18.7")` obtiene `18.7`. Ambos empiezan a leer por el inicio: `Number.parseInt("18px", 10)` devuelve `18`, mientras que `Number("18px")` devuelve `NaN`. Para datos introducidos por una persona, suele ser más seguro `Number(...)` si quieres aceptar **solo** un número completo.

```javascript
const count1 = 6.257;
const count2 = 6.258;

if (count1.toFixed(2) === count2.toFixed(2)) {
  console.log("Iguales en las dos primeras cifras decimales");
}
```

!!! warning "Decimales y dinero"
    Los `number` usan coma flotante binaria. Algunas operaciones no se representan exactamente: `0.1 + 0.2` puede mostrar `0.30000000000000004`. Para presentar un importe usa `toFixed(2)`; para cálculos de dinero reales se suelen guardar céntimos enteros o usar una biblioteca especializada.

`new Number(valor)` crea un **objeto**, no un primitivo. `new Number(6) === 6` es `false`. No lo uses en esta unidad.

## 3.1.4. `JSON`

**JSON** (*JavaScript Object Notation*) es un **formato de texto** para guardar o enviar datos: un objeto, una lista, un número, una cadena, un booleano o `null`. No es “un objeto JavaScript con otro nombre”: es la **cadena** que lo representa, la que viaja en una API o la que cabe en `localStorage` (solo admite texto; lo verás en el apartado 3.9).

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

La dirección importa:

```text
valor JavaScript -- JSON.stringify(...) --> texto JSON
valor JavaScript <-- JSON.parse(...)      -- texto JSON
```

En JSON solo se admiten comillas dobles, `true`, `false`, `null`, números y los signos de objeto/lista. Estas dos líneas se parecen, pero no son intercambiables:

```javascript
const objetoJavaScript = { nombre: "Alex" };
const textoJson = '{"nombre":"Alex"}';
```

- En el objeto JavaScript la clave puede escribirse sin comillas.
- En JSON la clave debe llevar comillas dobles.
- JSON no usa `undefined`, comentarios, funciones ni comas finales.

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

## Caso práctico resuelto: parte de acceso a la biblioteca

La biblioteca del centro guarda la hora de apertura, una estimación de visitantes y un pequeño parte que debe enviar como JSON. El script debe:

1. Crear y mostrar la fecha y hora del parte.
2. Validar una estimación escrita mediante `prompt`.
3. Calcular cuántos visitantes caben todavía, sin que el resultado sea negativo.
4. Asignar un número de turno aleatorio de 100 a 999.
5. Redondear una media de minutos de espera a dos decimales.
6. Convertir el parte a JSON y recuperar una copia del texto.

No se usa una función de usuario, un array, DOM, eventos ni una API externa: solo variables, condiciones de la UT2 y los objetos nativos de este apartado.

```javascript
const aforoMaximo = 60;
const ocupacionActual = 43;
const esperaMedia = 6.378;
const fechaParte = new Date();

const bruto = prompt("Estimación de visitantes que llegarán esta hora:");
const estimacion = Number(bruto);

if (bruto === null) {
  console.log("No se ha creado el parte: operación cancelada.");
} else if (bruto.trim() === "" || Number.isNaN(estimacion)) {
  console.log("No se ha creado el parte: escribe un número.");
} else if (!Number.isFinite(estimacion) || estimacion < 0) {
  console.log("No se ha creado el parte: la estimación debe ser un número positivo.");
} else {
  const plazasLibres = Math.max(0, aforoMaximo - ocupacionActual);
  const turno = Math.floor(Math.random() * 900) + 100;
  const dia = fechaParte.getDate();
  const mes = fechaParte.getMonth() + 1;
  const anio = fechaParte.getFullYear();
  const fechaTexto =
    (dia < 10 ? "0" + dia : String(dia)) + "/" +
    (mes < 10 ? "0" + mes : String(mes)) + "/" +
    anio;

  const parte = {
    fecha: fechaTexto,
    ocupacionActual: ocupacionActual,
    estimacionLlegadas: estimacion,
    plazasLibres: plazasLibres,
    turno: turno,
    esperaMediaMinutos: esperaMedia.toFixed(2)
  };

  const textoParte = JSON.stringify(parte);
  const copiaParte = JSON.parse(textoParte);

  console.log("Parte:", parte);
  console.log("Texto que se enviaría:", textoParte);
  console.log("Turno recuperado desde JSON:", copiaParte.turno);

  if (estimacion > plazasLibres) {
    console.log("Aviso: la estimación supera las plazas libres.");
  } else {
    console.log("La estimación cabe dentro del aforo disponible.");
  }
}
```

### Lectura del resultado

- `fechaParte` es un `Date`. Se consulta con `getDate`, `getMonth` y `getFullYear`; por eso al mes se le suma 1.
- `bruto` es texto o `null`. `Number(bruto)` intenta convertirlo; `Number.isNaN` detecta un texto que no era un número.
- `Math.max(0, ...)` evita informar de plazas negativas si la ocupación ya supera el aforo.
- `Math.floor(Math.random() * 900) + 100` solo puede producir enteros de 100 a 999.
- `toFixed(2)` deja la espera lista para mostrar, pero la convierte en **texto**. Es adecuado en un parte.
- `JSON.stringify` produce el texto que se podría guardar o enviar. `JSON.parse` crea otro objeto con los mismos datos; por eso `copiaParte.turno` funciona.

Prueba el script con `12`, con `hola`, con un texto vacío y pulsando Cancelar. Cada entrada sigue una rama distinta del `if`; comprobar esos casos forma parte de terminar el ejercicio.
