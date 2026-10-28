---
title: 4.5 Operaciones agregadas
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.5. Operaciones agregadas sobre colecciones

En 4.3 recorríamos un array con bucles. Ahora utilizaremos métodos que expresan una intención concreta: **recorrer, transformar, seleccionar, acumular o consultar**. No se trata de sustituir cualquier bucle por una cadena de métodos, sino de elegir la operación que produce el resultado que necesitamos.

Este apartado desarrolla las operaciones sobre información almacenada en colecciones (**RA4.e**) y la depuración y documentación del código (**RA4.k**). Consulta el [RA4 de la unidad](ra4.md), el [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405) y el currículo de Cantabria de la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244).

!!! note "Alcance y conocimientos previos"
    Necesitas funciones y flechas de 4.2, arrays de 4.3 y comprobaciones numéricas de 4.1. Trabajaremos con arrays sin huecos, de números o cadenas, y resultados en consola. No hacen falta clases, eventos, DOM, peticiones de red ni almacenamiento.

## Entender una función callback

Una **callback** es una función que entregamos a otra operación para que esta la llame. No significa necesariamente que se ejecute más tarde: los métodos de arrays de esta página ejecutan sus callbacks de forma síncrona, durante la llamada al método.

```javascript
function duplicar(numero) {
  return numero * 2;
}

const cantidades = [2, 4, 6];
const dobles = cantidades.map(duplicar);
console.log(dobles); // [4, 8, 12]
```

Pasamos `duplicar`, la referencia a la función, sin ejecutarla nosotros. `cantidades.map(duplicar())` sería distinto: llamaría inmediatamente a `duplicar` sin argumentos y pasaría su resultado a `map`, en lugar de una función.

La misma transformación puede escribirse con una flecha:

```javascript
const cantidades = [2, 4, 6];
const dobles = cantidades.map((numero) => numero * 2);
console.log(dobles); // [4, 8, 12]
```

En `forEach`, `map`, `filter`, `find`, `findIndex`, `some` y `every`, la callback puede recibir **elemento, índice y array recorrido**, en ese orden. Solo tienes que declarar los parámetros que necesitas. Sus nombres los eliges tú; el método proporciona los valores. `reduce` tiene otro orden: acumulador, elemento, índice y array.

| Necesidad | Método | Resultado |
| --- | --- | --- |
| Realizar una acción por elemento | `forEach` | `undefined` |
| Obtener un valor transformado por elemento | `map` | Array nuevo |
| Conservar los elementos que cumplan una condición | `filter` | Array nuevo |
| Acumular un resultado | `reduce` | El valor acumulado |
| Obtener la primera coincidencia | `find` | Elemento o `undefined` |
| Obtener la posición de la primera coincidencia | `findIndex` | Índice o `-1` |
| Comprobar si hay alguna coincidencia | `some` | Booleano |
| Comprobar si todos cumplen | `every` | Booleano |
| Comprobar si aparece un valor concreto | `includes` | Booleano; no recibe callback |

## Recorrer: `forEach`

```javascript
const notas = [7, 4, 9];
const resultado = notas.forEach((nota, indice) => {
  console.log("Prueba " + (indice + 1) + ": " + nota);
});
console.log(resultado); // undefined
```

`forEach` sirve aquí para mostrar cada nota. No construye un array con los mensajes ni devuelve las notas: su resultado es siempre `undefined`. Si necesitas una nueva lista, utiliza `map`.

Un `return` dentro de la callback termina esa llamada de la función, pero no detiene todo el recorrido de `forEach`. No puedes usar `break` dentro de ella como si fuera el cuerpo de un bucle. Para buscar y parar en la primera coincidencia tienes `find` o `some`; si necesitas controlar explícitamente un bucle, puedes seguir usando `for`.

## Transformar: `map`

```javascript
const notas = [7, 4, 9, 5, 10];
const porcentajes = notas.map((nota) => nota * 10);
console.log(porcentajes); // [70, 40, 90, 50, 100]
console.log(notas);       // [7, 4, 9, 5, 10]
```

En un array sin huecos, `map` genera un elemento de salida por cada elemento de entrada y mantiene el orden. Lo que devuelve la callback se coloca en esa posición del nuevo array.

### Retorno implícito y explícito

```javascript
const notas = [7, 4, 9];
const correctas = notas.map((nota) => {
  return nota * 10;
});
const sinRetorno = notas.map((nota) => {
  nota * 10;
});
console.log(correctas); // [70, 40, 90]
console.log(sinRetorno); // [undefined, undefined, undefined]
```

