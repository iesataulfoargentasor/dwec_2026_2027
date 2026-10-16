---
title: 3.8 Ventanas y marcos
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.8. Documentos con varias ventanas

Una página puede contener otro documento dentro de un **marco** o abrir una **ventana secundaria**. Cada documento dispone de su propio `window` y su propio `document`: compartir pantalla no significa compartir el mismo árbol HTML.

Este apartado desarrolla especialmente el criterio **f)** del [RA3](ra3.md), sobre el uso de las características del lenguaje en documentos con varias ventanas, y el criterio **h)**, sobre depuración y documentación. Su referencia es el módulo **0612, Desarrollo web en entorno cliente**, del CFGS de Desarrollo de Aplicaciones Web, recogido en el [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405) y en el currículo de Cantabria de la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244).

!!! note "Qué necesitas saber"
    Retomaremos `window`, `document`, condiciones, cadenas, `document.getElementById` y `textContent`. Para localizar elementos usaremos únicamente `getElementById`, con el valor del atributo `id` sin `#`. El caso resuelto y el ejercicio obligatorio usan un iframe propio, sin arrays, funciones de usuario ni eventos. El ejemplo de ventanas emergentes anticipa unas funciones y eventos de las UT4 y UT5, necesarios para responder a botones. Se explican como ampliación guiada.

## 3.8.1. De `frameset` a `iframe`

El material antiguo repartía la ventana mediante `<frameset cols="25%,*">` y etiquetas `<frame>`. Ambos elementos son obsoletos y no deben utilizarse en documentos HTML actuales. Para dividir visualmente una página en menú y contenido se utiliza **CSS**, por ejemplo Grid o Flexbox.

Un `<iframe>` tiene otra finalidad: **incrustar un documento independiente** dentro del actual. Puede servir para mostrar una actividad, un mapa o un reproductor. No es un sustituto general de la maquetación con CSS.

### Qué aporta cada atributo

```html
<iframe
  id="panel"
  name="panelActividad"
  src="panel.html"
  title="Panel de la actividad"
  width="600"
  height="240">
</iframe>
```

| Atributo | Para qué sirve |
| --- | --- |
| `src` | URL del documento que se carga; `panel.html` se resuelve respecto a la URL base del contenedor |
| `id` | Identifica el elemento HTML; `document.getElementById("panel")` permite localizarlo |
| `name` | Da nombre al contexto de navegación; un enlace con `target="panelActividad"` puede cargar ahí su destino |
| `title` | Describe el marco para las tecnologías de asistencia |
| `width` / `height` | Dimensiones iniciales; también pueden establecerse mediante CSS |

`id`, `name` y `title` cumplen funciones diferentes. El `title` del iframe no sustituye al `<title>` ni al encabezado del documento incrustado. Añade también un enlace para abrir el contenido directamente, como verás en el caso resuelto.

Los estilos del contenedor pueden dimensionar el iframe, pero no se heredan dentro de su documento. Si quieres dar estilo al texto de `panel.html`, debes definirlo allí o modificar ese documento si tienes permiso.

### Jerarquía: `self`, `frames`, `parent`, `top` y `opener`

```text
ventana principal: aula.html
├── iframe: panel.html
│   └── iframe: detalle.html
└── ventana auxiliar abierta con window.open: ayuda.html
    (es una ventana separada, no un marco hijo)
```

| Referencia | Qué representa |
| --- | --- |
| `window` / `self` | El contexto en el que se ejecuta el código |
| `window.frames` | Permite acceder a los contextos de los marcos hijos; `frames[0]` es el primero |
| `iframe.contentWindow` | La ventana del documento contenido en ese elemento iframe |
| `parent` | El contexto padre inmediato; si no hay padre, es la propia ventana |
| `top` | El contexto superior de la jerarquía de marcos |
| `opener` | La ventana que abrió esta, cuando se conserva esa relación; puede ser `null` |

