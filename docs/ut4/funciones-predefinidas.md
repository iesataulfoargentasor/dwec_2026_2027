---
title: 4.1 Funciones predefinidas
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.1. Funciones predefinidas del lenguaje

Una **función predefinida** ya está disponible en el lenguaje o en el entorno de ejecución. La utilizamos para realizar una operación sin escribir su implementación: convertir un texto, comprobar un número o codificar un dato para una URL.

Este apartado trabaja especialmente la clasificación y utilización de funciones predefinidas (**RA4.a**) y la depuración y documentación del código (**RA4.k**). Forma parte del módulo **0612, Desarrollo Web en Entorno Cliente**, del CFGS de Desarrollo de Aplicaciones Web. Puedes consultar el [RA4 de la unidad](ra4.md), el [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405) y el currículo de Cantabria establecido por la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244).

!!! note "Alcance y conocimientos previos"
    Reutilizaremos variables, condiciones, cadenas, números, objetos literales sencillos, diálogos y consola de las UT2 y UT3. Aquí practicamos **llamar a funciones existentes**. La definición de funciones propias comienza en 4.2 y los arrays en 4.3. Los ejemplos y ejercicios de esta página no necesitan eventos, manipulación del DOM, formularios, peticiones de red ni almacenamiento.

## Cómo leer y clasificar una llamada

En `nombre(argumentos)`, los argumentos son los datos que entregamos a la función. El **valor devuelto** es el resultado que podemos guardar o utilizar en otra expresión.

```javascript
const texto = "12.5";
const cantidad = Number(texto);
console.log(cantidad + 1); // 13.5
console.log(texto);        // "12.5": la cadena original no cambia
```

`Number(texto)` devuelve un número; no lo muestra por sí mismo. `console.log` muestra un valor en consola y su resultado es `undefined`. Por eso no debemos guardar el resultado de `console.log` esperando obtener el dato impreso.

En JavaScript no existe una declaración separada de «procedimiento». Se utilizan funciones también para operaciones cuyo resultado no nos interesa; la sintaxis de definición y `return` se estudiarán en 4.2.

| Categoría | Ejemplo | Cómo reconocerla |
| --- | --- | --- |
| Función global del lenguaje | `parseInt("12", 10)`, `encodeURIComponent("DAW 2")` | Se llama directamente por su nombre |
| Conversión con una función incorporada | `Number("12")`, `String(12)`, `Boolean(0)` | En estas conversiones no usamos `new` |
| Método estático de un objeto incorporado | `Number.isFinite(12)`, `JSON.parse("12")`, `Math.max(3, 8)` | Se accede mediante el nombre del objeto y un punto |
| Método de un valor o instancia | `" hola ".trim()`, `fecha.getFullYear()` | Se aplica a un valor o a un objeto concreto |
| Función o método del entorno navegador | `prompt("Nombre")`, `window.alert("Hola")` | Lo proporciona el navegador; no pertenece al núcleo ECMAScript |

Un **método también es una función**, accesible como propiedad de un objeto. En particular, `Number.parseInt` es un método estático de `Number`; `parseInt` es la función global equivalente. No confundas la forma de acceso con el origen de la funcionalidad.

## Conversión y comprobación numérica

Convertir, comprobar y validar son tres pasos distintos: obtenemos un número, comprobamos sus características y decidimos si cumple las reglas del problema.

| Operación | Resultado o finalidad |
| --- | --- |
| `Number(texto)` | Convierte el contenido completo a número; puede producir `NaN` |
| `Number.parseInt(texto, base)` | Interpreta el comienzo del texto como entero en la base indicada |
| `Number.parseFloat(texto)` | Interpreta el comienzo numérico, admitiendo parte decimal y exponente |
| `Number.isNaN(valor)` | Comprueba si el valor es precisamente `NaN`, sin convertirlo |
| `Number.isFinite(valor)` | Comprueba que es un número distinto de `NaN` e infinitos |
| `Number.isInteger(valor)` | Comprueba que es un número entero; no lo redondea ni lo convierte |
| `String(valor)` / `Boolean(valor)` | Convierten explícitamente a texto o booleano |