Con llaves debes devolver el valor expresamente. No utilices `map` solo para mostrar mensajes y descartar su resultado: para esa intención es más claro `forEach`.

También hay que prestar atención a los argumentos que el método entrega. Por ejemplo, no pases `parseInt` directamente a `map`: recibiría el índice como segundo argumento y lo interpretaría como la base de numeración. Escribe una callback que especifique la conversión:

```javascript
const textos = ["10", "11", "12"];
const numeros = textos.map((texto) => Number.parseInt(texto, 10));
console.log(numeros); // [10, 11, 12]
```

Esta conversión interpreta prefijos enteros; no valida por sí sola una entrada completa. Para ese objetivo aplica las comprobaciones de 4.1.

## Filtrar: `filter`

```javascript
const notas = [7, 4, 9, 5, 10];
const aprobados = notas.filter((nota) => nota >= 5);
console.log(aprobados); // [7, 9, 5, 10]
console.log(notas);     // La lista original no cambia.
```

La callback actúa como **condición**: si su resultado se considera verdadero, se conserva el elemento original. Si se considera falso, se descarta. Conviene devolver una comparación booleana clara. `filter` no transforma los valores y conserva su orden relativo; puede producir desde un array vacío hasta una lista con todos los elementos.

No confundas estas dos llamadas:

```javascript
const notas = [4, 7];
console.log(notas.map((nota) => nota >= 5));    // [false, true]
console.log(notas.filter((nota) => nota >= 5)); // [7]
```

La primera crea booleanos; la segunda selecciona notas. Si escribes una callback de filtro con llaves y olvidas `return`, devolverá `undefined` y no conservará ningún elemento.

## Reducir: `reduce`

`reduce` combina los elementos en un resultado que se va actualizando. En este apartado utilizaremos acumuladores numéricos para que cada paso sea fácil de seguir.

```javascript
const minutos = [10, 15, 5];
const total = minutos.reduce((acumulado, tiempo) => acumulado + tiempo, 0);
console.log(total); // 30
```

| Paso | Acumulado recibido | Elemento | Valor devuelto por la callback |
| --- | --- | --- | --- |
| 1 | 0 | 10 | 10 |
| 2 | 10 | 15 | 25 |
| 3 | 25 | 5 | 30 |

El `0` escrito después de la callback es el **valor inicial**, no un índice. El resultado de cada llamada se convierte en el acumulado de la siguiente. Si usas un bloque con llaves, recuerda `return acumulado + tiempo`.

### Valor inicial y array vacío

```javascript
const vacio = [];
console.log(vacio.reduce((suma, numero) => suma + numero, 0)); // 0
// Sin el 0 inicial, esta reducción sobre [] lanzaría TypeError.
```

Con valor inicial, un array vacío devuelve ese valor sin ejecutar la callback. Sin valor inicial, en un array no vacío se toma el primer elemento como acumulador y se comienza a combinar desde el siguiente. Si no hay elementos disponibles, se produce un error. En estas sumas escribiremos siempre `0`.

El valor inicial depende de la operación: para un producto suele ser `1`, no `0`. Elige también el tipo correcto: sumar números sobre una cadena vacía puede provocar concatenación.

### Calcular una media sin dividir entre cero

```javascript
const notas = [7, 4, 9];
const suma = notas.reduce((total, nota) => total + nota, 0);
if (notas.length > 0) {
  console.log("Media:", (suma / notas.length).toFixed(2)); // 6.67
} else {
  console.log("Sin datos para calcular la media.");
}
```

El denominador debe ser la longitud de la colección que has sumado. Si calculas la media de una selección, divide entre la cantidad de elementos seleccionados, no entre la longitud de la lista completa. `toFixed` devuelve texto y se usa al presentar, después del cálculo.

## Consultar

```javascript
const notas = [7, 4, 9, 5, 10];
console.log(notas.find((nota) => nota >= 9));     // 9
console.log(notas.findIndex((nota) => nota >= 9)); // 2
console.log(notas.some((nota) => nota < 5));      // true
console.log(notas.every((nota) => nota >= 5));    // false
console.log(notas.includes(10));                 // true
```

`find` y `findIndex` se detienen en la primera coincidencia. `some` puede terminar cuando encuentra un caso verdadero; `every`, cuando encuentra uno falso. `filter`, en cambio, reúne todas las coincidencias.

### Ausencia de coincidencias y valores falsos

```javascript
const valores = [0, 3, 6];
const encontrado = valores.find((numero) => numero === 0);
if (encontrado !== undefined) {
  console.log("Encontrado:", encontrado); // 0
}

const posicion = valores.findIndex((numero) => numero === 8);
if (posicion === -1) {
  console.log("No hay coincidencia.");
}
```

