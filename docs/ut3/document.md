---
title: 3.5 El objeto Document
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.5. El objeto `document`

`document` es el **documento HTML** cargado en la ventana. Es la puerta al **DOM** (*Document Object Model*): la representación que el navegador crea para que JavaScript pueda consultar y modificar la página.

El BOM te da `window.document`; el DOM es lo que hay dentro de esa ventana. No hay dos objetos distintos llamados Document:

```text
window                  → ventana, navegador, pantalla… (BOM)
└── document            → página HTML cargada (DOM)
    ├── documentElement → <html>
    ├── head            → <head>
    └── body            → <body>
```

En un script clásico también puedes escribir `document` sin `window.`:

```javascript
console.log(window.document === document); // true
```

El objeto existe mientras la página esté cargada. Si cambias de URL, se carga otro documento y el `document` anterior deja de ser el que ves.

## Propiedades útiles

| Propiedad | Significado |
| --- | --- |
| `title` | Texto de `<title>` (se puede asignar) |
| `URL` | URL completa del documento |
| `referrer` | Página de origen (puede ir vacía) |
| `lastModified` | Fecha de modificación que envía el servidor |
| `cookie` | Cadena de cookies (ver [almacenamiento](almacenamiento.md)) |
| `documentElement` | El elemento `<html>` |
| `body` | El `<body>` |
| `forms`, `images`, `links` | Colecciones clásicas (hoy se usa más `querySelector`) |

```javascript
console.log(document.title);
document.title = "DWEC · UT3";

console.log(document.URL);
console.log("Referrer:", document.referrer);
```

### Leer cada propiedad con sentido

- `document.title` corresponde al texto de la etiqueta `<title>`. Cambiarlo actualiza el nombre de la pestaña, no el encabezado `<h1>` que aparece dentro de la página.
- `document.URL` es de solo lectura: describe dónde está el documento. Para navegar se usa `location`, que se estudia en el 3.6.
- `document.referrer` es la URL de la página anterior **solo si** el navegador la envía; puede ser una cadena vacía por privacidad, al abrir directamente un marcador o al escribir la dirección.
- `document.lastModified` es una cadena que depende de lo que informe el servidor. No sirve como prueba absoluta de que el contenido sea actual.
- `document.body` es el elemento `<body>` y `document.documentElement` es el elemento `<html>`.

```javascript
console.log("Etiqueta raíz:", document.documentElement.tagName); // HTML
console.log("Idioma del documento:", document.documentElement.lang);
console.log("Etiqueta body:", document.body.tagName); // BODY
```

`forms`, `images` y `links` son colecciones clásicas que el navegador mantiene. Se pueden consultar, pero sus métodos y las listas se trabajan de forma más completa en la UT4 y en los apartados de DOM.

## Cambiar el aspecto del documento

El material antiguo asignaba `document.bgColor = "red"` y colores `fgColor`, `linkColor`, `alinkColor`, `vlinkColor`. Esas propiedades son **legado de HTML 4**. El aspecto se cambia con **CSS**.

```javascript
document.body.style.backgroundColor = "crimson";
document.body.style.color = "white";
```

`style` es un objeto que representa los estilos **en línea** del elemento. Las propiedades CSS escritas con guiones se convierten a *camelCase*:

| CSS | JavaScript |
| --- | --- |
| `background-color` | `style.backgroundColor` |
| `font-size` | `style.fontSize` |
| `text-align` | `style.textAlign` |

```javascript
document.body.style.backgroundColor = "#fff7ed";
document.body.style.color = "#1f2937";
document.body.style.fontSize = "18px";
```

Este mecanismo es útil para una modificación puntual. Para un tema completo, es preferible añadir o quitar una **clase**: la regla visual sigue en CSS y el script solo expresa el comportamiento.

Mejor aún: clases, para no mezclar diseño en el script:

```css
body.tema-oscuro {
  background-color: #111;
  color: #eee;
}
```

```javascript
document.body.classList.add("tema-oscuro");
document.body.classList.toggle("tema-oscuro");
```

`classList` ofrece tres operaciones sencillas:

| Método | Efecto |
| --- | --- |
| `add("clase")` | Añade la clase si no estaba |
| `remove("clase")` | Quita la clase si estaba |
| `toggle("clase")` | La añade si falta o la quita si existe |

Eso cubre el criterio **c)**: cambiar el aspecto del documento con objetos del lenguaje, de forma actual.

