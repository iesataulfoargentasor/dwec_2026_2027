---
title: 5.4 Apariencia y comportamiento
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.4. Modificación de apariencia y comportamiento

Un formulario ya sabe presentarse y ya sabe enviarse. Este apartado cambia las dos cosas a la vez, con el mismo dato: una casilla. El criterio **e)** pide reconocer esas capacidades.

Del [5.3](formularios.md) ya tienes `<form>`, `action`, `method`, `name`, `checked` y el hecho de que un control `disabled` no se envía. Del [5.1](modelo-eventos.md) y del [5.2](tipos-eventos.md) tienes `addEventListener`, el evento `change` y el evento `submit`. `classList` es el de la [UT3](../ut3/document.md): el script pone o quita una clase, y el color lo decide el CSS.

La página de trabajo es `gestion.html`. En la misma carpeta crea otros dos archivos, de una sola línea, para ver a dónde llega el envío:

```html
<!-- alta.html -->
<h1>Página de alta</h1>
```

```html
<!-- baja.html -->
<h1>Página de baja</h1>
```

## 5.4.1. Apariencia: agrupar y marcar el modo

`<fieldset>` dibuja un recuadro alrededor de controles que van juntos. `<legend>` es el título de ese recuadro. Un lector de pantalla anuncia el grupo al entrar en el primer campo.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Gestión</title>
    <style>
      form.modo-alta { background-color: #e7f6ec; }
      form.modo-baja { background-color: #fdecec; }
    </style>
  </head>
  <body>
    <form id="gestion" method="get">
      <p>
        <label>
          <input type="checkbox" id="es-alta" name="alta" value="si">
          Es un alta
        </label>
      </p>

      <fieldset id="datos-alta">
        <legend>Datos del alta</legend>
        <label for="nombre">Nombre</label>
        <input id="nombre" name="nombre" type="text">
      </fieldset>

      <button type="submit">Enviar</button>
      <button type="button" id="limpiar">Borrar</button>
    </form>

    <script>
      const form = document.querySelector("#gestion");
      const alta = document.querySelector("#es-alta");
      const datos = document.querySelector("#datos-alta");

      function refrescar() {
        if (alta.checked) {
          form.classList.add("modo-alta");
          form.classList.remove("modo-baja");
          datos.disabled = false;
          form.action = "alta.html";
        } else {
          form.classList.remove("modo-alta");
          form.classList.add("modo-baja");
          datos.disabled = true;
          form.action = "baja.html";
        }
      }

      alta.addEventListener("change", refrescar);
      refrescar();
    </script>
  </body>
</html>
```

`value="si"` es lo que viajará si la casilla está marcada. Sin `value`, el navegador enviaría `alta=on`.

### El grupo desactivado

`disabled` en el `<fieldset>` desactiva todos los controles de dentro. Se ven en gris, no cogen el foco y no se envían. La casilla, que está fuera del grupo, sigue pudiéndose marcar. En JavaScript es la propiedad `disabled`:

```javascript
datos.disabled = true;  // grupo apagado
datos.disabled = false; // grupo editable
```

### El color

`change` en la casilla salta al marcarla o desmarcarla. `refrescar()` también se llama al cargar la página, porque al abrirla la casilla está vacía y el aspecto tiene que nacer ya en «baja»: fondo `#fdecec`, campos del alta desactivados y destino `baja.html`. Al marcarla, el fondo pasa a verde, el nombre se puede escribir y el destino pasa a ser `alta.html`.

El script no asigna `style.backgroundColor` en cada rama. Cambia la clase `modo-alta` o `modo-baja`, y el `<style>` del `<head>` decide el color. Así el aspecto sigue estando en CSS.

## 5.4.2. A dónde se envía

`form.action` y `form.method` son las propiedades de los atributos del apartado 5.3. Se leen y se escriben.

Al asignar, basta el nombre del archivo: `form.action = "alta.html"`. Al leer `form.action`, el navegador devuelve la URL completa (`http://…/alta.html` o `file:///…/alta.html`). Es el mismo destino. Una ruta larga en el `console.log` no significa que se haya perdido el nombre corto.

`form.method = "post"` cambiaría el método. Este ejercicio lo deja en `get` para que los datos se vean en la barra de direcciones.

El botón Enviar es `type="submit"`. El navegador dispara `submit` y, si nadie lo cancela con `preventDefault()`, envía a la `action` de ese momento. Se vuelve a llamar a `refrescar()` dentro del evento, para que el destino coincida con la casilla justo antes de salir:

```javascript
form.addEventListener("submit", () => {
  refrescar();
});
```

No pongas `preventDefault()` en este manejador: si lo pones, la página no cambia y no podrás comprobar `alta.html` ni `baja.html`.

Qué tienes que ver:

| Casilla | Página | URL |
| --- | --- | --- |
| Marcada, nombre Alex | `alta.html` | `alta.html?alta=si&nombre=Alex` |
| Sin marcar | `baja.html` | `baja.html` sin `nombre`, porque el grupo estaba desactivado |

## 5.4.3. Enviar y borrar desde el script

El envío también se puede pedir sin pulsar Enviar. Los dos métodos no son intercambiables:

| Cómo se envía | ¿Salta el evento `submit`? | ¿El navegador frena un campo `required` vacío? |
| --- | --- | --- |
| Pulsar `<button type="submit">` | Sí | Sí |
| `form.requestSubmit()` | Sí | Sí. Hace lo mismo que pulsar Enviar |
| `form.submit()` | No | No. Envía en el acto, con los datos como estén |

`requestSubmit()` es el que encaja cuando otro botón debe provocar el envío normal. Los manejadores de `submit` del apartado 5.5 se ejecutan, y un `required` vacío detiene la salida:

```html
<button type="button" id="otro">Enviar desde aquí</button>
```

```javascript
document.querySelector("#otro").addEventListener("click", () => {
  form.requestSubmit();
});
```

`form.submit()` no avisa a esos manejadores. Un `preventDefault()` enganchado a `submit` no llega a ejecutarse. Reserva `submit()` para un envío que ya has decidido tú, después de comprobar los datos. Esas comprobaciones son el apartado 5.5.

Borrar es la operación inversa. `form.reset()` devuelve cada control al valor que tenía en el HTML y después tu código puede volver a pintar el modo. El botón tiene que ser `type="button"`: si fuera `type="reset"`, el navegador borraría por su cuenta y además ejecutaría el `click`.

```javascript
document.querySelector("#limpiar").addEventListener("click", () => {
  form.reset();
  refrescar();
});
```

`reset()` termina antes de la línea siguiente. `refrescar()` ya ve la casilla desmarcada, apaga el grupo, pone el fondo de baja y deja `action` en `baja.html`.

Un `<button type="reset">` hace el borrado sin script. No dispara `change`, así que el color no se entera. En este ejercicio el borrado pasa por `#limpiar`, que sí llama a `refrescar()`.

## Errores frecuentes

| Qué se ve | Qué ha pasado |
| --- | --- |
| El clic en Enviar no sale de `gestion.html` | Hay un `preventDefault()` en el `submit`, o el botón es `type="button"` y nadie llama a `requestSubmit()` |
| Siempre se abre la misma página | `refrescar()` no está en el `submit` y la `action` se quedó en el valor anterior |
| `console.log(form.action)` muestra `file:///` o `http://` | Es la URL completa. La asignación `form.action = "alta.html"` sigue siendo correcta |
| El nombre viaja también en la baja | El `<fieldset>` no está `disabled`. Los campos desactivados son los que no se envían |
| La URL lleva `alta=on` | A la casilla le falta `value="si"` |
| `form.submit()` ignora el `required` y tus manejadores | Es lo que hace ese método. Para el envío normal usa el botón `submit` o `requestSubmit()` |
| Tras pulsar un `type="reset"` el color no cambia | `reset` no dispara `change`. Hay que llamar a `refrescar()` después de `form.reset()` |

!!! example "Prueba en el navegador"
    Abre `gestion.html` al lado de `alta.html` y `baja.html`. Sin marcar la casilla, envía: tienes que llegar a la página de baja y la URL no lleva `nombre`. Vuelve atrás, marca la casilla, escribe un nombre y envía: la página de alta y la URL con `alta=si`. Pulsa Borrar y comprueba que el fondo vuelve al de baja antes de enviar otra vez.
