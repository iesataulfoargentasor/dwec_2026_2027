---
title: U.T. 3. Utilización de los objetos predefinidos del lenguaje
tags:
  - JavaScript
  - DWEC
  - RA3
---

# U.T. 3. Utilización de los objetos predefinidos del lenguaje

Un **objeto** agrupa **propiedades** (valores), **métodos** (funciones) y, en el navegador, **eventos** (acciones). Se accede con la notación de punto:

```javascript
objeto.propiedad;
objeto.metodo(argumentos);
```

JavaScript distingue dos familias que importan en esta unidad:

| Familia | Ejemplos | ¿Depende del navegador? |
| --- | --- | --- |
| **Objetos nativos** (ECMAScript) | `Date`, `Math`, `Number`, `String`, `Array`, `JSON` | No. También funcionan en Node.js |
| **BOM** (Browser Object Model) | `window`, `navigator`, `screen`, `location`, `history` | Sí. Describen la ventana y el navegador |
| **DOM** (Document Object Model) | `document`, nodos HTML | Sí. Describe el contenido de la página |

El **BOM** nunca tuvo un estándar tan cerrado como el DOM. Hoy muchas APIs de ventana sí están en HTML/WHATWG (`window`, `location`, `history`…). Aun así, conviene probar en más de un navegador.

Esta unidad cubre el **[RA3](ra3.md)**: escribir código identificando y aplicando las funcionalidades de los objetos predefinidos.

Consulta el [enunciado oficial del RA3 y sus criterios de evaluación](ra3.md).

## Qué vas a trabajar

| Apartado | Contenido |
| --- | --- |
| [3.1 Objetos nativos](objetos-nativos.md) | `Date`, `Math`, `Number` |
| [3.2 String](string.md) | Cadenas: `length`, `includes`, `split`, plantillas |
| [3.3 BOM](bom.md) | Modelo de objetos del navegador, `navigator`, `screen` |
| [3.4 Window](window.md) | Ventana, diálogos, temporizadores |
| [3.5 Document](document.md) | Documento cargado: título, URL, estilo con CSS |
| [3.6 History y Location](history-location.md) | Historial de sesión y URL |
| [3.7 Generar HTML](generar-html.md) | Texto y etiquetas desde código (`textContent`, `createElement`) |
| [3.8 Ventanas y marcos](ventanas.md) | `iframe`, `window.open`, `opener` (los `frameset` son legado) |
| [3.9 Almacenamiento](almacenamiento.md) | Cookies, `localStorage` y `sessionStorage` |

!!! info "Sobre el material original"
    Se mantiene la estructura pedagógica del documento *U.T. 3. Utilización de los objetos predefinidos del lenguaje*. El contenido se ha actualizado: HTML5, `const`/`let`, DOM en lugar de `document.write` / `bgColor`, sin `with`, sin `frameset` como técnica actual, y almacenamiento web para el criterio **g)** del RA3.

    El PDF de partida se puede descargar aquí: [U.T. 3. Utilización de los objetos predefinidos del lenguaje.pdf](../assets/UT3-objetos-original.pdf).
