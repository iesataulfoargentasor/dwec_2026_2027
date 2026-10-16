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
    Necesitas variables, condiciones, cadenas, `prompt`, `document` y `textContent`. El caso resuelto y el ejercicio obligatorio no requieren arrays, funciones de usuario ni eventos. La serialización con JSON y el selector de color se presentan como ampliaciones. Las cookies se desarrollan con más detalle en la [UT5](../ut5/cookies.md).

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

### Objetos y JSON: ampliación

Guardar un objeto directamente lo convierte normalmente en `"[object Object]"`, perdiendo la estructura. `JSON.stringify` crea una representación textual y `JSON.parse` intenta reconstruir el dato. Esto recupera un valor, no una conexión automática con el objeto original.

Escritura de un ejemplo propio:

```javascript
const preferencias = { tema: "claro", grupo: "DAW2" };
try {
  localStorage.setItem("dwec.ut3.demo.preferencias", JSON.stringify(preferencias));
} catch (error) {
  console.error("No se pudieron guardar las preferencias:", error);
}
```

Lectura independiente, incluso después de una recarga:

```javascript
try {
  const texto = localStorage.getItem("dwec.ut3.demo.preferencias");
  if (texto === null) {
    console.log("No hay preferencias guardadas.");
  } else {
    const dato = JSON.parse(texto);
    if (dato !== null && typeof dato === "object" && !Array.isArray(dato)
        && (dato.tema === "claro" || dato.tema === "oscuro")
        && typeof dato.grupo === "string") {
      console.log("Tema:", dato.tema, "Grupo:", dato.grupo);
    } else {
      console.log("El dato no tiene la estructura esperada.");
    }
  }
} catch (error) {
  console.error("No se pudo leer o interpretar el dato guardado:", error);
}
```

`JSON.parse` puede fallar si el texto no es JSON válido. Incluso un JSON válido puede contener un número, `null`, un array o un objeto con campos incorrectos: por eso se comprueba la estructura. `Array.isArray` permite reconocer arrays, que se estudiarán en la UT4. Cambiar `dato.tema` no guarda nada por sí mismo; hay que serializar y escribir otra vez. Esta ampliación no es necesaria para las prácticas de cadenas que siguen.

## Ejemplo unido al selector de color

Retomamos el selector de [Generar HTML](generar-html.md), con una paleta reducida para centrarnos en **guardar y restaurar**. Este ejemplo anticipa funciones y el evento `change`; el caso principal posterior funciona sin eventos.

**`colores.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>DWEC · Color guardado</title>
</head>
<body>
  <h1>Preferencia de color</h1>
  <label for="color">Color del fondo:</label>
  <select id="color">
    <option value="white">Blanco</option>
    <option value="navy">Azul oscuro</option>
    <option value="gold">Amarillo</option>
  </select>
  <p id="estado" role="status">Blanco por defecto.</p>
  <script src="colores.js"></script>
</body>
</html>
```

**`colores.js`**

```javascript
const clave = "dwec.ut3.colores.fondo";
const select = document.querySelector("#color");
const estado = document.querySelector("#estado");

function aplicarColor(color) {
  document.body.style.backgroundColor = color;
  document.body.style.color = color === "navy" ? "white" : "#111";
}

if (select === null || estado === null) {
  console.error("Faltan los elementos #color o #estado.");
} else {
  aplicarColor("white");
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado === "white" || guardado === "navy" || guardado === "gold") {
      select.value = guardado;
      aplicarColor(guardado);
      estado.textContent = "Color recuperado del almacenamiento.";
    } else if (guardado !== null) {
      estado.textContent = "El valor guardado no es un color admitido; se usa blanco.";
    }
  } catch (error) {
    estado.textContent = "No se pudo recuperar el color; se usa blanco.";
    console.error(error);
  }

  select.addEventListener("change", () => {
    const color = select.value;
    if (color !== "white" && color !== "navy" && color !== "gold") {
      estado.textContent = "Color no admitido.";
      return;
    }
    aplicarColor(color);
    try {
      localStorage.setItem(clave, color);
      estado.textContent = "Color aplicado y guardado.";
    } catch (error) {
      estado.textContent = "Color aplicado solo a esta página; no se pudo guardar.";
      console.error(error);
    }
  });
}
```

