---
title: 4.8 Patrones de diseño
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.8. Patrones de diseño de software

En [4.7 Objetos definidos por el usuario](objetos-usuario.md) cada artículo sabía comprobar sus existencias. Ahora piensa en el pedido completo. ¿Dónde guardamos sus líneas? ¿Quién puede añadir una? ¿Cómo creamos varias líneas con las mismas propiedades? Cada pregunta plantea un problema distinto de diseño.

Un **patrón de diseño** es una forma de organizar el código para resolver un problema que aparece en distintos programas. En esta unidad trabajaremos con funciones, objetos y arrays que ya conoces. Para el [criterio j) del RA4](ra4.md) tendrás que elegir un patrón, aplicarlo y explicar qué problema resuelve en tu programa. Practicarás también el criterio k) al seguir la ejecución y comprobar los resultados.

## Módulo (y módulo revelado)

Imagina que varios puntos del programa pueden añadir artículos al carrito. Si cualquiera puede modificar su array, resulta difícil averiguar qué operación cambió el total. Con el patrón **módulo** guardamos el array en el ámbito de una función y ofrecemos unas operaciones públicas para trabajar con él.

```javascript
const carrito = (function () {
  const lineas = [];

  function add(nombre, precio) {
    lineas.push({ nombre, precio });
  }

  function total() {
    return lineas.reduce((suma, linea) => suma + linea.precio, 0);
  }

  function listar() {
    return lineas.map(linea => linea.nombre);
  }

  return { add, total, listar };
})();

carrito.add("Cable", 4);
carrito.add("Ratón", 12);
console.log(carrito.listar().join(", ")); // Cable, Ratón
console.log(carrito.total());             // 16
console.log(carrito.lineas);              // undefined
```

Lee primero la última línea de la definición, `})();`. Los paréntesis finales ejecutan la función en ese momento. El resultado que se asigna a `carrito` es el objeto con las tres operaciones. La escritura abreviada `{ add, total, listar }` equivale a `{ add: add, total: total, listar: listar }`. Entregamos las funciones para poder llamarlas después.

Aunque la función exterior ya terminó, sus tres funciones interiores conservan acceso al mismo array. Ese acceso al ámbito donde se crearon se llama **cierre** (*closure*). Las dos llamadas a `add()` escriben en ese array y `total()` lee sus dos líneas. Esta variante recibe el nombre de **módulo revelado** porque el objeto devuelto indica qué funciones quedan disponibles.

**Al devolver una colección**, piensa qué podrá modificar quien la reciba. Aquí `listar()` crea un array nuevo de nombres, que son cadenas. Si devolviéramos `[...lineas]`, copiaríamos el array, pero sus objetos seguirían siendo los originales. En este ejemplo se suponen válidos los nombres y precios. En el caso resuelto añadiremos una regla de admisión.

También encontrarás la palabra *módulo* al estudiar archivos con `export` e `import`. Son la forma que ofrece el lenguaje de organizar código entre archivos. Para practicar el patrón en la UT4 basta con una función y las operaciones que devuelve.

## Fábrica (*factory*)

Una **función fábrica** recibe los datos de una entidad y devuelve un objeto preparado para usar. Centraliza decisiones como los nombres de las propiedades, el valor inicial de un campo o los métodos disponibles.

```javascript
function crearAlumno(nombre, nota) {
  return {
    nombre,
    nota,
    aprobado() {
      return this.nota >= 5;
    },
  };
}

const mar = crearAlumno("Mar", 7);
const leo = crearAlumno("Leo", 4);
leo.nota = 5;
console.log(mar.nota, leo.nota);             // 7 5
console.log(mar.aprobado(), leo.aprobado()); // true true
console.log(mar === leo);                    // false
```

Cada llamada evalúa de nuevo el literal del `return` y crea una ficha independiente. La decisión de que un 5 es suficiente para aprobar queda escrita en un único lugar. Como el método se define dentro del literal, cada ficha creada aquí recibe su propia función. En la clase de 4.7 los métodos ordinarios se compartían a través del prototipo. Una fábrica también podría devolver una instancia creada con `new` si el programa ya tuviera una clase adecuada.

## Singleton

En algunos programas interesa que todos consulten **la misma instancia**, por ejemplo una configuración del aula. Podemos crear el objeto una sola vez y utilizar esa referencia en todas las funciones que necesiten conocer el límite de plazas.

