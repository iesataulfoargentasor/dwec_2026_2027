---
title: 2.2 Hola Mundo en JavaScript
tags:
  - JavaScript
  - DWEC
  - RA2
---

# 2.2. Hola Mundo en JavaScript

El “Hola Mundo” actual es una página **HTML5** con un script. El resultado lo vemos en la **consola** del navegador (`F12`), no pintando HTML con `document.write`.

## En el navegador

Crea un archivo `hola.html`:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hola Mundo</title>
  </head>
  <body>
    <h1>Hola Mundo</h1>
    <script src="saludo.js"></script>
  </body>
</html>
```

Y un archivo `saludo.js` en la misma carpeta:

```javascript
console.log("¡Hola mundo!");
```

Abre `hola.html` en el navegador y mira la consola. Deberías ver `¡Hola mundo!`.

!!! tip "Por qué el script al final del `body`"
    Así el HTML ya está parseado cuando corre el script. Más adelante usarás `type="module"` o el atributo `defer` en el `<script>` del `head`; el efecto es el mismo: el código espera a tener el documento listo.

### Script en la propia página

También puedes incrustar el código (útil en pruebas rápidas; en proyectos reales separamos HTML y JS):

```html
<script>
  console.log("¡Hola mundo!");
</script>
```

Ya **no** hace falta `type="text/javascript"`: en HTML5 el tipo por defecto de `<script>` es JavaScript. El atributo `language` y el DOCTYPE XHTML del material antiguo están fuera de uso.

## En Node.js

El mismo archivo `saludo.js` se ejecuta en terminal:

```bash
node saludo.js
```

Salida:

```text
¡Hola mundo!
```

En Node no existen `document`, `alert` ni `prompt`. `console.log` sí.

## Qué debes comprobar

1. El archivo se guarda como **UTF-8** (tildes y `¡` se ven bien).
2. La consola no muestra errores en rojo.
3. Sabes abrir DevTools y filtrar la pestaña **Console**.

!!! example "Práctica rápida"
    Escribe en consola `console.log("HOLA PROFESOR")` y, a continuación, carga el mismo mensaje desde `saludo.js`. Es el puente entre “probar una sentencia” y “un programa en un archivo”.
