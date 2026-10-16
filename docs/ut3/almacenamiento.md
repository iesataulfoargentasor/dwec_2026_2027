---
title: 3.9 Almacenamiento en el navegador
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.9. Almacenar y recuperar información

Hasta ahora, las variables y los cambios de la página se perdían al cargar un documento nuevo. El almacenamiento del navegador permite **guardar datos y recuperarlos en otra ejecución**: recordar una preferencia, conservar un borrador temporal o continuar una actividad.

Este apartado desarrolla el criterio **g)** del [RA3](ra3.md), dedicado al almacenamiento y recuperación de información, y el criterio **h)**, sobre depuración y documentación. Se corresponde con el módulo **0612, Desarrollo web en entorno cliente**, del CFGS de Desarrollo de Aplicaciones Web, en el [Real Decreto 405/2023](https://www.boe.es/eli/es/rd/2023/05/29/405) y el currículo de Cantabria de la [Orden EDU/72/2025](https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=425244).

!!! note "Alcance del apartado"
    Necesitas variables, condiciones, cadenas, `prompt` y `document.getElementById`. Para localizar elementos del DOM usaremos únicamente este método, tanto en los ejemplos como en el ejercicio. El caso resuelto y el ejercicio obligatorio no requieren arrays, funciones de usuario ni eventos. Reutilizamos los objetos literales y los métodos JSON estudiados en 3.1: guardar y recuperar objetos es parte obligatoria de ambas prácticas. Las cookies se desarrollan con más detalle en la [UT5](../ut5/cookies.md).

## Recordatorio: localizar un elemento por su identificador

Si el HTML contiene `<p id="estado">Preparando la lectura.</p>`, podemos obtener ese párrafo así:

```javascript
const estado = document.getElementById("estado");
if (estado !== null) {
  estado.textContent = "Lectura preparada.";
}
```

El argumento `"estado"` es el valor del atributo `id`, **sin `#`**. El método devuelve el elemento o `null` si no lo encuentra. La variable guarda la referencia al párrafo; `textContent` permite cambiar su texto, pero no es otro método para buscar elementos.

Para cambiar la apariencia usaremos la propiedad `style` del cuerpo de la página, localizado también por su `id`. Modificar `style` o `textContent` no es buscar otro elemento. Coloca el script al final del `body` para que los elementos existan cuando se ejecute.

## Antes de probar: elegir qué debe conservarse

| Necesidad | Mecanismo adecuado en estos ejemplos |
| --- | --- |
| Recordar un tema de lectura entre visitas | `localStorage` |
| Conservar la actividad actual durante la sesión de una pestaña | `sessionStorage` |
| Enviar un dato pequeño al servidor con las peticiones que correspondan | Cookie |
| Mantener un valor solo mientras se ejecuta el documento | Variable de JavaScript |

No son las únicas tecnologías disponibles: existen también IndexedDB y Cache API para otros usos. Aquí nos centraremos en cookies y **Web Storage**, suficiente para practicar el RA3.g con datos pequeños.

Ejecuta las prácticas desde un **servidor local HTTP** o un sitio HTTPS, usando siempre el mismo origen. No uses `file:` para comparar resultados: su comportamiento de almacenamiento no es una base portable. Cada ejemplo es independiente; no pegues todos los bloques en el mismo script.

## Cookies

Una cookie es un pequeño dato asociado a un ámbito de servidor y ruta. El navegador la envía automáticamente en las peticiones que cumplen sus reglas. Se puede establecer desde el servidor con la cabecera `Set-Cookie` o, con limitaciones, desde JavaScript mediante `document.cookie`.

### Escritura, lectura y eliminación

En una página de prácticas servida por HTTP local:

```javascript
// Cookie de práctica válida durante un día.
document.cookie = "dwec_ut3_grupo=DAW2; Path=/; Max-Age=86400; SameSite=Lax";
console.log(document.cookie);
```

`86400` es la duración en **segundos**. `Path=/` abarca las rutas del sitio. Asignar `document.cookie` establece una cookie; no reemplaza todas las demás. Al leerlo se obtiene una cadena con los pares accesibles, separados por `;`, no sus atributos ni las cookies `HttpOnly`.

Para eliminar esta cookie, ejecuta por separado:

```javascript
document.cookie = "dwec_ut3_grupo=; Path=/; Max-Age=0; SameSite=Lax";
```

La eliminación debe coincidir en nombre, ruta y dominio con la cookie original. Aquí no se indicó `Domain` en ninguna operación. No confundas asignar un valor vacío con eliminar: lo que la caduca es `Max-Age=0`.

### Atributos que debes reconocer

| Atributo | Función |
| --- | --- |
| `Max-Age` / `Expires` | Duración en segundos o fecha de caducidad |
| `Path` / `Domain` | Ámbito de envío; la ruta no es una frontera de seguridad |
| `Secure` | Restringe el envío a conexiones seguras, con el tratamiento especial que aplican los navegadores a localhost |
| `HttpOnly` | Impide que JavaScript lea la cookie; lo establece el servidor |
| `SameSite` | Regula el envío en contextos entre sitios: `Lax`, `Strict` o `None` |

En producción HTTPS, las cookies que lo requieran deben configurarse con `Secure`. `SameSite=None` requiere `Secure`; no es una opción que haya que activar por defecto. `HttpOnly` reduce la exposición del valor a scripts, pero no elimina todos los efectos de un ataque XSS.

Las cookies tienen límites pequeños, habitualmente alrededor de 4 KiB por cookie, y no son apropiadas para grandes documentos. Tampoco comparten exactamente el aislamiento por origen de Web Storage: por ejemplo, **no se separan por puerto**. El valor puede necesitar codificación si contiene caracteres especiales; interpretar correctamente la cadena se verá en la UT5.

Para una preferencia que solo necesita el cliente, como el tema de lectura, Web Storage evita añadir ese dato automáticamente a las peticiones.

## `localStorage` y `sessionStorage`

Ambos proporcionan almacenes de **cadenas clave/valor**. La clave identifica el dato; el valor es su contenido. Son objetos accesibles desde `window`, aunque normalmente escribimos directamente `localStorage` y `sessionStorage`.

### Duración y ámbito

| Característica | `localStorage` | `sessionStorage` |
| --- | --- | --- |
| Ámbito básico | Origen y perfil del navegador | Origen y sesión de pestaña |
| Recargar la página | Conserva los datos | Conserva los datos |
| Nueva pestaña independiente del mismo origen | Accede a los mismos datos locales | Tiene su propia sesión |
| Cerrar y volver a visitar | Normalmente conserva los datos | Normalmente termina al cerrar la pestaña |
| API | Métodos de `Storage` | Los mismos métodos |

`localStorage` no tiene una caducidad automática por clave. Eso no garantiza conservación permanente: el usuario, las políticas del navegador o la limpieza de datos pueden eliminarlo. No es una copia de seguridad ni se sincroniza por sí solo entre equipos o perfiles.

Una pestaña abierta desde otra que conserva `opener` puede recibir una **copia inicial** de su `sessionStorage`; después ambos almacenes evolucionan por separado. La restauración de sesiones también puede recuperar datos. Por eso, para probar sesiones independientes, abre una pestaña nueva desde el navegador y escribe la URL; no uses «Duplicar pestaña» ni «Reabrir pestaña cerrada» como prueba de un almacén vacío.

### Qué significa «por origen»

`http://localhost:8000/` y `http://localhost:8001/` tienen almacenes distintos. También cambian al pasar de HTTP a HTTPS o de `localhost` a `127.0.0.1`. En cambio, dos rutas del mismo origen comparten el `localStorage`: la carpeta del proyecto no crea un almacén propio.

Utilizaremos claves como `dwec.ut3.lectura.tema` para evitar colisiones con otras prácticas. El prefijo **organiza nombres**, no impide que otro script del mismo origen acceda a ellos. En marcos de terceros pueden aplicarse restricciones o particiones adicionales; los ejemplos se ejecutan como páginas propias de primer nivel.

Web Storage no se envía automáticamente al servidor. Un script sí podría leerlo y enviarlo explícitamente, por lo que «solo en el navegador» no significa «inaccesible para el código».

### Crear, recuperar, modificar y borrar

| Miembro | Uso | Resultado |
| --- | --- | --- |
| `setItem(clave, valor)` | Guarda o sustituye el valor de esa clave | No devuelve una confirmación; puede lanzar un error |
| `getItem(clave)` | Lee un valor | Cadena o `null` si no existe |
| `removeItem(clave)` | Borra una clave concreta | Si no existía, no hace falta crearla ni produce error por esa ausencia |
| `clear()` | Vacía el almacén sobre el que se llama | Afecta a todas sus claves, no solo a las de esta práctica |
| `length` | Consulta cuántas claves hay | Número; es una propiedad, sin paréntesis |
| `key(indice)` | Consulta el nombre de una clave | Cadena o `null`; no presupongas un orden fijo |

```javascript
localStorage.setItem("dwec.ut3.demo.tema", "claro");
console.log(localStorage.getItem("dwec.ut3.demo.tema")); // "claro"

localStorage.setItem("dwec.ut3.demo.tema", "oscuro");
console.log(localStorage.getItem("dwec.ut3.demo.tema")); // "oscuro"

localStorage.removeItem("dwec.ut3.demo.tema");
console.log(localStorage.getItem("dwec.ut3.demo.tema")); // null
```

Este bloque demuestra el ciclo completo y **termina sin la clave**. Para comprobar persistencia, ejecuta solo la escritura, recarga y después realiza la lectura. Las prácticas completas incluyen manejo de errores; en estos bloques breves se presupone almacenamiento disponible.

Evita `clear()` en el sitio de clase: podrías borrar preferencias de otras unidades que comparten origen. Tampoco borra cookies ni vacía el otro almacén. Prefiere siempre `removeItem` con la clave concreta.

### Ausencia, cadena vacía y conversión de tipos

```javascript
sessionStorage.setItem("dwec.ut3.demo.nota", "");
const nota = sessionStorage.getItem("dwec.ut3.demo.nota");
console.log(nota === "");   // true: existe y está vacía
console.log(nota === null); // false: no está ausente
sessionStorage.removeItem("dwec.ut3.demo.nota");
```

Comprueba `=== null` si quieres saber si falta una clave. `if (nota)` no distingue todos los casos que pueden interesarte.

```javascript
localStorage.setItem("dwec.ut3.demo.intentos", 2);
const texto = localStorage.getItem("dwec.ut3.demo.intentos");
console.log(typeof texto);      // "string"
console.log(texto + 1);         // "21"
console.log(Number(texto) + 1); // 3
localStorage.removeItem("dwec.ut3.demo.intentos");
```

También `false` se guarda como `"false"`, que es una cadena no vacía y se considera verdadera al usarla como condición. Compara con el texto esperado o realiza una conversión validada. Si falta una clave, `Number(null)` da `0`: comprueba primero la ausencia para no confundirla con un dato numérico real.

### Cuando guardar o leer falla

El acceso puede estar restringido y una escritura puede superar la cuota. Por eso, que exista la API no demuestra que puedas usarla en ese momento.

```javascript
try {
  localStorage.setItem("dwec.ut3.demo.estado", "preparado");
  console.log("Guardado:", localStorage.getItem("dwec.ut3.demo.estado"));
  localStorage.removeItem("dwec.ut3.demo.estado");
} catch (error) {
  console.error("No se pudo completar la operación de almacenamiento:", error);
}
```

`try` contiene las operaciones que pueden fallar; `catch` informa del error. No da permiso para guardar ni revierte operaciones anteriores. Si haces dos escrituras y falla la segunda, la primera puede haberse completado: Web Storage no ofrece una transacción que agrupe ambas.

Como referencia, Web Storage suele disponer de unos **5 MiB para cada almacén por origen**, pero las cuotas y restricciones efectivas dependen del entorno. No programes suponiendo capacidad ilimitada. `QuotaExceededError` suele indicar un problema de cuota y `SecurityError`, una restricción de acceso. En navegación privada los datos suelen eliminarse al terminar la sesión privada; no asumas que la API está siempre deshabilitada.

### Objetos y JSON: guardar y recuperar una ficha

Web Storage guarda **cadenas**, no objetos JavaScript. Para conservar juntas varias propiedades utilizamos lo estudiado en [3.1 Objetos nativos](objetos-nativos.md):

- `JSON.stringify(objeto)` produce una cadena con la representación JSON del objeto.
- `JSON.parse(texto)` interpreta una cadena JSON y devuelve el valor representado. No lee el almacenamiento: primero hay que obtener el texto con `getItem`.

```javascript
const preferencias = { tema: "oscuro", tamano: 20 };
const texto = JSON.stringify(preferencias);
localStorage.setItem("dwec.ut3.prueba.json", texto);
console.log(texto);        // {"tema":"oscuro","tamano":20}
console.log(typeof texto); // "string"
```

En otra ejecución, recuperamos el texto y reconstruimos el objeto:

```javascript
const textoGuardado = localStorage.getItem("dwec.ut3.prueba.json");
if (textoGuardado !== null) {
  try {
    const recuperado = JSON.parse(textoGuardado);
    if (recuperado !== null && typeof recuperado === "object"
        && (recuperado.tema === "claro" || recuperado.tema === "oscuro")
        && (recuperado.tamano === 16 || recuperado.tamano === 20)) {
      console.log(recuperado.tema);
      console.log(recuperado.tamano + 2); // 22 si se guardó 20
    } else {
      console.log("El JSON no contiene unas preferencias válidas.");
    }
  } catch (error) {
    console.log("El texto guardado no es JSON válido.");
  }
}
```

Este fragmento se centra en JSON y supone que el acceso al almacén está permitido; el caso completo también controla los errores de acceso. Para terminar la prueba, elimina únicamente `dwec.ut3.prueba.json` con `removeItem`.

El número `20` sigue siendo un número después de `parse`, y un booleano como `false` seguiría siendo booleano. En cambio, si se guardó la propiedad `"tamano":"20"`, se recupera una cadena. JSON conserva los tipos representados; **no corrige los datos**.

No pases el objeto directamente a `setItem`: un objeto literal ordinario se convierte en `"[object Object]"`, que no contiene sus propiedades y no es JSON válido. Tampoco basta con que `parse` no falle: `null`, `25` o `{"tema":"azul"}` son JSON válido, pero no son la ficha que espera nuestro programa. Primero comprobamos que hay un objeto no nulo y después sus propiedades. El operador `&&` evita consultar las propiedades cuando las comprobaciones anteriores fallan.

!!! note "Usar métodos no es definir funciones"
    Aquí llamamos a métodos ya disponibles, como `JSON.parse`, `JSON.stringify` o `getItem`. No declaramos funciones propias, funciones flecha ni manejadores de eventos. El código se ejecuta de arriba abajo al cargar la página; para repetir la interacción, recargamos.

## Caso práctico resuelto: recordar el tema de lectura

Vamos a recordar **el tema y el tamaño del texto juntos**. Usaremos un objeto con dos propiedades y lo guardaremos como JSON en `localStorage`. Al volver a la página lo recuperaremos con `JSON.parse`, validaremos su contenido y lo aplicaremos al documento.

| Decisión | Valor |
| --- | --- |
| Clave | `dwec.ut3.lectura.preferencias` |
| Objeto inicial | `{ tema: "claro", tamano: 16 }` |
| Temas admitidos | `claro` y `oscuro` |
| Tamaños admitidos | Números `16` y `20`, en píxeles |
| Cancelar cualquiera de los dos `prompt` | No escribir ni borrar; conservar la configuración preparada |
| Orden `borrar` en el primer diálogo | Eliminar solo esta clave y aplicar los valores iniciales |
| Error al guardar o borrar | Informar y conservar la configuración preparada |

La clave es distinta de la antigua `dwec.ut3.lectura.tema`, que contenía solo una cadena. El programa no utiliza ni elimina esa clave antigua. Prueba los dos archivos desde un servidor local, con el mismo origen entre ejecuciones.

**`lectura.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Preferencias de lectura</title>
  <style>body { font-family: sans-serif; line-height: 1.6; padding: 2rem; }</style>
</head>
<body id="pagina">
  <h1>Mi espacio de lectura</h1>
  <p>El tema y el tamaño del texto se recuerdan entre visitas.</p>
  <p id="estado" role="status">Preparando la lectura.</p>
  <p>Recarga para cambiar las preferencias. Escribe borrar para olvidarlas.</p>
  <script src="lectura.js"></script>
</body>
</html>
```

**`lectura.js`**

```javascript
const clave = "dwec.ut3.lectura.preferencias";
const pagina = document.getElementById("pagina");
const estado = document.getElementById("estado");
let preferencias = { tema: "claro", tamano: 16 };
let mensaje = "No había preferencias guardadas. Se usan los valores iniciales.";
let textoGuardado = null;
let lecturaDisponible = true;

// 1. Leer la cadena. La ausencia de clave no es un error.
try {
  textoGuardado = localStorage.getItem(clave);
} catch (error) {
  lecturaDisponible = false;
  mensaje = "No se pudo acceder al almacenamiento. Se usan los valores iniciales.";
}

// 2. Reconstruir el objeto y comprobar sus propiedades.
if (lecturaDisponible && textoGuardado !== null) {
  try {
    const dato = JSON.parse(textoGuardado);
    if (dato !== null && typeof dato === "object"
        && (dato.tema === "claro" || dato.tema === "oscuro")
        && (dato.tamano === 16 || dato.tamano === 20)) {
      preferencias = dato;
      mensaje = "Preferencias recuperadas del JSON guardado.";
    } else {
      mensaje = "La estructura o los valores no son válidos. Se usan los valores iniciales.";
    }
  } catch (error) {
    mensaje = "El texto guardado no es JSON válido. Se usan los valores iniciales.";
  }
}

// 3. Pedir datos. Solo guardamos cuando ambos son válidos.
if (lecturaDisponible) {
  const entradaTema = prompt("Tema: claro, oscuro o borrar", preferencias.tema);
  if (entradaTema === null) {
    mensaje += " Cambio cancelado; no se modifica el almacenamiento.";
  } else {
    const temaElegido = entradaTema.trim().toLowerCase();
    if (temaElegido === "borrar") {
      try {
        localStorage.removeItem(clave);
        preferencias = { tema: "claro", tamano: 16 };
        mensaje = "Preferencias eliminadas. Se usan los valores iniciales.";
      } catch (error) {
        mensaje += " No se pudo borrar; se conserva la configuración preparada.";
      }
    } else if (temaElegido === "claro" || temaElegido === "oscuro") {
      const entradaTamano = prompt("Tamaño del texto: 16 o 20", String(preferencias.tamano));
      if (entradaTamano === null) {
        mensaje += " Cambio cancelado; no se modifica el almacenamiento.";
      } else {
        const tamanoElegido = Number(entradaTamano.trim());
        if (tamanoElegido === 16 || tamanoElegido === 20) {
          const nuevas = { tema: temaElegido, tamano: tamanoElegido };
          try {
            const textoNuevo = JSON.stringify(nuevas);
            localStorage.setItem(clave, textoNuevo);
            preferencias = nuevas;
            mensaje = "Preferencias guardadas correctamente como JSON.";
          } catch (error) {
            mensaje += " No se pudo guardar; se conserva la configuración preparada.";
          }
        } else {
          mensaje += " Tamaño no válido; no se guarda ningún cambio.";
        }
      }
    } else {
      mensaje += " Tema no válido; no se guarda ningún cambio.";
    }
  }
}

// 4. Aplicar el objeto preparado a los elementos localizados por su id.
if (pagina !== null) {
  if (preferencias.tema === "oscuro") {
    pagina.style.backgroundColor = "#202124";
    pagina.style.color = "#f1f3f4";
  } else {
    pagina.style.backgroundColor = "#ffffff";
    pagina.style.color = "#202124";
  }
  pagina.style.fontSize = preferencias.tamano + "px";
}
if (estado !== null) {
  estado.textContent = mensaje + " Tema: " + preferencias.tema
    + ". Tamaño: " + preferencias.tamano + " px.";
}
```

### Lectura del resultado

1. **Primera visita:** si la clave no existe, `getItem` devuelve `null`. Se prepara el objeto inicial; todavía no se escribe nada.
2. **Guardar:** introduce `oscuro` y `20`. `Number` convierte el segundo dato del diálogo en número. `stringify` genera `{"tema":"oscuro","tamano":20}` y `setItem` guarda esa cadena. Solo después de una escritura correcta se aplica el nuevo objeto.
3. **Recuperar:** recarga y pulsa Cancelar en el primer diálogo. `getItem` obtiene la cadena, `parse` reconstruye el objeto y la validación permite aplicar oscuro y 20 px. Cancelar conserva lo recuperado.
4. **Evitar cambios parciales:** si eliges claro pero cancelas el tamaño o introduces `18`, se conserva toda la configuración anterior. No se guarda el tema por separado.
5. **Borrar:** escribe `borrar`. Se elimina esa clave y se aplica claro con 16 px; no se vuelve a guardar el objeto inicial. Las otras claves permanecen intactas.
6. **Datos alterados:** cambia el valor desde las herramientas del navegador y recarga. Con `{` falla `parse`; con `{"tema":"azul","tamano":16}` se interpreta el JSON, pero falla la validación. En ambos casos se preparan los valores iniciales. Cancelar conserva el texto incorrecto; una nueva elección válida lo sustituye y `borrar` lo elimina.

| Prueba | Resultado esperado |
| --- | --- |
| Sin clave; Cancelar | Claro, 16 px y clave ausente |
| ` OSCURO ` y `20` | Objeto normalizado guardado como JSON; oscuro, 20 px |
| Recarga; Cancelar | Recuperación del objeto guardado |
| Tema válido; Cancelar en tamaño | Ninguna escritura parcial |
| Tema vacío, `azul`, tamaño vacío o `18` | Aviso y configuración anterior |
| JSON `null` o `{"tema":"claro","tamano":"20"}` | Respaldo: claro, 16 px; tipos incorrectos rechazados |
| Texto `{` | Aviso de JSON inválido sin detener el script |
| `borrar` | Solo se elimina la clave de la práctica |
| Acceso al almacén restringido | Respaldo y aviso; no se solicitan cambios |
| Escritura o borrado fallidos | Aviso sin anunciar éxito ni cambiar la configuración preparada |

El valor guardado sigue siendo una cadena. Las propiedades pertenecen al objeto reconstruido, no al texto: `textoGuardado.tamano` no recupera el tamaño. Esta separación entre **objeto → texto → almacenamiento → texto → objeto** es lo que debes saber explicar.

## Ejercicio propuesto: ficha de una actividad de estudio

### Contexto

Crea `estudio.html` y `estudio.js` para conservar la ficha de una actividad durante la sesión de una pestaña. Al recargar, la página debe recuperar y mostrar la ficha anterior. En esta práctica usarás `sessionStorage`, mientras que el caso resuelto utiliza `localStorage`.

La ficha tendrá esta estructura de ejemplo (no es la solución del programa):

```javascript
const ficha = { nombre: "Repasar objetos nativos", minutos: 25, completada: false };
```

Las tres propiedades deben guardarse juntas como JSON bajo la clave `dwec.ut3.estudio.ficha`. Necesitarás **tanto `JSON.stringify` como `JSON.parse`**. No se requieren arrays, funciones propias ni eventos.

### Requisitos obligatorios

1. Incluye párrafos con los identificadores `nombre`, `minutos`, `completada` y `estado`. Localízalos exclusivamente con `document.getElementById` y muestra los datos con `textContent`. Sitúa el script al final del `body`.
2. Prepara una ficha inicial: nombre `"Sin actividad"`, minutos `0` y completada `false`. Es un respaldo visual; no se guarda automáticamente ni es una ficha válida para recuperar.
3. Lee la clave. Si no existe, muestra el respaldo. Si existe, usa `JSON.parse` dentro de `try/catch` y valida: objeto no nulo, nombre de tipo cadena no vacío tras `trim`, minutos de tipo número entero entre 1 y 120 y completada de tipo booleano. Un JSON válido con propiedades incorrectas también debe rechazarse.
4. Pide el nombre mediante `prompt`. Cancelar conserva la ficha preparada. Un nombre vacío no se acepta. Reserva la entrada `borrar` (ignorando espacios y mayúsculas) para eliminar únicamente la clave de esta práctica y mostrar el respaldo, solo si el borrado tiene éxito.
5. Para un nombre válido, pide los minutos con otro `prompt`; convierte y valida el dato. Cancelar o introducir un valor incorrecto no debe guardar siquiera el nombre.
6. Tras validar nombre y minutos, usa `confirm("¿Has completado la actividad?")`. Aquí **Aceptar significa `true` y Cancelar significa `false`**: ambos son respuestas válidas, no una cancelación de la edición. Guarda el booleano directamente en la propiedad `completada`.
7. Construye la nueva ficha, conviértela con `JSON.stringify` y guárdala con `setItem`. Sustituye la ficha preparada y anuncia el éxito solo después de guardar correctamente.
8. Controla los errores de lectura, JSON, escritura y borrado. Si no puedes leer el almacén, muestra el respaldo y no solicites cambios. Si falla guardar o borrar, conserva la ficha preparada e informa. Con JSON incorrecto puedes permitir una nueva ficha válida o el borrado; Cancelar no debe modificar el texto almacenado.
9. Muestra el estado de finalización como `"Completada"` o `"Pendiente"`. La presentación debe partir de la ficha preparada después de todas las comprobaciones.

### Pistas de diseño

- Sigue cuatro fases: preparar el respaldo, recuperar y validar, solicitar y guardar, mostrar. Escribe instrucciones y condiciones consecutivas, sin declarar funciones.
- Comprueba `entrada === null` antes de llamar a `trim`: Cancelar no devuelve una cadena.
- Para el número recuperado, comprueba su tipo y después `Number.isInteger(valor)` y los límites. Para la entrada de `prompt`, convierte con `Number`; vacío se convierte en 0 y queda fuera del intervalo.
- No conviertas el dato recuperado antes de validarlo: `"25"` en el JSON debe rechazarse porque se exige un número. Tampoco uses `Boolean("false")`, que devuelve `true`; exige que la propiedad sea booleana.
- El orden de las comprobaciones importa: primero objeto no nulo, después tipos de propiedades, por último métodos de cadenas y límites numéricos.
- Utiliza una variable para la nueva ficha. Si cambias la ficha preparada antes de guardar y falla la escritura, mostrarías como guardados datos que no persistieron.
- No uses `clear()`: en el mismo origen pueden convivir otras prácticas.

### Casos que debes probar

| Situación | Resultado esperado |
| --- | --- |
| Clave ausente; Cancelar nombre | Respaldo; no se crea la clave |
| Nombre válido, `25`, Aceptar confirmación | JSON con número 25 y booleano true; ficha completada |
| Nombre válido, `10`, Cancelar confirmación | Se guarda completada false; ficha pendiente |
| Recargar y Cancelar nombre | Recuperación fiel de las tres propiedades |
| Cancelar minutos | Conservación de toda la ficha anterior |
| Nombre vacío; minutos vacíos, `0`, `121`, `2.5` o `abc` | Aviso y ninguna escritura |
| JSON mal formado, por ejemplo `{` | Respaldo y aviso; Cancelar no altera el texto |
| JSON `null`, sin una propiedad, minutos `"25"` o completada `"false"` | Rechazo por estructura o tipos |
| Orden `borrar` | Clave ausente y respaldo; otras claves intactas |
| Nueva pestaña independiente, escribiendo la misma URL | Sesión propia sin la ficha de la primera pestaña |
| Error al guardar o borrar | Aviso y conservación de la ficha preparada |

Para comparar pestañas, usa el mismo origen y perfil, sin duplicar ni restaurar una pestaña y sin abrirla desde otra con `opener`: esos mecanismos pueden copiar o restaurar datos. Si no puedes reproducir una restricción del almacenamiento, documenta la limitación y explica qué bloque la controlaría; no llenes el almacén para provocar errores.

### Entrega

Entrega los dos archivos, una captura del JSON en Session Storage y una tabla con entradas, resultados esperados y observados. Incluye una recarga y una prueba con pestaña independiente.

Explica qué recibe y devuelve cada método JSON, por qué no basta con guardar el objeto directamente, qué tipos tienen las propiedades recuperadas y por qué esta ficha usa `sessionStorage`. Compara también Cancelar en `prompt` con Cancelar en `confirm`.

La corrección valora la conservación y recuperación de las tres propiedades (**RA3.g**), la validación, el tratamiento de errores y la documentación de pruebas (**RA3.h**).


## Privacidad, límites y depuración

Guarda solo los datos necesarios para la actividad. No almacenes contraseñas ni secretos de sesión en Web Storage: los scripts que se ejecutan con acceso al origen pueden leerlo y modificarlo. Los datos guardados no son una prueba fiable de identidad ni de permisos. Utiliza datos ficticios y ofrece una forma de eliminar las preferencias.

Las operaciones de Web Storage son síncronas: muchas escrituras o cadenas muy grandes pueden bloquear la interfaz. Estas prácticas guardan unos pocos textos; para grandes conjuntos de datos se estudiarían mecanismos como IndexedDB.

En Chrome/Edge, abre **Application → Local Storage / Session Storage**; en Firefox, **Almacenamiento**. Selecciona el origen correcto. Las cookies se inspeccionan en su apartado específico. Cambiar un dato desde estas herramientas no actualiza por sí solo la interfaz del ejemplo: recarga.

| Síntoma | Qué debes comprobar |
| --- | --- |
| Tras recargar aparece el valor por defecto | Clave exacta, origen, escritura previa y posibles limpiezas |
| Dos proyectos comparten una preferencia | Mismo origen y claves sin un prefijo que los distinga |
| Un contador produce `"21"` | Se concatenó una cadena en lugar de convertir y validar el número |
| Una actividad aparece al duplicar la pestaña | Puede haberse copiado o restaurado el estado de sesión |
| El dato existe pero no cambia el aspecto | Falta recuperarlo, validarlo y aplicarlo al documento |
| Error al leer JSON | Texto no válido o estructura diferente de la esperada |
| Se anuncia «guardado» aunque falla | El mensaje de éxito debe ir después de `setItem`, dentro de `try` |
| Desaparecen preferencias ajenas | Revisa si se utilizó `clear()` en vez de `removeItem` |

!!! tip "Documentar el almacenamiento"
    Anota para cada dato su clave, almacén, valores admitidos, valor de respaldo y forma de borrarlo. Comprueba tanto lo que ve la persona como lo que realmente quedó almacenado: pueden diferir si una operación falla.

## Referencias para consultar

- [MDN: uso de Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) y [estándar HTML: Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html).
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) y [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
- [MDN: document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) y [cookies HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies).
- [MDN: cuotas y eliminación de datos](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
