---
title: 4.4 Map y Set
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.4. `Map` y `Set`

Un [array](arrays.md) permite organizar una lista y acceder a sus elementos por posición. A veces interesa otra forma de organizar los datos: consultar el nombre de un alumno a partir de su código, o recordar qué códigos ya se han registrado sin duplicarlos.

**`Map` asocia claves con valores; `Set` conserva valores únicos.** Ambos son objetos incorporados de JavaScript. Los estudiamos después de arrays para comparar sus usos y aprovechar los recorridos y conversiones entre colecciones.

Este apartado complementa el trabajo con colecciones de la UT4 y la depuración y documentación del código (**RA4.k**). No sustituye el uso de arrays exigido en **RA4.c y RA4.d**. Consulta el [RA4 y sus criterios](ra4.md), el [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405) y el currículo de Cantabria de la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244).

!!! note "Alcance del apartado"
    Utilizaremos cadenas, condiciones, bucles, arrays y spread de 4.3. Los resultados se mostrarán en consola. No hacen falta eventos, DOM, clases ni almacenamiento. Las operaciones agregadas con funciones de devolución se desarrollan en 4.5; aquí recorreremos las colecciones con `for...of`.

## Cuándo usar cada uno

| Necesidad | Colección adecuada | Acceso y tamaño |
| --- | --- | --- |
| Guardar una lista donde importan posiciones y repeticiones | Array | `lista[0]`, `lista.length` |
| Relacionar cada código con un dato | `Map` | `mapa.get(codigo)`, `mapa.size` |
| Saber si un código está registrado una sola vez | `Set` | `conjunto.has(codigo)`, `conjunto.size` |
| Representar una ficha con propiedades conocidas | Objeto literal | `alumno.nombre`; se desarrolla en 4.7 |

Un array también puede recorrerse para buscar datos o evitar duplicados. La elección de `Map` o `Set` expresa directamente la relación que necesitamos y ofrece métodos específicos para mantenerla.

En una cola pueden aparecer varias solicitudes de la misma persona: un array puede ser adecuado. Para un registro de asistencia, en cambio, cada código debe contar una sola vez: un `Set` resulta útil. Si necesitamos saber el nombre asociado al código, utilizamos además un `Map`.

## 4.4.1. `Map`

Un `Map` contiene **entradas**, cada una formada por una clave y su valor asociado. Una clave solo puede tener un valor en el mapa, aunque varias claves pueden compartir el mismo valor.

### Crear, consultar y actualizar

```javascript
const notas = new Map();
notas.set("A01", 8);
notas.set("A02", 6);

console.log(notas.get("A01")); // 8
console.log(notas.has("A03")); // false
console.log(notas.size);       // 2

notas.set("A01", 9);
console.log(notas.get("A01")); // 9
console.log(notas.size);       // 2: se actualizó una clave existente
```

`size` es una propiedad y no lleva paréntesis. Usar `set` con una clave nueva incrementa el tamaño; usarlo con una clave existente sustituye el valor. El mapa conserva el orden de inserción de las claves: actualizar un valor no mueve su clave al final.

| Operación | Resultado |
| --- | --- |
| `set(clave, valor)` | Añade o actualiza y devuelve el propio `Map` |
| `get(clave)` | Devuelve el valor asociado, o `undefined` si no existe la clave |
| `has(clave)` | Devuelve un booleano que indica si existe la clave |
| `delete(clave)` | Elimina la entrada y devuelve `true` si existía; si no, `false` |
| `clear()` | Elimina todas las entradas y devuelve `undefined` |
| `size` | Número de entradas, no de claves y valores sumados |

También puedes proporcionar un array de pares al crear el mapa:

```javascript
const grupos = new Map([
  ["A01", "DAW2"],
  ["A02", "DAW1"],
  ["A03", "DAW2"]
]);
console.log(grupos.size); // 3: el valor DAW2 puede repetirse
```

Cada par es un array de dos posiciones: clave y valor. Si la misma clave aparece varias veces al construir el mapa, se conserva el último valor asociado, con la posición de inserción inicial de la clave.

### `get` y `has` no contestan lo mismo

```javascript
const existencias = new Map([
  ["RAT", 0],
  ["TEC", 3]
]);

if (existencias.has("RAT")) {
  console.log("Unidades:", existencias.get("RAT")); // 0
} else {
  console.log("Código desconocido.");
}
```

No uses `if (existencias.get("RAT"))` para saber si el código existe: su valor es `0`, que se considera falso en una condición. Lo mismo puede ocurrir con `false` o una cadena vacía.

