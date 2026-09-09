---
title: 6.7 Compatibilidad entre navegadores
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.7. Programar para distintas implementaciones

El criterio **g)** pide que la aplicación **funcione** aunque el modelo no sea idéntico en todos los navegadores. El PDF lo llamaba *cross-browser* y apuntaba a librerías, capturas de IE y `ActiveXObject`.

## Qué no copies como plantilla

El cierre del material de 2013 ramificaba Ajax así:

```javascript
// Historia: IE5 / IE6
let xhr;
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
} else {
  xhr = new ActiveXObject("Microsoft.XMLHTTP");
}
```

`ActiveXObject` **no existe** en los navegadores actuales. `XMLHttpRequest` sí; para peticiones nuevas se usa **`fetch`**. El patrón que **sí** reutilizas es el de la primera rama: **“si existe la API, úsala”**.

## Detección de características

Preguntas al objeto si tiene el método o la propiedad, no qué nombre tiene el navegador.

```javascript
if ("querySelector" in document) {
  const app = document.querySelector("#app");
} else {
  const app = document.getElementById("app");
}
```

Hoy `querySelector` está en todos los navegadores que te importan; el `if` ilustra el **método**. Más realista: una API reciente.

```javascript
if ("showOpenFilePicker" in window) {
  // Selector de ficheros moderno
} else {
  // Fallback: <input type="file">
}
```

```javascript
const nombre = elemento.textContent ?? ""; // operador actual
if (elemento.classList) {
  elemento.classList.add("activo");
} else {
  elemento.className += " activo"; // legado extremo
}
```

**Mejora progresiva:** la página tiene sentido en HTML; JavaScript **añade** comportamiento. Si el script falla, el contenido sigue ahí (criterio **h)**).

## Librerías de terceros (temario 2.6)

Para unificar eventos y el DOM nació un ecosistema *cross-browser*. Durante años **jQuery** (`$()`) fue la respuesta del aula y de la industria: el mismo código en IE y en Firefox.

En un proyecto **nuevo** de DWEC **no hace falta jQuery** para seleccionar nodos ni para `click`: el DOM estándar cubre el RA6. Si un enunciado antiguo pide `$("#lista").append(...)`, el equivalente es `document.querySelector("#lista").append(...)`.

Otras ideas del PDF, actualizadas:

| Idea de 2013 | Equivalente actual |
| --- | --- |
| netrenderer (captura de IE) | Capturas o máquinas virtuales solo si hay un cliente con navegador viejo |
| multiIE / IE Collection | No instalar IE. Usar Edge, Chrome, Firefox y Safari (o WebKit en iOS) |
| Máquinas virtuales | Siguen valiendo para probar un Windows antiguo **si el módulo lo pide** |
| Librería que envuelve el DOM | Solo si el proyecto ya la usa; si no, API nativa |

Comprueba **al menos dos navegadores** de la práctica (por ejemplo Chrome y Firefox): consola sin errores, los nodos se crean, los eventos responden.

```javascript
function puedeDelegar() {
  return typeof document.addEventListener === "function";
}

if (!puedeDelegar()) {
  document.querySelector("#app").textContent =
    "Este navegador no admite la práctica.";
}
```

!!! tip "Documentar la prueba"
    Anota navegador y versión (criterio implícito de “verificar”). Un comentario o un README corto en la entrega Moodle basta: “Probado en Chrome 140 y Firefox 142”.
