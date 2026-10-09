---
title: 3.2 El objeto String
tags:
  - JavaScript
  - DWEC
  - RA3
---

# 3.2. El objeto `String`

Una cadena (`string`) es una sucesión de caracteres Unicode. Es un valor **primitivo**, no un objeto creado con `new`. Sin embargo, al consultar una propiedad o llamar a un método, JavaScript la envuelve de forma temporal para que puedas trabajar cómodamente con ella.

```javascript
const txt = "DWEC";
console.log(txt.length); // 4
```

`new String("hola")` crea un objeto envoltorio: evítalo. Las plantillas (acento grave) ya las viste en la UT2.

```javascript
const texto = "hola";
const objetoTexto = new String("hola");

console.log(texto === "hola");        // true
console.log(objetoTexto === "hola");  // false
```

## Idea clave: una cadena no se modifica

Los métodos de `String` devuelven **otra** cadena. No cambian la original:

```javascript
const nombre = "  ana  ";
const limpio = nombre.trim().toUpperCase();

console.log(nombre); // "  ana  "
console.log(limpio); // "ANA"
```

Esto evita efectos inesperados: si quieres conservar el resultado, asígnalo a una variable o úsalo directamente.

## 3.2.1. Longitud, posiciones y caracteres

`length` es la longitud. El primer carácter está en el índice `0`; el último está en `length - 1`.

```javascript
const codigo = "DAW2";

console.log(codigo.length);        // 4
console.log(codigo[0]);            // "D"
console.log(codigo.charAt(3));     // "2"
console.log(codigo[4]);            // undefined
console.log(codigo.charAt(4));     // ""
```

`txt[i]` es la forma habitual actual; `charAt(i)` sigue existiendo y resulta útil para ver la diferencia con una posición inexistente.

!!! warning "El índice no es un número de orden humano"
    El primer carácter es el índice `0`, no el `1`. Si una cadena mide 4, sus posiciones son `0`, `1`, `2` y `3`.

En texto normal para el aula esta idea basta. Unicode contiene algunos caracteres (por ejemplo, determinados emoji) que ocupan más de una posición interna; no uses `length` para medir “letras visibles” en un editor de emoji.

## 3.2.2. Buscar texto

Para saber si aparece un trozo de texto, usa `includes`. Devuelve un booleano y se lee muy bien dentro de un `if`.

```javascript
const comentario = "El aula tiene proyector y buena luz.";

console.log(comentario.includes("proyector")); // true
console.log(comentario.includes("Proyector")); // false: distingue mayúsculas
```

`startsWith` y `endsWith` comprueban el inicio o el final:

```javascript
const archivo = "actividad-ut3.js";

console.log(archivo.startsWith("actividad-")); // true
console.log(archivo.endsWith(".js"));          // true
```

`indexOf` devuelve el índice de la primera aparición; `lastIndexOf`, el de la última. Si no encuentra el texto, ambos devuelven `-1`.

```javascript
const ruta = "docs/ut3/string.md";

console.log(ruta.indexOf("/"));     // 4
console.log(ruta.lastIndexOf("/")); // 8
console.log(ruta.indexOf("css"));   // -1
```

Puedes comprobar `indexOf(...) !== -1`, pero para una pregunta sencilla de “¿lo contiene?” prefiere `includes`.

## 3.2.3. Extraer una parte: `slice`

`slice(inicio, fin)` devuelve desde `inicio` hasta **antes** de `fin`. No altera el texto original.

```javascript
const dni = "12345678Z";

console.log(dni.slice(0, 8));  // "12345678"
console.log(dni.slice(8));     // "Z"
console.log(dni.slice(-1));    // "Z": cuenta desde el final
```

`substring` existe, pero en código nuevo suele preferirse `slice`, entre otras cosas porque acepta índices negativos. `substr` está **obsoleto**: no lo uses.

## 3.2.4. Limpiar y cambiar el aspecto del texto