```javascript
const pendientes = new Map();
pendientes.set("A01", undefined);
console.log(pendientes.get("A01")); // undefined
console.log(pendientes.get("A99")); // undefined
console.log(pendientes.has("A01")); // true
console.log(pendientes.has("A99")); // false
```

En este ejemplo, `get` por sí solo no distingue una clave ausente de otra cuyo valor es `undefined`. Para comprobar la existencia utiliza `has`.

### Qué puede ser una clave

Un `Map` admite claves de distintos tipos. El número `5` y la cadena `"5"` son claves diferentes. En las prácticas utilizaremos códigos de texto, normalizados siempre de la misma forma.

```javascript
const datos = new Map();
datos.set(5, "Clave numérica");
datos.set("5", "Clave de texto");
console.log(datos.size);     // 2
console.log(datos.get(5));   // Clave numérica
console.log(datos.get("5")); // Clave de texto
```

No confundas `mapa.get("A01")` con `mapa["A01"]`: los corchetes no consultan las entradas del mapa. Asignar `mapa["A01"] = 8` crea una propiedad ordinaria del objeto, ajena a `set`, `get` y `size`. Para las entradas usa sus métodos.

A diferencia de `Map`, las claves de propiedades de un objeto ordinario son cadenas o símbolos. No necesitamos estudiar símbolos aquí; basta evitar la afirmación de que todas las claves de cualquier objeto son exclusivamente texto.

### Recorrer y obtener claves o valores

```javascript
const notas = new Map([
  ["A01", 8],
  ["A02", 6]
]);

for (const par of notas) {
  console.log("Código: " + par[0] + ". Nota: " + par[1]);
}

for (const codigo of notas.keys()) {
  console.log(codigo); // A01 y A02
}

for (const nota of notas.values()) {
  console.log(nota); // 8 y 6
}
```

Recorrer el mapa directamente equivale a recorrer sus entradas con `entries()`. `keys()`, `values()` y `entries()` devuelven objetos que se pueden recorrer, no arrays. No les apliques `push` ni esperes encontrar una propiedad `length`. Si necesitas un array, conviértelos mediante spread:

```javascript
const notas = new Map([["A01", 8], ["A02", 6]]);
const codigos = [...notas.keys()];
const calificaciones = [...notas.values()];
console.log(codigos.join(", ")); // A01, A02
console.log(calificaciones);    // [8, 6]
```

En las primeras prácticas realiza las modificaciones antes o después del recorrido, para no mezclar la presentación con cambios en la colección.

### Eliminar y vaciar

```javascript
const notas = new Map([["A01", 8], ["A02", 6]]);
console.log(notas.delete("A01")); // true
console.log(notas.delete("A99")); // false
console.log(notas.size);          // 1
notas.clear();
console.log(notas.size);          // 0
```

`delete` retira una entrada; `clear` las retira todas. Si eliminas una clave y después vuelves a insertarla, se coloca al final del orden de inserción. Eliminar una entrada no elimina automáticamente datos relacionados de otra colección: el programa debe decidir cómo mantener esa relación.

## 4.4.2. `Set`

Un `Set` es una colección de **valores únicos**. No almacena un dato asociado a cada valor ni permite seleccionar elementos mediante índices. Un valor está o no está: `has` responde a esa pregunta.

### Crear y utilizar un conjunto

```javascript
const vistos = new Set();
vistos.add("index.html");
vistos.add("app.js");
vistos.add("index.html");

console.log(vistos.size);          // 2
console.log(vistos.has("app.js")); // true
console.log(vistos.has("estilo.css")); // false
```

| Operación | Resultado |
| --- | --- |
| `add(valor)` | Añade si no estaba y devuelve el propio `Set` |
| `has(valor)` | Devuelve si el valor pertenece al conjunto |
| `delete(valor)` | Elimina el valor y devuelve si estaba presente |
| `clear()` | Elimina todos los valores y devuelve `undefined` |
| `size` | Número de valores únicos |

`add` no devuelve `true` cuando inserta ni `false` cuando el valor se repite. Si necesitas informar de una repetición, comprueba `has` antes de añadir. `const` permite modificar una colección mediante sus métodos, pero no reasignar la variable a otro conjunto.

### Duplicados, orden e igualdad

```javascript
const inscritos = new Set(["Ana", "Luis", "Ana", "Nora"]);
console.log(inscritos.size); // 3
for (const nombre of inscritos) {
  console.log(nombre); // Ana, Luis, Nora: orden de primera inserción
}
inscritos.delete("Luis");
inscritos.add("Luis");
console.log([...inscritos]); // ["Ana", "Nora", "Luis"]
```

