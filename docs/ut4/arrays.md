---
title: 4.3 Arrays
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.3. Arrays (matrices)

Un **array** reúne varios valores en una colección ordenada. Cada elemento ocupa una posición identificada por un **índice**. El primero es el `0`: en una lista de tres elementos, los índices son `0`, `1` y `2`.

Este apartado desarrolla el reconocimiento, creación y uso de arrays (**RA4.c y RA4.d**) y la depuración y documentación (**RA4.k**). Consulta el [RA4 de la unidad](ra4.md). La referencia del módulo 0612 es el [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405) y, en Cantabria, la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244).

!!! note "Alcance del apartado"
    Usaremos variables, condiciones, bucles, cadenas y las funciones estudiadas en 4.2. Los resultados se mostrarán en consola. No necesitamos eventos ni DOM. Los recorridos se harán con `for` y `for...of`; `map`, `filter`, `reduce` y otras operaciones con funciones de devolución se desarrollan en [4.5](operaciones-agregadas.md).

Los arrays de JavaScript son **dinámicos**: pueden crecer o reducirse. Admiten valores de distintos tipos, aunque en estas prácticas cada lista tendrá elementos del mismo tipo para facilitar su tratamiento. Son objetos: `typeof []` devuelve `"object"`; para comprobar si un valor es un array usamos `Array.isArray`.

## Crear y acceder

### Literales, índices y longitud

```javascript
const coches = ["Seat", "Audi", "Renault"];
const pendientes = [];

console.log(coches[0]);                 // Seat
console.log(coches.length);             // 3
console.log(coches[coches.length - 1]); // Renault
console.log(coches[3]);                 // undefined: no existe ese elemento
coches[1] = "BMW";
console.log(coches);                    // ["Seat", "BMW", "Renault"]
console.log(pendientes.length);         // 0
```

`length` no lleva paréntesis: es una propiedad. En un array sin huecos coincide con el número de elementos. El último índice es `length - 1`, no `length`. En un array vacío no hay primer ni último elemento: comprueba su longitud antes de utilizarlos.

`const` impide asignar otro array a la variable, pero permite cambiar el contenido del array existente. `coches[1] = "BMW"` es válido; `coches = []` no lo sería con esa declaración.

### Evitar huecos

```javascript
const ciudades = ["Santander", "Torrelavega"];
ciudades[4] = "Laredo";
console.log(ciudades.length); // 5
console.log(ciudades[2]);     // undefined
console.log(2 in ciudades);   // false: no existe una propiedad en ese índice
```

La asignación al índice 4 deja **huecos** en 2 y 3. Al leerlos se obtiene `undefined`, pero no son elementos que se hayan guardado explícitamente con ese valor. El operador `in` del ejemplo comprueba si existe esa propiedad; no busca un valor en la lista.

```javascript
const conValor = [undefined];
console.log(conValor[0]);   // undefined
console.log(0 in conValor); // true: aquí sí hay un elemento explícito
```

`new Array(3)` crea un array de longitud 3 con huecos, no `[3]` ni tres ceros. Para el elemento 3 utiliza `[3]`; para tres ceros, `[0, 0, 0]`. En las prácticas utiliza literales y `push` para añadir sin saltarte posiciones.

Cambiar `length` también modifica el array: reducirlo elimina los elementos finales; aumentarlo añade huecos. No lo uses para simular una capacidad máxima ni como sustituto de las operaciones que se explican a continuación.

## Recorrer

### Conocer la posición: `for`

```javascript
const grupos = ["DAW1", "DAW2", "DAM1"];
for (let i = 0; i < grupos.length; i += 1) {
  console.log("Posición " + i + ": " + grupos[i]);
}
```

La condición es `i < grupos.length`. Con `<=` se intentaría leer una posición adicional. Si quieres numerar una lista para una persona desde 1, muestra `i + 1`, pero sigue accediendo al elemento mediante `grupos[i]`.

### Usar solo los valores: `for...of`

```javascript
const grupos = ["DAW1", "DAW2", "DAM1"];
for (const grupo of grupos) {
  console.log(grupo);
}
```

