---
title: 3.3 BOM
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.3. Interacción de los objetos con el navegador (BOM)

Cuando JavaScript se ejecuta en una página no vive solo: está dentro de una **ventana del navegador**, en una pantalla, con un idioma, una URL y un historial. El **Browser Object Model** (**BOM**) es el conjunto de objetos que describe ese entorno.

- Conocer el navegador y la pantalla.
- Leer y cambiar la URL (`location`).
- Moverse por el historial (`history`).
- Abrir diálogos y, con limitaciones, otras ventanas.
- Guardar datos en el cliente (cookies y *Web Storage*).

Todo cuelga de **`window`**, el objeto global del navegador. La cadena de acceso completa puede resultar larga:

```javascript
console.log(window.innerWidth);
console.log(window.navigator.language);
console.log(window.location.href);
```

Como `window` es el objeto global, se puede abreviar:

```javascript
console.log(innerWidth);
console.log(navigator.language);
console.log(location.href);
```

Las dos formas llegan al mismo dato. En estos apuntes escribiremos `window.` cuando ayude a recordar **de qué objeto sale** una propiedad y lo omitiremos cuando sea una abreviatura conocida.

!!! warning "BOM frente a DOM"
    El **BOM** es el “marco”: ventana, navegador, pantalla, URL e historial. El **DOM** es el contenido HTML de esa ventana: `document`, elementos, texto y atributos.

    Si quieres saber el ancho de la pestaña, usas BOM (`window.innerWidth`). Si quieres cambiar un `<h1>`, usas DOM (`document` y sus nodos). El DOM se trabaja a partir del apartado 3.5.

En el material antiguo se decía que el BOM no estaba estandarizado. Hoy `Window`, `Location` e `History` forman parte de los estándares web, aunque siguen existiendo diferencias menores entre motores y restricciones de seguridad.

```text
navegador / ventana
└── window  ← objeto global del BOM
    ├── navigator  → navegador, idioma, estado de red…
    ├── screen     → pantalla física
    ├── location   → URL                 (3.6)
    ├── history    → atrás / adelante    (3.6)
    └── document   → HTML cargado (DOM)  (3.5)
```

No uses **ActiveX**, `javaEnabled()` ni `taintEnabled()`: son legado de Internet Explorer / Netscape.

## 3.3.1. El objeto `navigator`

`navigator` ofrece información sobre el **navegador** y, en parte, sobre el dispositivo. Puede servir para adaptar idioma, mostrar un aviso de conexión o diagnosticar un equipo, pero no para decidir “este navegador es bueno y este no”.

| Propiedad | Uso actual |
| --- | --- |
| `userAgent` | Cadena que el navegador envía al servidor. Útil para diagnóstico, frágil para detectar un navegador |
| `language` | Idioma principal de la interfaz, por ejemplo `"es-ES"` |
| `languages` | Idiomas preferidos, en orden. Es una lista (se estudia en UT4) |
| `cookieEnabled` | ¿Acepta cookies? |
| `onLine` | ¿Hay conexión a red? (no garantiza Internet real) |
| `hardwareConcurrency` | Núcleos lógicos (aproximado) |

```javascript
console.log("Idioma:", navigator.language);
console.log("Cookies:", navigator.cookieEnabled);
console.log("En línea:", navigator.onLine);
console.log("userAgent:", navigator.userAgent);
console.log("Núcleos lógicos:", navigator.hardwareConcurrency);
```

### Lo que sí puedes concluir y lo que no

`navigator.onLine` es una pista, no una prueba de que Internet o el servidor del centro funcionen:

```javascript
if (navigator.onLine) {
  console.log("El navegador tiene una conexión de red.");
} else {
  console.log("El navegador está sin conexión.");
}
```

Estar en línea puede significar que el equipo está conectado al router, aunque el router no tenga salida a Internet. Por la misma razón, estar fuera de línea no permite adivinar qué cable o servicio ha fallado.

`hardwareConcurrency` tampoco es una promesa de rendimiento. Indica una estimación de **núcleos lógicos**; un navegador puede redondearla por privacidad y no dice nada de la RAM, la batería, la red o la carga de otros programas.

!!! failure "No hagas *browser sniffing*"
    `appName` y `appVersion` mienten a menudo por compatibilidad. `userAgent` también puede cambiar o fingirse. No escribas “si Chrome, ejecuto; si Firefox, no”.

    Si necesitas una API, comprueba si **existe**. Eso se llama *detección de características*:

    ```javascript
    if ("geolocation" in navigator) {
      console.log("Este navegador ofrece geolocalización.");
    } else {
      console.log("La geolocalización no está disponible.");
    }
    ```

    Esta comprobación no pide ubicación ni activa un permiso: solo comprueba que la API existe. El uso de permisos se verá cuando corresponda.

Recorrer `navigator` con `for...in` (como en el PDF) lista muchas propiedades internas y los arrays `plugins` / `mimeTypes`, que en Chromium van vacíos por privacidad. En clase basta con las propiedades de la tabla.

## 3.3.2. El objeto `screen`

`screen` da datos de **solo lectura** sobre la pantalla física o el área disponible del sistema operativo.

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

### Pantalla, ventana y página: tres tamaños distintos

Son conceptos que se confunden con facilidad:

| Pregunta | Propiedad adecuada | Ejemplo |
| --- | --- | --- |
| ¿Cuántos píxeles tiene la pantalla? | `screen.width` / `screen.height` | El monitor completo: 1920 × 1080 |
| ¿Cuánto mide el área de la pestaña? | `window.innerWidth` / `window.innerHeight` | La ventana se ha reducido a media pantalla |
| ¿Cuánto mide todo el documento, aunque haga *scroll*? | DOM, a partir del 3.5 | Página más larga que el *viewport* |

Para el **tamaño de la ventana** usa `window.innerWidth` e `window.innerHeight`, no `screen`. Una persona puede tener una pantalla 1920 × 1080 y abrir una pestaña de solo 700 píxeles de ancho.

```javascript
console.log("Pantalla completa:", screen.width, "×", screen.height);
console.log("Área de esta pestaña:", window.innerWidth, "×", window.innerHeight);
```

Para diseño adaptable (*responsive*), CSS (`@media`) es la herramienta principal. JavaScript no debe ocultar contenido importante solo porque una pantalla tenga cierto tamaño; `screen` sirve mejor para diagnósticos o decisiones puntuales.

### Privacidad y valores aproximados

El navegador puede redondear determinados valores o informar de una pantalla lógica distinta de los píxeles físicos, especialmente con escalado del sistema, pantallas Retina o configuraciones de privacidad. Un script debe interpretar estos datos como **orientativos**; no como una huella fiable de la persona.

!!! warning "`with`"
    El ejemplo antiguo usaba `with (screen) { ... }`. Esa sentencia está **prohibida en modo estricto** y dificulta leer el código. Escribe `screen.width`, no `with`.

## Caso práctico resuelto: ficha de diagnóstico del aula

Antes de iniciar una prueba de JavaScript, el profesor quiere una ficha breve del equipo: fecha, idioma, estado de red, cookies, núcleos lógicos, pantalla y tamaño real de la pestaña. El resultado va a la **consola**; no modifica HTML, no abre ventanas y no utiliza eventos.

El script debe:

1. Crear la fecha y hora del diagnóstico.
2. Diferenciar pantalla completa y área de la pestaña.
3. Mostrar el idioma y las capacidades básicas del navegador.
4. Mostrar avisos comprensibles para conexión, cookies y ventana estrecha.
5. Comprobar si el navegador ofrece geolocalización, sin pedir permiso.
6. Formatear los minutos con dos cifras usando los objetos ya vistos en 3.1 y 3.2.

Solo se usan `const`/`let`, plantillas, `if`, operadores, `Date`, `String`, `navigator`, `screen` y `window`. No aparecen funciones de usuario, arrays como estructura de trabajo, DOM, eventos, diálogos, `location` ni `history`.

```javascript
const momento = new Date();
const horas = String(momento.getHours()).padStart(2, "0");
const minutos = String(momento.getMinutes()).padStart(2, "0");
const fecha = momento.toLocaleDateString("es-ES");

const anchoPantalla = screen.width;
const altoPantalla = screen.height;
const anchoVentana = window.innerWidth;
const altoVentana = window.innerHeight;

console.log("================================");
console.log(" DIAGNÓSTICO DEL EQUIPO DE AULA ");
console.log("================================");
console.log(`Fecha: ${fecha} · ${horas}:${minutos}`);
console.log(`Idioma: ${navigator.language}`);
console.log(`Pantalla: ${anchoPantalla} × ${altoPantalla}`);
console.log(`Pestaña: ${anchoVentana} × ${altoVentana}`);
console.log(`Núcleos lógicos: ${navigator.hardwareConcurrency}`);

if (navigator.onLine) {
  console.log("Red: el navegador indica que está en línea.");
} else {
  console.log("Red: el navegador indica que está sin conexión.");
}

if (navigator.cookieEnabled) {
  console.log("Cookies: el navegador las acepta.");
} else {
  console.log("Cookies: están desactivadas; algunas prácticas posteriores no funcionarán.");
}

if ("geolocation" in navigator) {
  console.log("Geolocalización: API disponible (no se ha pedido permiso).");
} else {
  console.log("Geolocalización: API no disponible.");
}

if (anchoVentana < 800) {
  console.log("Aviso: la pestaña es estrecha. Amplíala para leer mejor los ejemplos.");
} else {
  console.log("La pestaña tiene un ancho cómodo para el material.");
}
```

### Lectura del resultado

- `screen.width` y `screen.height` describen la pantalla; `window.innerWidth` e `innerHeight`, la zona de contenido de **esta** pestaña. Reducir la ventana cambia la segunda pareja, no necesariamente la primera.
- `navigator.language` puede ser `"es-ES"`, `"es"` u otro código de idioma configurado en el navegador.
- `navigator.onLine` informa del estado que ve el navegador. No afirma que una página concreta vaya a cargar.
- `navigator.cookieEnabled` solo indica si el navegador permite cookies en general; las políticas de una página pueden imponer más restricciones.
- `"geolocation" in navigator` es detección de característica: consulta si existe la API sin leer ubicación ni lanzar un cuadro de permiso.
- La fecha se prepara con `Date`; `padStart` evita que las 9:05 aparezcan como `9:5`.

Prueba el script con la pestaña a pantalla completa y después estrechándola. Observa que cambia el ancho de `window.innerWidth`; la resolución de `screen.width` suele mantenerse.