El conjunto conserva el orden de inserción, pero no proporciona acceso posicional: `inscritos[0]` no obtiene el primer valor. Añadir un valor ya presente no cambia su posición. Eliminarlo y volverlo a añadir sí lo incorpora al final.

La comparación utilizada por `Set` y por las claves de `Map` se denomina **SameValueZero**. Para los valores habituales se comporta como `===`; además, reconoce `NaN` como igual a `NaN`. `0` y `-0` se consideran el mismo valor. Los tipos siguen importando:

```javascript
const valores = new Set([5, "5", NaN, NaN, 0, -0]);
console.log(valores.size); // 4: 5, "5", NaN y 0
console.log(valores.has(NaN)); // true
```

### Normalizar antes de añadir

```javascript
const codigos = new Set();
const primerCodigo = " a01 ".trim().toUpperCase();
const segundoCodigo = "A01".trim().toUpperCase();
codigos.add(primerCodigo);
codigos.add(segundoCodigo);
console.log(codigos.size); // 1
```

Sin esa limpieza, `" a01 "`, `"a01"` y `"A01"` serían tres cadenas diferentes. La normalización es una regla del programa, no una tarea automática de `Set`. Aplícala tanto al guardar como al consultar. No cambies mayúsculas o espacios si en tu problema tienen un significado distinto.

### Convertir entre arrays y conjuntos

```javascript
const visitas = ["inicio", "ayuda", "inicio", "contacto"];
const paginasUnicas = new Set(visitas);
const listaUnica = [...paginasUnicas];
console.log(listaUnica); // ["inicio", "ayuda", "contacto"]
console.log(visitas.length); // 4: el array original no cambia
```

La conversión elimina repeticiones pero pierde su frecuencia: el conjunto no informa de cuántas veces se visitó cada página. Si necesitas un contador por página, un `Map` que relacione página con cantidad sería más apropiado.

## Copias y valores que son objetos

`const otra = coleccion` crea otra referencia a la misma colección. Para obtener un contenedor independiente utiliza su constructor:

```javascript
const notas = new Map([["A01", 8]]);
const copiaNotas = new Map(notas);
copiaNotas.set("A01", 10);
console.log(notas.get("A01")); // 8

const presentes = new Set(["A01"]);
const copiaPresentes = new Set(presentes);
copiaPresentes.add("A02");
console.log(presentes.size); // 1
```

Son **copias superficiales**, como en arrays. Si una clave o un valor es un objeto, no se copia automáticamente su contenido. Los objetos se reconocen por identidad, no por tener las mismas propiedades:

```javascript
const alumno = { codigo: "A01" };
const personas = new Set();
personas.add(alumno);
personas.add(alumno);
personas.add({ codigo: "A01" });
console.log(personas.size); // 2: hay dos objetos distintos
console.log(personas.has(alumno)); // true
console.log(personas.has({ codigo: "A01" })); // false: otro objeto nuevo
```

La misma regla se aplica a claves de objeto en un `Map`. Para evitar esta dificultad en las prácticas de registro, utilizaremos códigos de texto que identifican a cada persona o material.

## Ampliación: representar los datos con JSON

Para los mapas y conjuntos habituales creados aquí, `JSON.stringify` no conserva sus entradas directamente: produce `"{}"`. Primero se convierten los datos a arrays y después se reconstruye la colección.

```javascript
const notas = new Map([["A01", 8], ["A02", 6]]);
const textoMapa = JSON.stringify([...notas]);
const mapaRecuperado = new Map(JSON.parse(textoMapa));
console.log(mapaRecuperado.get("A02")); // 6

const presentes = new Set(["A01", "A02"]);
const textoSet = JSON.stringify([...presentes]);
const setRecuperado = new Set(JSON.parse(textoSet));
console.log(setRecuperado.has("A01")); // true
```

En el mapa se guarda un array de pares; en el conjunto, un array de valores. Estos ejemplos parten de texto generado por el propio programa y de cadenas y números representables en JSON. Con datos externos tendrías que controlar errores de lectura y validar la estructura. JSON tampoco conserva de manera general valores como `undefined`, ni la identidad de claves que sean objetos. No es una copia universal.

Esta ampliación no es necesaria para las prácticas siguientes: no se exige almacenar datos ni utilizar JSON.

## Errores frecuentes