No uses `if (encontrado)` si cero es un resultado válido, ni `if (posicion)` para comprobar índices: el índice 0 también es válido. En una colección que pueda contener `undefined`, `find` no distingue ese valor encontrado de la ausencia; `findIndex` permite comprobar la posición.

`includes` busca un valor, no una condición. Distingue tipos (`3` y `"3"`) y encuentra `NaN` gracias a la comparación SameValueZero, como vimos con Set. No es exactamente lo mismo que comparar siempre mediante `===`.

### Qué ocurre con una colección vacía

| Operación sobre `[]` | Resultado |
| --- | --- |
| `forEach(callback)` | `undefined`; no llama a la callback |
| `map(callback)` y `filter(callback)` | `[]` |
| `reduce(callback, 0)` | `0` |
| `find(callback)` | `undefined` |
| `findIndex(callback)` | `-1` |
| `some(callback)` | `false` |
| `every(callback)` | `true` |
| `includes(valor)` | `false` |

`every` devuelve `true` en una lista vacía porque no encuentra ningún elemento que incumpla la condición. Eso **no demuestra que existan datos**. Si el mensaje es «todas las pruebas están aprobadas», comprueba también que la lista no esté vacía antes de anunciarlo.

## Encadenar

El resultado de un método puede ser la entrada del siguiente. Comprueba su tipo antes de continuar: `filter` y `map` devuelven arrays; una suma con `reduce` devuelve un número y ya no permite seguir con métodos de array.

```javascript
const notas = [7, 4, 9, 5, 10];
const porcentajesAprobados = notas
  .filter((nota) => nota >= 5)
  .map((nota) => nota * 10);
console.log(porcentajesAprobados); // [70, 90, 50, 100]
```

### El orden puede cambiar el resultado

```javascript
const puntos = [4, 5];
const primeroFiltrar = puntos.filter((n) => n >= 5).map((n) => n + 1);
const primeroSumar = puntos.map((n) => n + 1).filter((n) => n >= 5);
console.log(primeroFiltrar); // [6]
console.log(primeroSumar);   // [5, 6]
```

Decide si la condición corresponde a los datos originales o a los transformados. Una cadena larga no es necesariamente más clara: durante el aprendizaje es útil guardar las etapas en variables (`validas`, `seleccionadas`, `total`) y comprobar cada resultado.

### No modificar el original desde las callbacks

`map` y `filter` crean arrays nuevos, pero **no impiden que tu callback modifique datos externos o el array recibido**. Tampoco realizan una copia profunda de objetos. En estos ejemplos las callbacks solo leen números o cadenas y devuelven resultados, por lo que el original permanece intacto.

No añadas ni elimines elementos de la misma lista mientras ejecutas estos métodos. Las diferencias de comportamiento con huecos complican además el análisis: muchos métodos, como `map` y `filter`, omiten posiciones vacías, mientras que `find` y `findIndex` las visitan como `undefined`. Trabajaremos con arrays densos, sin huecos, como los literales de las prácticas.

## Ejemplo con cadenas

```javascript
const nombres = ["  Alex ", "", " Luis", "Mar", "   "];
const limpios = nombres.map((nombre) => nombre.trim());
const conContenido = limpios.filter((nombre) => nombre !== "");
const largos = conContenido.filter((nombre) => nombre.length >= 4);
console.log(limpios);      // ["Alex", "", "Luis", "Mar", ""]
console.log(conContenido); // ["Alex", "Luis", "Mar"]
console.log(largos);       // ["Alex", "Luis"]
```

Primero limpiamos, después rechazamos los vacíos y por último aplicamos la regla de longitud. Todos los elementos de partida son cadenas; si recibieses tipos mezclados, tendrías que comprobarlos antes de llamar a `trim`.

Un filtro no elimina duplicados automáticamente: dos elementos iguales que cumplen la condición permanecen en la salida. Para valores únicos puedes utilizar el `Set` estudiado en 4.4.

!!! tip "Depurar y documentar"
    Coloca un punto de interrupción dentro de la callback y observa el elemento, el índice y, en reduce, el acumulador. Escribe qué devuelve cada etapa y prueba una lista vacía, una con un elemento y otra sin coincidencias. Si el resultado aparece como undefined, revisa los return antes de cambiar el algoritmo completo.

## Caso práctico resuelto: informe de resultados de un repaso

El aula dispone de cinco calificaciones de un repaso. Queremos comprobar que los datos son válidos, mostrar sus porcentajes, seleccionar los aprobados y calcular una media. Además, consultaremos si hay suspensos y cuál es el primero.