En `detalle.html`, `parent` corresponde a `panel.html`, mientras que `top` corresponde a `aula.html`. En una pestaña sin marcos, `window === parent` y `window === top` son verdaderos. Una ventana auxiliar no tiene a quien la abrió como `parent`: esa relación se consulta con `opener`.

```javascript
console.log("¿Estoy dentro de un marco?", window !== parent);
console.log("¿Soy la ventana superior?", window === top);
```

Estas comparaciones no leen el documento de otra ventana. Tener una referencia a `parent` no implica tener permiso para acceder a `parent.document`.

### Mismo origen: qué permite leer el navegador

Dos documentos tienen el mismo origen si coinciden **protocolo, nombre del servidor y puerto efectivo**. No es necesario que coincidan la ruta, la consulta o el fragmento.

Tomando como referencia `http://localhost:8000/aula.html`:

| Otra URL | ¿Mismo origen? | Motivo |
| --- | --- | --- |
| `http://localhost:8000/panel.html` | Sí | Solo cambia la ruta |
| `http://localhost:8000/ut3/panel.html?modo=repaso` | Sí | Ruta y consulta no definen el origen |
| `http://localhost:8001/panel.html` | No | Cambia el puerto |
| `https://localhost:8000/panel.html` | No | Cambia el protocolo |
| `http://127.0.0.1:8000/panel.html` | No | Cambia el nombre del servidor, aunque llegue al mismo equipo |

El puerto efectivo tiene en cuenta los valores predeterminados: `https://ejemplo.test/` y `https://ejemplo.test:443/` tienen el mismo origen. Para estas prácticas usa **el mismo servidor local y puerto**, sin políticas adicionales de aislamiento. No abras los archivos mediante `file:`: los navegadores pueden tratar sus orígenes como opacos, aunque estén en la misma carpeta.

Distingue dos controles independientes:

- **Mostrar el documento:** el servidor puede impedir que se incruste mediante `Content-Security-Policy: frame-ancestors` o `X-Frame-Options`.
- **Leer su contenido:** aunque se vea dentro del marco, la política de mismo origen puede impedir el acceso a su `document`.

Un iframe con `sandbox` introduce restricciones adicionales. Sin `allow-scripts` no ejecuta sus scripts; sin `allow-same-origin` recibe un origen opaco. No añadas permisos al azar para hacer desaparecer un error. El caso de clase usa únicamente documentos propios de confianza y no lleva `sandbox`; no es una configuración para incrustar contenido desconocido. Dar a contenido propio del mismo origen ambos permisos puede anular la utilidad de ese aislamiento.

### El documento hijo debe estar preparado

Después de asignar `src` o llamar a `open`, la página de destino puede seguir cargándose. No supongas que ya existen sus elementos ni lo resuelvas esperando un número fijo de milisegundos.

Desde el contenedor se puede escuchar el evento `load` del iframe antes de iniciar la carga. El siguiente patrón es una ampliación para un iframe propio que inicialmente **no tenga `src`** y que exista antes de ejecutar el script:

```javascript
const marco = document.getElementById("panel");

if (marco !== null) {
  marco.addEventListener("load", () => {
    const documentoHijo = marco.contentDocument;
    if (documentoHijo !== null && documentoHijo.body !== null) {
      documentoHijo.body.style.backgroundColor = "#eef6ff";
      documentoHijo.body.style.color = "#172033";
    }
  });
  marco.src = "panel.html";
}
```

`contentDocument` devuelve el documento accesible del marco, o `null` si no es del mismo origen. `load` indica que se ha producido una carga, pero **no demuestra que el recurso solicitado exista**: también debes comprobar la URL, los elementos esperados y los errores de red. En el caso resuelto evitamos esta coordinación haciendo que el hijo ejecute su script al final de su propio `body`.

## 3.8.2. Abrir y cerrar ventanas (`window.open`)

La llamada tiene esta forma: `window.open(url, destino, opciones)`. Los tres argumentos son opcionales, aunque conviene escribir explícitamente el destino que se desea abrir.