## Colecciones `forms` / `images` / `links`

Siguen existiendo. Un formulario con `id="alta"`:

```javascript
const formulario = document.querySelector("#alta");
// equivalente clásico si tiene name="alta":
// document.forms.alta
```

En esta unidad puedes usar `querySelector` / `querySelectorAll` (estándar DOM). `getElementById` también es correcto.

| Necesito… | Opción |
| --- | --- |
| Un elemento por su `id` | `document.getElementById("alta")` o `document.querySelector("#alta")` |
| El primer elemento que cumple un selector CSS | `document.querySelector("main p")` |
| Todos los elementos que cumplen un selector | `document.querySelectorAll("a")` |

`querySelector` devuelve un elemento o `null` si no encuentra ninguno. `querySelectorAll` devuelve una colección de elementos; se recorrerá con detalle cuando ya se hayan trabajado arrays y funciones.

!!! failure "`document.write`"
    `document.write("Hola")` solo es seguro **mientras** el HTML se está parseando. Si lo llamas después, **borra la página**. No lo uses para actualizar la interfaz. El apartado [3.7](generar-html.md) muestra las alternativas.

## Caso práctico resuelto: preparar el modo de lectura

Una página de apuntes quiere permitir que cada persona prepare la lectura antes de empezar. El script no crea etiquetas ni busca elementos: usa directamente el propio `document`.

Debe:

1. Pedir el tema de lectura: claro u oscuro.
2. Validar la respuesta sin distinguir espacios ni mayúsculas.
3. Cambiar el título de la pestaña.
4. Aplicar colores al `body` con propiedades CSS.
5. Mostrar en consola datos útiles de la página: URL, origen, idioma y última modificación.
6. Informar si la página se abrió desde otra página o directamente.

Solo se usan `prompt`, `const`/`let`, `if`, `String`, `Date`, `document` y estilos en línea. No hay funciones de usuario, eventos, arrays, creación de nodos, `innerHTML` ni selectores.

```javascript
const respuestaBruta = prompt("Elige tema de lectura: claro u oscuro", "claro");

if (respuestaBruta === null) {
  console.log("No se ha cambiado el modo de lectura.");
} else {
  const tema = respuestaBruta.trim().toLowerCase();
  const ahora = new Date();
  const hora = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");

  if (tema === "oscuro") {
    document.body.style.backgroundColor = "#111827";
    document.body.style.color = "#f9fafb";
    document.title = "DWEC · Lectura en modo oscuro";
  } else if (tema === "claro") {
    document.body.style.backgroundColor = "#fffdf7";
    document.body.style.color = "#1f2937";
    document.title = "DWEC · Lectura en modo claro";
  } else {
    console.log("Tema no reconocido. Escribe claro u oscuro.");
  }

  if (tema === "claro" || tema === "oscuro") {
    console.log("================================");
    console.log(" MODO DE LECTURA PREPARADO ");
    console.log("================================");
    console.log(`Tema: ${tema}`);
    console.log(`Preparado a las: ${hora}:${minutos}`);
    console.log(`Título de la pestaña: ${document.title}`);
    console.log(`URL: ${document.URL}`);
    console.log(`Idioma HTML: ${document.documentElement.lang}`);
    console.log(`Última modificación indicada: ${document.lastModified}`);

    if (document.referrer === "") {
      console.log("Origen: se ha abierto directamente o el navegador no comunica el referrer.");
    } else {
      console.log(`Origen: ${document.referrer}`);
    }
  }
}
```

### Lectura del resultado

- `trim().toLowerCase()` permite tratar igual `" OSCURO "` y `"oscuro"`.
- `document.body.style` cambia los estilos del cuerpo actual. Solo permanece mientras la página esté abierta o hasta que otro estilo lo reemplace.
- `document.title` modifica el texto de la pestaña; no cambia un título visible de la página.
- `document.URL` informa de la dirección actual. El script la consulta, no navega: para eso se verá `location` en el 3.6.
- `document.documentElement.lang` lee el atributo `lang` del elemento `<html>`. Es importante para lectores de pantalla, correctores y traducción.
- Un `referrer` vacío no es un error: es normal al escribir la URL, abrir un marcador o si una política de privacidad no lo envía.

Prueba `claro`, `OSCURO`, una respuesta desconocida, solo espacios y Cancelar. Comprueba también que el título de la pestaña cambia cuando el tema es válido.