| Dato | Valor |
| --- | --- |
| Array inicial `notas` | `[7, 4, 9, 5, 10]` |
| Nota válida | Número finito entre 0 y 10; se admiten decimales |
| Aprobado | Nota mayor o igual que 5 |
| Conversión a porcentaje | Multiplicar por 10 |

Crea estos archivos en la misma carpeta. Abre el HTML en el navegador y consulta la consola. Para probar otros datos, cambia el literal de `notas` y recarga.

**`repaso.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Informe de repaso</title>
</head>
<body>
  <h1>Informe de repaso</h1>
  <p>Abre la consola para consultar el análisis.</p>
  <script src="repaso.js"></script>
</body>
</html>
```

**`repaso.js`**

```javascript
const notas = [7, 4, 9, 5, 10];
const datosValidos = notas.every((nota) =>
  Number.isFinite(nota) && nota >= 0 && nota <= 10
);

if (notas.length === 0) {
  console.log("No hay calificaciones para analizar.");
} else if (!datosValidos) {
  console.log("Hay calificaciones no válidas. No se genera el informe.");
} else {
  const porcentajes = notas.map((nota) => nota * 10);
  const aprobados = notas.filter((nota) => nota >= 5);
  const sumaAprobados = aprobados.reduce((suma, nota) => suma + nota, 0);
  const haySuspensos = notas.some((nota) => nota < 5);
  const todosAprobados = notas.every((nota) => nota >= 5);
  const primerSuspenso = notas.find((nota) => nota < 5);
  const indiceSuspenso = notas.findIndex((nota) => nota < 5);

  console.log("Notas originales:", notas.join(", "));
  porcentajes.forEach((porcentaje, indice) => {
    console.log("Prueba " + (indice + 1) + ": " + porcentaje + "%");
  });
  console.log("Aprobados:", aprobados.length);
  if (aprobados.length === 0) {
    console.log("No hay aprobados para calcular su media.");
  } else {
    console.log("Media de aprobados:", (sumaAprobados / aprobados.length).toFixed(2));
  }
  console.log("¿Hay suspensos?", haySuspensos);
  console.log("¿Todos aprobados?", todosAprobados);
  if (indiceSuspenso !== -1) {
    console.log("Primer suspenso: " + primerSuspenso + ", en la prueba " + (indiceSuspenso + 1));
  } else {
    console.log("No hay suspensos.");
  }
  console.log("Original conservado:", notas.join(", "));
}
```

### Lectura del resultado

Con los datos iniciales se obtiene:

```text
Notas originales: 7, 4, 9, 5, 10
Prueba 1: 70%
Prueba 2: 40%
Prueba 3: 90%
Prueba 4: 50%
Prueba 5: 100%
Aprobados: 4
Media de aprobados: 7.75
¿Hay suspensos? true
¿Todos aprobados? false
Primer suspenso: 4, en la prueba 2
Original conservado: 7, 4, 9, 5, 10
```

1. La primera llamada a `every` comprueba tipos y límites, sin convertir cadenas en números. El vacío se trata por separado.
2. `map` produce cinco porcentajes; `forEach` los presenta sin crear otra lista.
3. `filter` conserva `7, 9, 5, 10`. Son cuatro aprobados y suman 31, por lo que su media es `31 / 4 = 7.75`.
4. `some` y `every` responden preguntas distintas. `find` devuelve el primer suspenso y `findIndex` su índice 1; para mostrar «prueba 2» sumamos uno al índice.
5. La lista original sigue igual porque las callbacks no la modifican. El filtro conserva el orden de las notas, no las ordena.

| Array de prueba | Resultado esperado |
| --- | --- |
| `[]` | Mensaje de ausencia; no se calcula ninguna media |
| `[5, 10]` | Dos aprobados, media `7.50`, ningún suspenso |
| `[2, 4]` | Cero aprobados; aviso sin división entre cero; primer suspenso 2 |
| `[0, 5]` | Un aprobado, media `5.00`; el primer suspenso es 0, no «ausente» |
| `[5]` | Un aprobado y media `5.00` |
| `[4.5, 7.5]` | Un aprobado y media `7.50` |
| `[7, "8"]`, `[11]`, `[NaN]` o `[Infinity]` | Datos no válidos; no se genera informe |

No se intenta reparar silenciosamente una lista incorrecta. La política del caso es rechazar el informe completo si algún dato incumple las reglas. No uses arrays con huecos en esta práctica.

## Ejercicio propuesto: analizar la duración de actividades