| Argumento | Ejemplo | Significado |
| --- | --- | --- |
| URL | `"ayuda.html"` | Recurso que se abrirá |
| Destino | `"ayudaUT3"` | Nombre para reutilizar una ventana existente; no es el título de la pestaña |
| Opciones | `"popup,width=600,height=400"` | Solicitud de ventana emergente y dimensiones |

`"_blank"` solicita un contexto nuevo; un nombre como `"ayudaUT3"` permite reutilizarlo. La presentación final como pestaña o ventana depende del navegador. El tamaño y la posición solicitados no son garantías; tampoco puedes controlar libremente las barras del navegador ni mover ventanas ajenas.

### Ejemplo guiado con botones

Crea estos tres archivos en la misma carpeta. Abre `ventanas.html` desde el servidor local.

**`ventanas.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DWEC · Ventana de ayuda</title>
</head>
<body>
  <h1>Ayuda en una ventana secundaria</h1>
  <button id="abrir" type="button">Abrir ayuda (otra ventana o pestaña)</button>
  <button id="cerrar" type="button">Cerrar ayuda</button>
  <p id="estado" role="status">Ayuda sin abrir.</p>
  <p><a href="ayuda.html">Consultar la ayuda en esta pestaña</a></p>
  <script src="ventanas.js"></script>
</body>
</html>
```

**`ayuda.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Ayuda de la UT3</title>
</head>
<body>
  <h1>Ayuda de la UT3</h1>
  <p>Consulta las propiedades de window y las relaciones entre documentos.</p>
</body>
</html>
```

**`ventanas.js`**

```javascript
let secundaria = null;
const estado = document.getElementById("estado");

// Estos botones y el párrafo están definidos en ventanas.html.
document.getElementById("abrir").addEventListener("click", () => {
  if (secundaria === null || secundaria.closed) {
    secundaria = window.open("ayuda.html", "ayudaUT3", "popup,width=600,height=400");
  }

  if (secundaria === null) {
    estado.textContent = "No se ha obtenido una ventana de ayuda. Usa el enlace de esta página.";
  } else if (secundaria.closed) {
    estado.textContent = "La referencia no permite controlar la ayuda.";
  } else {
    secundaria.focus();
    estado.textContent = "Ayuda abierta; se reutiliza si vuelves a pulsar.";
  }
});

document.getElementById("cerrar").addEventListener("click", () => {
  if (secundaria === null || secundaria.closed) {
    estado.textContent = "No hay una ventana de ayuda abierta que cerrar.";
  } else {
    secundaria.close();
    estado.textContent = "Se ha solicitado el cierre de la ayuda.";
  }
});
```

`let` permite actualizar la referencia. `closed` es una propiedad booleana; `close()` y `focus()` son métodos sin argumentos. El operador `||` deja de evaluar al encontrar una condición verdadera: si la referencia es `null`, no intenta consultar `null.closed`.

En `addEventListener("click", () => { ... })`, el primer argumento identifica el evento y el segundo es la función que se ejecuta al pulsar. Aquí se introduce solo lo necesario para que `open` responda directamente a una acción de la persona.

Prueba abrir dos veces, cerrar, volver a abrir y cerrar manualmente la ventana antes de pulsar «Cerrar ayuda». La página consulta el estado al pulsar: no lo actualiza automáticamente cuando cierras la auxiliar con la X.

!!! warning "Bloqueo y referencias"
    Sin una acción directa de la persona, una apertura puede ser bloqueada. Si falla, `open` puede devolver `null`; compruébalo. No afirmes que toda llamada al cargar falla siempre: influyen los permisos y el navegador. Además, `noopener` devuelve `null` aunque se abra el destino, y ciertas políticas de aislamiento pueden separar las referencias.

