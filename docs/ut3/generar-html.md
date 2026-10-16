---
title: 3.7 Generación de HTML
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.7. Generación de elementos HTML desde código

El criterio **d)** del [RA3](ra3.md) pide generar **textos y etiquetas** al ejecutar JavaScript. Aquí aprenderás a convertir datos en contenido visible: un párrafo, una lista o una ficha. Usaremos el **DOM**, la representación del documento que mantiene el navegador.

Este contenido forma parte del módulo **0612, Desarrollo web en entorno cliente**, del CFGS de Desarrollo de Aplicaciones Web. Se corresponde con el RA3 del [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405) y con el currículo de Cantabria de la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244) (apartado del módulo 0612, RA3). También practicarás la depuración y documentación del criterio **h)**.

!!! note "Alcance de este apartado"
    Necesitas variables, cadenas y condiciones, además de lo visto sobre `document` y `location`. Introducimos solo las operaciones del DOM necesarias para generar contenido. Los arrays y funciones se desarrollan en la UT4, los eventos en la UT5 y el estudio completo del DOM en la UT6. El caso resuelto y el ejercicio obligatorio no requieren arrays, funciones de usuario ni eventos.

## Antes de probar: del dato al elemento visible

Hay tres pasos distintos: **crear** un elemento, **configurar** su contenido y **añadirlo** al documento. Una cadena como `"<p>Hola</p>"` es texto de JavaScript; no aparece en la página por el simple hecho de guardarla en una variable.

Prepara este archivo `index.html` y un archivo `app.js` en la misma carpeta:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DWEC · Generación de HTML</title>
</head>
<body>
  <main>
    <h1>Generación de HTML</h1>
    <div id="app"></div>
  </main>
  <script src="app.js"></script>
</body>
</html>
```

El script está al final del `body` para que el contenedor con `id="app"` exista al ejecutarlo. Otra opción es un script **externo** con `defer` en el `head`. Para localizar elementos utilizaremos únicamente `document.getElementById("app")`: recibe el valor del atributo `id`, **sin `#`**, y devuelve el elemento o `null` si no existe. Cada identificador debe ser único dentro del documento.

Localizar un elemento existente y crear uno nuevo son operaciones distintas. `getElementById` localiza el contenedor; `createElement` crea los elementos que aprenderemos a generar en este apartado, `textContent` establece su texto y `append` los inserta. Estos últimos no son métodos de búsqueda.

Prueba cada ejemplo de manera independiente, reemplazando el contenido de `app.js` y recargando. No pegues todos los bloques seguidos: algunos declaran las mismas constantes y otros sustituyen el contenido anterior.

## Texto seguro: `textContent`

```javascript
const app = document.getElementById("app");
app.textContent = "Hola Mundo";
```

`textContent` es una **propiedad**: se asigna con `=`, sin paréntesis. Muestra texto sin interpretarlo como etiquetas. Por eso es la opción adecuada para presentar nombres, comentarios o datos recibidos desde una URL.

```javascript
const app = document.getElementById("app");
app.textContent = "Estudiamos <strong>JavaScript</strong> & HTML";
```

Verás los signos `<`, `>` y `&` y la palabra `strong` escrita; no aparecerá una negrita. La asignación **sustituye todos los hijos** de `app` por ese texto. Si ya había una lista, desaparecerá. Asignar `""` vacía el contenedor, pero no elimina el propio `div`.

Para conservar una estructura y cambiar solo un mensaje, asigna `textContent` al párrafo concreto que contiene ese mensaje. Los datos no se convierten en código al mostrarlos así; esto no significa que sean válidos para cualquier otro uso, como construir el destino de un enlace.

## Crear etiquetas: `createElement`

### Crear, configurar e insertar

```javascript
const app = document.getElementById("app");
const parrafo = document.createElement("p");
parrafo.textContent = "Este párrafo se ha generado con JavaScript.";
parrafo.classList.add("aviso");
app.append(parrafo);
```

`document.createElement("p")` recibe el **nombre de la etiqueta**, sin `<` ni `>`, y devuelve un elemento nuevo. Todavía no está dentro de la página: `app.append(parrafo)` lo incorpora al final del contenedor. La variable guarda una referencia al elemento, no una copia de su HTML.

