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

## Antes de probar: propiedades, métodos y carga del HTML

`document.title = "Mis apuntes"` asigna una propiedad: no llama a un método ni recibe argumentos. En cambio, `document.getElementById("alta")` llama a un método y le pasa la cadena `"alta"` como argumento. Los paréntesis indican la llamada.

Coloca el `<script src="practica.js"></script>` justo antes de cerrar `</body>`, o usa un script externo con `defer` en el `head`. Así el cuerpo ya estará creado al ejecutar el código. Si ejecutas el script demasiado pronto, `document.body` puede ser `null`. Para estas prácticas prepara un HTML sencillo con `<html lang="es">`, un `<title>`, un encabezado y varios párrafos.

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
| `forms`, `images`, `links` | Colecciones de formularios, imágenes y enlaces; su recorrido se estudiará más adelante |

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

`forms`, `images` y `links` son colecciones que el navegador mantiene. Aquí basta con reconocer qué representan: para localizar un elemento concreto en la UT3 usaremos únicamente `document.getElementById`. El trabajo con colecciones se desarrollará en unidades posteriores.

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

En `document.body.style.fontSize = "18px"`, `document.body` selecciona el cuerpo, `style` permite cambiar su estilo en línea y `fontSize` corresponde a `font-size` en CSS. `"18px"` es una cadena: `18` indica el tamaño y `px` la unidad. No escribas `18` sin unidad para este tamaño. Los valores `"#fff7ed"` y `"#1f2937"` son colores CSS hexadecimales, no nombres de variables.

`color` fija el color del texto y `backgroundColor`, el fondo. Los estilos de los elementos hijos pueden tener sus propios colores o tamaños y prevalecer sobre los heredados del cuerpo. Estos cambios no editan el archivo HTML guardado; al recargar se vuelven a cargar los estilos originales (y se ejecuta otra vez el script).

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

El argumento `"tema-oscuro"` es el nombre de la clase **sin punto**. El punto se usa en el selector CSS (`body.tema-oscuro`), no en `add`, `remove` o `toggle`. Estas operaciones cambian el atributo `class`; necesitas la regla CSS para que se vea un efecto.

En las dos líneas del ejemplo, `add` añade la clase y el `toggle` siguiente la quita: pruébalas por separado si quieres observar el cambio. Repetir `add` no duplica la clase, mientras que repetir `toggle` alterna entre ponerla y quitarla.

Eso cubre el criterio **c)**: cambiar el aspecto del documento con objetos del lenguaje, de forma actual.

## Colecciones `forms` / `images` / `links`

Estas propiedades agrupan elementos del documento, pero no las utilizaremos como mecanismo de búsqueda en esta unidad. Un formulario, una imagen o un enlace se puede localizar por su `id`, igual que un párrafo.

### Localizar elementos con `document.getElementById`

Prepara estos elementos en el HTML, antes del script:

```html
<form id="alta">
  <label for="nombre">Nombre:</label>
  <input id="nombre" type="text">
</form>
<p id="aviso">Formulario pendiente.</p>
```

En JavaScript:

```javascript
const formulario = document.getElementById("alta");
const aviso = document.getElementById("aviso");

if (formulario === null || aviso === null) {
  console.error("Falta el formulario alta o el párrafo aviso.");
} else {
  aviso.textContent = "Formulario localizado correctamente.";
}
```

`getElementById` recibe una cadena con el valor exacto del atributo `id`, **sin `#` ni punto**. Devuelve la referencia al elemento, o `null` si no existe. Cada identificador debe ser único en el documento y respetar las mayúsculas y minúsculas.

| Elemento del HTML | Cómo localizarlo |
| --- | --- |
| Formulario con `id="alta"` | `document.getElementById("alta")` |
| Campo con `id="nombre"` | `document.getElementById("nombre")` |
| Párrafo con `id="aviso"` | `document.getElementById("aviso")` |

El método no busca por el nombre de la etiqueta, por una clase ni por el atributo `name`. Si necesitas localizar otro elemento, asígnale un `id` propio en el HTML y usa ese identificador.

Guardar la referencia permite utilizar después las propiedades del elemento. En el ejemplo, `aviso.textContent` cambia el texto del párrafo ya localizado: no realiza una nueva búsqueda. `document.body` y `document.documentElement` son accesos directos a partes del documento, no métodos alternativos de búsqueda.

Prueba a cambiar temporalmente `id="aviso"` por `id="otro"`: debe aparecer el mensaje de error sin intentar escribir en `null`. Restáuralo después. Si el identificador está bien pero no se encuentra el elemento, comprueba que el script se ejecute después de su HTML.

!!! failure "`document.write`"
    `document.write("Hola")` recibe texto que el navegador interpreta como HTML. Durante la carga puede insertar contenido en el flujo del documento; después de la carga puede abrir un documento nuevo y borrar el contenido existente. No lo uses para actualizar la interfaz. El apartado [3.7](generar-html.md) muestra las alternativas.

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
// Ejecuta el script al final del body, cuando el cuerpo ya existe.
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