El cierre por código está limitado a ventanas que el navegador considera cerrables por script, como las creadas en este ejemplo. No se debe ofrecer como mecanismo general para cerrar pestañas abiertas manualmente por la persona. `close()` no devuelve una confirmación de cierre; por eso el ejemplo dice «Se ha solicitado».

El código antiguo que usaba `moveBy`, `resizeTo` o temporizadores para mover ventanas no constituye una práctica fiable ni una buena interacción actual. Las opciones históricas `menubar`, `toolbar` o `status` tampoco permiten ocultar a voluntad la interfaz del navegador.

## 3.8.3. Comunicación entre ventanas

### Elegir la referencia adecuada

| Dirección | Referencia para empezar |
| --- | --- |
| Contenedor → iframe | `document.getElementById("panel").contentWindow` |
| Iframe → contenedor | `parent` |
| Principal → ventana auxiliar | La referencia devuelta por `window.open` |
| Auxiliar → principal | `opener`, si existe y sigue disponible |

Selecciona primero la ventana correcta y después su documento. Por ejemplo, `document.getElementById("estado")` busca en el documento actual; `parent.document.getElementById("estado")` busca en el padre, si el acceso está permitido. Es el mismo método que ya conoces, aplicado a otro documento. Los identificadores pertenecen a cada documento: una búsqueda en el padre no atraviesa automáticamente un iframe.

Guarda el resultado y comprueba si es `null` antes de utilizarlo cuando el elemento pueda faltar. `contentWindow` permite acceder a la ventana del marco ya localizado; `textContent` lee o modifica el texto de un elemento. Son propiedades, no métodos alternativos para buscar elementos.

### Comprobar antes de escribir

Este fragmento se ejecutaría **desde una auxiliar propia del mismo origen**, una vez cargada. La principal debe tener un elemento con `id="estado"`, como `ventanas.html`. No forma parte del archivo `ayuda.html` anterior: puedes añadirlo en un script al final de su `body` para experimentar con la comunicación de vuelta.

```javascript
if (window.opener === null || window.opener.closed) {
  console.log("No hay una ventana de origen disponible.");
} else {
  try {
    const destino = window.opener.document.getElementById("estado");
    if (destino !== null) {
      destino.textContent = "La ventana de ayuda ha respondido.";
    } else {
      console.log("La principal no contiene el elemento #estado.");
    }
  } catch (error) {
    console.error("No se pudo acceder al documento de la principal:", error);
  }
}
```

Hay tres problemas diferentes: no existe referencia, existe pero no se permite acceder al documento, o el documento es accesible pero `getElementById` devuelve `null` porque falta el elemento. `try` intenta ejecutar el bloque; `catch` recibe un error si se produce y permite informar de él. No concede permisos ni evita la política de origen.

El encadenamiento opcional `?.` sirve para ciertas lecturas y llamadas cuando una referencia puede faltar. **No puede usarse como destino de una asignación**, ni evita un error de seguridad al acceder a un documento de otro origen. Guarda el elemento, comprueba que existe y después asigna su `textContent`, como arriba.

### `noopener` y `postMessage`: conceptos para continuar

Para abrir contenido externo sin mantener una relación con la página de origen, un enlace puede usar `target="_blank"` y `rel="noopener"`. Esto impide que el destino disponga de `opener`. Los ejercicios de comunicación directa conservan esa relación deliberadamente entre documentos propios; no añadas `noopener` esperando que siga funcionando la respuesta mediante `opener`.

Entre orígenes distintos se utiliza **`postMessage`**, un intercambio de mensajes en lugar de acceso directo al DOM. El emisor indica el origen exacto de destino; el receptor comprueba `event.origin`, `event.source` y la forma de `event.data` antes de actuar. No envíes datos sensibles usando `"*"` como destino. Su implementación se deja para cuando se trabajen eventos y objetos; no es necesaria en esta práctica.

## Caso práctico resuelto: comunicar una actividad con su panel

