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
    Necesitas variables, condiciones, cadenas, `prompt` y `document.getElementById`. Para localizar elementos del DOM usaremos únicamente este método, tanto en los ejemplos como en el ejercicio. El caso resuelto y el ejercicio obligatorio no requieren arrays, funciones de usuario ni eventos. Las dos prácticas guardan un único dato de texto y no necesitan JSON. El recordatorio sobre objetos y JSON es una ampliación opcional. Las cookies se desarrollan con más detalle en la [UT5](../ut5/cookies.md).

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

### Ampliación opcional: objetos y JSON

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

Este fragmento se centra en JSON y supone que el acceso al almacén está permitido; el caso resuelto de esta página muestra cómo controlar los errores de acceso al guardar un texto. Para terminar la prueba, elimina únicamente `dwec.ut3.prueba.json` con `removeItem`.

El número `20` sigue siendo un número después de `parse`, y un booleano como `false` seguiría siendo booleano. En cambio, si se guardó la propiedad `"tamano":"20"`, se recupera una cadena. JSON conserva los tipos representados; **no corrige los datos**.

No pases el objeto directamente a `setItem`: un objeto literal ordinario se convierte en `"[object Object]"`, que no contiene sus propiedades y no es JSON válido. Tampoco basta con que `parse` no falle: `null`, `25` o `{"tema":"azul"}` son JSON válido, pero no son la ficha que espera nuestro programa. Primero comprobamos que hay un objeto no nulo y después sus propiedades. El operador `&&` evita consultar las propiedades cuando las comprobaciones anteriores fallan.

!!! note "Usar métodos no es definir funciones"
    Aquí llamamos a métodos ya disponibles, como `JSON.parse`, `JSON.stringify` o `getItem`. No declaramos funciones propias, funciones flecha ni manejadores de eventos. El código se ejecuta de arriba abajo al cargar la página; para repetir la interacción, recargamos.

## Caso práctico resuelto: recordar un nombre

La página pide un nombre, lo guarda en `localStorage` y muestra un saludo. Al recargar, recupera el nombre anterior. Solo guardaremos **una cadena de texto**, sin objetos ni JSON.

Crea estos dos archivos en la misma carpeta y abre el HTML desde el servidor local del aula.

**`saludo.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Un saludo que se recuerda</title>
</head>
<body>
  <h1>Mi página de clase</h1>
  <p id="saludo"></p>
  <p id="estado"></p>
  <p>Recarga para cambiar el nombre. Escribe borrar para olvidarlo.</p>
  <script src="saludo.js"></script>
</body>
</html>
```

**`saludo.js`**

```javascript
const clave = "dwec.ut3.saludo.nombre";
let nombre = "Visitante";
let mensaje = "No hay un nombre guardado.";

try {
  // 1. Recuperar el nombre, si existe.
  const guardado = localStorage.getItem(clave);
  if (guardado !== null && guardado.trim() !== "") {
    nombre = guardado;
    mensaje = "Nombre recuperado.";
  }

  // 2. Pedir un nombre nuevo o conservar el anterior.
  const entrada = prompt("Escribe tu nombre o borrar", nombre);
  if (entrada === null) {
    mensaje += " No se han hecho cambios.";
  } else {
    const nuevoNombre = entrada.trim();
    if (nuevoNombre.toLowerCase() === "borrar") {
      localStorage.removeItem(clave);
      nombre = "Visitante";
      mensaje = "Nombre eliminado.";
    } else if (nuevoNombre === "") {
      mensaje += " El nombre no puede estar vacío.";
    } else {
      localStorage.setItem(clave, nuevoNombre);
      nombre = nuevoNombre;
      mensaje = "Nombre guardado.";
    }
  }
} catch (error) {
  mensaje = "No se pudo completar la operación de almacenamiento.";
}

// 3. Mostrar el resultado.
document.getElementById("saludo").textContent = "Hola, " + nombre + ".";
document.getElementById("estado").textContent = mensaje;
```

Los dos párrafos existen porque están definidos antes del script. Los localizamos únicamente con `getElementById`. El bloque `try/catch` permite mostrar un aviso si el navegador impide acceder al almacén: `try` contiene las operaciones y `catch` se ejecuta si alguna falla.

### Lectura del resultado

1. **Primera visita:** `getItem` devuelve `null` porque la clave no existe. El nombre inicial es `Visitante`.
2. **Escribe Ana:** `setItem` guarda la cadena `"Ana"` y la página muestra «Hola, Ana.».
3. **Recarga y pulsa Cancelar:** se recupera `"Ana"`; Cancelar no escribe ni borra nada. El saludo sigue siendo «Hola, Ana.».
4. **Escribe Luis:** se sustituye el valor de la misma clave. No se crea otra clave para cada nombre.
5. **Introduce solo espacios:** `trim` produce una cadena vacía. Se muestra un aviso y se conserva el nombre anterior.
6. **Escribe borrar:** `removeItem` elimina únicamente esta clave. Se muestra «Hola, Visitante.» y la clave queda ausente.

