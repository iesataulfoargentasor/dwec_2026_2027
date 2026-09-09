---
title: 3.6 History y Location
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.6. `history` y `location`

## 3.6.1. El objeto `history`

Guarda la **sesión de navegación** de esa pestaña (atrás / adelante). No puedes leer las URLs visitadas (privacidad): `current`, `next` y `previous` del PDF **no están disponibles** para el contenido web.

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

`history.pushState` / `replaceState` cambian la URL **sin recargar** (aplicaciones de una sola página). Se verán con más detalle en unidades posteriores; de momento basta `back`, `forward` y `length`.

## 3.6.2. El objeto `location`

Representa la **URL** de la página y permite navegar.

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
```

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

!!! warning "Redirección al cargar"
    El ejemplo del PDF ponía `location.href = "http://www.google.es"` en el `body`. Eso **expulsa** al alumnado de tu página en cuanto abre el archivo. Úsalo solo como respuesta a un clic o a una condición.
