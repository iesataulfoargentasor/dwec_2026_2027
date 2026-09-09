---
title: 3.9 Almacenamiento en el navegador
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.9. Almacenar y recuperar información

El criterio **g)** pide usar mecanismos del navegador para **guardar** datos y **volver a leerlos**. En el PDF de 2013 esto aparecía como “gestión de cookies” en la lista del BOM. Hoy hay tres herramientas: **cookies**, **`localStorage`** y **`sessionStorage`**.

## Cookies

Pequeños pares `nombre=valor` que el navegador guarda y, si corresponde, **envía al servidor** en cada petición.

Lectura/escritura clásica desde JS: la propiedad `document.cookie` (una cadena).

```javascript
document.cookie = "grupo=DAW2; path=/; max-age=86400"; // 1 día
console.log(document.cookie);
```

Limitaiones: ~4 KB, hay que parsear la cadena a mano, y sin flags (`Secure`, `HttpOnly`, `SameSite`) son un riesgo. `HttpOnly` no se puede poner desde JavaScript (precisamente para que el script no robe la cookie de sesión).

En DWEC las cookies sirven para entender el mecanismo. Para datos **solo de cliente** (último color elegido, nombre del ejercicio) usa Web Storage.

## `localStorage` y `sessionStorage`

Almacén de **cadenas** clave/valor, por origen (protocolo + host + puerto). No se mandan al servidor.

| | `localStorage` | `sessionStorage` |
| --- | --- | --- |
| Duración | Hasta que el usuario o el código lo borre | Hasta cerrar la pestaña |
| Visibilidad | Todas las pestañas del mismo origen | Solo esa pestaña |
| API | La misma | La misma |

```javascript
localStorage.setItem("colorFondo", "crimson");
const color = localStorage.getItem("colorFondo"); // "crimson" o null

localStorage.removeItem("colorFondo");
localStorage.clear(); // borra todas las claves de este origen
```

Solo guarda **strings**. Para objetos:

```javascript
const alumno = { nombre: "Alex", grupo: "DAW2" };
localStorage.setItem("alumno", JSON.stringify(alumno));

const leido = JSON.parse(localStorage.getItem("alumno"));
console.log(leido?.nombre);
```

`sessionStorage` se usa igual: `sessionStorage.setItem(...)`.

## Ejemplo unido al selector de color

```javascript
const select = document.querySelector("#color");
const guardado = localStorage.getItem("colorFondo");

if (guardado) {
  select.value = guardado;
  document.body.style.backgroundColor = guardado;
}

select.addEventListener("change", () => {
  document.body.style.backgroundColor = select.value;
  localStorage.setItem("colorFondo", select.value);
});
```

Al recargar, el fondo se restaura: has **almacenado** y **recuperado** información.

!!! warning "Privacidad y tamaño"
    No guardes contraseñas. El límite ronda los 5 MB por origen. En modo incógnito el almacenamiento puede vaciarse al cerrar.

!!! tip "Depuración"
    En DevTools → **Application** (Chrome/Edge) o **Almacenamiento** (Firefox) ves cookies, `localStorage` y `sessionStorage` en vivo. Es la forma más clara de verificar el criterio **g)** y de **documentar** qué clave has usado (criterio **h)**).
