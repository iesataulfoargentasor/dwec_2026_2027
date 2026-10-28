---
title: 4.2 Funciones definidas por el usuario
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.2. Funciones definidas por el usuario

En 4.1 utilizábamos operaciones que JavaScript ya proporciona. Ahora vamos a **definir nuestras propias funciones**: bloques reutilizables que reciben datos, realizan una tarea y pueden devolver un resultado. Una función permite escribir una regla una vez y aplicarla a diferentes entradas.

Este apartado desarrolla la creación y utilización de funciones propias (**RA4.b**) y su depuración y documentación (**RA4.k**). Consulta el [RA4 y sus criterios](ra4.md). La referencia del módulo 0612 es el [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405), junto con el currículo de Cantabria de la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244).

!!! note "Alcance del apartado"
    Necesitas variables, condiciones, cadenas, números y las comprobaciones de 4.1. Trabajaremos con llamadas directas, diálogos y consola. No hacen falta eventos ni DOM. Los arrays se desarrollan en 4.3: los parámetros rest se presentan como anticipo conceptual, pero las prácticas de esta página no los necesitan.

## Declaración clásica

```javascript
function saludar(nombre) {
  return "Hola, " + nombre;
}

const saludoAlex = saludar("Alex");
const saludoAna = saludar("Ana");
console.log(saludoAlex); // Hola, Alex
console.log(saludoAna);  // Hola, Ana
```

| Parte | Significado |
| --- | --- |
| `function` | Inicia la declaración |
| `saludar` | Nombre que permite identificar y llamar a la función |
| `nombre` | Parámetro: nombre local que recibirá un dato |
| `{ ... }` | Cuerpo: instrucciones que se ejecutan en cada llamada |
| `"Alex"` | Argumento: valor concreto que se entrega en esa llamada |
| `return` | Devuelve el resultado y termina esa ejecución de la función |

**Definir no es ejecutar.** Al llegar a la declaración se prepara la función; su cuerpo se ejecuta cuando se llama a `saludar(...)`. Cada llamada recibe sus propios valores locales. No escribas `let`, `const` ni tipos delante de los parámetros.

### Devolver no es mostrar

```javascript
function duplicar(numero) {
  return numero * 2;
}

function mostrarDoble(numero) {
  console.log(numero * 2);
}

const resultado = duplicar(4);
console.log(resultado + 1); // 9: podemos reutilizar el resultado
const sinResultado = mostrarDoble(4); // Muestra 8
console.log(sinResultado); // undefined
```

`console.log` escribe en consola, pero no sustituye a `return`. Si una función termina sin devolver un valor explícito, el resultado es `undefined`. `return;` también termina la función devolviendo `undefined`.

Una función devuelve un único valor en cada llamada. Ese valor puede ser un número, una cadena o un booleano; más adelante también podremos organizar varios datos en una estructura.

### Retorno anticipado

```javascript
function obtenerEtiqueta(nombre) {
  if (nombre.trim() === "") {
    return "Sin nombre";
  }
  return nombre.trim().toUpperCase();
}

console.log(obtenerEtiqueta("  Ana  ")); // ANA
console.log(obtenerEtiqueta("   "));    // Sin nombre
```

El contrato de esta función exige recibir una cadena. El primer `return` resuelve el caso vacío; cuando se ejecuta, no se alcanza el siguiente. Esto evita anidar condiciones innecesariamente. El retorno termina **la función**, no todo el programa: la ejecución continúa después de la llamada.

Escribe el valor en la misma línea que `return`. Un salto de línea inmediatamente después puede hacer que JavaScript interprete un retorno sin valor. Tampoco puede escribirse `return` fuera de una función en un script de navegador.

### Orden de las declaraciones

```javascript
console.log(triplicar(3)); // 9

function triplicar(numero) {
  return numero * 3;
}
```

Una declaración clásica puede utilizarse antes de su posición textual dentro del ámbito correspondiente. Este comportamiento se conoce como *hoisting*: no significa que el cuerpo se ejecute antes. En los ejercicios colocaremos las funciones primero y el programa principal después para facilitar la lectura.

## Expresión y flecha

También podemos guardar una función en una variable:

```javascript
const sumar = function (a, b) {
  return a + b;
};

console.log(sumar(3, 4)); // 7
```

Es una **expresión de función**. La variable se llama `sumar` aunque la función de la expresión sea anónima. Con `const`, debes realizar la llamada después de inicializarla; intentar usarla antes produce `ReferenceError`. `const` impide reasignar esa variable, pero no impide llamar muchas veces a la función.