`grupo` recibe el valor de cada elemento. No es su índice. Para sustituir elementos de un array de cadenas o números utiliza un recorrido por índices y asigna sobre el array. `for...in` recorre claves y puede incluir propiedades adicionales: no lo usaremos para estas listas.

Un array vacío no entra en ninguno de estos dos bucles. Para acumular números, inicializa el acumulador antes del recorrido y comprueba el vacío antes de dividir:

```javascript
const minutos = [10, 15, 5];
let total = 0;
for (const tiempo of minutos) {
  total += tiempo;
}
console.log("Total:", total); // 30
if (minutos.length > 0) {
  console.log("Media:", total / minutos.length); // 10
} else {
  console.log("No hay tiempos para calcular una media.");
}
```

Evita añadir o quitar elementos mientras recorres la misma lista en estos primeros ejercicios: cambiarían sus índices y su longitud. Realiza las modificaciones antes del recorrido de presentación.

## Añadir y quitar

Estos métodos **modifican el array**. El resultado que devuelven no siempre es el propio array:

| Método | Modificación | Valor devuelto |
| --- | --- | --- |
| `push(elemento)` | Añade al final | Nueva longitud |
| `pop()` | Elimina el último | Elemento eliminado, o `undefined` si estaba vacío |
| `unshift(elemento)` | Añade al principio y desplaza los demás | Nueva longitud |
| `shift()` | Elimina el primero y desplaza los demás | Elemento eliminado, o `undefined` si estaba vacío |
| `splice(inicio, cantidad, ...elementos)` | Elimina e inserta desde una posición | Array con los elementos eliminados |

```javascript
const cola = ["Ana", "Luis"];
const longitud = cola.push("Marta");
console.log(longitud); // 3, no el array
const atendida = cola.shift();
console.log(atendida); // Ana
console.log(cola);     // ["Luis", "Marta"]
cola.unshift("Eva");
const ultima = cola.pop();
console.log(ultima);   // Marta
console.log(cola);     // ["Eva", "Luis"]
```

No hagas `lista = lista.push(...)` esperando conservar la lista: `push` devuelve un número. El mismo cuidado se aplica al guardar el resultado de otros métodos.

### Eliminar, insertar y sustituir con `splice`

```javascript
const materiales = ["Cable", "Ratón", "Teclado"];
const retirados = materiales.splice(1, 1);
console.log(retirados); // ["Ratón"]
console.log(materiales); // ["Cable", "Teclado"]

materiales.splice(1, 0, "Monitor"); // Inserta sin borrar.
console.log(materiales); // ["Cable", "Monitor", "Teclado"]

materiales.splice(2, 1, "Auriculares"); // Sustituye un elemento.
console.log(materiales); // ["Cable", "Monitor", "Auriculares"]
```

El segundo argumento indica **cuántos elementos borrar**, no el índice donde terminar. Si es `0`, solo se insertan los elementos indicados. Los índices posteriores se reajustan, por lo que no debes reutilizar una posición antigua suponiendo que sigue identificando el mismo elemento.

!!! warning "No borrar con delete"
    `delete lista[i]` deja un hueco y no reduce `length`. Para eliminar un elemento y desplazar los siguientes utiliza `splice`. En estas prácticas trabajamos con listas sin huecos.

### Buscar antes de eliminar

```javascript
const tareas = ["Leer", "Practicar", "Repasar"];
console.log(tareas.includes("Leer")); // true
console.log(tareas.includes("leer")); // false: distingue mayúsculas

const posicion = tareas.indexOf("Practicar");
if (posicion !== -1) {
  tareas.splice(posicion, 1);
}
console.log(tareas); // ["Leer", "Repasar"]
```

`includes` devuelve un booleano; `indexOf` devuelve el primer índice encontrado o `-1`. No compruebes `if (posicion)`: el índice `0` es una posición válida, pero se considera falso en una condición. Tampoco llames a `splice(-1, 1)` si no encuentras el elemento: el índice negativo haría que se eliminase el último.

