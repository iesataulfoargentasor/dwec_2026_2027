---
title: 6.5 Eventos del modelo
tags:
  - JavaScript
  - DWEC
  - RA6
---

# 6.5. Programación de eventos del DOM

Los eventos **relacionan** lo que hace el usuario (o el navegador) con cambios en el árbol. El criterio **e)** pide **asociar acciones** a esos eventos. El detalle de tipos y del objeto `event` está en la [UT5](../ut5/modelo-eventos.md); aquí el foco es **cuándo está listo el DOM** y **cómo el listener modifica nodos**.

## 6.5.1. Carga de la página: `load`

Una condición para trabajar con el árbol es que **exista**. El PDF usaba `onload` en `<body>`: se dispara cuando la página **completa** (imágenes incluidas) ha cargado.

```html
<body>
  <p>Primer párrafo</p>
  <script>
    window.addEventListener("load", () => {
      alert("Página cargada completamente");
    });
  </script>
</body>
```

El atributo `onload="…"` cubre el criterio de marcas de la UT5; en esta unidad registra el listener en JavaScript.

## 6.5.2. Comprobar si el árbol está listo: `DOMContentLoaded`

El ejemplo del PDF asignaba `window.onload = "true"` (una **cadena**) y no comprueba el DOM. Eso no es una prueba real.

Hechos:

- **`DOMContentLoaded`:** el HTML ya está parseado y el árbol construido. **No** espera imágenes. Es el momento habitual para `querySelector` y crear nodos.
- **`load`:** todo el recurso, imágenes incluidas.
- Un script con **`defer`** (o al final del `body`) ya ve el DOM sin listener.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const parrafos = document.querySelectorAll("p");
  console.log("Nodos p:", parrafos.length);
});
```

```html
<script src="app.js" defer></script>
```

`document.readyState` vale `"loading"`, `"interactive"` (DOM listo) o `"complete"` (`load` ya ocurrió). Si el script puede llegar tarde:

```javascript
function iniciar() {
  document.querySelector("h1").textContent = "DOM listo";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
```

## 6.5.3. Actuar sobre el DOM cuando ocurre un evento

Versión del temario (cambiar el texto de un `div` al pasar el ratón), con selectores y `textContent`:

```html
<div id="zona">Valor por defecto</div>
```

```javascript
const zona = document.querySelector("#zona");

zona.addEventListener("mouseover", () => {
  zona.textContent = "El ratón está encima";
});

zona.addEventListener("mouseout", () => {
  zona.textContent = "No está el ratón encima";
});
```

El PDF escribía `getElementsByTagName("div")[0].childNodes[0].nodeValue`. Funciona si el primer hijo es un `Text`; se rompe si hay un elemento dentro. `textContent` cubre todo el texto del nodo.

### Delegación

Si los elementos **se crean después**, no hace falta un listener por cada uno: escuchas al **padre** (burbuja, [UT5](../ut5/modelo-eventos.md)).

```javascript
const lista = document.querySelector("#tareas");

lista.addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (!item || !lista.contains(item)) {
    return;
  }
  item.classList.toggle("hecho");
});
```

Los `li` nuevos, insertados en [6.4](crear-modificar.md), **reutilizan** el mismo manejador.

!!! tip "Capas"
    El HTML no lleva `onmouseover`. El CSS define `.hecho { text-decoration: line-through; }`. El JS solo cambia la clase. Eso es el criterio **h)** unido al **e)**.