### Dos formas de escribir una flecha

```javascript
const restar = (a, b) => a - b;
const multiplicar = (a, b) => {
  const producto = a * b;
  return producto;
};

console.log(restar(9, 4));      // 5
console.log(multiplicar(3, 4)); // 12
```

Una expresión sin llaves se devuelve implícitamente. Con un cuerpo entre llaves debes escribir `return` si quieres devolver un valor. Por ejemplo, `(a, b) => { a + b; }` devuelve `undefined`, porque calcula la suma pero no la retorna.

Puedes escribir `() => ...` sin parámetros, `numero => ...` con uno sencillo o `(a, b) => ...` con varios. Mantener los paréntesis en todos los casos puede ayudar al principio.

| Forma | Uso en este apartado |
| --- | --- |
| Declaración `function` | Funciones principales con un nombre y una tarea clara |
| Expresión guardada en `const` | Practicar que una función también es un valor |
| Flecha de una expresión | Cálculos cortos con retorno implícito |
| Flecha con bloque | Varias instrucciones y retorno explícito |

La flecha no tiene `this` propio: utiliza el del contexto que la rodea. No es un sustituto universal de una función clásica; estudiaremos esa diferencia al trabajar métodos y objetos. Tampoco necesitas usar flechas en todo el programa por ser una sintaxis más breve.

### Referencia a la función y llamada

```javascript
function cuadrado(numero) {
  return numero * numero;
}

const calcular = cuadrado; // Guarda la función, sin ejecutarla.
const valor = calcular(5); // La ejecuta con el argumento 5.
console.log(valor);       // 25
```

`cuadrado` y `cuadrado(5)` no significan lo mismo: la primera expresión permite utilizar la función como valor; la segunda obtiene el resultado de ejecutarla. Esta distinción será útil más adelante al pasar funciones a otras operaciones, sin necesidad de introducir eventos ahora.

## Parámetros

### Posición, tipo y argumentos omitidos

Los argumentos se asocian a los parámetros por su posición. Sus nombres no tienen que coincidir con los de las variables que utilizas al llamar.

```javascript
function calcularCoste(unidades, precio) {
  return unidades * precio;
}

const ejemplares = 4;
console.log(calcularCoste(ejemplares, 0.5)); // 2
console.log(calcularCoste(4));              // NaN: precio recibe undefined
```

JavaScript no obliga a proporcionar exactamente el número de argumentos declarado. Si falta uno sin valor predeterminado, ese parámetro recibe `undefined`. Los argumentos adicionales no crean automáticamente nuevos parámetros nombrados. Debes conocer y respetar el contrato de cada función.

Los tipos tampoco se validan por escribir parámetros: una función que suma con `+` puede concatenar si recibe cadenas. Convierte y valida las entradas antes de calcular, como se explica en 4.1.

### Valores por defecto

```javascript
function ficha(nombre, grupo = "DAW2") {
  return nombre + " (" + grupo + ")";
}

console.log(ficha("Luis"));            // Luis (DAW2)
console.log(ficha("Luis", "DAW1"));    // Luis (DAW1)
console.log(ficha("Luis", undefined)); // Luis (DAW2)
console.log(ficha("Luis", ""));        // Luis ()
console.log(ficha("Luis", null));      // Luis (null)
```

El valor predeterminado se utiliza cuando falta el argumento o cuando es `undefined`. No sustituye automáticamente `null`, `0`, `false` ni una cadena vacía. Es habitual colocar los parámetros opcionales después de los obligatorios para facilitar las llamadas.

### Parámetros rest: después de estudiar arrays

La notación `...datos`, llamada **rest**, recoge argumentos restantes en un array. Ese parámetro debe ser el último. Como todavía no hemos desarrollado arrays, dejaremos su creación y recorrido para después de 4.3. No lo confundas con **spread**, que permite expandir elementos en otros contextos. Las funciones de esta página utilizan un número conocido de parámetros.

### Qué puede cambiar una función

Los argumentos se pasan **por valor**. Si el dato es un número o una cadena, reasignar el parámetro no modifica la variable exterior:

```javascript
function aumentar(cantidad) {
  cantidad = cantidad + 1;
  return cantidad;
}

const inicial = 3;
const siguiente = aumentar(inicial);
console.log(inicial);   // 3
console.log(siguiente); // 4
```

Con un objeto literal como los utilizados en la UT3, el valor que se copia es una **referencia al objeto**. Ambas referencias permiten acceder al mismo objeto; por eso modificar una propiedad puede verse desde fuera. En cambio, reasignar el parámetro hace que esa variable local apunte a otro objeto:

```javascript
function marcar(tarea) {
  tarea.vista = true;
}

function reemplazar(tarea) {
  tarea = { titulo: "Otra", vista: false };
}

const actividad = { titulo: "Repaso", vista: false };
marcar(actividad);
console.log(actividad.vista); // true
reemplazar(actividad);
console.log(actividad.titulo); // Repaso
```

No se ha copiado todo el objeto al llamar, ni se ha dado a la función la capacidad de reasignar la variable `actividad`. Conviene documentar si una función modifica propiedades. En las prácticas principales usaremos cadenas y números y devolveremos los resultados, sin modificar objetos externos.

## Ámbito y anidamiento

### Variables locales y de bloque

Los parámetros y las variables declaradas dentro de una función no se pueden utilizar desde fuera de ella. Además, `let` y `const` respetan el bloque entre llaves en el que se declaran.

```javascript
const nombre = "Exterior";

function crearMensaje() {
  const nombre = "Interior";
  if (nombre !== "") {
    const prefijo = "Hola, ";
    return prefijo + nombre;
  }
  return "Sin saludo";
}

console.log(crearMensaje()); // Hola, Interior
console.log(nombre);         // Exterior
// prefijo y el nombre local no son accesibles aquí.
```

En este ejemplo el nombre local oculta al exterior mientras se ejecuta la función. Es válido, pero en programas largos conviene evitar nombres confusos. Una función puede leer variables de su ámbito exterior, aunque para datos que cambian entre llamadas suele ser más claro utilizar parámetros.

Declara siempre las variables: una asignación a un identificador no declarado puede crear una propiedad global en un script no estricto, y en modo estricto produce un error. No dependas de ese comportamiento.

### Funciones anidadas

```javascript
function exterior(x) {
  function interior(y) {
    return x + y;
  }
  return interior(10);
}

console.log(exterior(5)); // 15
```

`interior` está disponible dentro de `exterior`, no fuera. Puede acceder a `x` por estar definida en ese ámbito. Este acceso al entorno donde se crea una función está relacionado con los **cierres** (*closures*), que se retomarán en los patrones de la unidad. Aquí basta entender qué variables puede consultar la función interna; no es obligatorio anidar funciones para resolver las prácticas.

## Documentar (criterio k)

Antes de programar, escribe el **contrato**: qué recibe, qué devuelve, qué entradas admite y si modifica algo fuera. Después compruébalo mediante llamadas concretas.

```javascript
/**
 * Calcula un importe con un recargo didáctico.
 * @param {number} base - Importe no negativo, ya validado.
 * @param {number} [tasa=0.1] - Proporción de recargo no negativa.
 * @returns {number} Importe final, sin formatear.
 */
function aplicarRecargo(base, tasa = 0.1) {
  return base * (1 + tasa);
}

console.log(aplicarRecargo(10));       // 11
console.log(aplicarRecargo(10, 0.2));  // 12
console.log(aplicarRecargo(10, 0));    // 10
```

Los comentarios JSDoc ayudan a comprender el contrato, pero **no validan los tipos en ejecución**. Aquí el programa que llama debe aportar números válidos. Una función de cálculo devuelve un número; otra parte del programa decide si mostrarlo con `toFixed(2)`.

Para depurar, coloca un punto de interrupción en la primera instrucción de una función y observa los parámetros y variables locales. Ejecuta paso a paso hasta `return` y comprueba el valor recibido por quien la llamó. Prueba varias entradas, no solo el caso correcto más sencillo.

| Síntoma | Qué revisar |
| --- | --- |
| Se muestra un dato, pero la variable contiene `undefined` | Se usó `console.log` sin devolver el resultado |
| La función no hace nada | Falta la llamada con paréntesis |
| Una flecha devuelve `undefined` | Falta `return` dentro de su bloque |
| Aparece `NaN` | Argumento omitido, tipo incorrecto o conversión fallida |
| Se concatena `"23"` en vez de sumar 5 | Se recibieron cadenas en una suma |
| Falla una llamada antes de una expresión con `const` | La variable aún no está inicializada |
| Una variable no existe fuera | Está limitada a una función o a un bloque |

!!! warning "Nombres"
    Usa nombres que describan una tarea: `calcularCoste`, `esCantidadValida`, `crearResumen`. No empieces por un dígito ni reutilices un identificador para otra declaración incompatible en el mismo ámbito. Respeta las mayúsculas: `calcularCoste` y `calcularcoste` no son el mismo nombre.

