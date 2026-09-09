---
title: 5.1 Modelo de gestión de eventos
tags:
  - JavaScript
  - DWEC
  - RA5
---

# 5.1. Modelo de gestión de eventos

Un **evento** es un suceso que el navegador notifica: el usuario hace clic, pulsa una tecla, envía un formulario, la página termina de cargar…

Para **controlarlo** hace falta un **manejador**: la función que se ejecuta cuando ocurre ese suceso. El nombre clásico del manejador de `click` es `onclick` (el prefijo `on` + el tipo de evento).

El criterio **a)** pide reconocer cómo el **HTML** captura eventos. El **b)** pide las características de **JavaScript** para gestionarlos. Aquí ves las dos vías; en código actual se prefiere la segunda.

## Captura desde el lenguaje de marcas

Puedes asociar el manejador **en el propio HTML**:

```html
<img src="mundo.jpg" alt="Planeta" onclick="alert('Clic en la imagen');">
```

O llamar a una función:

```html
<button type="button" onclick="saludar()">Saludar</button>

<script>
  function saludar() {
    alert("Clic en el botón");
  }
</script>
```

Otros atributos habituales: `onchange`, `onsubmit`, `onkeydown`, `onload`…

!!! warning "Por qué no es la forma recomendada"
    Mezcla HTML y JavaScript, solo admite **un** manejador por atributo y complica las comillas. Sirve para entender el criterio **a)** y código legado. En ejercicios nuevos usa `addEventListener`.

## Captura desde JavaScript: `addEventListener`

```html
<button type="button" id="btnSaludo">Saludar</button>

<script>
  const boton = document.querySelector("#btnSaludo");

  boton.addEventListener("click", () => {
    alert("Clic en el botón");
  });
</script>
```

Ventajas:

- Varios escuchadores sobre el mismo elemento y el mismo evento.
- El HTML no lleva código.
- Puedes **quitar** el escuchador con `removeEventListener` si guardas la misma función.

```javascript
function avisar() {
  console.log("Clic");
}

boton.addEventListener("click", avisar);
boton.removeEventListener("click", avisar);
```

!!! tip "Cuándo registrar el escuchador"
    El script debe ejecutarse **después** de que exista el elemento. Coloca el `<script>` al final del `body`, usa el atributo `defer` o espera a [`DOMContentLoaded`](tipos-eventos.md#eventos-de-documento-y-ventana).

## El objeto `event`

El navegador pasa al manejador un objeto **`Event`** (a menudo `MouseEvent`, `KeyboardEvent`, `SubmitEvent`…).

```javascript
boton.addEventListener("click", (event) => {
  console.log(event.type);          // "click"
  console.log(event.target);        // elemento que originó el evento
  console.log(event.currentTarget); // elemento al que está enganchado el listener
  event.preventDefault();           // cancela la acción por defecto
});
```

| Propiedad / método | Para qué sirve |
| --- | --- |
| `type` | Nombre del evento (`"click"`, `"submit"`…) |
| `target` | Nodo donde **ocurrió** el suceso |
| `currentTarget` | Nodo que tiene **este** listener |
| `preventDefault()` | Evita la acción por defecto (seguir un enlace, enviar el form…) |
| `stopPropagation()` | Impide que el evento siga subiendo por el árbol |

En un `<form>`, `preventDefault()` en `submit` es la forma habitual de **validar en el cliente** y no recargar la página si hay errores (apartado [5.5](validacion.md)).

## Propagación: captura y burbuja

El evento recorre el DOM en dos fases:

1. **Captura:** de `window` hacia el elemento origen.
2. **Burbuja:** del origen hacia arriba (es la fase por defecto).

```javascript
padre.addEventListener("click", () => console.log("padre"));
hijo.addEventListener("click", () => console.log("hijo"));
// Clic en hijo: primero "hijo", luego "padre" (burbuja)
```

El tercer argumento `true` registra el listener en fase de **captura**. En DWEC basta con conocer que existe; casi todo el código de prácticas usa burbuja.

```javascript
document.addEventListener("click", manejador, true); // captura
```

## Tres formas que debes distinguir

| Forma | Ejemplo | Uso |
| --- | --- | --- |
| Atributo HTML | `onclick="f()"` | Criterio **a)**; código antiguo |
| Propiedad DOM | `boton.onclick = f` | Solo **un** manejador; se pisa si asignas otra |
| `addEventListener` | `boton.addEventListener("click", f)` | Forma actual (criterio **b)** y **d)**) |

```javascript
// Propiedad: la segunda asignación sustituye a la primera
boton.onclick = () => console.log("A");
boton.onclick = () => console.log("B"); // solo se ejecuta B
```
