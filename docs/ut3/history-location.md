---
title: 3.6 History y Location
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.6. `history` y `location`

## 3.6.1. El objeto `history`

`history` guarda la **sesión de navegación** de esa pestaña: es lo que usan los botones Atrás y Adelante del navegador. No es una base de datos de todas las páginas que ha visitado una persona.

Por privacidad, una página no puede leer las URLs visitadas. Las propiedades `current`, `next` y `previous` del PDF **no están disponibles** para el contenido web. Imagina el problema si cualquier página pudiera preguntar “¿qué webs ha abierto esta persona antes?”.

| Miembro | Efecto |
| --- | --- |
| `length` | Número de entradas en el historial de la sesión |
| `back()` | Como el botón Atrás |
| `forward()` | Como el botón Adelante |
| `go(n)` | `go(-1)` atrás, `go(1)` adelante |

```javascript
console.log("Entradas de historial:", history.length);

const botonAtras = document.getElementById("atras");
if (botonAtras !== null) {
  botonAtras.addEventListener("click", () => {
    history.back();
  });
}
```

`history.length` es un número orientativo de entradas de la sesión de la pestaña. No dice qué direcciones contienen ni garantiza que `back()` vaya a volver a una página de tu propio sitio.

```javascript
history.back();    // como pulsar Atrás
history.forward(); // como pulsar Adelante
history.go(-1);    // una entrada atrás
history.go(1);     // una entrada adelante
```

### ¿Qué recibe cada método?

`back()` y `forward()` no reciben argumentos: los paréntesis vacíos indican que se llama al método. `go(n)` recibe un número de pasos respecto a la entrada actual, no una URL ni un índice absoluto.

| Llamada | Significado |
| --- | --- |
| `history.go(-2)` | Intenta retroceder dos entradas |
| `history.go(2)` | Intenta avanzar dos entradas |
| `history.go(0)` | Recarga la página actual; no significa «no hacer nada» |

Si no existe la entrada solicitada, el desplazamiento no se realiza. `history.length` incluye la entrada actual y puede incluir entradas por delante: no permite calcular cuántas veces puedes volver atrás. Prueba las llamadas por separado, nunca todas seguidas al cargar el script.

Para probar el ejemplo, coloca `<button id="atras" type="button">Atrás</button>` antes del script. `document.getElementById("atras")` localiza el botón por su identificador, sin `#`. Se guarda su referencia y se comprueba que no sea `null` antes de utilizarla. `addEventListener("click", () => { ... })` recibe el nombre del evento y una función que se ejecutará al hacer clic. Es un anticipo de la UT5; no necesitas usarlo en el caso ni en el ejercicio propuesto.

!!! warning "No supongas qué hay detrás"
    Un `history.back()` puede volver a otra página de tu sitio, a un buscador, a una pestaña en blanco o no hacer nada visible si no hay una entrada anterior. No lo uses como sustituto de un enlace explícito a la página que quieres ofrecer.

`history.pushState` / `replaceState` cambian la URL **sin recargar** (aplicaciones de una sola página). Se verán con más detalle en unidades posteriores; de momento basta `back`, `forward` y `length`.

## 3.6.2. El objeto `location`

`location` representa la **URL actual** y permite navegar. Una URL no es solo “la dirección”: está formada por piezas que ayudan a saber de dónde procede el documento y qué información se le ha pasado.

En esta página:

```text
https://ies.edu/dwec/ut3.html?tema=bom#window
│       │       │            │          │
│       │       │            │          └─ hash: ancla dentro de la página
│       │       │            └─ search: parámetros de consulta
│       │       └─ pathname: ruta del recurso
│       └─ host / hostname: servidor
└─ protocol: protocolo
```

| Propiedad | Ejemplo en `https://ies.edu/dwec/ut3.html?tema=bom#window` |
| --- | --- |
| `href` | URL completa |
| `protocol` | `https:` |
| `host` | `ies.edu` (con puerto si no es el de por defecto) |
| `hostname` | `ies.edu` |
| `port` | Puerto, o cadena vacía |
| `pathname` | `/dwec/ut3.html` |
| `search` | `?tema=bom` |
| `hash` | `#window` |