## Caso práctico resuelto: presupuesto de cuadernos del aula

El aula necesita preparar un presupuesto de cuadernos. Cada uno cuesta **2.5 euros** y se admiten cantidades enteras entre **1 y 30**. Organizaremos el programa en tres funciones con responsabilidades distintas y un bloque principal que pide la entrada.

| Función | Recibe | Devuelve |
| --- | --- | --- |
| `esCantidadValida(cantidad)` | Un valor que se quiere comprobar | Booleano: si es un entero entre 1 y 30 |
| `calcularImporte(cantidad, precio = 2.5)` | Cantidad validada y precio numérico no negativo | Importe numérico |
| `crearResumen(cantidad, importe)` | Cantidad e importe válidos | Cadena con el resumen |

Las funciones no abren diálogos ni escriben en consola. Así pueden probarse por separado. Crea estos dos archivos en la misma carpeta y abre el HTML en el navegador; el resultado se verá en la consola de F12.

**`cuadernos.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Presupuesto de cuadernos</title>
</head>
<body>
  <h1>Presupuesto de cuadernos</h1>
  <p>Abre la consola para ver el resultado. Recarga para repetir.</p>
  <script src="cuadernos.js"></script>
</body>
</html>
```

**`cuadernos.js`**

```javascript
/** Devuelve si cantidad es un entero entre 1 y 30. */
function esCantidadValida(cantidad) {
  return Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 30;
}

/** Recibe números válidos y devuelve el importe sin formatear. */
function calcularImporte(cantidad, precio = 2.5) {
  return cantidad * precio;
}

/** Recibe datos válidos y devuelve un texto para presentar. */
function crearResumen(cantidad, importe) {
  return "Cuadernos: " + cantidad + ". Importe: " + importe.toFixed(2) + " euros.";
}

const entrada = prompt("¿Cuántos cuadernos necesitas? (1 a 30)");

if (entrada === null) {
  console.log("Presupuesto cancelado.");
} else if (entrada.trim() === "") {
  console.log("Debes indicar una cantidad.");
} else {
  const cantidad = Number(entrada);
  if (!esCantidadValida(cantidad)) {
    console.log("La cantidad debe ser un entero entre 1 y 30.");
  } else {
    const importe = calcularImporte(cantidad);
    const resumen = crearResumen(cantidad, importe);
    console.log(resumen);
  }
}
```

### Lectura del resultado

Con la entrada `4` se muestra:

```text
Cuadernos: 4. Importe: 10.00 euros.
```

1. Las declaraciones preparan las tres funciones. Ninguna pide datos al definirse.
2. `prompt` recibe `"4"`; el programa principal comprueba la cancelación y el vacío y lo convierte en el número `4`.
3. `esCantidadValida(4)` devuelve `true`. También rechaza `NaN`, infinitos y cadenas porque `Number.isInteger` no convierte valores.
4. `calcularImporte(4)` utiliza el precio por defecto y devuelve el número `10`.
5. `crearResumen(4, 10)` devuelve una cadena. Solo aquí se formatea el importe; el número original no cambia.
6. El programa principal muestra el resumen. Ninguna función depende de que exista una variable global llamada `entrada` o `cantidad`.

Con `2.5`, `0`, `31`, `hola`, `4px` o `Infinity`, el programa no calcula el importe. Cancelar y escribir espacios siguen sus propias ramas. `"1e1"` se convierte en 10 y se admite: como en 4.1, validamos el valor numérico y no un formato compuesto exclusivamente por dígitos.

Después de cargar el archivo puedes probar las funciones directamente en la consola, sin repetir el diálogo:

```javascript
// Ejecuta estas llamadas después de cargar cuadernos.js.
console.log(esCantidadValida(30));      // true
console.log(esCantidadValida(31));      // false
console.log(esCantidadValida("4"));     // false: no convierte texto
console.log(calcularImporte(4));        // 10
console.log(calcularImporte(4, 3));     // 12: precio explícito
console.log(calcularImporte(4, 0));     // 0: no se sustituye por 2.5
console.log(crearResumen(2, 5));        // Cuadernos: 2. Importe: 5.00 euros.
```

La validación pertenece a `esCantidadValida`; `calcularImporte` y `crearResumen` tienen un contrato que exige datos válidos. No están diseñadas para corregir argumentos arbitrarios. Separar estas responsabilidades permite cambiar el precio o la presentación sin repetir el programa completo.

## Ejercicio propuesto: presupuesto de carpetas para un taller