Observa las tres operaciones en las herramientas del navegador, dentro de **Local Storage**: guardar, recuperar tras recargar y eliminar. El texto `"borrar"` está reservado como orden; no se guarda como nombre.

| Prueba | Resultado esperado |
| --- | --- |
| Sin clave; Cancelar | Saludo a Visitante; no se crea la clave |
| Escribir ` Ana ` | Se guarda `Ana`, sin espacios en los extremos |
| Recargar; Cancelar | Se conserva Ana |
| Escribir Luis | Se guarda Luis en la misma clave |
| Escribir solo espacios | Aviso; no cambia lo guardado |
| Escribir `borrar` | Se elimina la clave y se saluda a Visitante |

El nuevo nombre se asigna **después** de `setItem`, y el nombre inicial se restaura **después** de `removeItem`. Si una operación falla, no se anuncia éxito ni se aplica ese cambio al saludo. Si falla la lectura, no se llega a pedir el nombre. No necesitas provocar errores del navegador para completar esta práctica.

## Ejercicio propuesto: recordar una actividad en esta pestaña

### Contexto

Crea una página que recuerde qué actividad estás haciendo, por ejemplo `Repasar String`. En este caso usarás **`sessionStorage`**: la actividad debe conservarse al recargar dentro de la misma sesión de pestaña.

Guardarás únicamente el nombre de la actividad como texto, con la clave `dwec.ut3.estudio.actividad`. No necesitas JSON, arrays, funciones propias ni eventos.

### Requisitos obligatorios

1. Crea `actividad.html` y `actividad.js`. En el HTML incluye un párrafo con `id="actividad"` y otro con `id="estado"`. Coloca el script al final del `body`.
2. Usa `"Sin actividad"` como texto inicial y recupera la actividad guardada con `getItem`. Si no existe o solo contiene espacios, conserva el texto inicial.
3. Pide una actividad con `prompt`. Si se pulsa Cancelar, conserva lo recuperado.
4. Elimina los espacios de los extremos con `trim`. Si la entrada queda vacía, muestra un aviso y no la guardes.
5. Si se escribe `borrar`, ignorando mayúsculas y espacios en los extremos, elimina solo la clave de esta práctica y muestra `"Sin actividad"`.
6. Para cualquier otro texto no vacío, usa `setItem` y muestra la nueva actividad. Actualiza la variable después de guardar correctamente.
7. Muestra la actividad y un mensaje de estado con `textContent`, localizando los párrafos exclusivamente con `document.getElementById`.

### Pistas de diseño

- Sigue el mismo orden que en el caso resuelto: recuperar, preguntar y mostrar.
- Cambia el almacén, la clave y los textos para adaptarlos a una actividad.
- Comprueba `entrada === null` antes de utilizar `trim`.
- Usa `removeItem`, no `clear`, para respetar otras prácticas del mismo origen.
- Puedes reutilizar el único bloque `try/catch` del ejemplo. No necesitas más validaciones que las indicadas ni varios datos por actividad.

### Casos que debes probar

| Prueba | Resultado esperado |
| --- | --- |
| Sin clave; Cancelar | Se muestra Sin actividad |
| Escribir ` Repasar String ` | Se guarda y muestra Repasar String |
| Recargar y Cancelar | Se recupera la actividad anterior |
| Escribir otra actividad | Se sustituye el texto de la misma clave |
| Introducir espacios | Aviso; se conserva lo anterior |
| Escribir `BORRAR` | Se elimina la clave y aparece Sin actividad |
| Abrir una pestaña independiente escribiendo la misma URL | No comparte la actividad de la primera pestaña |

Para la última prueba, utiliza el mismo perfil y origen, sin duplicar ni restaurar la pestaña y sin abrirla desde otra mediante `opener`: esos mecanismos pueden copiar o restaurar el almacenamiento de sesión.

### Entrega

Entrega los dos archivos y una tabla breve con el resultado de las pruebas. Añade una captura de la clave en Session Storage.

Responde: ¿por qué aquí se utiliza `sessionStorage`?, ¿qué devuelve `getItem` cuando no existe la clave? y ¿qué diferencia hay entre Cancelar, introducir espacios y escribir `borrar`?

Se valora guardar, recuperar y eliminar un dato (**RA3.g**), comprobar las entradas indicadas y explicar los resultados de las pruebas (**RA3.h**).


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
