---
title: U.T. 6. Utilización del DOM
tags:
  - JavaScript
  - DWEC
  - RA6
---

# U.T. 6. Utilización del modelo de objetos del documento (DOM)

El **DOM** (*Document Object Model*) es la API con la que el navegador representa una página como un **árbol de nodos**. JavaScript usa ese árbol para **leer**, **cambiar** y **ampliar** el contenido, la estructura y (con cuidado) el estilo.

En la [UT3](../ut3/document.md) ya entraste por `document`. Aquí profundizas: tipos de nodo, recorrido del árbol, creación de elementos, eventos ligados al modelo y cómo **separar** HTML, CSS y JavaScript.

El DOM nació para documentos XML; HTML y XHTML lo usan por extensión. La API **no depende** de un único lenguaje: existe en Java, Python, etc. En DWEC la usas desde **JavaScript en el navegador**.

Esta unidad cubre el **[RA6](ra6.md)**: desarrollar aplicaciones web analizando y aplicando las características del modelo de objetos del documento.

Consulta el [enunciado oficial del RA6 y sus criterios de evaluación](ra6.md).

## Qué vas a trabajar

| Apartado | Contenido |
| --- | --- |
| [6.1 El modelo DOM](modelo-dom.md) | Estándar W3C/WHATWG, HTML DOM y árbol de nodos |
| [6.2 Objetos, propiedades y métodos](objetos-propiedades.md) | Tipos de nodo e interfaz `Node` |
| [6.3 Acceso al documento](acceso-documento.md) | Recorrido, `querySelector`, atributos |
| [6.4 Crear y modificar elementos](crear-modificar.md) | `createElement`, `append`, `textContent` |
| [6.5 Eventos del modelo](eventos-dom.md) | `DOMContentLoaded`, listeners y delegación |
| [6.6 Diferencias entre navegadores](diferencias-navegadores.md) | Histórico (IE) y diferencias actuales |
| [6.7 Compatibilidad](compatibilidad.md) | Detección de características, no *user-agent* |
| [6.8 Tres capas](tres-capas.md) | Contenido, aspecto y comportamiento |

## Criterios de evaluación (RA6)

El texto oficial del resultado de aprendizaje y de los criterios **a)** a **h)** está en [RA6 y criterios de evaluación](ra6.md).

!!! info "Sobre el material original"
    Se mantiene la estructura pedagógica del documento *U.T. 6. Utilización del modelo de objetos del documento (DOM)*. El contenido se ha actualizado: HTML5, `querySelector` / `querySelectorAll`, `children` frente a `childNodes`, `classList`, `append` / `remove`, `DOMContentLoaded`, delegación de eventos y **separación de capas**. El código *cross-browser* de IE5/IE6 (`ActiveXObject`) se explica como historia, no como plantilla. Se añade el apartado 6.8 porque el criterio **h)** no tenía epígrafe propio en el PDF.

    El PDF de partida se puede descargar aquí: [U.T. 6. Utilización del modelo de objetos del documento (DOM).pdf](../assets/UT6-dom-original.pdf).
