---
title: 4.6 Objetos definidos por el usuario
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.6. Objetos definidos por el usuario

Tú defines la **estructura** (qué propiedades y métodos tiene) y luego **creas instancias** y las usas. Criterios **g)**, **h)** e **i)**.

## Literal (un objeto suelto)

```javascript
const producto = {
  id: 1,
  nombre: "Teclado",
  precio: 24.5,
  iva: 0.21,
  precioFinal() {
    return this.precio * (1 + this.iva);
  },
};

console.log(producto.nombre);
console.log(producto["precio"]);
console.log(producto.precioFinal().toFixed(2));
```

Útil para un dato único. Si vas a crear **muchos** iguales, usa una clase (o una fábrica).

Acceso: `obj.prop` o `obj["prop"]` (cuando el nombre viene en una variable).

## Clase (molde)

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

const teclado = new Producto("Teclado", 24.5);
const raton = new Producto("Ratón", 12);
console.log(teclado.etiquetar());
console.log(raton.etiquetar());
```

- **`constructor`:** inicializa propiedades al hacer `new`.
- **Métodos:** van en el prototipo; todas las instancias los comparten.
- **Uso:** `new Producto(...)` devuelve el objeto; llamas a sus métodos.

### Propiedades de instancia frente a estáticas

```javascript
class Contador {
  static creados = 0;

  constructor() {
    Contador.creados += 1;
    this.id = Contador.creados;
  }
}

new Contador();
new Contador();
console.log(Contador.creados); // 2
```

`static` pertenece a la **clase**, no a cada objeto.

### Campos privados (opcional)

```javascript
class Caja {
  #saldo = 0;

  ingresar(cantidad) {
    if (cantidad > 0) {
      this.#saldo += cantidad;
    }
  }

  ver() {
    return this.#saldo;
  }
}
```

`#saldo` no se lee desde fuera (`caja.#saldo` es error). Encapsulación real.

## Forma antigua: función constructora

El material de 2013 usaba esto. Sigue funcionando; en código nuevo se prefiere `class`.

```javascript
function ProductoAntiguo(nombre, precio) {
  this.nombre = nombre;
  this.precio = precio;
}

ProductoAntiguo.prototype.precioFinal = function () {
  return this.precio * 1.21;
};

const p = new ProductoAntiguo("Cable", 5);
```

Olvidar `new` aquí contaminaba `this` global. Con `class`, olvidar `new` lanza error: más seguro.

## Usar los objetos (criterio i)

Combina arrays y objetos de usuario:

```javascript
const catalogo = [
  new Producto("Teclado", 24.5),
  new Producto("Ratón", 12),
  new Producto("HDMI", 8),
];

const total = catalogo
  .map((p) => p.precioFinal())
  .reduce((acum, n) => acum + n, 0);

console.log(`Total IVA incl.: ${total.toFixed(2)} €`);
```

!!! success "Documentar la clase"
    Un bloque JSDoc encima de `class Producto` (`@param`, `@returns`) cubre el criterio **k)** junto con pruebas en consola.
