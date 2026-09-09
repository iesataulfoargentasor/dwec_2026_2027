---
title: 6.8 Independizar las tres capas
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.8. Las tres capas de implementación

El criterio **h)** pide **independizar** contenido, aspecto y comportamiento. El PDF de la UT6 no tenía un epígrafe con ese título; es un requisito oficial del RA6 y la forma profesional de usar el DOM.

| Capa | Qué es | Dónde vive |
| --- | --- | --- |
| **Contenido** (estructura) | Qué hay: títulos, listas, textos, controles | HTML |
| **Aspecto** (presentación) | Cómo se ve: colores, márgenes, visibilidad | CSS |
| **Comportamiento** (lógica) | Qué pasa al interactuar: crear nodos, clases, eventos | JavaScript |

Cada capa se **entrega en su archivo** (`index.html`, `estilos.css`, `app.js`) y se enlazan. No se mezclan.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Tareas</title>
    <link rel="stylesheet" href="estilos.css">
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Tareas</h1>
    <ul id="tareas"></ul>
    <button type="button" id="anadir">Añadir</button>
  </body>
</html>
```

```css
/* estilos.css */
.hecho {
  text-decoration: line-through;
  color: gray;
}
```

```javascript
// app.js
document.addEventListener("DOMContentLoaded", () => {
  const lista = document.querySelector("#tareas");
  const boton = document.querySelector("#anadir");

  boton.addEventListener("click", () => {
    const item = document.createElement("li");
    item.textContent = "Nueva tarea";
    lista.append(item);
  });

  lista.addEventListener("click", (event) => {
    const item = event.target.closest("li");
    if (item) {
      item.classList.toggle("hecho");
    }
  });
});
```

El JS **no** pone `item.style.textDecoration = "line-through"`: cambia una **clase**. El CSS decide el aspecto. El HTML no lleva `onclick`.

## Qué evita cada capa

| Evita | Por qué |
| --- | --- |
| `onclick="…"` y `onmouseover` en el HTML | Mezcla contenido y comportamiento |
| `style="color: red"` salvo casos puntuales | Mezcla contenido y aspecto |
| `element.style.color = "red"` para temas enteros | El aspecto debe poder cambiarse sin reescribir lógica |
| `innerHTML` con cadenas enormes de marcado | El contenido “de verdad” debería estar en HTML o crearse nodo a nodo |
| Un único archivo `.html` de 400 líneas con CSS y JS incrustados | Impide reutilizar y probar |

## Cómo se relaciona con el DOM

El DOM es el **puente**: el script localiza nodos del HTML y les pone clases que el CSS ya define. También puede **crear** contenido que no estaba en el archivo (lista vacía + `append`), pero la **cáscara** semántica (`h1`, `ul`, `button`) sigue en HTML.

Buenas prácticas unidas a esta unidad:

1. HTML semántico (`button` no es un `div` clicable).
2. `id` / clases estables para que el JS no dependa del orden de los `div`.
3. `defer` o `DOMContentLoaded` para no tocar nodos que aún no existen.
4. Un cambio visual = `classList`, no un bloque de estilos en el manejador.

!!! success "Lista de comprobación de la práctica"
    - Tres archivos (o al menos CSS y JS externos).
    - Ningún manejador como atributo HTML.
    - Ningún color o `display` crítico solo en JavaScript.
    - Funciona con el CSS desactivado lo bastante como para **leer** el contenido (mejora progresiva).
    - Probado en más de un navegador ([6.7](compatibilidad.md)).
