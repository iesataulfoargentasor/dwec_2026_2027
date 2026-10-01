---
title: 4.8 Patrones de diseño
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.8. Patrones de diseño de software

Un **patrón** es una solución **reutilizable** a un problema que aparece a menudo (cómo crear objetos, cómo ocultar datos, cómo avisar de un cambio…). No es una librería: es una **forma de organizar** el código.

El criterio **j)** pide **utilizar** patrones, no memorizar el catálogo GoF. En cliente web, estos cuatro bastan para empezar.

## Módulo (y módulo revelado)

Problema: no llenar `window` de variables.  
Idea: una función se ejecuta **una vez**, guarda estado interno (closure) y **exporta** solo lo público.

```javascript
const carrito = (function () {
  const lineas = []; // privado

  function total() {
    return lineas.reduce((acum, l) => acum + l.precio, 0);
  }

  return {
    add(nombre, precio) {
      lineas.push({ nombre: nombre, precio: precio });
    },
    listar() {
      return [...lineas];
    },
    total: total,
  };
})();

carrito.add("Teclado", 24.5);
console.log(carrito.total());
```

Hoy el mismo espíritu son los **módulos ES** (`export` / `import`), que separan el código en ficheros. En este apartado no hacen falta: el ejemplo de arriba ya oculta `lineas`.

## Fábrica (*factory*)

Problema: crear objetos parecidos sin repetir `new` ni exponer la clase.

```javascript
function crearAlumno(nombre, nota) {
  return {
    nombre: nombre,
    nota: nota,
    aprobado() {
      return this.nota >= 5;
    },
  };
}

const a1 = crearAlumno("Alex", 8);
const a2 = crearAlumno("Luis", 4);
```

Útil cuando el objeto es simple. Si hay herencia o muchas instancias, `class` suele ser más claro.

## Singleton

Problema: **una sola** instancia (configuración, registro de log). `Object.freeze` deja el objeto quieto: no se le pueden cambiar las propiedades.

```javascript
const config = {
  api: "https://api.aula.local",
  timeout: 5000,
};

Object.freeze(config);
console.log(config.api);
```

`Object.freeze` impide cambiar o añadir propiedades. Ese objeto, guardado en un único sitio, **ya es** un singleton. No hace falta una clase con `getInstance()` al estilo Java. La palabra `export`, para sacar el objeto a otro fichero, no hace falta en este ejemplo.

## Observador (*pub/sub* sencillo)

Problema: un objeto avisa a otros cuando pasa algo, sin conocerlos uno a uno (UI, eventos).

```javascript
function crearEmisor() {
  const oyentes = {};

  return {
    on(evento, fn) {
      if (oyentes[evento] === undefined) {
        oyentes[evento] = [];
      }
      oyentes[evento].push(fn);
    },
    emit(evento, dato) {
      const lista = oyentes[evento] ?? [];
      lista.forEach((fn) => fn(dato));
    },
  };
}

const bus = crearEmisor();
bus.on("login", (user) => console.log("Bienvenido", user));
bus.emit("login", "Alex");
```

En el navegador, `addEventListener` **es** este patrón aplicado al DOM.

## Cómo elegir

| Si necesitas… | Patrón |
| --- | --- |
| Ocultar variables y ofrecer una API pequeña | Módulo |
| Construir objetos similares | Fábrica o `class` |
| Un único punto de configuración | Singleton (módulo exportado) |
| Desacoplar “quién avisa” de “quién reacciona” | Observador / eventos |

!!! example "Práctica de aula"
    Un carrito (módulo) que usa `Producto` (clase), guarda líneas en un array y, al añadir, `emit("cambio", total)`. Ahí juntas funciones, arrays, objetos y un patrón: el RA4 completo.

!!! tip "Depurar patrones"
    El estado “privado” no se ve como propiedad del objeto. En DevTools, pon un breakpoint **dentro** del módulo (`add`, `total`) para inspeccionar `lineas`.
