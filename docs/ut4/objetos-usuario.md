---
title: 4.7 Objetos definidos por el usuario
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.7. Objetos definidos por el usuario

Un aula necesita saber cuántos cables quedan después de cada entrega. Podemos guardar el nombre y las existencias en dos variables, pero al añadir un segundo artículo tendremos que recordar qué cantidad corresponde a cada uno. Con un objeto podemos escribir `cable.retirar(2)` y pedir al propio artículo que compruebe si hay unidades suficientes.

En [4.6 Orientación a objetos](orientacion-objetos.md) vimos cómo varias instancias comparten métodos y conservan su propio estado. Ahora diseñaremos esos objetos. Trabajaremos los criterios **g)** al elegir su estructura, **h)** al escribir propiedades y métodos, **i)** al utilizar las instancias desde un programa y **k)** al documentar y probar su comportamiento. Consulta los [criterios del RA4](ra4.md).

## Literal (un objeto suelto)

Un literal reúne en una expresión los datos de una ficha y las operaciones disponibles. En este ejemplo guardamos el precio base y el tipo de IVA. Calculamos el precio final cuando se solicita, de modo que un cambio en el precio base se refleje en la siguiente consulta.

```javascript
const producto = {
  id: 1,
  nombre: "Teclado",
  precio: 24,
  iva: 0.21,
  precioFinal() {
    return this.precio * (1 + this.iva);
  },
};

const campo = "precio";
console.log(producto.nombre);                   // Teclado
console.log(producto[campo]);                   // 24
console.log(producto.campo);                    // undefined
console.log(producto.precioFinal().toFixed(2)); // 29.04
```

`producto[campo]` evalúa la variable y lee la propiedad `precio`. En cambio, `producto.campo` busca una propiedad llamada literalmente `campo`. Los paréntesis de `precioFinal()` ejecutan el método con `producto` como receptor. El método devuelve un número y `toFixed(2)` produce el texto que mostramos.

## Clase (molde)

Si tenemos un catálogo, interesa que cada producto admita las mismas operaciones. Antes de escribir la clase, decide qué datos recibirá el constructor, qué datos conservará cada instancia y qué valores podrán calcular los métodos.

| Elemento de `Producto` | Decisión de diseño |
| --- | --- |
| `nombre`, `precio`, `iva` | Cada producto conserva sus propios valores. El precio recibido es el precio base. |
| `constructor(nombre, precio, iva)` | Inicializa la ficha. Si se omite el tipo de IVA, utiliza el valor predeterminado del ejemplo. |
| `precioFinal()` | Calcula un número que se podrá sumar o comparar. |
| `etiquetar()` | Devuelve el texto que verá quien consulte el catálogo. |

```javascript
class Producto {
  constructor(nombre, precio, iva = 0.21) {
    this.nombre = nombre;
    this.precio = precio;
    this.iva = iva;
  }

  precioFinal() {
    return this.precio * (1 + this.iva);
  }

  etiquetar() {
    return `${this.nombre}: ${this.precioFinal().toFixed(2)} €`;
  }
}

const teclado = new Producto("Teclado", 24);
const raton = new Producto("Ratón", 12);
console.log(teclado.etiquetar()); // Teclado: 29.04 €
console.log(raton.etiquetar());   // Ratón: 14.52 €
```

En `this.precio = precio`, el valor de la derecha llega como argumento. La propiedad de la izquierda permanece en el objeto una vez terminado el constructor. Dentro de `etiquetar()`, la llamada `this.precioFinal()` reutiliza el cálculo definido en la propia clase. Si cambia la fórmula, basta con modificar ese método.

### Propiedades de instancia frente a estáticas

Un identificador pertenece a una ficha concreta. El recuento de fichas creadas corresponde al conjunto. Un campo `static` permite llevar esa cuenta en la clase y el constructor puede copiar el número que toca en cada instancia.

```javascript
class Contador {
  static creados = 0;

  constructor() {
    Contador.creados += 1;
    this.id = Contador.creados;
  }
}

const primero = new Contador();
const segundo = new Contador();
console.log(primero.id, segundo.id); // 1 2
console.log(Contador.creados);       // 2
console.log(primero.creados);        // undefined
```

Sigue la segunda llamada a `new`. El contador de la clase pasa de 1 a 2 y ese 2 se asigna a `segundo.id`. La propiedad `primero.id` conserva el 1 que recibió al crearse. El contador expresa cuántas instancias se han creado durante esta ejecución.

### Campos privados (opcional)

La clase `Caja` permite ingresar una cantidad y consultar el saldo. Al declarar `#saldo`, la clase controla qué operaciones pueden escribir en ese campo. Definimos una regla que se puede comprobar en consola: un ingreso será válido si recibe un número finito mayor que cero.