Una página de aula contiene un panel que debe leer el nombre de la actividad y confirmar que lo ha recibido. El objetivo es observar la comunicación **principal → panel → principal**, utilizando únicamente documentos propios del mismo origen.

Crea una carpeta con estos tres archivos y ábrela desde el servidor local del aula. Por ejemplo, si sirve la carpeta en `http://localhost:8000/`, abre `http://localhost:8000/aula.html`. No es suficiente abrir el archivo con doble clic.

**`aula.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DWEC · Aula de la UT3</title>
  <style>
    body { font-family: sans-serif; line-height: 1.5; }
    iframe { width: 100%; height: 14rem; border: 1px solid #64748b; }
  </style>
</head>
<body>
  <h1>Aula de la UT3</h1>
  <p id="actividad">Repaso de objetos del navegador</p>
  <p id="estado" role="status">Esperando la confirmación del panel.</p>
  <iframe id="panel" src="panel.html" title="Resumen de la actividad"></iframe>
  <p><a href="panel.html">Abrir el panel directamente en esta pestaña</a></p>
</body>
</html>
```

**`panel.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Panel de actividad</title>
</head>
<body>
  <h1>Panel de actividad</h1>
  <p id="resumen">Preparando el resumen.</p>
  <script src="panel.js"></script>
</body>
</html>
```

**`panel.js`**

```javascript
const resumen = document.getElementById("resumen");

if (resumen === null) {
  console.error("Falta el párrafo #resumen en panel.html.");
} else if (window === parent) {
  resumen.textContent = "Panel abierto directamente: no hay un contenedor al que responder.";
} else {
  try {
    const actividad = parent.document.getElementById("actividad");
    const estado = parent.document.getElementById("estado");

    if (actividad === null || estado === null) {
      resumen.textContent = "El contenedor no tiene los elementos #actividad y #estado necesarios.";
    } else {
      let nombre = actividad.textContent.trim();
      if (nombre === "") {
        nombre = "Actividad sin nombre";
      }

      // Leemos un dato del padre y lo mostramos como texto en el hijo.
      resumen.textContent = `Actividad recibida: ${nombre}`;
      // Escribimos la confirmación en el documento padre.
      estado.textContent = `Panel preparado para: ${nombre}`;
    }
  } catch (error) {
    resumen.textContent = "No se ha podido acceder al documento contenedor. Revisa el origen y los permisos.";
    console.error("Error de comunicación con el contenedor:", error);
  }
}
```

### Lectura del resultado

Al abrir `aula.html`, el panel muestra «Actividad recibida: Repaso de objetos del navegador» y el estado de la principal cambia a «Panel preparado para: Repaso de objetos del navegador».

1. El navegador analiza el HTML de la principal. Los párrafos `#actividad` y `#estado` están **antes del iframe**, por lo que ya existen cuando el hijo los consulta.
2. Se carga `panel.html`. Su script está al final del `body`, después de `#resumen`.
3. El hijo detecta que `window !== parent`, busca los dos elementos en el documento padre y lee el nombre.
4. Escribe su resumen en su propio documento y la confirmación en el padre. No cambia la URL ni guarda datos para otras sesiones.
5. Si abres `panel.html` directamente, `parent` es la propia ventana y aparece el mensaje previsto, sin intentar tratarla como una página contenedora.

La principal ofrece el dato y el hijo lo lee: no hace falta que ambos documentos ejecuten scripts. La comunicación es una lectura y una escritura concretas, no una sincronización permanente. Si cambias después el nombre en Elements, el panel no se actualiza solo; recarga la página para repetir la ejecución.

Usamos `textContent` para conservar el dato como texto. Si en el HTML escribes `&lt;strong&gt;Repaso&lt;/strong&gt;`, el panel mostrará `<strong>Repaso</strong>` literalmente, sin crear una etiqueta nueva.

En las herramientas del navegador, cambia el contexto de la consola entre la principal y el iframe. Comprueba `document.title`, `window === parent` y `window === top` en cada uno. En este caso hay un único nivel de marco: para el hijo, `parent === top` es verdadero. Los errores capturados se muestran en consola para ayudar a diagnosticarlos.