```javascript
console.log(location.href);
console.log("Ruta:", location.pathname);
console.log("Consulta:", location.search);
console.log("Ancla:", location.hash);
```

### Leer no es navegar

Consultar una propiedad de `location` no mueve la página:

```javascript
const paginaActual = location.href;
console.log(paginaActual);
```

En cambio, asignar `location.href`, llamar a `assign`, `replace` o `reload` inicia una navegación. El documento actual puede desaparecer inmediatamente; por eso no pongas esas instrucciones sueltas al cargar un script.

### Métodos

| Método | Qué hace |
| --- | --- |
| `assign(url)` | Carga esa URL (queda en el historial) |
| `replace(url)` | Carga esa URL **sustituyendo** la entrada actual (no hay “atrás” a esta página) |
| `reload()` | Vuelve a cargar la URL actual; la gestión de caché depende del navegador y del servidor |

```javascript
// Navegar (déjalo detrás de un botón; si lo pones suelto en el script, la página salta al cargar)
const botonIr = document.getElementById("ir-google");
if (botonIr !== null) {
  botonIr.addEventListener("click", () => {
    location.assign("https://www.google.es");
  });
}
```

Asignar `location.href = "..."` equivale a `assign`.

`assign(url)` y `replace(url)` reciben una cadena con el destino. Una URL absoluta, como `"https://www.google.es"`, incluye protocolo y servidor. Una relativa, como `"indice.html"`, se resuelve respecto a la URL base del documento (que puede cambiar con `<base>`). Desde `/ut3/history-location/`, sin `<base>`, `"indice.html"` apunta a `/ut3/history-location/indice.html`, mientras que `"../"` apunta a `/ut3/`. Los nombres de archivo del ejemplo son ilustrativos: el destino debe existir.

`reload()` no necesita argumentos. No uses `reload(true)` como una forma portable de evitar la caché. Para el ejemplo de navegación, coloca `<button id="ir-google" type="button">Ir a Google</button>` antes del script. `document.getElementById("ir-google")` recibe el identificador sin `#`; `"click"` es el evento y la función contiene la navegación. Si falta el botón, la comprobación de `null` evita utilizar una referencia inexistente.

### `assign` frente a `replace`

La diferencia importa para quien navega:

```javascript
// La página actual queda en el historial:
location.assign("indice.html");

// La página actual desaparece de la pila de Atrás:
location.replace("acceso-denegado.html");
```

Si navegas A → B y desde B ejecutas `assign` hacia C, la secuencia es A → B → C: Atrás permite volver a B. Si desde B usas `replace` hacia C, queda A → C: se sustituye esa entrada de B, no se borra todo el historial ni se impide que existan otras visitas anteriores a B.

- Usa **`assign`** (o un enlace HTML) para una navegación normal: índice, siguiente apartado o página de ayuda.
- Reserva **`replace`** para pantallas que no quieres que la persona vuelva a abrir con Atrás, por ejemplo una pantalla temporal de acceso que ya ha sido sustituida. No lo uses para “ahorrar un clic”.

`reload()` vuelve a cargar el documento actual. Puede perder texto escrito en un formulario que aún no se haya enviado; úsalo solo cuando la persona lo espera o lo ha solicitado.

!!! warning "Redirección al cargar"
    El ejemplo del PDF ponía `location.href = "http://www.google.es"` en el `body`. Eso **expulsa** al alumnado de tu página en cuanto abre el archivo. Úsalo solo como respuesta a un clic o a una condición.

### Consulta y fragmento no son lo mismo

En `?tema=repaso#location`, la consulta empieza por `?` y el fragmento por `#`, en ese orden. `search` y `hash` son cadenas, no objetos ya interpretados. El fragmento no se envía como parte de la petición HTTP al servidor.

