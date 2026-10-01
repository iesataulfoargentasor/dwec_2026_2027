---
title: 5.7 Utilización de cookies
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.7. Utilización de cookies

HTTP no recuerda a la persona entre una petición y la siguiente. Una **cookie** es un par `nombre=valor` que el navegador guarda y, cuando toca, **vuelve a enviar al servidor** con la página. El temario las incluye porque durante años fueron la única forma de dejar un dato en el cliente.

En la [UT3, apartado 3.9](../ut3/almacenamiento.md) ya están las tres herramientas: cookies, `localStorage` y `sessionStorage`. Aquí se escribe y se lee la cookie con la propiedad `document.cookie`, que es lo que pide este apartado. `encodeURIComponent` y `decodeURIComponent` son las funciones de la UT4. `split`, `trim`, `startsWith` y `slice` son los de la cadena en la UT3. `join` es el del array en la UT4.

Ábrela por `http://localhost` o con la vista previa del editor. Con `file://` muchos navegadores ignoran `document.cookie`: asignas la cookie, la vuelves a leer y la cadena sale vacía. No es un fallo de la función.

## Para qué se usan

| Uso | Qué se guarda |
| --- | --- |
| Preferencia | Idioma, tamaño de letra, tema. El dato viaja al servidor si la página se genera allí |
| Carrito o asistente | Lo que tiene que llegar también al servidor en la siguiente petición |
| Sesión | El servidor crea la cookie al entrar. En una aplicación real suele marcarla `HttpOnly`: JavaScript no puede leerla, y un script metido en la página tampoco |
| Seguimiento | Identificar visitas. Hay que informar a la persona. En las prácticas no se usa salvo que el enunciado lo pida |

Caducan. `max-age` son los segundos de vida. `expires` es una fecha. Pasado ese momento el navegador las tira. Cerrar la sesión por inactividad lo decide el servidor: no basta con alargar la fecha en el script.

No guardes contraseñas ni datos sensibles en una cookie que JavaScript pueda leer. El tamaño ronda los 4 KB por cookie.

## Qué hace `document.cookie`

Se lee y se escribe por la misma propiedad, y las dos operaciones no son simétricas.

- **Al asignar**, añades o sustituyes **una** cookie. No borras las demás.
- **Al leer**, recibes **todas** las que el script puede ver, en una sola cadena: `"username=Ana; tema=claro"`. No vienen `path`, `expires` ni `SameSite`. Esos atributos se ven en DevTools, no en `document.cookie`.

```javascript
document.cookie = "tema=claro; path=/";
document.cookie = "username=Ana; path=/";
console.log(document.cookie); // "tema=claro; username=Ana"
```

La segunda asignación no ha borrado `tema`. Ha sumado `username`. Si vuelves a asignar `username=Luis` con el mismo `path`, se sustituye el valor de esa cookie y `tema` sigue.

Un valor con espacio, acento o `=` rompe la cadena. `encodeURIComponent` lo deja en una pieza: `"Ana Pérez"` pasa a `"Ana%20P%C3%A9rez"`. Al leer, `decodeURIComponent` lo devuelve a la frase.

## Escribir

Los atributos van en la misma cadena, separados por punto y coma. El orden del ejemplo es el que usaremos:

| Trozo | Qué fija |
| --- | --- |
| `nombre=valor` | El par. Los dos lados van codificados |
| `max-age=604800` | Vida en segundos. 604800 es siete días. `0` la borra |
| `expires=…` | La misma idea, con una fecha en UTC. Hace falta si quieres una fecha concreta en vez de unos segundos |
| `path=/` | La cookie se envía en todo el sitio. Si omites `path`, solo vale para la carpeta de la página actual |
| `SameSite=Lax` | Se envía al entrar en el sitio. No se envía en una petición oculta lanzada desde otra web |
| `Secure` | Solo por HTTPS. En `http://localhost` no la pongas: el navegador puede no guardarla |

`HttpOnly` no se escribe desde JavaScript. Lo manda el servidor. Por eso una cookie de sesión bien puesta no sale en `document.cookie`.

```javascript
function setCookie(nombre, valor, dias) {
  const segundos = dias * 24 * 60 * 60;
  const trozos = [
    encodeURIComponent(nombre) + "=" + encodeURIComponent(valor),
    "max-age=" + segundos,
    "path=/",
    "SameSite=Lax",
  ];
  document.cookie = trozos.join("; ");
}
```

`join("; ")` deja la cadena `"username=Ana; max-age=604800; path=/; SameSite=Lax"`. Siete días es un número cómodo para mirar la caducidad en DevTools. Un año sería `365`.

La variante con fecha usa `Date`, que ya conoces. `setDate` mueve el día; si te pasas de mes, el objeto lo ajusta. `toUTCString()` es el formato que admite `expires`:

```javascript
function setCookieConFecha(nombre, valor, dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  document.cookie =
    encodeURIComponent(nombre) + "=" + encodeURIComponent(valor) +
    "; expires=" + fecha.toUTCString() +
    "; path=/; SameSite=Lax";
}
```