### Convertir todo el texto o interpretar su comienzo

```javascript
console.log(Number("12.5"));                // 12.5
console.log(Number("12px"));                // NaN
console.log(Number.parseInt("12px", 10));   // 12
console.log(Number.parseInt("12.9", 10));   // 12; no redondea a 13
console.log(Number.parseFloat("12.5 euros")); // 12.5
console.log(Number.parseFloat("euros 12.5")); // NaN
```

`parseInt` y `parseFloat` pueden aceptar solo una parte de la entrada. Son útiles cuando esa interpretación es deliberada, pero **no demuestran que todo el texto sea un número válido**. Para pedir una cantidad completa usaremos `Number` y después comprobaremos el resultado.

| Texto de entrada | `Number(texto)` | `Number.parseInt(texto, 10)` | `Number.parseFloat(texto)` |
| --- | --- | --- | --- |
| `"12.5"` | `12.5` | `12` | `12.5` |
| `"12px"` | `NaN` | `12` | `12` |
| `"12,5"` | `NaN` | `12` | `12` |
| `""` o solo espacios | `0` | `NaN` | `NaN` |
| `"Infinity"` | `Infinity` | `NaN` | `Infinity` |

En estas conversiones se utiliza el **punto decimal**, no la coma. No conviertas `"12,5"` con `parseFloat` esperando obtener `12.5`: obtendrías `12`. Tampoco uses `parseInt` para «arreglar» una cantidad de personas con decimales: debes rechazarla.

### La base de `parseInt`

El segundo argumento indica el sistema de numeración del texto, no el número de decimales del resultado:

```javascript
console.log(Number.parseInt("101", 2));  // 5
console.log(Number.parseInt("101", 10)); // 101
console.log(Number.parseInt("FF", 16));  // 255
console.log(Number.parseInt("08", 10));  // 8
```

Para cantidades escritas en decimal, indica `10`. Las formas globales `parseInt` y `parseFloat` siguen siendo válidas y corresponden a `Number.parseInt` y `Number.parseFloat`. Usar el prefijo `Number.` no cambia las reglas de interpretación. En JavaScript actual un cero inicial no obliga a interpretar octal; omitir la base sí permite inferir hexadecimal con el prefijo `0x`. Escribir la base expresa claramente la intención.

### Comprobar `NaN`, finitud y enteros

```javascript
const numero = Number("hola");
console.log(Number.isNaN(numero));      // true
console.log(Number.isNaN("hola"));      // false: sigue siendo texto
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite("12"));    // false: no convierte cadenas
console.log(Number.isInteger(12.5));    // false
console.log(Number.isInteger(12));      // true
```

`NaN` significa que una operación no ha producido un número utilizable; su tipo sigue siendo `number`. No lo compruebes con `valor === NaN`: esa comparación nunca identifica `NaN`. Además, no ser `NaN` no garantiza que el valor sea finito. Para cantidades habituales, `Number.isFinite` rechaza tanto `NaN` como los infinitos.

Las funciones globales `isNaN` e `isFinite` **no están obsoletas**, pero convierten el argumento antes de comprobarlo. En estas prácticas preferimos las variantes de `Number` para que la conversión sea explícita:

```javascript
console.log(isNaN("hola"));        // true: convierte primero
console.log(Number.isNaN("hola")); // false: no convierte
console.log(isFinite("12"));      // true: convierte primero
console.log(Number.isFinite("12")); // false
```

### Validar una entrada de `prompt`

`prompt` devuelve una cadena o `null` al cancelar. Comprueba la cancelación y el texto vacío **antes** de convertir: `Number(null)` y `Number("")` producen `0`, pero no representan una cantidad introducida voluntariamente.

