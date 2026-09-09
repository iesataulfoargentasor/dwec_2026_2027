---
title: 3.8 Ventanas y marcos
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.8. Documentos con varias ventanas

El criterio **f)** habla de documentos compuestos por **varias ventanas**. En 2013 eso eran sobre todo `<frameset>` y `window.open`. Hoy el `frameset` está **obsoleto** en HTML5; el equivalente vigente es el **`<iframe>`**, y las ventanas emergentes están muy limitadas por el bloqueo de pop-ups.

## 3.8.1. De `frameset` a `iframe`

El PDF definía `index.html` con `<frameset cols="25%,*">` y dos `<frame>`. Eso ya no pasa el validador HTML5 ni lo usan sitios actuales (accesibilidad, SEO, historial).

Misma idea con un iframe (página embebida):

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Página con marco</title>
    <style>
      iframe {
        width: 100%;
        height: 12rem;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <h1>Contenedor</h1>
    <iframe id="panel" src="panel.html" title="Panel embebido"></iframe>
    <script src="contenedor.js"></script>
  </body>
</html>
```

Jerarquía (la misma idea que `frames`, `parent` y `top`):

| Referencia | Qué es |
| --- | --- |
| `window` / `self` | Esta ventana |
| `frames` / `iframe.contentWindow` | Ventanas hijas |
| `parent` | Ventana que contiene el iframe |
| `top` | Ventana más externa |
| `opener` | Quién abrió esta con `window.open` |

Solo puedes leer el `document` de otro marco si es **mismo origen** (mismo protocolo + host + puerto). Si el iframe carga Google, el navegador bloquea el acceso (política de origen).

```javascript
const marco = document.querySelector("#panel");
marco.addEventListener("load", () => {
  const hijo = marco.contentWindow;
  hijo.document.body.style.backgroundColor = "seagreen";
});
```

Desde el documento **dentro** del iframe, `parent` es el contenedor (si hay mismo origen).

## 3.8.2. Abrir y cerrar ventanas (`window.open`)

```javascript
let secundaria = null;

function abrir() {
  secundaria = window.open(
    "https://www.google.es",
    "busqueda",
    "width=600,height=400,left=80,top=80"
  );
}

function cerrar() {
  secundaria?.close();
}
```

Tercer argumento (apariencia): `width`, `height`, `left`, `top`. Opciones clásicas (`menubar`, `toolbar`, `status`, `scrollbars=no`…) los navegadores **las ignoran** en gran medida.

!!! warning "El bloqueador de pop-ups"
    `open` solo suele funcionar si lo llama un **clic** (o gesto equivalente). Si lo lanzas al cargar la página, `open` devuelve `null`. Comprueba siempre la referencia.

El ejemplo del PDF que abría una ventana vacía, escribía texto, la movía con `moveBy` cada 100 ms y la cerraba **ya no es realista**: movimiento y tamaño están restringidos.

## 3.8.3. Comunicación entre ventanas

- **Principal → secundaria:** guarda el retorno de `open` y usa esa referencia (`secundaria.document` solo a **mismo origen**).
- **Secundaria → principal:** `window.opener` apunta a quien abrió.

```javascript
// En la principal, mismo origen:
const w = window.open("popup.html", "p", "width=400,height=300");

// En popup.html:
document.querySelector("#avisar")?.addEventListener("click", () => {
  window.opener?.document.querySelector("#estado").textContent =
    "El popup ha respondido";
});
```

Para orígenes distintos se usa `postMessage` (más adelante). No intentes `opener.document` sobre un sitio de terceros.

!!! note "Por qué sigue en el currículo"
    El RA3 pide varias ventanas. En prácticas usaremos **iframe de mismo origen** o un `open` a un HTML tuyo, no `frameset` ni ventanas que se mueven solas.