### Contexto

El departamento quiere revisar la duración prevista de varias actividades. Cada elemento del array representa minutos de una actividad, en su orden original. Debes producir un informe mediante operaciones agregadas, sin modificar los datos iniciales.

### Datos de partida

| Dato | Valor |
| --- | --- |
| Array `duraciones` | `[20, 45, 10, 60, 30]` |
| Duración válida | Número entero entre 0 y 180 minutos |
| Actividad larga | Duración mayor o igual que 30 minutos |
| Límite que se desea consultar | 45 minutos |
| Conversión de minutos a segundos | Multiplicar por 60 |

Crea `actividades.html` y `actividades.js`. La entrada es el array literal: para probar, modifica sus valores y recarga. No necesitas `prompt` ni formularios.

### Requisitos obligatorios

1. Comprueba con `every` que todas las duraciones sean números enteros entre 0 y 180. Rechaza cadenas, decimales, valores negativos e infinitos. Si alguna es incorrecta, informa y no continúes con el análisis.
2. Trata el array vacío por separado: indica que no hay actividades, sin medias ni mensajes que afirmen que todas cumplen una regla.
3. Genera con `map` un array de segundos, sin cambiar los minutos originales, y muestra cada resultado mediante `forEach` con numeración desde 1.
4. Selecciona con `filter` las actividades largas. Calcula con `reduce` y valor inicial 0 tanto el total de todos los minutos como el total de la selección.
5. Muestra la media de las actividades largas con dos decimales, únicamente si la selección no está vacía. Divide entre la longitud de esa selección.
6. Usa `some` para comprobar si hay alguna duración superior a 45 y `every` para comprobar si todas son menores o iguales que 45. Recuerda que esta parte se ejecuta solo con datos válidos y no vacíos.
7. Obtén con `find` y `findIndex` la primera duración superior a 45 y su posición. Si no existe, muestra un mensaje de ausencia; no presentes el índice `-1` como una actividad.
8. Muestra al final los minutos originales para comprobar que no se han modificado. Documenta qué devuelve cada método y por qué lo has elegido.

### Pistas de diseño

- Conserva una variable por etapa: segundos, largas, total y suma de largas. Evita una expresión demasiado larga mientras depuras.
- Una callback de `filter` devuelve una condición; una de `map`, el nuevo valor; una de `reduce`, el siguiente acumulado.
- No uses `forEach` para construir manualmente los resultados que se piden con `map`, `filter` o `reduce`.
- Los decimales de presentación se añaden al final con `toFixed`, que devuelve texto.
- No necesitas objetos propios, clases, JSON, eventos, DOM ni almacenamiento. Se trabaja con arrays densos de números.

### Casos que debes probar

| Duraciones | Resultado principal esperado |
| --- | --- |
| `[20, 45, 10, 60, 30]` | Total 165; largas `[45, 60, 30]`, suma 135 y media `45.00`; primera superior a 45: 60, índice 3 (actividad 4) |
| `[]` | Sin actividades; no se calcula media |
| `[10, 20]` | Total 30; ninguna larga; ninguna superior a 45 |
| `[30]` | Una larga; suma y total 30; media `30.00`; no supera 45 |
| `[45, 45]` | Total 90; dos largas; media `45.00`; todas cumplen el límite de 45 |
| `[0, 60]` | Total 60; una larga; media `60.00`; primera superior al límite en el índice 1 |
| `[180]` | Válida en el máximo; una larga y media `180.00` |
| `[-1]`, `[181]`, `[2.5]`, `["30"]`, `[NaN]` o `[Infinity]` | Datos no válidos; sin análisis |

En el caso inicial los segundos son `[1200, 2700, 600, 3600, 1800]`. Hay alguna actividad superior a 45, pero no todas son menores o iguales que 45. La selección mantiene el orden 45, 60, 30: no hay que ordenarla.

### Entrega

Entrega ambos archivos, una captura del caso inicial y una tabla con resultados esperados y observados. Incluye una lista vacía, otra sin actividades largas y otra con un dato incorrecto.

Explica por qué `map` y `filter` no son intercambiables, para qué sirve el 0 inicial de `reduce`, qué devuelve `every` sobre `[]` y por qué la media de la selección no se divide entre el número total de actividades.

La corrección valora elegir y utilizar las operaciones adecuadas (**RA4.e**), controlar los casos límite, conservar los datos originales y documentar las pruebas (**RA4.k**).

## Referencias para consultar

- [MDN: map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) y [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
- [MDN: reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
- [MDN: forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).
- [MDN: every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) y [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