## Ejercicio propuesto: panel de seguimiento de una actividad

### Contexto

Una página de actividades debe mostrar, dentro de un iframe, una ficha con el nombre de la tarea y su modo de trabajo. El panel debe informar a la página principal cuando haya podido leerlos. Se pide reutilizar la estructura del caso resuelto, sin ventanas emergentes.

### Requisitos obligatorios

1. Crea `actividad.html`, `seguimiento.html` y `seguimiento.js`. Los dos HTML deben declarar `lang="es"`, codificación UTF-8 y un título apropiado. Sirve todos los archivos desde el mismo origen HTTP local.
2. En la principal, coloca **antes del iframe** un elemento `#nombre-actividad`, otro `#modo` y un párrafo `#estado-panel` con el texto «Panel pendiente». Usa inicialmente «Práctica de ventanas» y «practica» como datos.
3. Añade un iframe con `id="seguimiento"`, `src="seguimiento.html"` y un `title` descriptivo. Incluye fuera un enlace para abrir `seguimiento.html` directamente.
4. En el documento hijo, prepara un encabezado y tres párrafos con los identificadores `nombre-recibido`, `modo-recibido` y `diagnostico`. Enlaza su script al final del `body`. Localiza cada párrafo con `document.getElementById`, guarda su referencia y comprueba que no sea `null` antes de usarla.
5. Si se abre directamente, muestra en el diagnóstico «Abre actividad.html para conectar este panel» y no intentes consultar elementos de una principal.
6. Si está incrustado, localiza los tres elementos requeridos mediante `parent.document.getElementById("nombre-actividad")`, `parent.document.getElementById("modo")` y `parent.document.getElementById("estado-panel")`. Si alguna referencia es `null`, informa en el diagnóstico y no anuncies éxito. Mantén la comprobación de errores de acceso del caso resuelto.
7. Lee el nombre, elimina espacios de los extremos y, si queda vacío, usa «Actividad sin nombre». Muéstralo con `textContent`.
8. Normaliza el modo con `trim().toLowerCase()`. Acepta únicamente `practica` y `repaso`, y muestra respectivamente «Modo práctica» o «Modo repaso». Para cualquier otro valor, incluido el vacío, muestra «Modo no reconocido» y actualiza `#estado-panel` con «Revisa el modo de la actividad».
9. Cuando nombre y modo se hayan procesado y el modo sea válido, muestra «Comunicación completada» en `#diagnostico` y «Panel preparado:» seguido del nombre en `#estado-panel`. Para un modo inválido, explica también el problema en `#diagnostico`.
10. Conserva los encabezados y la estructura de ambos documentos. Añade comentarios que expliquen el orden de carga y la comprobación de `window === parent`.

!!! note "Límites del ejercicio"
    Para localizar elementos utiliza únicamente `getElementById`, sobre `document` o `parent.document` según corresponda. Usa variables, cadenas, condiciones, `textContent`, `parent` y el bloque `try/catch` explicado. No necesitas arrays, funciones de usuario, eventos, temporizadores, `postMessage` ni almacenamiento. No uses `document.write`, `innerHTML`, `frameset`, redirecciones ni cambios de configuración de seguridad del navegador.

### Pistas de diseño

1. Distingue las referencias del hijo de las del padre: `document` y `parent.document` no buscan en el mismo lugar.
2. Comprueba primero los elementos locales, después si existe un padre distinto y, por último, los elementos del padre.
3. No confundas una llamada a `getElementById` que devuelve `null` con un acceso a otro origen que provoca una excepción. Se detectan de manera distinta.
4. Prepara los mensajes con condiciones y escribe el estado de éxito únicamente al terminar la validación.
5. Si modificas los datos de los archivos, guarda y recarga la principal. No se pide actualización automática mientras están abiertos.

