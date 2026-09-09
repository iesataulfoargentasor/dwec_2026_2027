---
title: 4.7 Patrones de diseño
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.7. Patrones de diseño de software

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
      lineas.push({ nombre, precio });
    },
    listar() {
      return [...lineas];
    },
    total,
  };
})();

carrito.add("Teclado", 24.5);
console.log(carrito.total());
```

Hoy el mismo espíritu son los **módulos ES** (`export` / `import`). El IIFE anterior es el patrón clásico cuando no hay bundler.

## Fábrica (*factory*)

Problema: crear objetos parecidos sin repetir `new` ni exponer la clase.

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

const a1 = crearAlumno("Alex", 8);
const a2 = crearAlumno("Luis", 4);
```

Útil cuando el objeto es simple. Si hay herencia o muchas instancias, `class` suele ser más claro.

## Singleton

Problema: **una sola** instancia (configuración, registro de log).

```javascript
const config = {
  api: "https://api.aula.local",
  timeout: 5000,
};

Object.freeze(config);
export { config };
```

Un objeto módulo exportado **ya es** un singleton. No hace falta una clase con `getInstance()` al estilo Java.

## Observador (*pub/sub* sencillo)

Problema: un objeto avisa a otros cuando pasa algo, sin conocerlos uno a uno (UI, eventos).

```javascript
function crearEmisor() {
  const oyentes = {};

  return {
    on(evento, fn) {
      oyentes[evento] ??= [];
      oyentes[evento].push(fn);
    },
    emit(evento, dato) {
      (oyentes[evento] ?? []).forEach((fn) => fn(dato));
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
