---
title: U.T. 5. Interacción con el usuario
tags:
  - JavaScript
  - DWEC
  - RA5
---

# U.T. 5. Interacción con el usuario: eventos y formularios

Una página web deja de ser un documento estático cuando **reacciona** a lo que hace la persona que la usa: un clic, una tecla, un envío de formulario. Esa reacción se programa con **eventos**.

El **DOM** construye el árbol de objetos de la página y es también quien **dispara** los eventos. Tú escribes un **manejador** (*handler*): una función que se ejecuta cuando ocurre el suceso.

Esta unidad cubre el **[RA5](ra5.md)**: desarrollar aplicaciones web interactivas integrando el manejo de eventos, la gestión de formularios y la validación (incluida con expresiones regulares).

Consulta el [enunciado oficial del RA5 y sus criterios de evaluación](ra5.md).

## Qué vas a trabajar

| Apartado | Contenido |
| --- | --- |
| [5.1 Modelo de eventos](modelo-eventos.md) | Manejador, atributos HTML y `addEventListener` |
| [5.2 Tipos de eventos](tipos-eventos.md) | Ratón, teclado, HTML/ventana y cambios en el DOM |
| [5.3 Formularios](formularios.md) | `<form>`, controles, `name`/`value`, HTML5 |
| [5.4 Apariencia y comportamiento](apariencia-comportamiento.md) | `fieldset`, `action` dinámico, `submit()` |
| [5.5 Validación y envío](validacion.md) | `submit`, HTML5 y Constraint Validation API |
| [5.6 Expresiones regulares](expresiones-regulares.md) | Patrones, `test()`, email, DNI, teléfono |
| [5.7 Cookies](cookies.md) | Lectura/escritura; cuándo usar Web Storage |

## Criterios de evaluación (RA5)

El texto oficial del resultado de aprendizaje y de los criterios **a)** a **h)** está en [RA5 y criterios de evaluación](ra5.md).

!!! info "Sobre el material original"
    Se mantiene la estructura pedagógica del documento *U.T. 5. Interacción con el usuario: eventos y formularios*. El contenido se ha actualizado: `addEventListener`, objeto `event`, `preventDefault`, `event.key`, `DOMContentLoaded`, tipos HTML5 (`email`, `required`, `pattern`), Constraint Validation API, `FormData` y `MutationObserver` en lugar de los eventos de mutación del DOM. No se enseña `escape`/`unescape` ni `keypress` como API recomendada.

    El PDF de partida se puede descargar aquí: [U.T. 5. Interacción con el usuario: eventos y formularios.pdf](../assets/UT5-eventos-formularios-original.pdf).