En arrays, `includes` busca **un elemento completo**, no una parte de una cadena. `['Repasar JavaScript'].includes('JavaScript')` devuelve `false`. Tanto `includes` como `indexOf` distinguen el número `3` de la cadena `"3"`. Una diferencia con valores especiales es que `includes` encuentra `NaN` y `indexOf` no; no necesitaremos ese caso para las listas de texto del ejercicio.

### Arrays como argumentos

```javascript
function anadir(lista, elemento) {
  lista.push(elemento);
}

const tareas = ["Leer"];
anadir(tareas, "Practicar");
console.log(tareas); // ["Leer", "Practicar"]
```

Como vimos en 4.2, se pasa por valor **una referencia al array**. El parámetro y la variable exterior permiten acceder al mismo objeto; por eso `push` modifica la lista original. No se crea una copia independiente. Reasignar el parámetro a otro array, en cambio, no reasigna la variable exterior. Documenta si una función modifica el array recibido o devuelve otro.

## El operador spread (`...`)

En un literal de array, spread despliega los elementos de otro iterable. Para copiar una lista sencilla:

```javascript
const nombres = ["Zoe", "Ana"];
const copia = [...nombres];
copia[0] = "Luis";
console.log(copia);   // ["Luis", "Ana"]
console.log(nombres); // ["Zoe", "Ana"]
console.log(copia === nombres); // false
```

No confundas la copia con `const alias = nombres`: esa asignación crea otra variable que apunta al **mismo array**. Modificarlo desde `alias` también cambia lo que ves desde `nombres`.

```javascript
const primero = [1, 2];
const segundo = [3, 4];
console.log([...primero, ...segundo]); // [1, 2, 3, 4]
console.log([..."AB"]); // ["A", "B"]
```

En cadenas, spread recorre puntos de código Unicode: el ejemplo `AB` es sencillo, pero ciertos símbolos visuales están formados por varios puntos de código. No lo trates como una solución universal para separar cualquier texto en caracteres visibles. `Map` y `Set` también son iterables; los veremos en 4.4.

### Rest recoge; spread despliega

Ahora podemos completar la idea introducida en 4.2. En la declaración de una función, `...notas` es un parámetro **rest** y recoge los argumentos en un array:

```javascript
function media(...notas) {
  if (notas.length === 0) {
    return null;
  }
  let suma = 0;
  for (const nota of notas) {
    suma += nota;
  }
  return suma / notas.length;
}

const calificaciones = [7, 8, 9];
console.log(media(7, 8, 9));          // 8
console.log(media(...calificaciones)); // 8: spread en la llamada
console.log(media());                // null: no hay datos
```

El contrato de `media` exige argumentos numéricos válidos. El ejemplo devuelve `null` cuando no hay datos para distinguir «sin media» de una media igual a cero. El parámetro rest debe ser el último. En `media(...calificaciones)`, spread entrega tres argumentos separados; `media(calificaciones)` entregaría un solo array y no cumpliría ese contrato.

## Copiar y combinar (sin romper el original)

| Operación | Qué devuelve | ¿Modifica el original? |
| --- | --- | --- |
| `concat(otro)` | Array nuevo con los elementos de ambos | No |
| `slice(inicio, fin)` | Copia del tramo, sin incluir `fin` | No |
| `slice()` o `[...lista]` | Copia superficial | No |
| `join(separador)` | Una cadena | No |
| `reverse()` | El mismo array con el orden invertido | Sí |
| `sort(comparar)` | El mismo array ordenado | Sí |

### `slice` no es `splice`

```javascript
const turnos = ["Ana", "Luis", "Marta", "Eva"];
const primeros = turnos.slice(0, 2);
console.log(primeros); // ["Ana", "Luis"]
console.log(turnos.length); // 4: no se ha borrado nada
console.log(turnos.slice(-2)); // ["Marta", "Eva"]
console.log(turnos.concat(["Leo"])); // Array nuevo con Leo al final
console.log(turnos.join(" → ")); // Ana → Luis → Marta → Eva
```

`slice(1, 3)` copia los índices 1 y 2. `splice(1, 3)` elimina tres elementos desde el índice 1. La diferencia afecta tanto al significado del segundo argumento como al estado del array original.

