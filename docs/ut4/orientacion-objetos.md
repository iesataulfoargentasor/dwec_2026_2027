---
title: 4.6 Orientación a objetos
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.6. Características de orientación a objetos

La **orientación a objetos** permite representar entidades mediante datos y operaciones relacionadas. Un libro tiene un título y un estado de préstamo; también puede prestarse o devolverse. Al reunir estas ideas en un objeto, el código expresa mejor qué representa cada dato y quién lo modifica.

Este apartado trabaja el reconocimiento de las características de orientación a objetos de JavaScript (**RA4.f**) y la comprobación y documentación del código (**RA4.k**). Consulta el [RA4 de la unidad](ra4.md). Las clases sencillas de esta página preparan la definición de objetos, propiedades y métodos que se desarrollará en [4.7 Objetos de usuario](objetos-usuario.md).

!!! note "Alcance y conocimientos previos"
    Utilizaremos variables, condiciones y funciones de los apartados anteriores. Los ejemplos se ejecutan secuencialmente y muestran sus resultados en consola. No requieren eventos, DOM, formularios ni almacenamiento. Cada bloque JavaScript es independiente; el caso resuelto incluye sus dos archivos completos.

## JavaScript y la orientación a objetos

JavaScript es **multiparadigma**: podemos organizar un programa con instrucciones, funciones y objetos. No es necesario convertir todo el código en clases.

| Característica | Qué significa en JavaScript |
| --- | --- |
| Objetos literales | Podemos crear un objeto directamente con `{}`, sin declarar una clase. |
| Prototipos | Un objeto puede encontrar propiedades y métodos en otro objeto al que está enlazado. |
| Clases | `class` ofrece una sintaxis para construir objetos similares; sigue apoyándose en prototipos. |
| Tipado dinámico | Una variable puede contener valores de distintos tipos. Conviene mantener tipos coherentes en cada propiedad. |
| Propiedades dinámicas | En un objeto ordinario podemos añadir propiedades después de crearlo. Es distinto del tipado dinámico. |

Si conoces Java, no supongas que todos los objetos JavaScript necesitan una clase ni una declaración previa de cada propiedad. En nuestros ejercicios mantendremos una estructura estable para que los objetos sean fáciles de entender.

## Objetos, propiedades y métodos

Un **objeto** reúne un estado y un comportamiento:

- Las **propiedades de datos** describen su estado, por ejemplo `nombre` y `nota`.
- Los **métodos** son propiedades cuyo valor es una función: permiten consultar o modificar ese estado.

```javascript
const ficha = {
  nombre: "Alex",
  nota: 8,
  aprobado() {
    return this.nota >= 5;
  },
};

console.log(ficha.nombre);     // Alex
console.log(ficha.aprobado()); // true
ficha.nota = 4;
console.log(ficha.aprobado()); // false
```

El punto permite acceder a una propiedad. Los paréntesis de `ficha.aprobado()` ejecutan el método; `ficha.aprobado`, sin paréntesis, obtiene la función. El método calcula el resultado con la nota actual cada vez que lo llamamos.

### Identidad y referencias

Dos objetos pueden tener los mismos datos y ser objetos distintos. Asignar un objeto a otra variable, en cambio, **no crea una copia**: ambas variables se refieren al mismo objeto.

```javascript
const original = { nombre: "Alex", nota: 8 };
const alias = original;
const otraFicha = { nombre: "Alex", nota: 8 };

console.log(original === alias);     // true
console.log(original === otraFicha); // false
alias.nota = 6;
console.log(original.nota);          // 6
console.log(otraFicha.nota);          // 8
```

`const` impide reasignar la variable a otro valor, pero no impide modificar las propiedades del objeto. Para obtener dos estados independientes, crearemos dos objetos diferentes.

## `this`: el objeto que recibe la llamada

En una llamada ordinaria como `ficha.aprobado()`, **`this` es `ficha`**. El método puede así trabajar con los datos del objeto que recibe la llamada, sin escribir su nombre concreto dentro de la función.

```javascript
const ficha = {
  nombre: "Mar",
  nota: 9,
  resumen() {
    return `${this.nombre}: ${this.nota}`;
  },
};

const otra = { nombre: "Leo", nota: 6, resumen: ficha.resumen };
console.log(ficha.resumen()); // Mar: 9
console.log(otra.resumen());  // Leo: 6
```

Los dos objetos utilizan la misma función, pero cada llamada tiene un receptor diferente. `this` no queda fijado al objeto donde escribimos inicialmente ese método.

### Separar el método de su objeto

Si guardamos el método en una variable y lo llamamos sin receptor, no conservamos automáticamente el objeto original:

```javascript
"use strict";
const ficha = {
  nota: 8,
  aprobado() {
    return this.nota >= 5;
  },
};

const comprobar = ficha.aprobado;
console.log(ficha.aprobado()); // true
// comprobar(); // TypeError: this sería undefined en modo estricto.
```

La primera instrucción activa el **modo estricto**, que aplica reglas más exigentes. En este ejemplo, una llamada simple `comprobar()` tendría `this` igual a `undefined`, y leer `this.nota` fallaría. Fuera del modo estricto, una función ordinaria llamada así puede recibir el objeto global, pero tampoco recupera `ficha`.

Las funciones **flecha no tienen `this` propio**: conservan el del contexto exterior donde se crean. Por eso no sustituiremos estos métodos por flechas. Las flechas siguen siendo útiles para las transformaciones de arrays de 4.5; aquí elegimos `resumen() { ... }` cuando el método necesita el objeto receptor.

## Clases e instancias: una primera aproximación

Una **clase** describe cómo inicializar objetos similares y qué métodos tendrán disponibles. Cada objeto creado con ella es una **instancia**.

```javascript
class Alumno {
  constructor(nombre, nota) {
    this.nombre = nombre;
    this.nota = nota;
  }

  aprobado() {
    return this.nota >= 5;
  }
}

const mar = new Alumno("Mar", 9);
const leo = new Alumno("Leo", 4);
console.log(mar.nombre, mar.aprobado()); // Mar true
console.log(leo.nombre, leo.aprobado()); // Leo false
leo.nota = 6;
console.log(mar.nota, leo.nota);         // 9 6
```

En este ejemplo, `new Alumno("Mar", 9)` crea una instancia, la enlaza con `Alumno.prototype` y ejecuta `constructor` para inicializarla. Dentro del constructor, `this` es la nueva instancia. `nombre` es un parámetro; `this.nombre` es una propiedad que permanece en el objeto después de terminar el constructor.

Observa la sintaxis: no escribimos `function` delante de los métodos ni ponemos comas entre ellos en el cuerpo de una clase. Declaramos la clase antes de usarla y la instanciamos con `new`.

`class` se apoya en el modelo de prototipos, pero también incorpora reglas propias: por ejemplo, el código de sus métodos se ejecuta en modo estricto. Por eso es más preciso entender su relación con los prototipos que considerarla solo un cambio de escritura.

## Prototipo: compartir comportamiento

Cuando leemos una propiedad, JavaScript la busca primero en el propio objeto. Si no está, continúa por su **cadena de prototipos**, hasta encontrarla o llegar al final (`null`). Si no existe, la lectura devuelve `undefined`.

En las clases de estos ejemplos, las asignaciones del constructor crean datos propios de cada instancia y los métodos ordinarios se guardan en el prototipo:

```javascript
class Alumno {
  constructor(nombre, nota) {
    this.nombre = nombre;
    this.nota = nota;
  }

  aprobado() {
    return this.nota >= 5;
  }
}

const mar = new Alumno("Mar", 9);
const leo = new Alumno("Leo", 4);
console.log(Object.getPrototypeOf(mar) === Alumno.prototype); // true
console.log(Object.getPrototypeOf(leo) === Alumno.prototype); // true
console.log(Object.hasOwn(mar, "nota"));                      // true
console.log(Object.hasOwn(mar, "aprobado"));                  // false
console.log(mar.aprobado === leo.aprobado);                   // true
console.log(mar.aprobado(), leo.aprobado());                  // true false
```

- `Object.getPrototypeOf(objeto)` devuelve el prototipo de ese objeto.
- `Object.hasOwn(objeto, "nombre")` comprueba si la propiedad pertenece directamente al objeto. No busca en la cadena de prototipos.
- `mar.aprobado` y `leo.aprobado` encuentran la misma función en `Alumno.prototype`. No se copia ese método en cada instancia.
- Al ejecutarla, `this` permite que la función compartida consulte la nota de la instancia que la llama.

Para este ejemplo, la búsqueda sigue esta cadena:

```text
mar → Alumno.prototype → Object.prototype → null
```

La propiedad `prototype` de la clase y el prototipo de una instancia están relacionados, pero no se consultan igual: usamos `Alumno.prototype` y `Object.getPrototypeOf(mar)`. No necesitamos modificar la cadena ni utilizar `__proto__` en estas prácticas.

## Encapsulación: reunir datos y operaciones

**Encapsular** consiste en organizar el estado y las operaciones que trabajan con él, ofreciendo una forma clara de usar el objeto. Por ejemplo, un método `prestar()` puede comprobar si un libro está disponible antes de cambiar su estado.

