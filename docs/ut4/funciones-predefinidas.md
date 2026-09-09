---
title: 4.1 Funciones predefinidas
tags:
  - JavaScript
  - DWEC
  - RA4
---

# 4.1. Funciones predefinidas del lenguaje

Una **función predefinida** (o *built-in*) la aporta el lenguaje o el entorno: no la escribes tú, solo la **llamas**. En el navegador muchas cuelgan de `window`; en Node.js, del objeto global. Se invocan igual: `nombre(argumentos)`.

En JavaScript **no hay procedimientos aparte**: todo es función, devuelva valor o no.

## Conversión y comprobación numérica

Ya las usaste en la UT2. Aquí las clasificamos como funciones (o métodos) globales.

| Función | Uso actual |
| --- | --- |
| `Number(texto)` | Convierte a número (`NaN` si no puede) |
| `Number.parseInt(texto, 10)` | Entero; **indica siempre la base** |
| `Number.parseFloat(texto)` | Decimal |
| `Number.isNaN(x)` | ¿Es el valor `NaN`? |
| `Number.isFinite(x)` | ¿Es un número finito? |
| `String(x)` / `Boolean(x)` | Conversión explícita |

```javascript
console.log(Number("12.5"));           // 12.5
console.log(Number.parseInt("12px", 10)); // 12
console.log(Number.isNaN(Number("hola"))); // true
console.log(Number.isFinite(1 / 0));   // false
```

`parseInt` y `parseFloat` sin `Number.` siguen existiendo (son alias globales). Prefiere `Number.parseInt(…, 10)` para no heredar octales raros del pasado.

## Texto y URL

| Función | Uso |
| --- | --- |
| `encodeURIComponent(s)` | Codifica un valor para query string (`á` → `%C3%A1`) |
| `decodeURIComponent(s)` | Inversa |
| `encodeURI(url)` | Codifica una URL completa (respeta `://`, `?`, `&`) |

```javascript
const busqueda = encodeURIComponent("DAW 2º");
const url = `https://ejemplo.edu/buscar?q=${busqueda}`;
console.log(url);
```

!!! failure "`escape` / `unescape`"
    Están **obsoletas**. Usa `encodeURIComponent`.

## Datos: `JSON`

Para pasar objetos a texto y al revés (almacenamiento, APIs):

```javascript
const alumno = { nombre: "Alex", grupo: "DAW2" };
const texto = JSON.stringify(alumno);
const copia = JSON.parse(texto);
console.log(copia.grupo); // "DAW2"
```

## Temporizadores y diálogos (entorno)

No son ECMAScript puro, pero sí “predefinidas” en el cliente:

- `setTimeout` / `setInterval` / `clearTimeout` / `clearInterval` (UT3)
- `alert`, `confirm`, `prompt` (UT3)

## Lo que no debes usar

| Antigua | Por qué no |
| --- | --- |
| `eval(cadena)` | Ejecuta texto como código: inseguro y difícil de depurar |
| `isNaN("hola")` | Coacciona tipos; usa `Number.isNaN` |
| `document.write` | Ya lo vimos: pisa el documento |

!!! success "Clasificar"
    En un examen, distingue: **función global** (`Number.parseInt`), **método de objeto nativo** (`Math.max`, `"hola".toUpperCase()`), **método de objeto del navegador** (`document.querySelector`). El criterio **a)** pide esa clasificación y usarlas.