El camino inverso a unir texto puede practicarse con `split`, método de **String** que devuelve un array:

```javascript
const texto = "Cable;Ratón;Teclado";
const materiales = texto.split(";");
console.log(materiales); // ["Cable", "Ratón", "Teclado"]
console.log(materiales.join(" | ")); // Cable | Ratón | Teclado
```

`split` no limpia ni valida cada parte. Dos separadores seguidos producen una cadena vacía entre ellos; `"".split(";")` produce `[""]`, no un array vacío. Por eso las prácticas principales parten de arrays literales.

### Ordenar una copia

```javascript
const notas = [10, 2, 8];
const ordenadas = [...notas].sort((a, b) => a - b);
console.log(ordenadas); // [2, 8, 10]
console.log(notas);     // [10, 2, 8]
const alReves = [...notas].reverse();
console.log(alReves);   // [8, 2, 10]: invierte, no ordena de mayor a menor
```

Sin función de comparación, `sort()` compara las representaciones como texto: `[10, 2, 8]` no se ordena numéricamente. La función `(a, b) => a - b` devuelve un valor negativo si `a` debe ir antes, positivo si debe ir después y cero si son equivalentes para esta ordenación. Para orden numérico descendente utiliza `b - a`, no un booleano como `a > b`.

Para cadenas, `sort()` usa un orden basado en unidades UTF-16; no garantiza el orden alfabético de un idioma, especialmente con tildes y mayúsculas. En los ejemplos de nombres se usan valores sencillos para que el resultado sea previsible.

### Una copia superficial no copia las filas internas

```javascript
const original = [[1, 2], [3, 4]];
const copia = [...original];
copia[0][0] = 99;
console.log(original[0][0]); // 99: se comparte la primera fila
```

La copia exterior es otro array, pero sus elementos internos siguen apuntando a las mismas filas. Sucede también con objetos contenidos en una lista. Con nuestras listas de cadenas, sustituir `copia[0]` no cambia el elemento original; con estructuras anidadas debes decidir qué niveles necesitas copiar.

## Arrays de arrays (multidimensionales)

Una tabla puede representarse con arrays cuyos elementos son otros arrays. El primer índice selecciona una fila y el segundo un elemento de esa fila:

```javascript
const notas = [
  [7, 8, 9],
  [6, 5, 8]
];
console.log(notas[1][2]); // 8: segunda fila, tercera columna

for (let fila = 0; fila < notas.length; fila += 1) {
  for (let columna = 0; columna < notas[fila].length; columna += 1) {
    console.log("Fila " + fila + ", columna " + columna + ": " + notas[fila][columna]);
  }
}
```

Cada fila tiene su propia longitud y podría ser distinta de las demás. Para recorrerla utiliza `notas[fila].length`. Leer una columna inexistente de una fila existente devuelve `undefined`; intentar acceder a una columna de una fila inexistente produce un error al encadenar el segundo acceso. Comprueba las posiciones cuando procedan de datos externos.

## Lo que no es un array

```javascript
console.log(Array.isArray(["Seat", "Audi"])); // true
console.log(Array.isArray("Seat"));           // false
console.log(Array.isArray({ nombre: "Seat" })); // false
console.log(typeof []); // object
```

Una propiedad como `lista["Juan"] = 20` no añade un elemento indexado ni aumenta `length`. No utilices arrays como diccionarios de nombres: para asociar claves con valores estudiaremos [Map](map-set.md); para valores únicos, Set. Los objetos con propiedades nombradas se desarrollan en 4.7.

Algunas colecciones del navegador tienen índices y `length`, pero no son arrays. No necesitamos manipularlas aquí: la existencia de esas propiedades no demuestra que un valor tenga métodos como `push`.

## Caso práctico resuelto: organizar una cola de atención

El aula tiene una cola inicial de atención: Ana, Luis y Marta. Vamos a conservar una copia de esa situación, añadir a una persona nueva si procede, atender a la primera y mostrar quiénes siguen esperando.