La clase `aviso` solo tendrá un efecto visual si has definido una regla CSS para ella. Crear contenido y diseñar su apariencia son tareas distintas.

| Instrucción | Qué recibe o modifica |
| --- | --- |
| `createElement("h2")` | Crea un encabezado de segundo nivel |
| `elemento.textContent = "Resumen"` | Sustituye su contenido por texto |
| `elemento.id = "resumen"` | Asigna un identificador, que debe ser único en la página |
| `elemento.classList.add("ficha")` | Añade una clase; se escribe sin punto |
| `elemento.setAttribute("title", "Ayuda")` | Recibe el nombre del atributo y su valor como cadenas |
| `contenedor.append(elemento)` | Inserta el elemento como último hijo |

### Construir una estructura y conservar lo que ya existe

```javascript
const app = document.getElementById("app");
const lista = document.createElement("ul");
const primero = document.createElement("li");
const segundo = document.createElement("li");

primero.textContent = "Crear el elemento";
segundo.textContent = "Añadirlo a su contenedor";
lista.append(primero, segundo);
app.append("Pasos de trabajo:", lista);
```

`append` admite varios nodos o cadenas, en el orden en que quieres insertarlos. Las cadenas se añaden como texto. En este ejemplo, los `li` son hijos de `ul` y la lista es hija de `app`: hay que respetar la estructura HTML, igual que al escribir las etiquetas a mano.

Si insertas **el mismo nodo** en otro contenedor, se mueve; no se duplica. Para dos párrafos diferentes, llama dos veces a `createElement("p")`. Para añadir nuevos elementos sin borrar los anteriores, usa `append`; para reemplazar todo por texto, usa `textContent`.

### Crear una tarjeta de color con código secuencial

Usa el HTML inicial y este `app.js`. El programa pide un color al cargar y crea una tarjeta con la elección validada. Para cambiarla, recarga. No necesita controles con eventos, arrays ni funciones propias.

```javascript
const app = document.getElementById("app");
const entrada = prompt("Color de la tarjeta: azul o amarillo", "azul");
let color = "azul";
let mensaje = "Se utiliza el color inicial.";
if (entrada !== null) {
  const elegido = entrada.trim().toLowerCase();
  if (elegido === "azul" || elegido === "amarillo") {
    color = elegido;
    mensaje = "Color elegido: " + color + ".";
  } else {
    mensaje = "Color no válido. Se utiliza azul.";
  }
}
if (app !== null) {
  const tarjeta = document.createElement("p");
  tarjeta.textContent = mensaje;
  tarjeta.style.padding = "1rem";
  if (color === "amarillo") {
    tarjeta.style.backgroundColor = "#ffdf00";
    tarjeta.style.color = "#111111";
  } else {
    tarjeta.style.backgroundColor = "#000080";
    tarjeta.style.color = "#ffffff";
  }
  app.append(tarjeta);
}
```

`getElementById` localiza el contenedor existente; `createElement` crea el párrafo y `append` lo incorpora. Cancelar conserva azul; una entrada desconocida muestra un aviso. Prueba también espacios y mayúsculas. El texto introducido no se interpreta como HTML.

### `innerHTML`: cuándo una cadena se interpreta como HTML

`innerHTML` permite escribir marcado controlado por quien programa:

```javascript
// Solo con HTML que controlas tú:
app.innerHTML = "<p class='aviso'>Listo</p>";
```

Aquí sí se crea un párrafo. La asignación reemplaza los hijos anteriores de `app`. Los nodos sustituidos dejan de ser los que se muestran en el contenedor. Evita `app.innerHTML += ...`: también reconstruye el contenido anterior.

| Necesidad | Opción apropiada |
| --- | --- |
| Mostrar un dato como texto | `textContent` |
| Construir una ficha con etiquetas y datos | `createElement` + `textContent` + `append` |
| Insertar una plantilla HTML fija y controlada | `innerHTML`, sabiendo que sustituye el contenido |