```javascript
const entrada = prompt("Cantidad de ejemplares (1 a 30):");

if (entrada === null) {
  console.log("Operación cancelada.");
} else if (entrada.trim() === "") {
  console.log("Debes escribir una cantidad.");
} else {
  const cantidad = Number(entrada);
  if (!Number.isFinite(cantidad)) {
    console.log("Escribe un número finito.");
  } else if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 30) {
    console.log("La cantidad debe ser un entero entre 1 y 30.");
  } else {
    console.log("Cantidad aceptada:", cantidad);
  }
}
```

La conversión también admite notaciones como `"1e1"` (10) o `"0x10"` (16). Este ejemplo valida **el valor numérico**, no que el texto contenga exclusivamente dígitos. La validación del formato mediante expresiones regulares se deja para su apartado correspondiente.

### Convertir a texto y a booleano

```javascript
console.log(String(25));       // "25"
console.log(Boolean(0));       // false
console.log(Boolean(""));      // false
console.log(Boolean("false")); // true: es una cadena no vacía
console.log(Boolean("0"));     // true: también es una cadena no vacía
```

`Boolean` no interpreta las palabras «true» y «false». Para una pregunta de sí/no, `confirm` ya devuelve un booleano. Para una respuesta escrita tendrías que comparar el texto con las opciones admitidas. Evita `new Number`, `new String` y `new Boolean` en estas conversiones: crean objetos envoltorio que no son los valores primitivos que buscamos.

## Texto y URL

Cuando un dato forma parte de una URL, ciertos caracteres pueden confundirse con sus separadores. Por ejemplo, `&` separa parámetros y `#` inicia un fragmento. La codificación permite incluirlos como parte del dato.

| Función | Cuándo utilizarla |
| --- | --- |
| `encodeURIComponent(texto)` | Codificar un valor que se añadirá a una URL |
| `decodeURIComponent(texto)` | Recuperar un componente codificado correctamente |
| `encodeURI(url)` | Codificar una URL completa conservando sus separadores |
| `decodeURI(url)` | Decodificar una URL completa conservando ciertas secuencias reservadas |

```javascript
const taller = "Diseño & Web";
const codificado = encodeURIComponent(taller);
const url = "https://ejemplo.edu/reserva?taller=" + codificado;

console.log(codificado); // Dise%C3%B1o%20%26%20Web
console.log(url);
console.log(decodeURIComponent(codificado)); // Diseño & Web
```

Codifica **cada valor**, no la URL completa con `encodeURIComponent`: codificarías también sus separadores. A la inversa, `encodeURI` conserva `&`, por lo que no sirve para proteger ese carácter cuando forma parte del nombre del taller. Estas funciones codifican texto; no cifran datos, no validan destinos ni hacen seguro insertar HTML.

Si el texto ya está codificado, no vuelvas a codificarlo sin motivo: el carácter `%` se convertiría en `%25`. Tampoco `decodeURIComponent` convierte `+` en espacio: para el ejemplo usamos `%20`. La lectura general de formularios y parámetros se tratará más adelante.

Una secuencia incompleta como `%` puede provocar `URIError`. Si decodificas un dato que no controlas, puedes informar del fallo con `try/catch`:

```javascript
const recibido = "%";
try {
  console.log(decodeURIComponent(recibido));
} catch (error) {
  console.log("El texto no tiene una codificación válida.");
}
```

!!! failure "`escape` / `unescape`"
    Son funciones obsoletas. Para un componente de URL utiliza `encodeURIComponent` y `decodeURIComponent`.

## Datos: `JSON`

Retomamos [JSON de la UT3](../ut3/objetos-nativos.md): `JSON.stringify` produce texto y `JSON.parse` interpreta ese texto. Ambos son **métodos del objeto incorporado `JSON`**. No hace falta definirlos ni crear una instancia de `JSON`.