| Error | Qué revisar |
| --- | --- |
| `mapa.length` o `conjunto.length` devuelve `undefined` | El tamaño se consulta con `size` |
| `mapa[clave]` no devuelve el dato guardado | Las entradas se leen con `get` |
| Un valor cero parece una clave inexistente | Comprueba la clave con `has` |
| Un nombre con otras mayúsculas se duplica | Define y aplica la misma normalización |
| Se comprueba el resultado de `add` como si fuera booleano | `add` devuelve el Set; usa `has` para detectar duplicados |
| La supuesta copia modifica el original | Se ha copiado la referencia, no el contenedor |
| Se espera orden alfabético | Las colecciones conservan el orden de inserción |
| Se usa `clear` para borrar una sola entrada | Utiliza `delete` con la clave o el valor concreto |

## Caso práctico resuelto: registrar la asistencia a un taller

Tenemos un catálogo de alumnos y un registro de quiénes ya han llegado. El catálogo utiliza un `Map` de **código → nombre**. La asistencia utiliza un `Set` de **códigos presentes**, porque cada alumno debe contarse una sola vez.

| Colección | Contenido inicial |
| --- | --- |
| Catálogo `alumnos` | A01 → Ana; A02 → Luis; A03 → Marta |
| Conjunto `presentes` | A01 |

Pide un código, normalízalo y comprueba que existe en el catálogo antes de registrar la asistencia. Cancelar, dejar vacío, introducir un código desconocido o repetir uno presente no debe alterar el registro.

**`asistencia.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Asistencia al taller</title>
</head>
<body>
  <h1>Asistencia al taller</h1>
  <p>Consulta el resultado en la consola. Recarga para empezar de nuevo.</p>
  <script src="asistencia.js"></script>
</body>
</html>
```

**`asistencia.js`**

```javascript
const alumnos = new Map([
  ["A01", "Ana"],
  ["A02", "Luis"],
  ["A03", "Marta"]
]);
const presentes = new Set(["A01"]);
const entrada = prompt("Código del alumno que llega:");

if (entrada === null) {
  console.log("Registro cancelado.");
} else {
  const codigo = entrada.trim().toUpperCase();
  if (codigo === "") {
    console.log("Debes escribir un código.");
  } else if (!alumnos.has(codigo)) {
    console.log("El código no pertenece al catálogo.");
  } else if (presentes.has(codigo)) {
    console.log("La asistencia de " + alumnos.get(codigo) + " ya estaba registrada.");
  } else {
    presentes.add(codigo);
    console.log("Asistencia registrada: " + alumnos.get(codigo));
  }
}

console.log("Alumnos del catálogo:", alumnos.size);
console.log("Presentes:", presentes.size);
console.log("Listado de presentes:");
for (const codigo of presentes) {
  console.log(codigo + " - " + alumnos.get(codigo));
}

console.log("Pendientes de llegar:");
let pendientes = 0;
for (const par of alumnos) {
  if (!presentes.has(par[0])) {
    console.log(par[0] + " - " + par[1]);
    pendientes += 1;
  }
}
if (pendientes === 0) {
  console.log("No queda nadie pendiente.");
}
```

### Lectura del resultado

Abre el HTML en el navegador y muestra la consola. Con la entrada ` a02 ` se obtiene:

```text
Asistencia registrada: Luis
Alumnos del catálogo: 3
Presentes: 2
Listado de presentes:
A01 - Ana
A02 - Luis
Pendientes de llegar:
A03 - Marta
```

1. El código se transforma en `A02`. No modificamos el nombre del alumno ni buscamos por su posición en una lista.
2. `alumnos.has` comprueba que el código pertenece al catálogo; `alumnos.get` recupera su nombre.
3. `presentes.has` detecta una repetición y `add` incorpora solo un código válido que todavía no estaba.
4. `size` tiene distinto significado en cada colección: alumnos conocidos y alumnos presentes.
5. El recorrido del Set obtiene códigos; el recorrido del Map obtiene pares de código y nombre. No hace falta desestructuración para leer `par[0]` y `par[1]`.
6. El catálogo no cambia. El conjunto únicamente contiene códigos del catálogo porque la comprobación se realiza antes de añadir.

Prueba `A01`, `A99`, espacios y Cancelar: se conserva un único presente. Con `a03` se registra Marta. Para comprobar la rama sin pendientes, cambia temporalmente la inicialización por `new Set(["A01", "A02", "A03"])` y cancela el diálogo.