| Método | Qué devuelve |
| --- | --- |
| `toLowerCase()` / `toUpperCase()` | El texto en minúsculas / mayúsculas |
| `trim()` | Sin espacios al principio ni al final |
| `trimStart()` / `trimEnd()` | Sin espacios solo al principio / final |
| `padStart(longitud, relleno)` | Texto rellenado por la izquierda |
| `padEnd(longitud, relleno)` | Texto rellenado por la derecha |
| `repeat(n)` | El texto repetido `n` veces |

Normalizar antes de comparar evita fallos por espacios o mayúsculas:

```javascript
const respuesta = "  Si ";
const respuestaNormalizada = respuesta.trim().toLowerCase();

console.log(respuestaNormalizada === "si"); // true
```

`padStart` es muy útil para fechas y códigos:

```javascript
const dia = 7;
const mes = 3;

const fecha = String(dia).padStart(2, "0") + "/" +
  String(mes).padStart(2, "0") + "/2026";

console.log(fecha); // "07/03/2026"
```

## 3.2.5. Sustituir texto

`replace` sustituye **solo la primera aparición** si el primer argumento es texto. `replaceAll` sustituye todas.

```javascript
const aviso = "error: error de conexión";

console.log(aviso.replace("error", "aviso"));
// "aviso: error de conexión"

console.log(aviso.replaceAll("error", "aviso"));
// "aviso: aviso de conexión"
```

No usamos expresiones regulares todavía: llegarán en la UT5. En este apartado, los argumentos de búsqueda son textos simples.

## 3.2.6. Separar texto: `split`

`split(separador)` divide el texto y devuelve una **lista**. La lista resultante es un `Array`, que se estudia formalmente en la UT4. Ahora basta con reconocer la operación:

```javascript
const asignatura = "Desarrollo-Web-Cliente";
const partes = asignatura.split("-");

console.log(partes); // ["Desarrollo", "Web", "Cliente"]
```

No necesitas `split` para los casos prácticos de esta página; se incluye porque es frecuente al leer datos CSV, rutas o fechas.

## Resumen de métodos

| Necesito… | Método |
| --- | --- |
| Una posición / un carácter | `length`, `txt[i]`, `charAt(i)` |
| Comprobar contenido | `includes`, `startsWith`, `endsWith` |
| Localizar una posición | `indexOf`, `lastIndexOf` |
| Cortar un tramo | `slice` |
| Limpiar o unificar para comparar | `trim`, `toLowerCase`, `toUpperCase` |
| Sustituir una o todas las apariciones | `replace`, `replaceAll` |
| Mostrar con ceros o columnas | `padStart`, `padEnd` |
| Dividir por un separador | `split` (la lista se ve en UT4) |

Los métodos HTML del material antiguo (`bold()`, `italics()`, `fontcolor()`, `blink()`, `anchor()`, `link()`…) están obsoletos. El aspecto se cambia con **HTML + CSS**, no generando etiquetas desde el `String`.

## Ejemplo guiado: palíndromo

Un palíndromo se lee igual de izquierda a derecha que de derecha a izquierda. Se lee la cadena del final al principio con un `for` (UT2) y `charAt`. Todavía no hace falta una función, expresiones regulares ni métodos de array: eso llega en la UT4 y en la UT5.

```javascript
const frase = "Ana";
const normalizada = frase.toLowerCase().trim();
let reves = "";

for (let i = normalizada.length - 1; i >= 0; i -= 1) {
  reves += normalizada.charAt(i);
}

console.log(reves); // "ana"
if (normalizada === reves) {
  console.log(frase + " es un palindromo");
} else {
  console.log(frase + " no es un palindromo");
}
```

!!! example "Prueba en consola"
    Carga un `script` al final del `body` y abre DevTools (:kbd:`F12`). No hace falta `alert` para ver el resultado.

## Caso práctico resuelto: comprobar un código de préstamo

La biblioteca usa códigos con este formato:

```text
BIB-2026-0042
```