```javascript
const solicitud = { taller: "Diseño web", plazas: 3 };
const texto = JSON.stringify(solicitud);
const recuperada = JSON.parse(texto);

console.log(typeof texto);       // "string"
console.log(recuperada.plazas);  // 3
console.log(recuperada === solicitud); // false: es otro objeto
```

JSON representa datos, no instrucciones ejecutables. `JSON.parse` no sustituye a una validación: puede interpretar correctamente un número, `null` o un objeto con propiedades diferentes de las esperadas. Si el texto no cumple la sintaxis JSON, lanza un error:

```javascript
try {
  const dato = JSON.parse('{"plazas":3,}'); // La coma final no es válida.
  console.log(dato);
} catch (error) {
  console.log("No se pudo interpretar el JSON.");
}
```

Para objetos sencillos como el anterior se conservan cadenas y números. No lo interpretes como una copia universal de cualquier objeto: por ejemplo, una fecha se representa como texto y no se recupera automáticamente como `Date`. En [Almacenamiento](../ut3/almacenamiento.md), JSON es una ampliación opcional; las prácticas básicas de ese apartado guardan texto directamente.

## Temporizadores y diálogos (entorno)

El navegador proporciona funcionalidades predefinidas que **no pertenecen al núcleo ECMAScript**. No presupongas que un archivo que usa `prompt` se ejecutará igual en Node.js.

| Operación del navegador | Resultado o efecto |
| --- | --- |
| `prompt(mensaje)` | Devuelve texto o `null` al cancelar |
| `confirm(mensaje)` | Devuelve `true` al aceptar y `false` al cancelar |
| `alert(mensaje)` | Muestra un aviso; devuelve `undefined` |
| `setTimeout` | Programa una ejecución después de un retraso mínimo |
| `setInterval` | Programa ejecuciones repetidas |
| `clearTimeout` / `clearInterval` | Cancelan usando el identificador del temporizador |

```javascript
const continuar = confirm("¿Quieres preparar el parte?");
console.log(continuar);        // true o false
console.log(typeof continuar); // "boolean"
```

Los tiempos de los temporizadores se expresan en milisegundos; 1000 ms equivalen a un segundo. Programar una tarea no detiene el resto del script ni garantiza que se ejecute exactamente en ese instante. Su uso necesita pasar una función: lo retomaremos después de estudiar funciones de usuario. **No hay que programar temporizadores ni eventos para resolver las prácticas de 4.1.**

## Lo que no debes usar

| Práctica que evitaremos | Motivo y alternativa |
| --- | --- |
| `eval(cadena)` | Ejecuta texto como código. Para convertir usa `Number`; para datos JSON, `JSON.parse`; para decidir operaciones, condiciones |
| `escape` / `unescape` | Son obsoletas; utiliza la pareja de codificación adecuada para URL |
| `parseInt` para validar una cantidad completa | Puede aceptar un prefijo y ocultar texto incorrecto; convierte y comprueba el valor |
| `Boolean("false")` como interpretación de una respuesta | Produce `true`; compara con el texto admitido o usa `confirm` |
| `document.write` para actualizar una página | Puede reemplazar el documento si se usa después de cargarlo; en este apartado basta la consola |

No es necesario ejecutar código peligroso para comprender por qué se descarta. Tampoco debes tratar la función global `isNaN` como obsoleta: su diferencia con `Number.isNaN` es la conversión previa del argumento.

## Caso práctico resuelto: preparar una solicitud de copias

La biblioteca necesita preparar una solicitud de copias de un material. Pediremos el título y la cantidad, comprobaremos los datos y mostraremos en consola el coste y una URL de ejemplo. **No se envía ninguna solicitud ni se navega a otra página.**

| Dato | Valor |
| --- | --- |
| Precio por copia | `0.05` euros |
| Cantidad admitida | Entero entre `1` y `100` |
| Destino ilustrativo | `https://ejemplo.edu/copias` |

Crea `copias.html` y `copias.js` en la misma carpeta. Abre el HTML en el navegador, muestra la consola con F12 y recarga para repetir la prueba.

