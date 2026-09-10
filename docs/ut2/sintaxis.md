---
title: "2.3 El lenguaje JavaScript: sintaxis"
tags:
  - JavaScript
  - DWEC
  - RA2
---

# 2.3. El lenguaje JavaScript: sintaxis

La sintaxis de JavaScript recuerda a C y a Java. Las normas básicas son las siguientes.

## 2.3.1. Mayúsculas y minúsculas

JavaScript **distingue mayúsculas y minúsculas**. `nombre`, `Nombre` y `NOMBRE` son tres identificadores distintos.

```javascript
const total = 10;
console.log(Total); // ReferenceError: Total is not defined
```

## 2.3.2. Comentarios en el código

Misma sintaxis que C++:

```javascript
// Comentario de una línea

/*
  Comentario
  de varias líneas
*/

/** Documentación breve de lo que hace el siguiente bloque (JSDoc). */
function saludar(nombre) {
  return `Hola, ${nombre}`;
}
```

Los comentarios no se ejecutan. Úsalos para explicar **por qué**, no para repetir lo que el código ya dice.

!!! warning "Comentarios que mienten"
    Un comentario desactualizado es peor que ninguno. Si cambias el código, revisa el comentario.

## 2.3.3. Tabulación y saltos de línea

El motor ignora espacios, tabuladores y saltos de línea extra. Aun así, la **legibilidad** es parte de la sintaxis que evaluamos en clase: indentación de 2 espacios (habitual en JS) y una sentencia por línea.

```javascript
const a = 1;
const b = 2;
const suma = a + b;
```

## 2.3.4. El punto y coma

El `;` termina una sentencia. JavaScript aplica **ASI** (inserción automática de punto y coma) y a menudo “entiende” el salto de línea como fin de sentencia.

```javascript
const mensaje = "Hola"
console.log(mensaje)
```

Eso funciona, pero hay casos en los que ASI **rompe** el código (por ejemplo, una línea que empieza por `[` o `(`). En este curso **escribimos el punto y coma** al final de cada sentencia. Es predecible y coincide con gran parte del código profesional que vas a leer.

```javascript
const mensaje = "Hola";
console.log(mensaje);
```

## 2.3.5. Palabras reservadas

No puedes usar como nombre de variable o función las palabras que el lenguaje necesita para sus instrucciones.

Palabras que **sí** usarás en esta unidad y siguientes:

`break`, `case`, `catch`, `class`, `const`, `continue`, `debugger`, `default`, `delete`, `do`, `else`, `export`, `extends`, `false`, `finally`, `for`, `function`, `if`, `import`, `in`, `instanceof`, `let`, `new`, `null`, `return`, `super`, `switch`, `this`, `throw`, `true`, `try`, `typeof`, `var`, `void`, `while`, `with`, `yield`, `await`, `async`, `static`.

Otras quedan reservadas por el estándar o por compatibilidad (`enum`, `implements`, `interface`, `package`, `private`, `protected`, `public`…).

!!! tip "Lista viva"
    La referencia canónica es el estándar [ECMA-262](https://tc39.es/ecma262/). No memorices la lista: el editor (VS Code, Cursor) te marcará el error si eliges un nombre prohibido.

## Identificadores válidos

- El primer carácter: letra, `_` o `$` (también Unicode, pero en clase usamos ASCII).
- El resto: letras, dígitos, `_` y `$`.
- Convención en JavaScript: **camelCase** para variables y funciones (`nombreCompleto`, `calcularTotal`).

```javascript
const _privado = 1;
const $elemento = "ok";
const nombre2 = "Ana";
// const 2nombre = "error"; // SyntaxError
```