Usaremos `prompt` una vez. Cancelar, dejar vacío o introducir un nombre ya presente no debe modificar la cola ni atender a nadie. Para esta práctica dos nombres iguales representan la misma inscripción; en una aplicación real haría falta un identificador que distinguiese a personas con el mismo nombre.

**`cola.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Cola de atención</title>
</head>
<body>
  <h1>Cola de atención del aula</h1>
  <p>Consulta la consola. Recarga para empezar de nuevo.</p>
  <script src="cola.js"></script>
</body>
</html>
```

**`cola.js`**

```javascript
const cola = ["Ana", "Luis", "Marta"];
const inicial = [...cola];
const entrada = prompt("Nombre de la persona que se incorpora:");

if (entrada === null) {
  console.log("Operación cancelada.");
} else {
  const nombre = entrada.trim();
  if (nombre === "") {
    console.log("El nombre no puede estar vacío.");
  } else if (cola.includes(nombre)) {
    console.log("Ese nombre ya está en la cola.");
  } else {
    cola.push(nombre);
    const atendida = cola.shift();
    console.log("Persona atendida:", atendida);
  }
}

console.log("Cola inicial:", inicial.join(" → "));
if (cola.length === 0) {
  console.log("No quedan personas esperando.");
} else {
  console.log("Personas pendientes:", cola.length);
  for (let i = 0; i < cola.length; i += 1) {
    console.log((i + 1) + ". " + cola[i]);
  }
}

const ordenados = [...cola].sort();
console.log("Nombres ordenados para consulta:", ordenados.join(", "));
console.log("Orden de atención conservado:", cola.join(" → "));
```

### Lectura del resultado

Guarda ambos archivos en la misma carpeta, abre el HTML y muestra la consola. Con la entrada ` Eva ` se obtiene:

```text
Persona atendida: Ana
Cola inicial: Ana → Luis → Marta
Personas pendientes: 3
1. Luis
2. Marta
3. Eva
Nombres ordenados para consulta: Eva, Luis, Marta
Orden de atención conservado: Luis → Marta → Eva
```

1. `inicial` es una copia de la lista de cadenas, por lo que conserva los nombres y el orden previos.
2. `trim` elimina los espacios exteriores del nombre, sin cambiar sus mayúsculas.
3. `includes` evita repetir exactamente un nombre. `Ana` está inscrita; `ana` se considera una cadena distinta en esta práctica.
4. `push` añade Eva al final y `shift` devuelve y elimina Ana. Solo se atiende a una persona cuando se ha aceptado una incorporación.
5. El recorrido utiliza índices desde cero, aunque la numeración visible comienza en uno.
6. Se ordena una copia para consultar los nombres. La cola real mantiene su orden de llegada. `join` genera cadenas estables para mostrar el estado en consola.

Prueba Cancelar, espacios, `Ana` y `Eva`. En los tres primeros casos se mantiene la cola inicial y no aparece «Persona atendida». Cambia temporalmente el array inicial por `[]` y prueba Cancelar: se muestra que no hay personas. Si introduces Eva con esa cola vacía, se incorpora y se atiende inmediatamente, por lo que vuelve a quedar vacía.

Los cambios viven solo durante la ejecución: al recargar se crea de nuevo el array inicial. No se utiliza almacenamiento. Tampoco se modifica la lista durante el recorrido: las operaciones de incorporación y atención ocurren antes.

## Ejercicio propuesto: revisar el material de un aula

### Contexto

El aula dispone de una lista de materiales. Debes conservar su estado inicial, incorporar material nuevo y retirar el primer elemento cuyo nombre indique la persona responsable. Al final se mostrará la lista de trabajo y una copia ordenada para consulta.

### Datos de partida

| Dato | Valor |
| --- | --- |
| Array inicial `materiales` | `["Cable", "Ratón", "Teclado"]` |
| Incorporación al final | `"Monitor"` |
| Incorporación al principio | `"Adaptador"` |
| Entrada mediante `prompt` | Nombre exacto del material que se desea retirar |

Crea `materiales.html` y `materiales.js`. Muestra los resultados en consola; no hacen falta controles HTML ni eventos.

### Requisitos obligatorios