| Idea | Aplicación en esta unidad |
| --- | --- |
| Interfaz pública | Conjunto de propiedades y métodos que utilizamos desde fuera. Aquí “interfaz” es una idea de diseño, no una palabra reservada. |
| Reglas de uso | Un método comprueba las condiciones antes de modificar el estado. |
| Propiedades públicas | Pueden leerse y modificarse desde fuera; nuestros ejemplos iniciales las utilizan. |
| Convención `_nombre` | Sugiere uso interno, pero no impide el acceso. |
| Campos privados `#nombre` | El lenguaje restringe su acceso; se desarrollan en 4.7. |

Usar métodos ayuda a centralizar las reglas, pero **no hace privadas las propiedades**. Si escribimos directamente `libro.prestado = true`, evitamos las comprobaciones de `prestar()`. En este apartado respetaremos la interfaz por disciplina y explicaremos esta limitación.

La herencia permite reutilizar comportamiento y el polimorfismo permite trabajar con objetos que ofrecen una misma operación aunque la implementen de forma distinta. Aquí nos centramos en reconocer la delegación al prototipo; no necesitamos diseñar jerarquías de clases para resolver los ejercicios.

## Caso práctico resuelto: préstamo de libros de la biblioteca

La biblioteca del centro necesita representar dos libros. Cada libro comienza disponible, puede prestarse una vez y puede devolverse si estaba prestado. Un intento que no corresponde con su estado debe devolver `false` y dejarlo como estaba.

Trabajaremos con títulos fijos y no vacíos. El constructor no valida los títulos en este primer modelo. Las operaciones devuelven booleanos y `resumen()` devuelve un texto; el programa principal se encarga de mostrarlos.

Guarda estos dos archivos en la misma carpeta, abre el HTML y consulta la consola del navegador.

**`biblioteca.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Préstamo de libros</title>
</head>
<body>
  <h1>Préstamo de libros</h1>
  <p>Abre la consola del navegador para consultar el resultado.</p>
  <script src="biblioteca.js"></script>
</body>
</html>
```

**`biblioteca.js`**

```javascript
class Libro {
  constructor(titulo) {
    this.titulo = titulo;
    this.prestado = false;
  }

  prestar() {
    if (this.prestado) {
      return false;
    }
    this.prestado = true;
    return true;
  }

  devolver() {
    if (!this.prestado) {
      return false;
    }
    this.prestado = false;
    return true;
  }

  resumen() {
    let estado = "disponible";
    if (this.prestado) {
      estado = "prestado";
    }
    return `${this.titulo}: ${estado}`;
  }
}

const libroA = new Libro("JavaScript paso a paso");
const libroB = new Libro("Diseño web básico");

console.log(libroA.resumen());
console.log("Primer préstamo:", libroA.prestar());
console.log("Préstamo repetido:", libroA.prestar());
console.log(libroA.resumen());
console.log(libroB.resumen());
console.log("Primera devolución:", libroA.devolver());
console.log("Devolución repetida:", libroA.devolver());
console.log(libroA.resumen());
console.log("Mismo método:", libroA.prestar === libroB.prestar);
console.log("Prototipo de Libro:", Object.getPrototypeOf(libroA) === Libro.prototype);
```

### Lectura del resultado

```text
JavaScript paso a paso: disponible
Primer préstamo: true
Préstamo repetido: false
JavaScript paso a paso: prestado
Diseño web básico: disponible
Primera devolución: true
Devolución repetida: false
JavaScript paso a paso: disponible
Mismo método: true
Prototipo de Libro: true
```

1. Cada `new Libro(...)` crea una instancia con su propio título y su propio `prestado`, inicialmente `false`.
2. El primer préstamo cambia el estado de `libroA` y devuelve `true`. El segundo detecta que ya estaba prestado y termina con `false` antes de modificarlo.
3. `libroB` continúa disponible: compartir métodos no significa compartir los valores de las propiedades creadas en cada instancia.
4. La primera devolución restablece la disponibilidad. La segunda devuelve `false` porque no hay un préstamo que devolver.
5. Las últimas comprobaciones muestran que las instancias encuentran el mismo método en el prototipo.

El booleano devuelto indica **si la operación se ha realizado**, no el estado final. Por ejemplo, `devolver()` devuelve `true` al realizar la devolución, aunque `prestado` pase a valer `false`.

Como prueba adicional, presta `libroB` y comprueba ambos resúmenes. Después crea `const referencia = libroA`: modificar el libro a través de `referencia` también se observará mediante `libroA`, porque no has creado una tercera instancia.

## Ejercicio propuesto: reserva de equipos del aula móvil

### Contexto

El aula móvil dispone de equipos que pueden reservarse y liberarse. Debes modelar dos equipos y demostrar que su estado es independiente, aunque utilicen los mismos métodos. Toda la ejecución será secuencial, con datos fijos y salida en consola.

### Datos de partida