El script pide un código y comprueba las reglas que puede resolver con los conceptos vistos:

1. El usuario puede escribir espacios y minúsculas: se limpian con `trim` y se pasa a mayúsculas.
2. Debe empezar por `BIB-`.
3. Debe tener exactamente 13 caracteres.
4. Debe terminar en cuatro cifras. Sin expresiones regulares todavía, se comprueba carácter a carácter con un `for`.
5. Si es válido, se obtiene el año (`2026`) y el número de préstamo (`0042`) con `slice`.
6. Se muestra una línea separadora con `repeat`.

No se usa una función de usuario, un array, DOM, eventos ni expresiones regulares. Solo aparecen `prompt`, `const`/`let`, condiciones y bucles de la UT2, y los métodos de `String` de este apartado.

```javascript
const bruto = prompt("Escribe el código de préstamo (BIB-2026-0042):");

if (bruto === null) {
  console.log("Consulta cancelada.");
} else {
  const codigo = bruto.trim().toUpperCase();
  let cuatroDigitos = true;

  if (codigo.length !== 13) {
    cuatroDigitos = false;
  } else {
    for (let i = 9; i < 13; i += 1) {
      const caracter = codigo.charAt(i);

      if (caracter < "0" || caracter > "9") {
        cuatroDigitos = false;
      }
    }
  }

  if (!codigo.startsWith("BIB-")) {
    console.log("Código no válido: debe comenzar por BIB-.");
  } else if (codigo.charAt(8) !== "-") {
    console.log("Código no válido: falta el segundo guion.");
  } else if (!cuatroDigitos) {
    console.log("Código no válido: los cuatro últimos caracteres deben ser cifras.");
  } else {
    const anio = codigo.slice(4, 8);
    const numero = codigo.slice(9);
    const titulo = " PRÉSTAMO LOCALIZADO ";
    const linea = "=".repeat(titulo.length);

    console.log(linea);
    console.log(titulo);
    console.log(linea);
    console.log("Código normalizado: " + codigo);
    console.log("Año: " + anio);
    console.log("Número de préstamo: " + numero);
    console.log("¿Contiene el año 2026?: " + codigo.includes("2026"));
  }
}
```

### Qué hace cada parte

1. `trim().toUpperCase()` transforma `" bib-2026-0042 "` en `"BIB-2026-0042"`. Como los métodos devuelven texto nuevo, el resultado se guarda en `codigo`.
2. `length !== 13` descarta pronto un código de tamaño incorrecto.
3. `startsWith("BIB-")` comprueba el prefijo. `charAt(8)` revisa el segundo guion, cuya posición se conoce por el formato.
4. El `for` recorre únicamente las posiciones 9, 10, 11 y 12. Comparar cada carácter con `"0"` y `"9"` permite saber si es una cifra sin adelantar expresiones regulares.
5. `slice(4, 8)` extrae el año: empieza en 4 y se detiene antes de 8. `slice(9)` toma desde el número hasta el final.
6. `repeat` prepara una línea decorativa para la consola; no genera HTML.

Pruébalo con estos casos:

| Entrada | Resultado esperado |
| --- | --- |
| `bib-2026-0042` | Válido: se normaliza y se muestran año y número |
| ` BIB-2026-0007 ` | Válido: los espacios no importan |
| `BIB-2026-ABCD` | No válido: el final no son cifras |
| `LIB-2026-0042` | No válido: prefijo incorrecto |
| `BIB-26-42` | No válido: longitud incorrecta |

## Ejercicio propuesto: registrar un archivo de entrega

### Contexto

El profesorado pide que cada ejercicio de la UT3 se entregue con un nombre de archivo uniforme:

```text
ut3-apellido-nombre.js
```

Por ejemplo:

```text
ut3-garcia-ana.js
```

El alumnado suele escribir mayúsculas, espacios al principio o al final, extensiones incorrectas o nombres sin el prefijo de la unidad. Debes crear un script llamado `registro-entrega.js` que reciba un nombre de archivo mediante `prompt`, lo compruebe y muestre un resumen en la consola.

