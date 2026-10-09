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

document.querySelector("#atras")?.addEventListener("click", () => {
  history.back();
});
```

`history.length` es un número orientativo de entradas de la sesión de la pestaña. No dice qué direcciones contienen ni garantiza que `back()` vaya a volver a una página de tu propio sitio.

```javascript
history.back();    // como pulsar Atrás
history.forward(); // como pulsar Adelante
history.go(-1);    // una entrada atrás
history.go(1);     // una entrada adelante
```

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
| `reload()` | Recarga. `reload()` fuerza revalidación según el navegador |

```javascript
// Navegar (déjalo detrás de un botón; si lo pones suelto en el script, la página salta al cargar)
document.querySelector("#ir-google")?.addEventListener("click", () => {
  location.assign("https://www.google.es");
});
```

Asignar `location.href = "..."` equivale a `assign`.

### `assign` frente a `replace`

La diferencia importa para quien navega:

```javascript
// La página actual queda en el historial:
location.assign("indice.html");

// La página actual desaparece de la pila de Atrás:
location.replace("acceso-denegado.html");
```

- Usa **`assign`** (o un enlace HTML) para una navegación normal: índice, siguiente apartado o página de ayuda.
- Reserva **`replace`** para pantallas que no quieres que la persona vuelva a abrir con Atrás, por ejemplo una pantalla temporal de acceso que ya ha sido sustituida. No lo uses para “ahorrar un clic”.

`reload()` vuelve a cargar el documento actual. Puede perder texto escrito en un formulario que aún no se haya enviado; úsalo solo cuando la persona lo espera o lo ha solicitado.

!!! warning "Redirección al cargar"
    El ejemplo del PDF ponía `location.href = "http://www.google.es"` en el `body`. Eso **expulsa** al alumnado de tu página en cuanto abre el archivo. Úsalo solo como respuesta a un clic o a una condición.

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
  console.log(`La URL apunta a la sección ${location.hash}.`);
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