`aplicarColor` agrupa las dos asignaciones de estilo. Se mantiene texto claro sobre azul oscuro y oscuro sobre blanco o amarillo. `change` ejecuta la función cuando cambia la selección; `return` termina esa función si el valor no es admisible.

Aplicar un color y guardarlo son operaciones distintas: si la escritura falla, el cambio visual sigue presente hasta recargar. Tampoco basta con guardar para que cambie el fondo; al cargar hay que leer, validar y aplicar el valor. No se exige sincronización visual inmediata entre pestañas: cada una restaura al cargar.

## Caso práctico resuelto: recordar el tema de lectura

Una página de apuntes debe recuperar el tema anterior y permitir conservarlo, cambiarlo o borrar la preferencia. Trabajaremos con **una clave propia**, `dwec.ut3.lectura.tema`, que solo admite `claro` y `oscuro`.

El script lee la preferencia, pregunta una vez mediante `prompt` y presenta el resultado. Cancelar no modifica el almacenamiento; `borrar` elimina únicamente esta clave y vuelve al tema claro. El valor recuperado se valida porque puede haber sido modificado desde otra página o desde las herramientas del navegador.

**`lectura.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DWEC · Preferencia de lectura</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; padding: 1rem; }
  </style>
</head>
<body>
  <h1>Preferencia de lectura</h1>
  <p>Esta actividad recuerda el tema elegido entre visitas.</p>
  <p id="estado" role="status">Preparando la lectura.</p>
  <script src="lectura.js"></script>
</body>
</html>
```

**`lectura.js`**

```javascript
const clave = "dwec.ut3.lectura.tema";
const estado = document.querySelector("#estado");
let tema = "claro";
let mensaje = "No hay preferencia guardada; se usa el tema claro.";
let lecturaDisponible = true;

if (estado === null) {
  console.error("Falta el párrafo #estado en lectura.html.");
} else {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado === "claro" || guardado === "oscuro") {
      tema = guardado;
      mensaje = "Preferencia recuperada.";
    } else if (guardado !== null) {
      mensaje = "Preferencia guardada no válida; se usa claro sin modificar la clave.";
    }
  } catch (error) {
    lecturaDisponible = false;
    mensaje = "No se pudo leer el almacenamiento; se usa claro sin guardar.";
    console.error("Error de lectura:", error);
  }

  // Si no pudimos leer, mantenemos el valor de respaldo sin pedir cambios.
  if (lecturaDisponible) {
    const respuesta = prompt("Tema: claro u oscuro. Escribe borrar para olvidar la preferencia.", tema);

    if (respuesta === null) {
      mensaje += " Cambio cancelado; no se modifica el almacenamiento.";
    } else {
      const opcion = respuesta.trim().toLowerCase();
      if (opcion === "claro" || opcion === "oscuro") {
        try {
          localStorage.setItem(clave, opcion);
          // Solo confirmamos y cambiamos el tema después de guardar con éxito.
          tema = opcion;
          mensaje = "Preferencia guardada correctamente.";
        } catch (error) {
          mensaje = "No se pudo guardar; se mantiene el tema anterior de esta página.";
          console.error("Error de escritura:", error);
        }
      } else if (opcion === "borrar") {
        try {
          localStorage.removeItem(clave);
          tema = "claro";
          mensaje = "Preferencia eliminada; se vuelve al tema claro.";
        } catch (error) {
          mensaje = "No se pudo borrar; se mantiene el tema anterior de esta página.";
          console.error("Error de borrado:", error);
        }
      } else {
        mensaje += " Entrada no válida: escribe claro, oscuro o borrar. No se guarda ningún cambio.";
      }
    }
  }

  if (tema === "oscuro") {
    document.body.style.backgroundColor = "#111827";
    document.body.style.color = "#f9fafb";
  } else {
    document.body.style.backgroundColor = "#fffdf7";
    document.body.style.color = "#1f2937";
  }

  estado.textContent = `${mensaje} Tema aplicado: ${tema}.`;
}
```

### Lectura del resultado