Un fragmento puede señalar un elemento con un `id` coincidente, pero su presencia no demuestra que ese elemento exista. Si no existe, la URL puede conservar el fragmento sin saltar a ninguna sección. Tampoco basta con añadir `?tema=repaso` para que la página cambie: algún código debe interpretar la consulta.

## Caso práctico resuelto: leer la URL del material

El material de clase puede abrirse desde una URL como esta:

```text
https://iesataulfoargentasor.github.io/dwec_2026_2027/ut3/history-location/?tema=repaso#location
```

El objetivo es preparar un pequeño diagnóstico de navegación para consola. El script:

1. Muestra la URL completa y sus partes principales.
2. Indica si se ha abierto una sección concreta de la página (si hay `hash`).
3. Indica si la URL trae una consulta (si hay `search`).
4. Muestra el número de entradas de historial sin intentar leerlas.
5. Pregunta si la persona quiere volver atrás, pero **no** ejecuta una navegación automática durante la explicación.

El caso utiliza `location`, `history`, `confirm`, `if`, cadenas y consola. No usa eventos, funciones de usuario, DOM, arrays ni redirecciones automáticas.

```javascript
console.log("================================");
console.log(" DIAGNÓSTICO DE NAVEGACIÓN ");
console.log("================================");
console.log(`URL completa: ${location.href}`);
console.log(`Protocolo: ${location.protocol}`);
console.log(`Servidor: ${location.host}`);
console.log(`Ruta: ${location.pathname}`);
console.log(`Consulta: ${location.search}`);
console.log(`Ancla: ${location.hash}`);
console.log(`Entradas en historial: ${history.length}`);

if (location.search === "") {
  console.log("La URL no contiene parámetros de consulta.");
} else {
  console.log("La URL incluye una consulta. Aquí solo la mostramos; se interpretará más adelante.");
}

if (location.hash === "") {
  console.log("La URL no apunta a una sección concreta.");
} else {
  console.log(`La URL incluye el fragmento ${location.hash}; no hemos comprobado si existe esa sección.`);
}

const volver = confirm("¿Quieres volver a la página anterior?");

if (volver) {
  console.log("En una aplicación real se ejecutaría history.back() aquí.");
  console.log("En este ejemplo no navegamos para poder revisar todos los mensajes.");
} else {
  console.log("Sigues en la página actual.");
}
```

### Lectura del resultado

- `location.href` reúne toda la URL. Las demás propiedades separan sus piezas.
- `location.search` contiene el `?` inicial cuando existe consulta; `location.hash` contiene el `#` inicial cuando existe ancla. Si no existen, ambas son `""`.
- `history.length` da una cantidad, no permite inspeccionar URLs previas.
- `confirm` devuelve `true` o `false`. El caso solo explica qué ocurriría con `history.back()`; no lo ejecuta, porque cambiar de página mientras se estudia el resultado sería molesto.
- No se usa `location.assign` ni `location.replace` dentro del ejemplo. Esas llamadas recargarían o abandonarían la página; se explican arriba como navegación deliberada.

Prueba el apartado con y sin `#location` al final de la URL. Si quieres probar una consulta, añade manualmente `?tema=repaso` antes del `#`, por ejemplo `.../history-location/?tema=repaso#location`, y recarga.

## Ejercicio propuesto: ficha de navegación de una actividad

### Contexto

Una actividad puede abrirse con una consulta y un fragmento, por ejemplo `actividad.html?modo=practica#instrucciones`. Crea `ficha-navegacion.js` para mostrar cómo se ha abierto y simular la decisión de volver atrás, como en el caso resuelto. **La práctica no debe cambiar de página.**

Prepara un HTML llamado `actividad.html` con un encabezado `<h2 id="instrucciones">Instrucciones</h2>` y enlaza el script al final del `body`. El identificador permite probar un fragmento que sí existe, sin buscarlo desde JavaScript.

### Requisitos obligatorios

