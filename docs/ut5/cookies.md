---
title: 5.7 Utilización de cookies
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.7. Utilización de cookies

HTTP no “recuerda” al visitante entre peticiones. Las **cookies** son pares `nombre=valor` que el navegador guarda y, si corresponde, **vuelve a enviar al servidor**. El PDF de la UT5 las incluye porque durante años fueron la única forma de persistir datos en el cliente.

En el módulo ya viste el panorama completo en [3.9 Almacenamiento](../ut3/almacenamiento.md): cookies, `localStorage` y `sessionStorage`. Aquí se mantiene el apartado del temario (usos + lectura/escritura) con la API **actual**.

## Para qué se usan

- **Preferencias de visualización:** idioma, tamaño de fuente, tema.
- **Estado de un asistente o carrito:** datos que deben viajar **también** al servidor.
- **Sesión y autenticación:** el servidor pone una cookie de sesión. En aplicaciones reales suele ser `HttpOnly` (JavaScript **no** puede leerla: es una protección contra XSS).
- **Seguimiento:** identificar visitas. Requiere información al usuario (RGPD / ePrivacy). No lo uses en prácticas salvo que el enunciado lo pida.

Caducan con `expires` / `max-age`. Un sitio puede invalidar la sesión tras un tiempo de inactividad **en el servidor**; no basta con la fecha de la cookie.

## Lectura y escritura desde JavaScript

`document.cookie` es **una sola cadena** con todas las cookies accesibles al script. No uses `escape` / `unescape` (obsoletos): usa `encodeURIComponent` / `decodeURIComponent`.

```javascript
function setCookie(nombre, valor, dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  const trozos = [
    `${encodeURIComponent(nombre)}=${encodeURIComponent(valor)}`,
    `expires=${fecha.toUTCString()}`,
    "path=/",
    "SameSite=Lax",
  ];
  document.cookie = trozos.join("; ");
}

function getCookie(nombre) {
  const clave = `${encodeURIComponent(nombre)}=`;
  const partes = document.cookie.split(";");
  for (const parte of partes) {
    const trozo = parte.trim();
    if (trozo.startsWith(clave)) {
      return decodeURIComponent(trozo.slice(clave.length));
    }
  }
  return null;
}

function checkCookie() {
  let usuario = getCookie("username");
  if (usuario) {
    alert(`Bienvenido, ${usuario}`);
    return;
  }
  usuario = prompt("Por favor, introduce tu usuario:", "");
  if (usuario) {
    setCookie("username", usuario, 365);
  }
}

document.querySelector("#chequear").addEventListener("click", checkCookie);
```

Atributos que puedes concatenar al asignar `document.cookie`:

| Atributo | Efecto |
| --- | --- |
| `path=/` | Visible en todo el sitio |
| `max-age=86400` | Segundos de vida (alternativa a `expires`) |
| `SameSite=Lax` | Limita el envío en peticiones cruzadas |
| `Secure` | Solo por HTTPS |

`HttpOnly` **no** se puede poner desde JavaScript (el servidor lo envía en `Set-Cookie`).

Para borrar: escribe la misma cookie con fecha pasada o `max-age=0`.

## Cookies o Web Storage

| Necesitas… | Herramienta |
| --- | --- |
| Que el **servidor** reciba el dato en cada petición | Cookie |
| Guardar un dato **solo en el cliente** (ejercicio, color, JSON) | `localStorage` / `sessionStorage` |

```javascript
localStorage.setItem("username", usuario);
const leido = localStorage.getItem("username");
```

En las prácticas de esta unidad, si el enunciado dice “cookie”, implementa `document.cookie` como arriba. Si solo hay que recordar un valor entre recargas y no hay servidor, Web Storage es más claro y seguro para datos de cliente.

!!! warning "Privacidad"
    No guardes contraseñas ni datos personales sensibles en cookies leídas por JavaScript. El tamaño ronda los 4 KB por cookie.

!!! tip "Depuración"
    En DevTools: *Application* → *Cookies* (y *Local Storage*). Comprueba `path`, caducidad y `SameSite`.