1. En la primera visita, la clave no existe y `getItem` devuelve `null`. El tema de respaldo es claro.
2. Si escribes ` OSCURO `, se normaliza a `oscuro`, se guarda la cadena y después se aplica el estilo.
3. Al recargar, la variable `tema` vuelve a crearse, pero el script recupera la cadena guardada. Pulsa Cancelar para comprobar que mantiene el tema sin escribir de nuevo.
4. Si escribes `borrar`, se elimina solo `dwec.ut3.lectura.tema`. La siguiente lectura devolverá `null`; no se guarda una cadena `"null"` ni un valor vacío.
5. Una entrada vacía o desconocida no sobrescribe la preferencia. Si el dato almacenado ya era inválido, se usa claro y se conserva la clave hasta que elijas un valor válido o la borres.
6. Si falla la lectura, no se pregunta y se usa claro. Si falla una escritura o un borrado, no se anuncia éxito y se conserva el tema que estaba preparado.

El script se ejecuta al final del `body`, cuando existe `#estado`. No hay actualización automática entre pestañas ni persistencia del estilo por sí mismo: se guarda **el nombre del tema**, y las asignaciones de CSS se repiten en cada carga.

Esta política difiere del selector anterior: aquel permite aplicar un color aunque no se guarde; aquí solo se cambia al nuevo tema cuando la escritura tiene éxito. Ambas decisiones son posibles, pero el mensaje debe explicar lo que realmente ocurrió.

Comprueba la clave en las herramientas del navegador y prueba también a cambiar manualmente su valor por `azul`. Recarga y pulsa Cancelar: debe verse el aviso de preferencia inválida, sin romper la página.

## Ejercicio propuesto: preferencias y actividad de la pestaña

### Contexto

Una página de estudio recordará el **perfil de lectura** entre visitas, pero conservará la **actividad actual** únicamente en la sesión de esa pestaña. Debes implementar ambos comportamientos y demostrar que no tienen el mismo ámbito.

Prepara `estudio.html` con idioma, codificación, título, encabezado y dos párrafos de salida: `#perfil` y `#actividad`. Enlaza `estudio.js` al final del `body`.

### Requisitos obligatorios

1. Comprueba que existen ambos párrafos antes de utilizarlos. Usa exactamente estas claves: `dwec.ut3.estudio.perfil` en `localStorage` y `dwec.ut3.estudio.actividad` en `sessionStorage`.
2. Recupera el perfil. Solo admite `normal` o `ampliado`; ante ausencia o valor inválido, usa `normal` e informa de la causa sin modificar automáticamente la clave.
3. Pregunta el perfil con `prompt`, ofreciendo el perfil recuperado como valor inicial. Normaliza con `trim().toLowerCase()`. Cancelar conserva el estado; vacío o desconocido produce un aviso sin guardar. Un valor válido se guarda y se aplica solo si la escritura tiene éxito.
4. Acepta también `borrar` como orden para eliminar únicamente la clave del perfil. Si se elimina correctamente, aplica `normal`; si falla, conserva el perfil preparado y muestra el error.
5. Aplica `fontSize = "16px"` para `normal` y `"20px"` para `ampliado`. El párrafo `#perfil` debe indicar el perfil aplicado y si se recuperó, guardó, borró, canceló o no pudo completarse la operación.
6. Recupera la actividad desde `sessionStorage`. Si está ausente, vacía o solo contiene espacios, muestra «Sin actividad». En otro caso, utiliza el texto sin espacios exteriores, conservando sus mayúsculas.
7. Pide el nombre de la actividad en un segundo `prompt`, con el nombre recuperado como valor inicial o `""` si no existe. Cancelar no cambia nada. Aceptar vacío o solo espacios elimina únicamente su clave; un nombre no vacío se guarda con `setItem` después de `trim()`.
8. Actualiza el nombre mostrado solo si su escritura o eliminación termina correctamente. Informa en `#actividad` del nombre vigente y del resultado. Usa `textContent`, también si se escriben etiquetas HTML como parte del nombre.
9. Gestiona por separado los fallos de ambos almacenes. Si falla la lectura de uno, muestra su valor de respaldo y no preguntes por él, pero continúa con el otro. Si falla una modificación, conserva el valor mostrado anteriormente y no anuncies éxito.
10. Añade comentarios sobre la elección de cada almacén y documenta las pruebas. No uses `clear()` ni alteres claves de otras actividades.