Cada recarga reconstruye el catálogo y el conjunto inicial. Para probar una repetición, usa A01 o cambia los datos iniciales: el programa no conserva las altas de una ejecución anterior. Esta práctica no es un sistema real de identificación; utiliza datos ficticios y códigos conocidos.

## Ejercicio propuesto: controlar préstamos de material a un grupo

### Contexto

Un grupo puede pedir una unidad de cada tipo de material. Hay que comprobar que el código existe, que quedan unidades disponibles y que ese grupo no lo ha recibido ya. Un `Map` guardará las existencias disponibles y un `Set` los códigos ya prestados a ese grupo.

### Datos de partida

| Colección o dato | Valor inicial |
| --- | --- |
| `stock` | Map con TEC → 3, RAT → 0 y CAM → 2 |
| `prestados` | Set con CAM |
| Significado de los códigos | TEC: teclado; RAT: ratón; CAM: cámara |
| Cantidad por operación válida | Una unidad del código solicitado |

Las existencias son las unidades que **quedan disponibles**: las dos cámaras del mapa no incluyen la que ya tiene el grupo. Crea `prestamos.html` y `prestamos.js`; la entrada será un único `prompt` y la salida se verá en consola.

### Requisitos obligatorios

1. Construye las colecciones con los datos de partida y muestra su estado inicial. Utiliza códigos de texto y cantidades numéricas.
2. Pide un código y normalízalo con `trim` y `toUpperCase`. Cancelar o dejarlo vacío debe informar sin modificar ninguna colección.
3. Comprueba con `stock.has` si el código existe. No confundas un código con cero unidades con un código desconocido.
4. Si el grupo ya tiene ese material según `prestados.has`, rechaza la petición sin descontar unidades.
5. Si quedan cero unidades, informa de falta de existencias sin añadir el código al Set.
6. En una petición válida, recupera las unidades con `get`, resta una, actualiza el Map con `set` y añade el código al Set con `add`.
7. Muestra al final cada código y sus unidades con `for...of`, el tamaño del Map y los códigos prestados. Convierte el Set a array si deseas presentarlo con `join`.
8. Documenta por qué una actualización del stock no aumenta `stock.size` y por qué un préstamo repetido no debe modificar las existencias.

### Pistas de diseño

- Realiza primero las comprobaciones y después las dos modificaciones de la operación válida.
- El orden de mensajes será: cancelación o vacío, código desconocido, ya prestado, sin existencias y préstamo aceptado.
- No utilices `if (stock.get(codigo))` para comprobar la existencia: RAT existe y tiene valor 0.
- `set` actualiza el número asociado al código; no descuenta nada automáticamente.
- El conjunto representa los materiales recibidos por **un único grupo**, no el historial de todos los grupos.
- No necesitas JSON, almacenamiento, clases, eventos, DOM ni métodos de operaciones agregadas de 4.5.

### Casos que debes probar

Recarga antes de cada prueba normal para recuperar el estado inicial.

| Entrada | Resultado esperado |
| --- | --- |
| `TEC` | Préstamo aceptado; TEC queda en 2 y el Set contiene CAM y TEC |
| ` tec ` | Mismo resultado tras normalizar |
| `RAT` | Sin existencias; stock y Set permanecen iguales |
| `CAM` | Ya prestado; CAM sigue con 2 unidades disponibles |
| `IMP` | Código desconocido; no se crea una entrada nueva |
| Solo espacios | Aviso; no cambia ninguna colección |
| Cancelar | Cancelación; no cambia ninguna colección |

Con TEC, el Map debe seguir teniendo **3 entradas**, y el Set pasa de **1 a 2 valores**. Su orden de presentación será CAM y TEC, no necesariamente alfabético.

Para comprobar el último ejemplar, cambia temporalmente TEC a 1 y solicita TEC: debe quedar en 0 y registrarse el préstamo. Para comprobar un préstamo repetido de TEC, inclúyelo también en el Set inicial y verifica que no se descuenta ninguna unidad. Restaura los datos originales al terminar.

### Entrega

Entrega los dos archivos, una captura del préstamo válido de TEC y una tabla de pruebas con entrada, mensaje, existencias finales y códigos prestados.

Explica qué representa cada colección, qué devuelve `get` frente a `has`, por qué se utilizan `size` y no `length`, y por qué no se deben usar corchetes para actualizar una entrada del mapa.

Se valora elegir y utilizar las colecciones con coherencia, mantener sincronizadas las dos modificaciones del préstamo válido y documentar las pruebas (**RA4.k**), como continuación del trabajo con estructuras de datos de la UT4.

## Referencias para consultar

- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).