```javascript
class Caja {
  #saldo = 0;

  ingresar(cantidad) {
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return false;
    }
    this.#saldo += cantidad;
    return true;
  }

  ver() {
    return this.#saldo;
  }
}

const caja = new Caja();
console.log(caja.ingresar(5), caja.ver());   // true 5
console.log(caja.ingresar("3"), caja.ver()); // false 5
```

El resultado de `ingresar()` indica si se aceptó la operación. El resultado de `ver()` indica cuánto hay. Desde fuera consultamos `caja.ver()`. Escribir `caja.#saldo` fuera de la clase provocaría un error de sintaxis que impediría ejecutar el archivo completo.

## Forma antigua: función constructora

También encontrarás código que define una función constructora y asigna métodos a su `prototype`. Para leerlo, localiza primero las asignaciones que inicializan cada instancia y después la función compartida.

```javascript
function ProductoAntiguo(nombre, precio) {
  this.nombre = nombre;
  this.precio = precio;
}

ProductoAntiguo.prototype.precioFinal = function () {
  return this.precio * 1.21;
};

const cable = new ProductoAntiguo("Cable", 5);
console.log(cable.precioFinal().toFixed(2)); // 6.05
```

`new` crea el objeto que recibirá `nombre` y `precio` y lo enlaza con `ProductoAntiguo.prototype`, donde encontrará el método. Una llamada ordinaria a esta función sin `new` puede escribir sobre el objeto global en modo no estricto o fallar al asignar las propiedades en modo estricto. Con `class`, llamar al constructor sin `new` produce un error. En las prácticas utilizaremos `class`.

## Usar los objetos (criterio i)

Añade este bloque **debajo del ejemplo de la clase `Producto`**, en el mismo archivo. El array contendrá instancias. En cada paso del recorrido podemos pedir a la instancia actual que calcule su propio precio.

```javascript
const catalogo = [teclado, raton, new Producto("HDMI", 8)];
const precios = catalogo.map((producto) => producto.precioFinal());
const total = precios.reduce((suma, precio) => suma + precio, 0);

console.log(catalogo.length);        // 3
console.log(total.toFixed(2));       // 53.24
console.log(catalogo[2].etiquetar()); // HDMI: 9.68 €
```

`map` construye un array de números y `reduce` los suma desde cero. El redondeo se aplica al total que se muestra. Si utilizáramos `etiquetar()` en el primer paso obtendríamos textos con nombres y euros, inadecuados para la suma. Puedes repasar el recorrido en [4.5 Operaciones agregadas](operaciones-agregadas.md).

## Caso práctico resuelto: entrega de material del aula

El almacén tiene dos artículos. Al retirar unidades necesitamos saber si la entrega se ha realizado, cuánto queda de cada artículo y cuántas unidades conserva el almacén en total. El programa principal solicita las operaciones. Cada artículo decide si puede atenderlas.

| Pregunta de diseño | Decisión |
| --- | --- |
| ¿Qué recibe cada artículo al crearse? | Un nombre y una cantidad inicial. Los datos de partida son válidos, con cantidades enteras mayores o iguales que cero. |
| ¿Qué puede pedir el programa? | Retirar unidades, consultar las existencias y obtener una ficha de texto. |
| ¿Cuándo se acepta una retirada? | Cuando la cantidad es un entero positivo y hay unidades suficientes. Se puede retirar la última unidad. |
| ¿Qué ocurre si se rechaza? | El método devuelve `false` y conserva las existencias anteriores. |

Guarda los dos archivos en la misma carpeta, abre el HTML en el navegador y consulta la consola.

**`almacen.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Entrega de material del aula</title>
</head>
<body>
  <h1>Entrega de material del aula</h1>
  <p>Consulta las entregas en la consola del navegador.</p>
  <script src="almacen.js"></script>
</body>
</html>
```

**`almacen.js`**

```javascript
class Articulo {
  constructor(nombre, unidades) {
    this.nombre = nombre;
    this.unidades = unidades;
  }

  /**
   * Descuenta unidades si se puede completar la entrega.
   * @param {number} cantidad Unidades solicitadas.
   * @returns {boolean} Indica si se ha realizado la entrega.
   */
  retirar(cantidad) {
    if (!Number.isInteger(cantidad) || cantidad <= 0 || cantidad > this.unidades) {
      return false;
    }
    this.unidades -= cantidad;
    return true;
  }

  existencias() {
    return this.unidades;
  }

  ficha() {
    return `${this.nombre}: ${this.existencias()} uds.`;
  }
}

const cables = new Articulo("Cable HDMI", 5);
const ratones = new Articulo("Ratón", 2);
const inventario = [cables, ratones];

console.log("Entrega de 3 cables:", cables.retirar(3));
console.log("Entrega de otros 3:", cables.retirar(3));
console.log("Entrega de 2 ratones:", ratones.retirar(2));

for (const articulo of inventario) {
  console.log(articulo.ficha());
}
const total = inventario.reduce((suma, articulo) => suma + articulo.existencias(), 0);
console.log("Unidades en el almacén:", total);
```

### Lectura del resultado