En la página de este apartado se usa `setCookie`, la de `max-age`. Las dos guardan el mismo par.

## Leer

Hay que partir la cadena, quitar el espacio que hay tras cada `;` y quedarse con el trozo que empieza por el nombre. El nombre se codifica igual que al guardar: si no, `"Ana Pérez"` como clave no coincidiría con lo que está escrito.

```javascript
function getCookie(nombre) {
  const clave = encodeURIComponent(nombre) + "=";
  const partes = document.cookie.split(";");

  for (const parte of partes) {
    const trozo = parte.trim();
    if (trozo.startsWith(clave)) {
      return decodeURIComponent(trozo.slice(clave.length));
    }
  }
  return null;
}
```

Con `"tema=claro; username=Ana"` y nombre `"username"`, el bucle salta `tema=claro`, encuentra `username=Ana` y devuelve `"Ana"`. Si no está, devuelve `null`. Una cadena vacía, que es lo que hay antes de la primera cookie, no empieza por la clave y también acaba en `null`.

## Borrar

Se vuelve a escribir **el mismo nombre y el mismo `path`**, con vida cero. Si el `path` no coincide con el de `setCookie`, la cookie original sigue en el navegador y `getCookie` la encuentra.

```javascript
function borrarCookie(nombre) {
  document.cookie =
    encodeURIComponent(nombre) + "=; max-age=0; path=/; SameSite=Lax";
}
```

## La página

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Cookies</title>
  </head>
  <body>
    <label for="usuario">Usuario</label>
    <input id="usuario" type="text">
    <button type="button" id="guardar">Guardar</button>
    <button type="button" id="leer">Leer</button>
    <button type="button" id="borrar">Borrar</button>
    <p id="salida"></p>
    <script src="cookies.js"></script>
  </body>
</html>
```

```javascript
const salida = document.querySelector("#salida");

document.querySelector("#guardar").addEventListener("click", () => {
  const usuario = document.querySelector("#usuario").value.trim();
  if (usuario.length === 0) {
    salida.textContent = "Escribe un usuario";
    return;
  }
  setCookie("username", usuario, 7);
  salida.textContent = "Guardado durante 7 días";
});

document.querySelector("#leer").addEventListener("click", () => {
  const usuario = getCookie("username");
  if (usuario) {
    salida.textContent = "Bienvenido, " + usuario;
  } else {
    salida.textContent = "No hay usuario guardado";
  }
});

document.querySelector("#borrar").addEventListener("click", () => {
  borrarCookie("username");
  salida.textContent = "Cookie borrada";
});
```

Recarga la página después de guardar y pulsa Leer: el párrafo saluda. El dato no está en el HTML. Está en la cookie. El temario clásico hacía lo mismo con `prompt` y `alert`; el cuadro y el párrafo de arriba dejan el resultado a la vista.

En DevTools: *Application* → *Cookies* (Chrome o Edge) o *Almacenamiento* (Firefox). Ahí se ven `path`, la caducidad y `SameSite`, que `document.cookie` no enseña.

## Cuándo no hace falta una cookie

Si el dato no tiene que ir al servidor, `localStorage` es el almacén de la UT3. No se monta la cadena a mano y no viaja en cada petición.

| Necesitas… | Herramienta |
| --- | --- |
| Que el servidor reciba el dato en cada petición | Cookie |
| Recordar un valor solo en este navegador (el color del ejercicio, un nombre de práctica) | `localStorage` |
| Recordarlo solo hasta cerrar la pestaña | `sessionStorage` |

```javascript
localStorage.setItem("username", usuario);
const leido = localStorage.getItem("username");
```

Si el enunciado dice «cookie», el código es `document.cookie`. Si solo hay que sobrevivir a una recarga y no hay servidor, Web Storage basta.

## Errores frecuentes

| Qué se ve | Qué ha pasado |
| --- | --- |
| Asignas la cookie y `document.cookie` sigue vacío | La página está en `file://`. Ábrela por `http://localhost` |
| La segunda cookie borra la primera | No debería. Cada asignación cambia un nombre. Si desaparece, estás leyendo otra página u otro `path` |
| `getCookie` devuelve `null` y en DevTools la cookie está | El `path` con el que se guardó no es el de esta página, o el nombre no se codificó igual al leer y al escribir |
| Borrar no borra | `borrarCookie` usa otro `path` que `setCookie`. Los dos tienen que ser `/` |
| En el `console.log` no sale `max-age` ni `path` | La lectura no incluye los atributos. Están en la pestaña *Application* |
| La cookie con `Secure` no aparece en local | `Secure` exige HTTPS. En el aula, no la pongas |
| Esperabas leer la cookie de sesión del servidor | Si es `HttpOnly`, JavaScript no la ve |

!!! example "Prueba en el navegador"
    Sirve `cookies.html` por localhost. Escribe un nombre, guarda, recarga y lee: el párrafo tiene que saludar. Borrar y leer: «No hay usuario guardado». En *Application* → *Cookies*, después de guardar, comprueba `path=/` y una caducidad a siete días.