## Ejercicio propuesto: preparar una página para estudiar

### Contexto

Una página de apuntes ofrece dos perfiles: **normal** y **ampliado**. Crea `modo-estudio.js` basándote en el caso resuelto. Debe preguntar el perfil, cambiar el título de la pestaña y el aspecto del cuerpo, y mostrar un resumen en consola.

Prepara un HTML sencillo con `lang="es"`, un título y varios párrafos. Enlaza el script al final del `body`. No apliques estilos particulares a los párrafos, para observar los que heredan del cuerpo.

### Requisitos obligatorios

1. Pide el perfil con `prompt("Elige perfil: normal o ampliado", "normal")`. El primer argumento es el mensaje; el segundo rellena inicialmente el campo. Aceptar devuelve texto y Cancelar devuelve `null`.
2. Si se pulsa Cancelar, informa en consola y no cambies el título ni los estilos.
3. Normaliza la respuesta con `trim().toLowerCase()`. Acepta únicamente `normal` o `ampliado`. Una entrada vacía o desconocida debe producir un mensaje de error sin modificar la página.
4. Para un perfil válido, guarda el título original y aplica los valores de esta tabla:

| Propiedad | Perfil normal | Perfil ampliado |
| --- | --- | --- |
| `document.title` | `DWEC · Estudio normal` | `DWEC · Estudio ampliado` |
| `document.body.style.backgroundColor` | `"#ffffff"` | `"#fff7ed"` |
| `document.body.style.color` | `"#1f2937"` | `"#1f2937"` |
| `document.body.style.fontSize` | `"16px"` | `"20px"` |

5. Crea la fecha y hora de preparación con `Date`. Muestra la hora como `HH:MM` con `String` y `padStart`.
6. Muestra una cabecera, el perfil, la fecha, la hora, el título original, el nuevo título, `document.URL`, `document.documentElement.lang` y `document.lastModified`. Identifica esta última como información del servidor, no como fecha garantizada de actualización de los apuntes.
7. Si el idioma HTML está vacío, indica «Idioma no declarado». No lo confundas con el idioma del navegador.
8. Si `document.referrer` está vacío, indica «Origen no comunicado: acceso directo o restricciones de privacidad». Si contiene texto, muéstralo. No afirmes que un valor vacío demuestra un acceso directo.

!!! warning "Límites del ejercicio"
    Usa variables, condiciones, plantillas, `Date`, `String`, `prompt` y las propiedades de `document`. No necesitas selectores, clases, funciones de usuario, arrays, bucles, eventos, creación de nodos, `innerHTML`, `document.write` ni almacenamiento.

### Pistas de diseño

1. Comprueba `null` antes de llamar a los métodos de cadena.
2. Organiza la validación para que una respuesta incorrecta no llegue a las asignaciones de estilos.
3. Guarda el título original antes de reemplazarlo. Cambiar `document.title` no modifica el encabezado visible.
4. Usa `if` / `else if` para aplicar cada perfil y un bloque común para el resumen de los perfiles válidos.
5. Los valores de estilo son cadenas CSS. Puedes leerlos después mediante la misma propiedad; el navegador puede expresar un color hexadecimal como `rgb(...)` sin que eso sea un error.
6. Recarga entre pruebas. La práctica no guarda preferencias y volverá a preguntar al ejecutar el script.

### Casos que debes probar

| Entrada o situación | Resultado esperado |
| --- | --- |
| `normal` | Fondo blanco, texto de 16px y título de estudio normal |
| ` AMPLIADO ` | Se normaliza; fondo crema, texto de 20px y título de estudio ampliado |
| `oscuro` | Mensaje de error; título y estilos sin cambios |
| Vacío o solo espacios | Error; sin cambios |
| Cancelar | Cancelación; sin cambios |
| HTML con `lang="es"` | El resumen muestra `es` |
| HTML sin atributo `lang` | El resumen indica que no se declaró idioma |
| `referrer` vacío | Origen no comunicado, sin asegurar una causa concreta |

Para probar la falta de idioma, quita temporalmente el atributo del HTML, recarga y restáuralo antes de entregar. Para observar el origen, compara una apertura directa y otra desde un enlace: las políticas del navegador pueden mantenerlo vacío en ambos casos.

### Entrega

Entrega el HTML y `modo-estudio.js`, con capturas de ambos perfiles y de una entrada inválida. Incluye el resumen de consola y comprueba visualmente el título de la pestaña y el tamaño del texto.

Explica qué significa `"20px"`, por qué se usa `fontSize` en JavaScript y qué diferencia hay entre el título de la pestaña y el encabezado del documento. La corrección valora que valides antes de modificar, mantengas el nivel del caso resuelto y puedas explicar cada propiedad utilizada.
