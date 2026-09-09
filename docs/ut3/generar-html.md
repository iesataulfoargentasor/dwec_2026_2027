---
title: 3.7 Generación de HTML
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.7. Generación de elementos HTML desde código

El criterio **d)** pide generar **textos y etiquetas** al ejecutar JavaScript. La forma actual es el **DOM**, no `document.write`.

Prepara un contenedor en el HTML:

```html
<main>
  <h1>Selector de color</h1>
  <div id="app"></div>
</main>
<script src="app.js"></script>
```

## Texto seguro: `textContent`

```javascript
const app = document.querySelector("#app");
app.textContent = "Hola Mundo";
```

No interpreta HTML: si el texto trae `<` o `&`, se muestran literales. Es lo adecuado para datos del usuario.

## Crear etiquetas: `createElement`

Equivalente moderno al formulario de colores del PDF:

```javascript
const app = document.querySelector("#app");

const etiqueta = document.createElement("label");
etiqueta.textContent = "Selecciona un color para el fondo:";
etiqueta.setAttribute("for", "color");

const select = document.createElement("select");
select.id = "color";

const colores = [
  ["crimson", "Rojo"],
  ["navy", "Azul"],
  ["gold", "Amarillo"],
  ["seagreen", "Verde"],
  ["black", "Negro"],
  ["white", "Blanco"],
];

for (const [valor, texto] of colores) {
  const opcion = document.createElement("option");
  opcion.value = valor;
  opcion.textContent = texto;
  select.append(opcion);
}

const boton = document.createElement("button");
boton.type = "button";
boton.textContent = "Modifica el color";
boton.addEventListener("click", () => {
  document.body.style.backgroundColor = select.value;
  document.body.style.color = select.value === "white" ? "#111" : "#fff";
});

app.append(etiqueta, select, boton);
```

`append` inserta nodos o texto al final. `innerHTML` también crea etiquetas, pero **interpreta HTML**: no lo uses con cadenas que vengan de `prompt` o de un servidor sin sanitizar (XSS).

```javascript
// Solo con HTML que controlas tú:
app.innerHTML = "<p class='aviso'>Listo</p>";
```

## Plantilla de referencia (lo que ya no hacemos)

```javascript
document.write("<form>…</form>");
document.bgColor = document.cambiacolor.color.value;
```

Eso reescribe el documento y usa APIs antiguas. El DOM de arriba cubre el mismo ejercicio y se puede depurar en **Elements** de DevTools.

!!! success "Documentar y depurar"
    Nombra las funciones (`cambiarColor`), comenta el *porqué* y mira el árbol en Elements mientras haces clic. Es el criterio **h)** aplicado a este apartado.