**`copias.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Solicitud de copias</title>
</head>
<body>
  <h1>Solicitud de copias</h1>
  <p>Consulta el resultado en la consola. Recarga para repetir.</p>
  <script src="copias.js"></script>
</body>
</html>
```

**`copias.js`**

```javascript
const precioCopia = 0.05;
const maximoCopias = 100;
const tituloBruto = prompt("Título del material:");

if (tituloBruto === null) {
  console.log("Solicitud cancelada.");
} else if (tituloBruto.trim() === "") {
  console.log("Debes indicar un título.");
} else {
  const titulo = tituloBruto.trim();
  const cantidadBruta = prompt("Número de copias (1 a 100):");

  if (cantidadBruta === null) {
    console.log("Solicitud cancelada.");
  } else if (cantidadBruta.trim() === "") {
    console.log("Debes indicar una cantidad.");
  } else {
    const cantidad = Number(cantidadBruta);
    if (!Number.isFinite(cantidad)) {
      console.log("La cantidad debe ser un número finito.");
    } else if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > maximoCopias) {
      console.log("La cantidad debe ser un entero entre 1 y 100.");
    } else {
      const coste = cantidad * precioCopia;
      const tituloCodificado = encodeURIComponent(titulo);
      const url = "https://ejemplo.edu/copias?titulo=" + tituloCodificado
        + "&cantidad=" + String(cantidad);

      console.log("Título:", titulo);
      console.log("Copias:", cantidad);
      console.log("Coste estimado:", coste.toFixed(2) + " euros");
      console.log("URL de ejemplo:", url);
      console.log("Título recuperado:", decodeURIComponent(tituloCodificado));
    }
  }
}
```

### Lectura del resultado

Con el título ` Guía & repaso ` y la cantidad `12`, se muestra:

```text
Título: Guía & repaso
Copias: 12
Coste estimado: 0.60 euros
URL de ejemplo: https://ejemplo.edu/copias?titulo=Gu%C3%ADa%20%26%20repaso&cantidad=12
Título recuperado: Guía & repaso
```

1. `prompt` aporta la entrada desde el navegador. Comprobamos `null` antes de llamar a `trim`.
2. `trim` quita espacios de los extremos del título, pero conserva los que separan sus palabras.
3. `Number` convierte la cantidad completa. `Number.isFinite` y `Number.isInteger` comprueban características distintas; las comparaciones fijan los límites del problema.
4. El coste se calcula con números. `toFixed(2)` devuelve una cadena para presentar dos decimales, no un número para seguir calculando. Aquí es una estimación didáctica, no un sistema de facturación.
5. `encodeURIComponent` codifica el título como valor del parámetro. La cadena fija mantiene los separadores `?`, `=` y `&` de la URL.
6. `decodeURIComponent` recupera el título a partir del componente codificado. No decodificamos la URL completa para extraer el parámetro.

Prueba Cancelar en cada diálogo, un título vacío y cantidades como `0`, `2.5`, `12px`, `Infinity` y `101`: no debe mostrarse el coste ni la URL. Con `1` y `100` sí se prepara la solicitud. Con `1e1` se aceptan 10 copias porque validamos el valor numérico.

Clasifica tres llamadas del caso: `encodeURIComponent` es global del lenguaje; `Number.isInteger` es un método estático; `prompt` lo aporta el navegador. `trim` y `toFixed` son métodos aplicados a valores concretos. Esa explicación es parte del objetivo del apartado.

## Ejercicio propuesto: preparar una reserva para un taller

### Contexto

El centro organiza talleres y necesita preparar una reserva de plazas. Escribe `reserva.html` y `reserva.js` para pedir el nombre del taller y la cantidad de plazas. El resultado se muestra únicamente en consola, incluida una URL ilustrativa para una posible reserva futura.

### Datos de partida

