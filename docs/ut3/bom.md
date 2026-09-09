---
title: 3.3 BOM
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.3. Interacción de los objetos con el navegador (BOM)

El **Browser Object Model** describe la **ventana** del navegador, no el HTML. Permite, entre otras cosas:

- Conocer el navegador y la pantalla.
- Leer y cambiar la URL (`location`).
- Moverse por el historial (`history`).
- Abrir diálogos y, con limitaciones, otras ventanas.
- Guardar datos en el cliente (cookies y *Web Storage*).

Todo cuelga de **`window`**, el objeto global del navegador. `window.document`, `window.navigator` y `window.location` se pueden abreviar como `document`, `navigator` y `location`.

```javascript
console.log(window.innerWidth);
console.log(navigator.userAgent);
console.log(location.href);
```

!!! warning "BOM frente a DOM"
    El **DOM** (`document`, nodos, `querySelector`) es el estándar del contenido de la página. El **BOM** es el “marco” del navegador. En el material antiguo se decía que el BOM no estaba estandarizado; hoy `Window`, `Location` e `History` viven en HTML. Siguen existiendo diferencias menores entre motores.

No uses **ActiveX**, `javaEnabled()` ni `taintEnabled()`: son legado de Internet Explorer / Netscape.

## 3.3.1. El objeto `navigator`

Información sobre el **navegador** (y, en parte, el dispositivo).

| Propiedad | Uso actual |
| --- | --- |
| `userAgent` | Cadena que el navegador envía al servidor. Frágil para “detectar Chrome vs Firefox” |
| `language` / `languages` | Idioma(s) de la interfaz |
| `cookieEnabled` | ¿Acepta cookies? |
| `onLine` | ¿Hay conexión a red? (no garantiza Internet real) |
| `hardwareConcurrency` | Núcleos lógicos (aproximado) |

```javascript
console.log("Idioma:", navigator.language);
console.log("Cookies:", navigator.cookieEnabled);
console.log("En línea:", navigator.onLine);
console.log("userAgent:", navigator.userAgent);
```

!!! failure "No hagas *browser sniffing*"
    `appName` y `appVersion` mienten a menudo por compatibilidad. Si necesitas saber si una API existe, pregunta por ella: `"geolocation" in navigator`, `"serviceWorker" in navigator`.

Recorrer `navigator` con `for...in` (como en el PDF) lista muchas propiedades internas y los arrays `plugins` / `mimeTypes`, que en Chromium van vacíos por privacidad. En clase basta con las propiedades de la tabla.

## 3.3.2. El objeto `screen`

Datos de **solo lectura** sobre la pantalla (o el área disponible).

| Propiedad | Significado |
| --- | --- |
| `width` / `height` | Resolución de la pantalla |
| `availWidth` / `availHeight` | Área usable (sin barra de tareas, según el SO) |
| `colorDepth` / `pixelDepth` | Profundidad de color |

```javascript
console.log(`Pantalla: ${screen.width}×${screen.height}`);
console.log(`Disponible: ${screen.availWidth}×${screen.availHeight}`);
console.log("colorDepth:", screen.colorDepth);
```

Para el **tamaño de la ventana** usa `window.innerWidth` e `innerHeight`, no `screen`. Para diseño responsive, CSS (`@media`) es la herramienta principal; `screen` sirve para diagnósticos o decisiones puntuales.

!!! warning "`with`"
    El ejemplo antiguo usaba `with (screen) { ... }`. Esa sentencia está **prohibida en modo estricto** y dificulta leer el código. Escribe `screen.width`, no `with`.