!!! note "Límites del ejercicio"
    Usa variables, condiciones, cadenas, `prompt`, `try/catch`, `textContent`, `style.fontSize` y los métodos de Storage explicados. No necesitas JSON, arrays, funciones de usuario, eventos, cookies, temporizadores ni sincronización entre pestañas.

### Pistas de diseño

1. Organiza dos bloques independientes: perfil persistente y actividad de pestaña. Que falle uno no debe impedir procesar el otro.
2. Distingue la cadena almacenada, el valor validado que vas a mostrar y la nueva respuesta. No cambies el valor vigente antes de saber si la operación se completó.
3. Comprueba `null` antes de llamar a `trim()`. Para el perfil, vacío significa entrada inválida; para la actividad, vacío significa borrar: son decisiones diferentes del enunciado.
4. No conviertas el nombre de la actividad a minúsculas. La normalización del perfil sirve para comparar opciones cerradas, pero un nombre puede tener mayúsculas significativas.
5. Borrar una clave y aplicar un valor por defecto no exige guardar ese valor por defecto. Comprueba que `getItem` devuelve realmente `null` tras eliminar.
6. Recarga para recuperar los datos. Guardarlos en otra pestaña no modifica automáticamente el texto de la que ya estaba abierta.

### Casos que debes probar

| Entrada o situación | Resultado esperado |
| --- | --- |
| Sin claves, Cancelar en ambos diálogos | Perfil normal y «Sin actividad»; no se crean claves |
| Perfil ` AMPLIADO ` y actividad ` Repaso UT3 ` | Texto de 20px; perfil `ampliado` local y actividad `Repaso UT3` en la sesión |
| Recargar y Cancelar en ambos | Se recuperan los dos valores |
| Perfil vacío o `oscuro` | Aviso; no sustituye el perfil guardado |
| Actividad vacía o solo espacios | Se elimina su clave y aparece «Sin actividad» |
| Orden `borrar` para el perfil | Se elimina solo su clave y se aplica normal |
| Nombre `<strong>Repaso</strong> & HTML` | Texto literal; no se crea un elemento `strong` |
| Modificar el perfil guardado a `gigante` desde DevTools | Respaldo normal y aviso; Cancelar no sobrescribe la clave inválida |
| Nueva pestaña independiente con la misma URL | Recupera el perfil local; comienza sin actividad de sesión |
| Cambiar de puerto del servidor | Los almacenes pertenecen a otro origen; las claves no se comparten |
| Lectura de un almacén no disponible | Mensaje y respaldo de ese bloque; el otro sigue funcionando |

Para comparar pestañas, usa el mismo perfil de navegador y abre una nueva escribiendo la URL. Para comparar puertos, sirve la carpeta en un segundo puerto. Los resultados de ausencia presuponen que no has guardado previamente esas mismas claves en el contexto de prueba.

Comprueba también que borrar las claves de esta práctica no elimina `dwec.ut3.lectura.tema` del caso resuelto. No llenes el almacenamiento para provocar errores: si no puedes reproducir una restricción, indica ese límite y explica qué bloques la gestionarían. La prueba de fallos puede simularse de forma controlada en el aula.

### Entrega

Entrega `estudio.html` y `estudio.js`, capturas de ambos almacenes con las claves de la actividad y una tabla con entradas, resultados esperados y observados. Incluye una prueba de recarga y otra de pestaña independiente.

Explica por qué el perfil y la actividad usan almacenes distintos, qué diferencia hay entre `null` y `""`, por qué guardar `false` no produce un booleano y qué ocurriría si utilizases `clear()` en el origen compartido del sitio de clase.

La corrección valora guardar, recuperar y eliminar los datos apropiados (**RA3.g**), el tratamiento coherente de entradas y errores y la documentación de las pruebas (**RA3.h**). No se exige implementar todos los mecanismos de almacenamiento en el mismo programa.

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