| Instancia que debes crear | Código | Estado inicial |
| --- | --- | --- |
| `equipoA` | `PORT-01` | Sin reserva |
| `equipoB` | `PORT-02` | Sin reserva |

Define una clase `Equipo` cuyo constructor reciba el código y cree las propiedades públicas `codigo` y `reservado`. Puedes suponer que los códigos son cadenas no vacías y diferentes.

### Requisitos obligatorios

1. Crea las dos instancias con `new`. No copies la referencia del primer equipo para crear el segundo.
2. Implementa `reservar()`: devuelve `true` y cambia el estado si el equipo estaba libre; devuelve `false` sin cambios si ya estaba reservado.
3. Implementa `liberar()`: devuelve `true` y deja libre un equipo reservado; devuelve `false` sin cambios si ya estaba libre.
4. Implementa `resumen()`: devuelve el código y el texto `libre` o `reservado`, sin modificar el estado.
5. Utiliza `this` y métodos ordinarios. Muestra los resultados con `console.log` desde el programa principal.
6. Comprueba que ambos equipos tienen `Equipo.prototype` como prototipo y que `equipoA.reservar === equipoB.reservar` es `true`.
7. Comprueba con `Object.hasOwn` que `reservado` es propio de la instancia y `reservar` no. Explica por qué se puede llamar al método aunque esa segunda comprobación dé `false`.
8. Añade comentarios sobre las reglas de reserva y sobre la diferencia entre el resultado de la operación y el estado final. No utilices eventos, DOM ni campos privados.

### Pistas de diseño

- El constructor prepara el estado inicial; no realiza una reserva.
- Comprueba primero si puedes realizar la operación. Si no puedes, termina con `return false`.
- Cambia el estado únicamente después de superar la comprobación.
- El texto del resumen se calcula a partir del estado actual; no hace falta almacenarlo en otra propiedad.
- No cambies `reservado` directamente desde el programa principal: utiliza la interfaz que has definido.

### Casos que debes probar

Ejecuta esta secuencia sobre las mismas dos instancias:

| Paso | Operación | Resultado esperado | Estado posterior de A / B |
| --- | --- | --- | --- |
| 1 | Consultar ambos resúmenes | Ambos muestran `libre` | Libre / libre |
| 2 | Liberar A sin reserva previa | `false` | Libre / libre |
| 3 | Reservar A | `true` | Reservado / libre |
| 4 | Volver a reservar A | `false` | Reservado / libre |
| 5 | Reservar B | `true` | Reservado / reservado |
| 6 | Liberar A | `true` | Libre / reservado |
| 7 | Volver a liberar A | `false` | Libre / reservado |
| 8 | Reservar A de nuevo | `true` | Reservado / reservado |

Consulta dos veces seguidas el resumen de un equipo y comprueba que no altera su estado. Comprueba también que `equipoA === equipoB` es `false`. Finalmente, guarda `const referencia = equipoA` y explica por qué `referencia === equipoA` es `true`.

### Entrega

Entrega `equipos.html`, `equipos.js` y un breve documento con los resultados de las pruebas, una captura de consola y estas explicaciones:

- Qué diferencia hay entre clase, instancia, propiedad y método en tu solución.
- Qué objeto representa `this` al llamar a `equipoB.reservar()`.
- Qué datos pertenecen a cada instancia y dónde se encuentran los métodos compartidos.
- Por qué `const` no impide cambiar el estado y por qué tus propiedades todavía son públicas.

## Errores frecuentes

| Error | Cómo corregirlo |
| --- | --- |
| Confundir `objeto.metodo` con `objeto.metodo()` | El primero obtiene la función; el segundo la ejecuta. |
| Creer que `const b = a` copia el objeto | Crea otra referencia; utiliza otro literal o `new` para una entidad independiente. |
| Usar una flecha como método esperando recibir la instancia en `this` | Utiliza la sintaxis de método ordinario de los ejemplos. |
| Llamar a un método separado de su objeto | Conserva la llamada `objeto.metodo()`. |
| Pensar que un método heredado no existe porque `Object.hasOwn` devuelve `false` | Distingue propiedades propias de las encontradas en el prototipo. |
| Suponer que `_estado` es privado | Es una convención; la privacidad con `#` se estudia en 4.7. |
| Interpretar `true` como “reservado” en cualquier método | Lee el contrato: aquí significa que la operación tuvo éxito. |

## Referencias y siguiente paso

- [MDN: trabajar con objetos](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_objects).
- [MDN: `this`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this).
- [MDN: herencia y cadena de prototipos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain).
- [MDN: clases](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes).
- [MDN: `Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn).

En [4.7 Objetos de usuario](objetos-usuario.md) profundizaremos en la definición de clases, métodos y propiedades, incluidos miembros estáticos y campos privados.