1. Crea el array inicial y conserva una copia independiente de esa lista de cadenas antes de modificarla.
2. Añade Monitor con `push` y Adaptador con `unshift`. Estas incorporaciones se realizan siempre, antes del diálogo.
3. Pide el nombre que se desea retirar. Cancelar o introducir solo espacios debe omitir únicamente la retirada, conservando las incorporaciones anteriores.
4. Limpia los espacios exteriores y busca la posición con `indexOf`. La comparación distingue mayúsculas y tildes: no inventes equivalencias.
5. Si se encuentra el nombre, elimina un elemento con `splice` y muestra el nombre retirado. Si no se encuentra, informa y no elimines nada. No uses `delete`.
6. Muestra la copia inicial, el número de elementos finales y la lista numerada mediante `for` o `for...of` con un contador.
7. Crea una copia ordenada con `sort` y muéstrala con `join`. Comprueba que la lista de trabajo mantiene su orden anterior a la ordenación.
8. Crea una vista con los dos primeros materiales mediante `slice(0, 2)` sin retirarlos de la lista. Si hay menos de dos, debe mostrar los que existan.
9. Documenta qué métodos modifican el original y qué devuelve `push`, `splice`, `slice` y `join` en tu programa.

### Pistas de diseño

- `const copia = materiales` no conserva una lista independiente: utiliza spread o `slice()`.
- Busca después de incorporar los materiales: sus índices pueden haber cambiado.
- El índice `0` debe aceptarse. El valor que indica ausencia es `-1`.
- `splice` devuelve un array, aunque solo se elimine un elemento; puedes leer su índice 0 tras una eliminación confirmada.
- Ordena una copia. Para estos nombres se utiliza el orden de `sort` por defecto, no una ordenación lingüística general.
- No necesitas `map`, `filter`, `reduce`, objetos propios, JSON ni almacenamiento.

### Casos que debes probar

En cada prueba normal, recarga para partir de los mismos tres materiales iniciales.

| Entrada | Resultado esperado tras las incorporaciones y la posible retirada |
| --- | --- |
| `Ratón` | `Adaptador, Cable, Teclado, Monitor`; longitud 4 |
| `Adaptador` | Se elimina el índice 0; quedan `Cable, Ratón, Teclado, Monitor` |
| `Monitor` | Se elimina el último; quedan `Adaptador, Cable, Ratón, Teclado` |
| ` Cable ` | Se retira Cable tras limpiar espacios |
| `Impresora` | Aviso; se conservan los cinco elementos |
| `ratón` | No coincide con Ratón; no se retira nada |
| Solo espacios | Aviso; se conservan las dos incorporaciones |
| Cancelar | No se retira nada; quedan cinco elementos |

Con `Ratón`, la copia ordenada será `Adaptador, Cable, Monitor, Teclado`; la lista de trabajo debe seguir siendo `Adaptador, Cable, Teclado, Monitor`. La vista de los dos primeros será `Adaptador, Cable`, sin reducir la longitud.

Como prueba adicional, cambia el array inicial por `[]`: después de las incorporaciones tendrá Adaptador y Monitor. Retira Adaptador y comprueba que `slice(0, 2)` devuelve solo Monitor. Si pruebas nombres duplicados, documenta que `indexOf` y la retirada de un elemento afectan únicamente a la primera coincidencia.

### Entrega

Entrega los dos archivos, una captura de la prueba con Ratón y una tabla de resultados esperados y observados. En la captura deben distinguirse la copia inicial, la lista final, la copia ordenada y la vista de los dos primeros.

Explica por qué comprobar `posicion !== -1` evita borrar el último elemento por error, por qué `sort` se aplica a una copia y qué diferencia hay entre `slice` y `splice`.

La corrección valora crear y utilizar correctamente los arrays (**RA4.c y RA4.d**), controlar índices y modificaciones, y documentar las pruebas (**RA4.k**). Las operaciones agregadas de 4.5 y el manejo de eventos y DOM quedan fuera de esta práctica.

## Referencias para consultar

- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
- [MDN: splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) y [slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).
- [MDN: sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
- [MDN: spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) y [parámetros rest](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
