---
title: 4.5 Orientación a objetos
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.5. Características de orientación a objetos

JavaScript es **multiparadigma**. La orientación a objetos no funciona como en Java:

| En Java / C# | En JavaScript |
| --- | --- |
| Clases desde el diseño | **Prototipos**: cada objeto puede enlazar con otro que le “presta” métodos |
| Tipado estático | Tipado dinámico: las propiedades se pueden añadir en caliente |
| `class` obligatorio | Objetos literales **sin clase**; `class` (ES2015) es azúcar sobre prototipos |

Un **objeto** agrupa:

- **Propiedades:** datos (`nombre`, `nota`).
- **Métodos:** funciones que pertenecen al objeto (`aprobar()`, `presentarse()`). Un método es una propiedad cuyo valor es una función.

```javascript
const ficha = {
  nombre: "Alex",
  nota: 8,
  aprobado() {
    return this.nota >= 5;
  },
};

console.log(ficha.aprobado()); // true
```

## `this`

Dentro de un método, `this` es el objeto **desde el que se llamó** (`ficha.aprobado()` → `this` es `ficha`).

Si extraes la función, se pierde el receptor:

```javascript
const fn = ficha.aprobado;
// fn(); // this no es ficha (en estricto: undefined)
```

Las **flechas** no tienen `this` propio: usan el de la función envolvente. Por eso, en métodos de objeto suele usarse la sintaxis `aprobado() { … }`, no `aprobado: () => { … }`.

## Prototipo

Si varias fichas comparten el mismo método, no hace falta copiarlo en cada una: se pone en el **prototipo**. `class` hace exactamente eso por ti.

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

const a = new Alumno("Mar", 9);
console.log(a.aprobado());
console.log(Object.getPrototypeOf(a) === Alumno.prototype); // true
```

`new` crea el objeto, enlaza el prototipo y ejecuta `constructor`.

## Encapsulación (idea)

Ocultar detalles y ofrecer una interfaz. En JS moderno: campos privados `#nota`, o un [módulo](patrones.md) que no exporta las variables internas.

No hay interfaces ni modificadores `private` al estilo Java en el sentido clásico (salvo `#` y convención `_privado`).

!!! note "Colecciones del DOM"
    `document.forms` no es una clase tuya: es una colección del navegador. Tus **objetos de usuario** viven en memoria para modelar el dominio (alumno, producto, carrito), no necesariamente un tag HTML.