!!! warning "Los datos externos no son una plantilla"
    No interpoles datos de `prompt`, una URL o un servidor dentro de `innerHTML`. Podrían introducir marcado no deseado y provocar XSS (ejecución de código en la página). Utiliza `textContent` para mostrarlos. `trim()` no sanitiza HTML y quitar solo etiquetas `script` tampoco es una defensa suficiente.

## Plantilla de referencia (lo que ya no hacemos)

```javascript
document.write("<form>…</form>");
document.bgColor = document.cambiacolor.color.value;
```

`document.write` escribe en el flujo de análisis del HTML: durante la carga puede insertar marcado y, si se llama después de cargar, puede abrir otro documento y borrar el contenido existente. Su comportamiento depende del momento y contexto de ejecución; no es una herramienta adecuada para actualizar una interfaz.

`document.bgColor` es una API obsoleta de presentación. La expresión `document.cambiacolor.color` depende del acceso clásico por nombres de formulario y control. En código nuevo utiliza referencias explícitas a los elementos y CSS, como en los ejemplos anteriores.

No ejecutes el bloque antiguo en la página de apuntes. Se incluye para reconocerlo y entender su sustitución.

## Caso práctico resuelto: leer la URL del material

En [History y Location](history-location.md#caso-practico-resuelto-leer-la-url-del-material) se mostraba la información en consola. Ahora la convertiremos en una **ficha HTML visible**: el dato procede de `location` y la presentación se construye con `document`.

El objetivo es generar un `article` con un encabezado y una lista que muestre la URL completa, la ruta, la consulta y el fragmento. Si faltan consulta o fragmento, aparecerá un mensaje explícito. El script solo lee la URL: no navega ni interpreta los parámetros.

Guarda el HTML inicial como `material.html` y cambia su referencia al script por `<script src="ficha-material.js"></script>`. Conserva el `div` con `id="app"`. Crea `ficha-material.js` con este código completo:

```javascript
const app = document.getElementById("app");

if (app === null) {
  console.error('No se encuentra el contenedor con id="app".');
} else {
  const ficha = document.createElement("article");
  ficha.id = "ficha-material";

  const titulo = document.createElement("h2");
  titulo.textContent = "Ficha del material";

  const lista = document.createElement("ul");
  const datoURL = document.createElement("li");
  const datoRuta = document.createElement("li");
  const datoConsulta = document.createElement("li");
  const datoFragmento = document.createElement("li");

  // Los datos de la URL se muestran como texto, nunca como marcado.
  datoURL.textContent = `URL completa: ${location.href}`;
  datoRuta.textContent = `Ruta: ${location.pathname}`;

  if (location.search === "") {
    datoConsulta.textContent = "Consulta: sin parámetros";
  } else {
    datoConsulta.textContent = `Consulta: ${location.search}`;
  }

  if (location.hash === "") {
    datoFragmento.textContent = "Fragmento: no indicado";
  } else {
    datoFragmento.textContent = `Fragmento: ${location.hash} (no comprobamos si existe el destino)`;
  }

  lista.append(datoURL, datoRuta, datoConsulta, datoFragmento);
  ficha.append(titulo, lista);

  // Este contenedor se reserva a la salida: limpiarlo evita duplicar fichas.
  app.textContent = "";
  app.append(ficha);
  console.log("Ficha generada: un article, un h2, un ul y cuatro li.");
}
```

### Lectura del resultado

Si abres `material.html?tema=repaso#instrucciones`, verás un encabezado «Ficha del material» y cuatro elementos de lista. La URL completa y la ruta dependerán de dónde hayas guardado o servido el archivo; la consulta será `?tema=repaso` y el fragmento, `#instrucciones`.

```text
div#app
└── article#ficha-material
    ├── h2 → Ficha del material
    └── ul
        ├── li → URL completa: ...
        ├── li → Ruta: ...
        ├── li → Consulta: ?tema=repaso
        └── li → Fragmento: #instrucciones (...)
```

- El `div` estaba escrito en el HTML; el `article` y sus descendientes se han creado al ejecutar JavaScript.
- Se construye la ficha antes de insertarla. El orden de los argumentos de `append` determina el orden de lectura.
- Las plantillas con `${...}` producen cadenas. Es `textContent` quien las coloca como texto en cada elemento.
- La consulta conserva `?` y el fragmento conserva `#`. El navegador puede mostrar caracteres codificados, como `%20`: el ejemplo no los decodifica.
- El fragmento se informa aunque no exista un elemento de destino. Añadir una consulta tampoco cambia por sí solo el comportamiento del material.
- La comprobación de `null` permite dar un diagnóstico si falta el contenedor y evita intentar insertar contenido en él.

Abre **Elements/Elementos** en las herramientas del navegador y despliega `#app`. En «Ver código fuente» seguirás viendo el HTML recibido inicialmente; en Elements verás los nodos generados. El script modifica el documento en memoria, no el archivo guardado. Al recargar se ejecuta de nuevo.

Prueba sin consulta, con `?tema=repaso` y con `?tema=repaso#instrucciones`. Si solo cambias el fragmento en la barra de direcciones, recarga para que se vuelva a ejecutar el script: aquí no hay eventos que actualicen la ficha automáticamente.

## Ejercicio propuesto: ficha de navegación de una actividad

### Contexto

Vas a crear una ficha visible que identifique una actividad y explique cómo se ha abierto. Retoma el ejercicio de [History y Location](history-location.md#ejercicio-propuesto-ficha-de-navegacion-de-una-actividad), pero ahora el resultado principal debe estar **dentro de la página**, no solo en consola.

Prepara `actividad.html` con `lang="es"`, un título de pestaña, un `h1`, un `<h2 id="instrucciones">Instrucciones</h2>`, un contenedor vacío `<div id="app"></div>` y un script externo `ficha-actividad.js` al final del `body`.

### Requisitos obligatorios

1. Localiza el contenedor mediante `document.getElementById("app")` y guarda su referencia. Si devuelve `null`, escribe un error claro en consola y no intentes generar la ficha.
2. Si existe, pide el nombre de la actividad mediante `prompt`. Comprueba primero si devuelve `null`. Si se cancela, se deja vacío o solo contiene espacios, utiliza «Actividad sin nombre»; en otro caso, conserva el nombre sin espacios iniciales ni finales.
3. Crea un `article` con `id="ficha-actividad"`, un `h2` para el nombre y un párrafo con el texto «Resumen de navegación generado con JavaScript».
4. Crea una lista `ul` con cinco `li`: URL completa, protocolo, servidor (`location.host`), ruta y número de entradas del historial. Si `host` está vacío, muestra «Servidor no indicado en la URL». Etiqueta la cantidad como «Entradas de esta sesión»; no la interpretes como número de páginas anteriores de tu sitio.
5. Añade otro párrafo para la consulta. Distingue: vacía («Sin consulta»); exactamente `?modo=practica` («Modo práctica solicitado»); cualquier otra («Otra consulta:», seguida del valor). Solo se comparan cadenas.
6. Añade un párrafo para el fragmento. Si está vacío, muestra «Sin fragmento»; si existe, muestra su valor y aclara que no se ha comprobado el destino.
7. Inserta los elementos en este orden: encabezado, presentación, lista, consulta y fragmento. Usa `textContent` para todos los textos, incluido el nombre escrito por la persona.
8. Vacía únicamente el contenedor con `id="app"`, usando la referencia guardada, antes de insertar la ficha. Conserva los encabezados y las instrucciones originales de la página.
9. Documenta por qué compruebas `null` y por qué muestras los datos con `textContent`. Comprueba la estructura en Elements y corrige los errores de consola.

!!! note "Límites del ejercicio"
    Para localizar elementos utiliza únicamente `document.getElementById`. Usa variables, condiciones, cadenas, `prompt`, `location`, `history.length` y las operaciones de creación e inserción del DOM explicadas aquí. No necesitas arrays, bucles, funciones de usuario, eventos ni almacenamiento. No uses `innerHTML` ni `document.write`. No cambies de página ni asignes propiedades de `location`.

### Pistas de diseño

1. Separa la lectura de datos, la creación de elementos y la inserción final. Usa nombres como `ficha`, `titulo` y `datoRuta` para saber qué guarda cada referencia.
2. No llames a `trim()` hasta comprobar que la respuesta de `prompt` no es `null`.
3. Cada `li` necesita su propia llamada a `createElement`. Insertar cinco veces la misma referencia no produce cinco elementos.
4. Construye primero los hijos de la lista y después los hijos del artículo. Inserta el artículo en `app` al final.
5. Compara la consulta completa con `"?modo=practica"`; `"?modo=practica&grupo=2"` es otra cadena.
6. Para comprobar que el nombre se trata como texto, prueba `<strong>Repaso</strong>`. Debe aparecer escrito literalmente, sin crear un elemento `strong`.

### Casos que debes probar

Recarga entre pruebas. Usa el servidor local del aula para modificar cómodamente la consulta y el fragmento en la barra de direcciones.

| Entrada o situación | Resultado esperado |
| --- | --- |
| Nombre ` Repaso UT3 ` | Encabezado `Repaso UT3`, sin espacios en los extremos |
| Nombre vacío, solo espacios o Cancelar | Encabezado «Actividad sin nombre», sin errores |
| Nombre `<strong>Repaso</strong> & HTML` | Texto literal; no se crea un nodo `strong` |
| `actividad.html` | «Sin consulta» y «Sin fragmento» |
| `actividad.html?modo=practica#instrucciones` | Modo práctica y fragmento informado |
| `actividad.html?modo=practica&grupo=2` | Otra consulta; sin fragmento |
| `actividad.html?modo=examen#inexistente` | Otra consulta y fragmento informado sin asegurar que exista |
| Archivo abierto mediante `file:` | Si `host` está vacío, «Servidor no indicado en la URL» |
| Cambiar temporalmente `id="app"` por `id="otro"` | Error descriptivo en consola; sin excepción por acceder a `null` |

Restaura `id="app"` después de la última prueba. No se exige un número fijo de entradas del historial: depende de la sesión. Comprueba que hay un solo artículo, cinco elementos de lista y que los encabezados originales siguen presentes.

### Entrega

Entrega `actividad.html` y `ficha-actividad.js`, con capturas de la ficha sin consulta y con consulta y fragmento. Incluye una captura de Elements donde se vea la estructura generada y una tabla breve con los casos probados y su resultado.

Explica la diferencia entre crear e insertar un elemento, por qué `textContent` muestra las etiquetas del nombre literalmente, qué ocurriría al asignarlo al artículo después de añadir sus hijos y por qué el código fuente original no contiene la ficha generada.

Se valoran la generación correcta de textos y etiquetas (**RA3.d**), el tratamiento de entradas vacías y canceladas, la conservación del contenido original y las pruebas y comentarios que permitan entender y depurar el programa (**RA3.h**). Esta actividad trabaja una parte del RA3, no todos sus criterios.

## Documentar y depurar

| Síntoma | Qué debes revisar |
| --- | --- |
| Error al leer propiedades de `null` | Identificador y momento de ejecución del script |
| No aparece el elemento | Si falta `append` o se insertó en un contenedor desconectado |
| Solo queda el último elemento de una lista | Si se reutilizó y movió el mismo nodo |
| Desaparece una estructura ya creada | Si se asignó `textContent` o `innerHTML` a su contenedor |
| Se ven etiquetas en el texto | Es normal con `textContent`; decide si necesitas crear elementos |
| No cambia la ficha al modificar el fragmento | Recarga: estos ejemplos no escuchan cambios de URL |

!!! success "Documentar y depurar"
    Usa nombres claros, comenta el *porqué* y compara el árbol de Elements con la estructura que querías generar. Pon un punto de interrupción antes de `app.append(ficha)` y avanza una instrucción para observar cuándo se incorpora al documento. Es el criterio **h)** aplicado a este apartado.

## Referencias para consultar

- [MDN: `textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent).
- [MDN: `createElement`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement).
- [MDN: `append`](https://developer.mozilla.org/en-US/docs/Web/API/Element/append).
- [MDN: `innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).
- [MDN: `document.write`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write).