No copies el caso resuelto del préstamo de biblioteca: aquí no hay un código de longitud fija ni se valida un número. El objetivo es practicar búsqueda, extracción, normalización y sustitución de texto.

### Requisitos obligatorios

Tu script debe cumplir estas condiciones:

1. Si se pulsa **Cancelar**, muestra que no se ha registrado ninguna entrega y termina.
2. Elimina los espacios de los extremos y pasa el nombre a minúsculas. Así, `" UT3-Garcia-Ana.JS "` debe tratarse como `"ut3-garcia-ana.js"`.
3. Comprueba que el nombre empieza por `ut3-` y termina por `.js`.
4. Usa `lastIndexOf(".")` para localizar el último punto y `slice` para extraer:

   - el nombre sin extensión;
   - la extensión;
   - el texto situado después del prefijo `ut3-`.

5. Recorre el texto con un `for` y `charAt` para comprobar que **no contiene espacios internos**. Si hay un espacio entre apellido y nombre, no es válido.
6. Comprueba que, después de `ut3-`, aparece al menos un guion: separa apellido y nombre. Puede haber más si el apellido es compuesto. Puedes contarlos con un contador y un `for`.
7. Si el archivo es válido, prepara un título legible:

   ```text
   ENTREGA UT3: garcia ana
   ```

   Para ello, usa `replaceAll("-", " ")` sobre la parte sin prefijo y sin extensión.

8. Muestra una cabecera de consola formada con `repeat` y alinea el texto `Estado: aceptado` con `padEnd`.
9. Muestra también si el nombre contiene la palabra `prueba` mediante `includes`. No lo rechaces por ello: solo avisa en consola para que el profesorado pueda revisarlo.

!!! warning "Límites del ejercicio"
    No uses funciones de usuario, arrays, `split`, DOM, eventos, expresiones regulares, `localStorage` ni `alert`. Solo necesitas `prompt`, variables, `if`, un bucle `for` y los métodos de `String` de este apartado.

### Pistas de diseño

No son una solución completa, pero sí el orden lógico:

1. Comprueba Cancelar antes de usar `trim`.
2. Guarda la versión normalizada en una nueva constante.
3. Valida prefijo y extensión antes de extraer y mostrar el resumen.
4. Calcula la posición del último punto una sola vez y guárdala en una variable.
5. Declara un contador con `let` antes del `for`: el contador cambiará.
6. Solo imprime el resumen final cuando todas las reglas se cumplan.

### Casos que debes probar

| Entrada en `prompt` | Resultado esperado |
| --- | --- |
| `ut3-garcia-ana.js` | Aceptado; título con `garcia ana` |
| ` UT3-Garcia-Ana.JS ` | Aceptado; se normaliza antes de validar |
| `ut3-lopez-de-la-vega.js` | Aceptado; los guiones adicionales son válidos |
| `ut3-garcia ana.js` | Rechazado: hay un espacio interno |
| `ut2-garcia-ana.js` | Rechazado: prefijo incorrecto |
| `ut3-garcia-ana.txt` | Rechazado: extensión incorrecta |
| `ut3-prueba-ana.js` | Aceptado, pero muestra aviso por contener `prueba` |
| Cancelar | No se registra ninguna entrega |

### Entrega

Entrega `registro-entrega.js` y una captura de consola de un caso válido y otro inválido. En el caso válido deben verse:

- el nombre normalizado;
- el nombre sin extensión y la extensión extraídos con `slice`;
- el título legible creado con `replaceAll`;
- una línea decorativa generada con `repeat`;
- el estado alineado mediante `padEnd`.

La corrección valora que cada regla tenga un mensaje claro, que no haya espacios internos, que uses `lastIndexOf` en lugar de asumir una posición fija para el punto y que no adelantes expresiones regulares ni métodos de arrays.