1. Muestra una cabecera y estas propiedades: `location.href`, `protocol`, `hostname`, `port`, `pathname`, `search` y `hash`.
2. Si `port` está vacío, informa «La URL no muestra un puerto no predeterminado». No afirmes que la conexión no utiliza puerto. Si contiene texto, muéstralo.
3. Distingue tres casos de consulta: vacía; exactamente `?modo=practica`; cualquier otra consulta. Para el segundo indica «Modo práctica solicitado en la URL». Solo compara cadenas: no necesitas interpretar parámetros.
4. Si no hay fragmento, indica «Sin fragmento». Si hay uno, muestra su valor y aclara que el script no comprueba si existe una sección coincidente.
5. Muestra `history.length` con la etiqueta «Entradas de esta sesión». Añade que el número no revela las URLs ni garantiza un destino anterior del mismo sitio.
6. Pregunta con `confirm("¿Quieres simular volver a la página anterior?")`. El argumento es el mensaje; Aceptar devuelve `true` y Cancelar, `false`.
7. Si se acepta, escribe «Se ejecutaría history.back(), que no recibe argumentos». Si se cancela, escribe «Se mantiene la actividad actual». En ambos casos termina sin ejecutar navegación.
8. Añade al resumen una explicación de qué pasaría al usar `assign` o `replace` para ir a un índice. No invoques esos métodos.

!!! warning "Límites del ejercicio"
    Solo necesitas variables, condiciones, plantillas, cadenas, `location`, `history`, `confirm` y consola. No uses funciones de usuario, eventos, selectores, arrays, `URLSearchParams` ni almacenamiento. No asignes propiedades de `location` ni ejecutes `back`, `forward`, `go`, `assign`, `replace` o `reload`.

### Pistas de diseño

1. Guarda las propiedades que vayas a comparar en constantes con nombres claros.
2. Usa `if` / `else if` / `else` para los tres casos de consulta. Recuerda incluir el signo `?` en la comparación.
3. Compara el fragmento con `""` antes de mostrarlo. Si existe, conserva el `#` en el resumen.
4. Una cadena dentro de `console.log` solo se imprime: escribir `"history.back()"` no ejecuta el método.
5. No utilices `history.length > 1` como prueba de que hay una página anterior de tu sitio.

### Casos que debes probar

Abre estas variantes de tu archivo, manteniendo el mismo servidor o carpeta:

| Final de la URL | Resultado esperado |
| --- | --- |
| `actividad.html` | Consulta vacía y sin fragmento |
| `actividad.html?modo=practica` | Modo práctica solicitado, sin fragmento |
| `actividad.html#instrucciones` | Sin consulta y fragmento `#instrucciones` |
| `actividad.html?modo=practica#instrucciones` | Consulta reconocida y fragmento informado |
| `actividad.html?modo=examen#inexistente` | Otra consulta y fragmento informado; no se asegura que exista la sección |
| `actividad.html?modo=practica&grupo=2` | Otra consulta: no coincide exactamente con `?modo=practica` |

Prueba Aceptar y Cancelar en la confirmación: ninguna respuesta debe abandonar la actividad. Para cambiar la consulta o el fragmento, edita la barra de direcciones. Si solo cambias el fragmento, recarga manualmente para que el script vuelva a ejecutarse: no utiliza eventos.

No se exige un número fijo de entradas en el historial, porque depende de cómo hayas navegado. Si trabajas con `file:`, el servidor puede aparecer vacío; para observar un servidor y un puerto utiliza el servidor local del aula.

### Entrega

Entrega `actividad.html` y `ficha-navegacion.js`, y dos capturas: una sin consulta ni fragmento y otra con ambos. Incluye los mensajes de las dos respuestas de confirmación.

Explica la diferencia entre leer `location.href` y asignarle un valor, qué representa el argumento de `history.go(-1)` y cómo cambia el historial al utilizar `assign` frente a `replace`. La corrección valora las comparaciones, los mensajes claros y que la simulación no navegue realmente.