```javascript
const configuracion = Object.freeze({ plazas: 12 });

function quedanPlazas(ocupadas) {
  return ocupadas < configuracion.plazas;
}

const ajustesDelAula = configuracion;
console.log(ajustesDelAula === configuracion); // true
console.log(quedanPlazas(11));                 // true
console.log(quedanPlazas(12));                 // false
```

La igualdad de referencias muestra que ambos nombres permiten consultar el mismo objeto. En esta solución el **singleton** se consigue al crear una única configuración y compartirla. `Object.freeze()` cumple otra función: impide añadir, quitar o reasignar sus propiedades. La congelación es superficial. Si una propiedad contuviera un objeto, ese objeto conservaría sus propias reglas de modificación.

Un registro compartido podría necesitar cambios y seguir siendo una única instancia. En cambio, para dos talleres con aforos independientes, como en 4.7, interesa crear dos objetos.

## Observador (*pub/sub* sencillo)

Un taller publica su número de plazas libres. Una parte del programa quiere mostrar el dato y otra quiere guardar el último valor. El patrón **observador** permite registrar esas reacciones como funciones. Al publicar un valor, el emisor recorre la lista y llama a cada función con el mismo dato.

```javascript
function crearEmisor() {
  const oyentes = [];
  return {
    suscribir(funcion) {
      oyentes.push(funcion);
    },
    publicar(dato) {
      for (const avisar of oyentes) {
        avisar(dato);
      }
    },
  };
}

const avisos = crearEmisor();
let ultimo = 0;
avisos.suscribir(plazas => console.log("Plazas:", plazas));
avisos.suscribir(plazas => { ultimo = plazas; });
avisos.publicar(3);
console.log("Último valor:", ultimo);
```

La salida es `Plazas: 3` y después `Último valor: 3`. Al suscribir una función se guarda su referencia. Su cuerpo se ejecuta al llegar a `avisar(dato)`. Las llamadas son síncronas y siguen el orden de registro. Si publicas antes de registrar oyentes, el array está vacío y el recorrido termina sin llamar a nadie. El ejemplo utiliza un único tipo de aviso y se puede seguir de principio a fin en la consola.

## Cómo elegir

| Necesidad concreta | Patrón | Qué puedes comprobar |
| --- | --- | --- |
| Mantener el pedido y ofrecer operaciones de consulta y alta | Módulo | Dos altas consecutivas se reflejan en el mismo total. |
| Crear una ficha por cada participante | Fábrica | Cambiar la primera ficha conserva los datos de la segunda. |
| Compartir una configuración durante la ejecución | Singleton | Dos partes del programa consultan el mismo objeto. |
| Avisar a varias funciones cuando cambia un valor | Observador | Una publicación llega a todos los oyentes registrados. |

Los patrones pueden colaborar. Un pedido puede usar una fábrica para crear líneas y un módulo para conservarlas. Si el programa solo necesita calcular el total cuando alguien lo pide, basta con llamar al método de consulta.

## Caso práctico resuelto: pedido de material del aula

El departamento prepara un pedido. Cada línea tiene un material, una cantidad y un precio por unidad expresado en céntimos. Queremos calcular el importe sin perder las líneas anteriores cuando se rechace una cantidad. La **fábrica** se encarga de construir una línea y calcular su importe. El **módulo** decide qué peticiones admite y guarda las líneas aceptadas.

Utilizaremos nombres de material válidos y precios enteros positivos ya comprobados. El dato que debemos validar en este caso es la cantidad: solo admitimos enteros mayores que cero. Guarda los dos archivos juntos, abre el HTML y consulta la consola.

**`pedido.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Pedido de material</title>
</head>
<body>
  <h1>Pedido de material del aula</h1>
  <p>Consulta las operaciones en la consola del navegador.</p>
  <script src="pedido.js"></script>
</body>
</html>
```

**`pedido.js`**