```text
Entrega de 3 cables: true
Entrega de otros 3: false
Entrega de 2 ratones: true
Cable HDMI: 2 uds.
Ratón: 0 uds.
Unidades en el almacén: 2
```

La primera entrega deja dos cables. La segunda vuelve a pedir tres, por lo que `retirar()` termina en el primer `return` y las existencias siguen en dos. La tercera petición coincide exactamente con los dos ratones disponibles. La condición utiliza `>`, así que acepta esa entrega y deja cero ratones. El recorrido final consulta el estado que conservan los dos artículos después de las tres llamadas.

**Prueba de depuración.** Coloca un punto de interrupción en el `if` de `retirar()`. En la segunda llamada comprueba que `cantidad` vale 3 y `this.unidades` vale 2. Avanza una instrucción y observa qué `return` se ejecuta. Prueba también `cables.retirar(0)` y `cables.retirar(1.5)`: las dos llamadas deben devolver `false` y dejar dos cables.

Las propiedades del caso resuelto son públicas. El programa principal respeta la regla de existencias porque todas las retiradas pasan por el método. Como ampliación, puedes convertir `unidades` en un campo privado y repetir las pruebas manteniendo las mismas llamadas del programa principal.

## Ejercicio propuesto: inscripción en talleres

### Contexto

El centro organiza dos talleres con aforo limitado. Secretaría necesita inscribir grupos, consultar las plazas disponibles e imprimir un resumen. Una inscripción de grupo se acepta completa o se rechaza completa.

### Datos de partida

| Instancia | Taller | Capacidad | Plazas ocupadas al comenzar |
| --- | --- | ---: | ---: |
| `redes` | Redes | 5 | 0 |
| `web` | Web | 3 | 0 |

### Requisitos obligatorios

1. Define la clase `Taller`. El constructor recibe un nombre y una capacidad entera positiva. Para este ejercicio puedes suponer válidos ambos argumentos. Inicializa las plazas ocupadas a cero.
2. Implementa `disponibles()` para calcular las plazas libres a partir de la capacidad y las ocupadas.
3. Implementa `inscribir(cantidad)`. Acepta únicamente enteros positivos que quepan en las plazas disponibles. Devuelve un booleano y actualiza las plazas ocupadas solo cuando acepta la inscripción.
4. Haz que `ficha()` devuelva un texto como `Redes: 2 de 5 plazas libres`. Llama a `disponibles()` desde este método para reutilizar el cálculo.
5. Crea las dos instancias con `new`, guárdalas en un array y ejecuta las pruebas en orden. Al terminar, recorre los talleres, imprime sus fichas y calcula el total de plazas libres.
6. Documenta con JSDoc el parámetro y el resultado de `inscribir()`. Incluye una prueba que muestre por qué una inscripción rechazada conserva el estado.

### Pistas de diseño

Guarda los datos que cambian al inscribir un grupo. Si las plazas libres se calculan con una resta, puedes obtenerlas en cualquier momento. Antes de incrementar las plazas ocupadas, comprueba si la cantidad es entera, positiva y cabe en el taller que recibe la llamada.

### Casos que debes probar

Ejecuta las filas en orden sobre las mismas instancias.

| Operación | Resultado | Libres en Redes | Libres en Web |
| --- | --- | ---: | ---: |
| Consultar el estado inicial | Dos fichas | 5 | 3 |
| Inscribir 3 personas en Redes | `true` | 2 | 3 |
| Intentar inscribir otras 3 en Redes | `false` | 2 | 3 |
| Intentar inscribir 0 y después 1.5 en Web | `false` en ambas llamadas | 2 | 3 |
| Inscribir 3 en Web | `true` | 2 | 0 |
| Intentar inscribir 1 más en Web | `false` | 2 | 0 |

El informe final debe indicar dos plazas libres en total. Comprueba también que pedir dos fichas consecutivas del mismo taller devuelve el mismo texto.

### Entrega

Entrega `talleres.html`, `talleres.js` y una captura de la consola con los resultados de la tabla. Explica qué propiedades pertenecen a cada instancia y, para una inscripción rechazada, anota la cantidad solicitada y las plazas disponibles que observaste al depurar.

## Errores frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| La etiqueta contiene `undefined`. | Comprueba que el constructor asigna el parámetro a una propiedad y que el método lee el mismo nombre. |
| Una consulta muestra el código de una función. | Revisa los paréntesis de la llamada. `articulo.ficha` obtiene la función y `articulo.ficha()` obtiene el texto. |
| Un intento rechazado modifica el objeto. | Comprueba las condiciones antes de escribir el nuevo estado. |
| La suma del catálogo une textos. | Localiza dónde se ejecuta `toFixed()`. Conserva los números hasta el momento de presentar el resultado. |

En [4.8 Patrones de diseño](patrones.md) utilizarás estas mismas ideas para decidir cómo crear objetos similares y cómo organizar el acceso a sus operaciones.
