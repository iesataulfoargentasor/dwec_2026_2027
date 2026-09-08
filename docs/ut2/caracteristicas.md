---
title: 2.1 Características de JavaScript
tags:
  - JavaScript
  - DWEC
  - RA2
---

# 2.1. Características de JavaScript

JavaScript es el lenguaje que ejecuta el navegador en el lado cliente. Hoy también corre fuera del navegador (Node.js, Deno, Bun), pero en DWEC el objetivo principal es **programar el cliente web**.

## Qué define al lenguaje hoy

- **Estándar ECMAScript (ES).** Lo que llamamos “JavaScript” es la implementación del estándar ECMA-262. Las versiones anuales (ES2015, ES2020, …) añaden sintaxis; en clase usamos la que soportan los navegadores actuales.
- **Sintaxis emparentada con C, C++ y Java**, pero el modelo de datos y el tipado son distintos. No es un “Java ligero”.
- **Multiparadigma.** Es un lenguaje basado en **prototipos**. Desde ES2015 tiene sintaxis de **clases**, funciones, y un estilo funcional muy usado (`map`, `filter`, arrow functions). En esta unidad nos centramos en la sintaxis básica; objetos y funciones se profundizan más adelante.
- **Tipado dinámico.** No declaras el tipo de una variable. El tipo lo determina el valor en tiempo de ejecución. Eso no significa “sin tipos”: existen tipos claros (`number`, `string`, `boolean`…) y conviene conocerlos.
- **Declaración con `const` y `let`.** Son la forma actual de crear identificadores. `var` sigue existiendo por compatibilidad, pero en código nuevo se evita.
- **Ámbito de bloque.** Una variable declarada con `let` o `const` dentro de `{ ... }` solo existe en ese bloque (función, `if`, `for`…).
- **Modo estricto.** En módulos ES (`type="module"`) el modo estricto está activo. Evita malas prácticas como crear variables globales por accidente.
- **Un solo hilo en el navegador**, con un bucle de eventos. Eso se verá en unidades posteriores (eventos, asincronía).

## Dónde se ejecuta

| Entorno | Uso en este módulo |
| --- | --- |
| Navegador (V8, SpiderMonkey, JavaScriptCore) | Entorno principal: HTML + JS + DevTools |
| Node.js | Mismo lenguaje, sin `document` ni `alert`. Útil para probar sintaxis en terminal |
| Consola DevTools | El laboratorio diario de esta unidad |

!!! warning "`alert` y `document.write`"
    `alert()` sigue funcionando y es cómodo en los primeros ejercicios. `document.write()` se considera obsoleto: pisa el documento si se llama cuando la página ya está cargada. Preferimos `console.log()` y, más adelante, el DOM (`textContent`, `innerHTML` controlado).

## JavaScript no es Java

| | JavaScript | Java |
| --- | --- | --- |
| Tipado | Dinámico | Estático |
| Compilación | Interpretado / JIT en el motor | Compilado a bytecode |
| Orientación a objetos | Prototipos + clases ES | Clases desde el diseño |
| Dónde corre (en DAW) | Navegador (cliente) | Servidor, Android, etc. |

!!! tip "TypeScript"
    TypeScript añade tipos estáticos y se transpila a JavaScript. Es muy usado en la industria. En esta unidad escribimos **JavaScript nativo**, que es lo que acaba ejecutando el navegador.