```javascript
function crearLinea(material, cantidad, precioCentimos) {
  return {
    material,
    cantidad,
    precioCentimos,
    importe() {
      return this.cantidad * this.precioCentimos;
    },
  };
}

const pedido = (function () {
  const lineas = [];

  function anadir(material, cantidad, precioCentimos) {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return false;
    }
    lineas.push(crearLinea(material, cantidad, precioCentimos));
    return true;
  }

  function materiales() {
    return lineas.map(linea => linea.material);
  }

  function totalCentimos() {
    return lineas.reduce((suma, linea) => suma + linea.importe(), 0);
  }

  return { anadir, materiales, totalCentimos };
})();

console.log("Total inicial:", pedido.totalCentimos());
console.log("Cable:", pedido.anadir("Cable", 3, 250));
console.log("Ratón:", pedido.anadir("Ratón", 0, 900));
console.log("Adaptador:", pedido.anadir("Adaptador", 2, 125));
console.log("Materiales:", pedido.materiales().join(", "));
console.log("Total:", (pedido.totalCentimos() / 100).toFixed(2), "€");
```

### Lectura del resultado

```text
Total inicial: 0
Cable: true
Ratón: false
Adaptador: true
Materiales: Cable, Adaptador
Total: 10.00 €
```

| Petición | Qué hace el módulo | Total acumulado |
| --- | --- | ---: |
| 3 cables a 250 céntimos | Crea y guarda una línea de 750 céntimos. | 750 |
| 0 ratones a 900 céntimos | Devuelve `false` antes de llamar a la fábrica. | 750 |
| 2 adaptadores a 125 céntimos | Crea y guarda una línea de 250 céntimos. | 1000 |

El total inicial es cero porque `reduce` parte de cero incluso con el array vacío. La conversión a euros se hace al imprimir. Para comprobar la decisión de diseño, pon un punto de interrupción en `lineas.push(...)` y ejecuta de nuevo el programa. Llegarás a esa instrucción dos veces. En la segunda, el array ya contiene el cable y la cantidad que estás a punto de añadir es 2.

## Ejercicio propuesto: registro de tiempos de un taller

### Contexto

Durante un taller de programación se registra cuánto dura cada actividad. El docente quiere conocer el total de minutos después de cada alta válida. Dos observadores utilizarán ese mismo total: uno lo mostrará y otro contará las actualizaciones recibidas.

### Datos de partida

El registro empieza vacío. Las actividades se identifican por un nombre, que puedes suponer válido. Los minutos deben ser enteros positivos. Utiliza los nombres y tiempos de la tabla de pruebas, en el orden indicado.

### Requisitos obligatorios

1. Crea un módulo `registro` con un array interno de actividades. Ofrece las operaciones `anotar(nombre, minutos)`, `totalMinutos()` y `suscribir(funcion)`.
2. `anotar()` debe guardar un objeto con el nombre y los minutos, y devolver `true` si acepta el alta. Ante un valor inválido, devuelve `false` y conserva el estado anterior.
3. Registra dos funciones antes de la primera alta. Una escribe el total recibido en consola. La otra incrementa un contador de avisos que el programa principal pueda consultar.
4. Tras cada alta válida, calcula el nuevo total y envíalo una sola vez a cada observador. Una consulta con `totalMinutos()` devuelve el total actual. Las consultas y las altas rechazadas dejan el contador de avisos como estaba.
5. Muestra el resultado de cada alta, el total y el contador para que puedas contrastarlos con la tabla.

### Pistas de diseño

El array de actividades guarda datos. El de oyentes guarda funciones. Revisa qué array necesitas recorrer para sumar minutos y cuál para repartir un aviso. Si envías el total después de guardar la actividad, el dato incluirá los minutos que acabas de aceptar.

### Casos que debes probar

| Operación en orden | Retorno | Total de minutos | Avisos recibidos por el segundo observador |
| --- | --- | ---: | ---: |
| Consultar el registro vacío | `0` | 0 | 0 |
| Anotar «Diseño», 12 | `true` | 12 | 1 |
| Intentar anotar «Pausa», 0 | `false` | 12 | 1 |
| Intentar anotar «Ensayo», 2.5 | `false` | 12 | 1 |
| Anotar «Prueba», 8 | `true` | 20 | 2 |
| Consultar dos veces el total | `20` en ambas llamadas | 20 | 2 |

El primer observador debe haber mostrado solo dos valores, 12 y 20. Como prueba adicional, inicia otra ejecución, realiza un alta válida antes de suscribir funciones y comprueba que los minutos quedan registrados.

### Entrega

Entrega `taller.html`, `taller.js` y una captura de la consola con las pruebas. Explica en dos o tres frases qué datos conserva el módulo, qué reciben los observadores y en qué línea pondrías un punto de interrupción si un alta rechazada provocara un aviso.