| Dato | Valor |
| --- | --- |
| Precio por plaza | `3.5` euros |
| Máximo de plazas por reserva | `8` |
| URL base ilustrativa | `https://ejemplo.edu/taller` |
| Parámetros de la URL | `nombre` y `plazas` |

Utiliza dos llamadas a `prompt`: primero el nombre del taller y, solo si es válido, la cantidad. No se pide almacenar la reserva ni enviarla a un servidor.

### Requisitos obligatorios

1. Si se pulsa Cancelar en cualquiera de los diálogos, informa y no generes la reserva.
2. Rechaza un nombre vacío después de `trim`. Conserva los espacios interiores, las tildes y los caracteres especiales.
3. Rechaza una cantidad vacía antes de convertirla. Usa `Number`, no `parseInt` ni `parseFloat`, para interpretar toda la entrada.
4. Comprueba con `Number.isFinite`, `Number.isInteger` y comparaciones que las plazas sean un entero entre 1 y 8. No redondees entradas incorrectas.
5. Calcula el coste total y muéstralo con dos decimales, conservando el número original para calcular.
6. Codifica el nombre con `encodeURIComponent` y construye una URL con los parámetros indicados. Muéstrala, sin navegar a ella.
7. Recupera el nombre desde su componente codificado con `decodeURIComponent` y comprueba que coincide con el nombre ya limpio.
8. Documenta en comentarios la clasificación de una función global del lenguaje, un método estático, un método aplicado a un valor y una función del navegador utilizados en tu solución.

### Pistas de diseño

- Separa mentalmente entrada, comprobación, cálculo y salida. Solo la rama válida debe generar el resumen.
- Cancelar y dejar vacío no son lo mismo. No necesitas `return` fuera de una función: organiza las ramas con `if` y `else`.
- Concatena la URL a partir de una base fija y del **nombre codificado**, no del nombre original.
- La práctica no necesita funciones propias, arrays, JSON, DOM, eventos ni temporizadores. Estos recursos no son necesarios para demostrar el uso de funciones predefinidas de 4.1.

### Casos que debes probar

| Nombre | Plazas | Resultado esperado |
| --- | --- | --- |
| `Diseño & Web` | `3` | Coste `10.50 euros`; nombre codificado y recuperado correctamente |
| `  Redes  ` | `1` | Nombre limpio `Redes`; coste `3.50 euros` |
| `JavaScript` | `8` | Reserva válida en el límite superior; coste `28.00 euros` |
| Cancelar | No se solicita | Cancelación sin reserva |
| Solo espacios | No se solicita | Error de nombre |
| `Redes` | Cancelar | Cancelación sin reserva |
| `Redes` | Vacío o espacios | Error de cantidad, sin reserva |
| `Redes` | `hola`, `3px`, `Infinity` | Error de número no válido o no finito |
| `Redes` | `0`, `-1`, `9`, `2.5` | Error de entero o de límites |
| `Redes` | `2,5` | Error: la coma no es el separador decimal de estas conversiones |
| `Redes` | `2e0` | Reserva válida de 2 plazas: se valida el valor, no el formato escrito |

### Entrega

Entrega los dos archivos, una captura de consola del caso `Diseño & Web` con 3 plazas y una tabla con entradas, resultado esperado y resultado observado. Incluye al menos una cancelación, una entrada vacía y una cantidad fuera de rango.

Explica por qué `parseInt("3px", 10)` no serviría para validar esta reserva, por qué `Boolean("false")` devuelve `true` y qué diferencia hay entre el coste numérico y el resultado de `toFixed(2)`.

La corrección valora elegir y clasificar las funciones adecuadas (**RA4.a**), validar antes de calcular y documentar las pruebas (**RA4.k**). No se exige dominar los contenidos de 4.2–4.8 ni los de eventos y DOM de las UT5 y UT6.

## Referencias para consultar

- [MDN: Number y conversiones numéricas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
- [MDN: parseInt y la base de numeración](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) y [parseFloat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat).
- [MDN: Number.isNaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN).
- [MDN: encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).