### Casos que debes probar

| Situación | Resultado esperado |
| --- | --- |
| Nombre `Práctica de ventanas` y modo `practica` | Nombre recibido, «Modo práctica» y confirmación en la principal |
| Nombre con espacios y modo ` REPASO ` | Nombre sin espacios exteriores y «Modo repaso» |
| Nombre vacío o solo espacios | «Actividad sin nombre»; con modo válido, comunicación completada |
| Modo vacío o `examen` | «Modo no reconocido», diagnóstico explicativo y «Revisa el modo de la actividad» |
| Abrir `seguimiento.html` directamente | Indicación de abrir la principal; sin excepción |
| Quitar temporalmente `id="modo"` de la principal | Diagnóstico de elemento ausente; no se anuncia éxito |
| Quitar temporalmente `id="diagnostico"` del hijo | Mensaje en consola; no se intenta escribir en `null` |
| Nombre escrito en HTML como `&lt;b&gt;Repaso&lt;/b&gt;` | Se muestra `<b>Repaso</b>` como texto, sin crear negrita |
| Cargar el hijo desde otro puerto local | Mensaje de acceso no permitido; la principal conserva «Panel pendiente» |

Para la última prueba, sirve la misma carpeta en un segundo puerto y cambia temporalmente el `src` por su URL absoluta, manteniendo ambos servidores activos. El marco puede mostrarse, pero el script no podrá consultar el documento padre. No uses una web ajena: podría impedir también la incrustación. Restaura los identificadores y el `src` original antes de entregar.

### Entrega

Entrega los dos HTML y `seguimiento.js`. Incluye una tabla de pruebas con resultado esperado y observado, y capturas de un caso correcto, un modo inválido y la apertura directa. Para la prueba con otro puerto, anota las dos URLs y el diagnóstico obtenido.

Explica qué diferencia hay entre `parent` y `opener`, por qué los párrafos de la principal aparecen antes del iframe, por qué dos puertos distintos cambian el origen y qué diferencia existe entre ver el marco y poder leer su documento.

Se valora que haya comunicación real entre documentos (**RA3.f**), que las referencias y los mensajes sean correctos y que documentes y depures los casos de prueba (**RA3.h**). El ejemplo adicional de ventanas emergentes sirve para practicar apertura, reutilización y cierre, pero no es obligatorio en esta entrega.

## Documentar y depurar

| Síntoma | Qué debes revisar |
| --- | --- |
| El marco no carga la actividad | Ruta de `src`, respuesta HTTP y posibles políticas de incrustación |
| `SecurityError` al acceder al padre | Origen de ambos documentos y restricciones del marco |
| `getElementById` devuelve `null` | Identificador sin `#`, documento en el que buscas y orden de carga |
| `opener` es `null` | Apertura directa, `noopener` o aislamiento entre ventanas |
| No aparece la ventana auxiliar | Acción directa, bloqueador y referencia devuelta por `open` |
| Cerrar no produce el efecto esperado | Si la ventana sigue abierta y si el navegador permite cerrarla por script |
| Error de sintaxis antes de ejecutar | Comprueba, entre otras cosas, que no asignas a una expresión con `?.` |

!!! success "Pruebas con contexto"
    Anota desde qué documento ejecutas cada instrucción, la URL de cada página y si trabajas en una pestaña, un iframe o una auxiliar. La misma expresión puede referirse a ventanas diferentes según dónde se ejecute. No desactives la seguridad para que una prueba pase: interpreta y documenta la restricción.

## Referencias para consultar

- [MDN: elemento iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe) y [estándar HTML: iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element).
- [MDN: política de mismo origen](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy).
- [MDN: window.open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open), [window.close](https://developer.mozilla.org/en-US/docs/Web/API/Window/close) y [window.opener](https://developer.mozilla.org/en-US/docs/Web/API/Window/opener).
- [Estándar HTML: API de Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-window-object).
- [MDN: postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
