---
title: U.T. 4. Programación con funciones, arrays y objetos
tags:
  - JavaScript
  - DWEC
  - RA4
---

# U.T. 4. Programación con funciones, arrays y objetos definidos por el usuario

Hasta ahora has escrito sentencias sueltas y has usado **objetos que ya venían con el lenguaje** (`Date`, `Math`, `JSON`, `window`…). En esta unidad organizas el código con **estructuras definidas por ti**, y completas las colecciones nativas que faltaban:

- **Funciones:** bloques reutilizables (las del lenguaje y las tuyas).
- **Arrays:** colecciones ordenadas (listas de valores), y al lado `Map` y `Set`.
- **Objetos propios:** datos + comportamiento (`propiedades` y `métodos`).
- **Patrones:** formas habituales de organizar ese código.

Esta unidad cubre el **[RA4](ra4.md)**: programar para el cliente web analizando y utilizando estructuras definidas por el usuario.

Consulta el [enunciado oficial del RA4 y sus criterios de evaluación](ra4.md).

## Qué vas a trabajar

| Apartado | Contenido |
| --- | --- |
| [4.1 Funciones predefinidas](funciones-predefinidas.md) | `Number`, `parseInt`, `JSON`, `encodeURIComponent`… |
| [4.2 Funciones de usuario](funciones-usuario.md) | `function`, flecha, parámetros, `return`, ámbito |
| [4.3 Arrays](arrays.md) | Crear, índices, `length`, mutar y copiar |
| [4.4 Map y Set](map-set.md) | Diccionario de claves y conjunto de valores únicos |
| [4.5 Operaciones agregadas](operaciones-agregadas.md) | `map`, `filter`, `reduce`, `find`… |
| [4.6 Orientación a objetos](orientacion-objetos.md) | Prototipos, `this`, clases |
| [4.7 Objetos de usuario](objetos-usuario.md) | Literales, `class`, métodos y propiedades |
| [4.8 Patrones de diseño](patrones.md) | Módulo, fábrica, singleton, observador |
| [Autoevaluación](autoevaluacion.md) | Test de 20 preguntas (código y casos de uso), con corrección comentada |

!!! info "JavaScript actual"
    Se sigue el temario clásico de la UT4 (funciones, arrays, objetos). El contenido usa **ECMAScript actual**: `const`/`let`, funciones flecha, `class`, métodos de array (`map`/`filter`/`reduce`) y patrones que verás en código profesional. No se enseña `eval`, ni `escape`/`unescape`, ni arrays “asociativos” como si fueran arrays de verdad.

!!! tip "Consola"
    Casi todos los ejemplos se prueban en DevTools (:kbd:`F12`) o con `node archivo.js`. Documenta con comentarios o JSDoc (criterio **k)**).