### Contexto

Un taller del centro prepara carpetas para sus participantes. Escribe `carpetas.html` y `carpetas.js` con funciones reutilizables para validar la cantidad, calcular el presupuesto y elaborar un mensaje. El programa principal pedirá la cantidad y mostrará el resultado en consola.

### Datos de partida

| Dato | Valor |
| --- | --- |
| Precio por carpeta | `1.75` euros |
| Cantidades admitidas | Enteros entre `1` y `25` |
| Presentación del importe | Dos decimales y la palabra euros |

### Requisitos obligatorios

1. Define `esCantidadValida(cantidad)`: devuelve un booleano y comprueba que el dato sea un número entero entre 1 y 25. No debe convertir cadenas, pedir datos ni mostrar mensajes.
2. Define `calcularTotal(cantidad, precio = 1.75)`: recibe números válidos y devuelve su producto como número. No uses `toFixed` dentro de esta función.
3. Define `crearMensaje(cantidad, total)`: devuelve una cadena con la cantidad de carpetas y el importe con dos decimales. No escribe directamente en consola.
4. En el programa principal pide la cantidad con `prompt`. Comprueba Cancelar y el texto vacío antes de convertir con `Number`.
5. Llama a la función de validación. Solo si devuelve `true`, llama a las funciones de cálculo y presentación y muestra el resultado.
6. Documenta qué recibe y devuelve cada función y qué datos deben estar validados previamente. Usa variables locales para los cálculos y parámetros para comunicar los datos.
7. Prueba `calcularTotal` con su precio por defecto, con un precio explícito de `2` y con precio `0`.
8. Escribe, como práctica independiente, una versión flecha de `calcularTotal` con otro nombre, por ejemplo `calcularTotalFlecha`. Comprueba que devuelve lo mismo para los tres precios anteriores; no es necesario cambiar el programa principal.

### Pistas de diseño

- Decide primero el contrato de cada función y realiza llamadas sencillas antes de añadir el diálogo.
- Una función de comprobación puede devolver directamente una expresión booleana.
- Al pasar una variable como argumento, usa su nombre sin comillas; `"cantidad"` sería una cadena literal.
- La salida con dos decimales es texto. Conserva el resultado numérico para cualquier cálculo posterior.
- Usa un nombre distinto para la versión flecha para evitar declarar dos veces el mismo identificador.
- No necesitas arrays, rest, funciones anidadas, objetos propios, JSON, almacenamiento, temporizadores, eventos ni DOM.

### Casos que debes probar

| Prueba | Resultado esperado |
| --- | --- |
| `esCantidadValida(1)` y `esCantidadValida(25)` | `true` en ambos límites |
| `esCantidadValida(0)`, `esCantidadValida(26)` y `esCantidadValida(2.5)` | `false` |
| `esCantidadValida("4")` y `esCantidadValida(NaN)` | `false` |
| `calcularTotal(4)` | Número `7` |
| `calcularTotal(4, 2)` | Número `8` |
| `calcularTotal(4, 0)` | Número `0` |
| Mismas llamadas con `calcularTotalFlecha` | Mismos resultados numéricos |
| Entrada `4` en el diálogo | Mensaje con 4 carpetas y `7.00 euros` |
| Entrada `25` | Mensaje con 25 carpetas y `43.75 euros` |
| Cancelar | Mensaje de cancelación; sin presupuesto |
| Vacío o espacios | Aviso de cantidad vacía; sin presupuesto |
| `hola`, `4px`, `Infinity`, `2,5` | Cantidad no válida; sin presupuesto |
| `0`, `26`, `-1`, `2.5` | Cantidad fuera de las reglas; sin presupuesto |

### Entrega

Entrega ambos archivos, una captura del resultado para 4 carpetas y una tabla con entradas, resultados esperados y observados. Incluye las pruebas directas de las funciones, además de las del diálogo.

Explica con una llamada de tu programa qué es un parámetro y qué es un argumento. Indica qué ocurriría si sustituyeses `return` por `console.log` en la función de cálculo y por qué el precio `0` no activa el valor por defecto.

Se valora crear y reutilizar funciones con una responsabilidad clara (**RA4.b**), devolver resultados coherentes, respetar el ámbito y documentar las pruebas (**RA4.k**). No se evalúan aquí eventos ni manipulación del DOM.

## Referencias para consultar

- [MDN: guía de funciones](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions).
- [MDN: parámetros por defecto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters).
- [MDN: funciones flecha](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).
- [MDN: sentencia return](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return).
