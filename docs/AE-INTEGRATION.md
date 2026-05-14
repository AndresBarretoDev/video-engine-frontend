# OP Video Engine — Integracion con After Effects

**Version:** 1.0
**Fecha:** Mayo 2026
**Estado:** Documento vivo — decisiones de arquitectura pendientes

---

## Proposito de este documento

Captura el estado tecnico real de la automatizacion de video que opera hoy en el equipo de Automation (Smart Studio), con base en el analisis del script JSX usado en produccion. Sirve como referencia para el equipo de desarrollo al momento de disenar la Fase 5 (Puente AE) y para que el equipo de QA entienda que comportamientos debe verificar en la integracion.

---

## El script de automatizacion actual

**Nombre del archivo:** `Automation Script` (JSX — ExtendScript para After Effects)
**Autoria:** Lizeth Gomez + Google AI
**Tipo:** Panel flotante dentro de After Effects

El script es el puente tecnico entre los datos del cliente (JSON) y las composiciones visuales de AE. Resuelve el problema de configurar manualmente cada variacion de video: en lugar de editar capa por capa, el script aplica expresiones dinamicas que hacen que cada composicion se "autoconfigure" segun los datos que le corresponden en el JSON.

---

## Como funciona el script — paso a paso

### Flujo de trabajo completo

```
1. Lizeth prepara el proyecto AE
   - Crea las composiciones (una por variacion de video)
   - Las nombra con el indice que les corresponde en los datos: "0", "1", "2"...
   - Nombra cada capa de texto exactamente igual a la clave JSON correspondiente
   - Marca las capas de imagen con el comentario AE_JSON_IMG_KEY:nombre_campo

2. El cliente entrega sus datos (Excel / Google Sheets)
   - Lizeth los convierte a JSON siguiendo la estructura que el script espera
   - Cada fila del Excel se convierte en una entrada del JSON indexada por composicion

3. Lizeth carga el JSON en el script
   - El script lee los campos disponibles y los muestra como opciones en dropdowns

4. Lizeth aplica las vinculaciones
   - Selecciona capas de texto → aplica expresion de texto
   - Selecciona capas de opacidad → elige el campo JSON que controla visibilidad
   - Selecciona capas de color → elige el campo JSON con el valor de color
   - Las capas de imagen ya estan pre-marcadas con el comentario → se actualizan con un clic

5. Exportacion
   - El script agrega todas las composiciones al Render Queue de AE de una vez
   - Nombra cada archivo de salida segun el campo JSON seleccionado
   - AE renderiza localmente

6. Entrega
   - Los MP4 generados se comparten con el cliente via WeTransfer o correo
```

---

## Los cuatro tipos de vinculacion de datos

### 1. Texto dinamico

**Como funciona:** El script aplica una expresion AE a las capas de texto seleccionadas. La expresion lee el valor del JSON buscando por `[nombre_de_composicion][nombre_de_capa]`.

**Convencion requerida:** El nombre de la capa de texto en AE debe ser exactamente igual a la clave en el JSON.

**Ejemplo:**
- Composicion AE llamada `"0"`
- Capa de texto llamada `"nombre_producto"`
- JSON: `{ "0": { "nombre_producto": "Leche Alpina 1L" } }`
- Resultado: la capa muestra "Leche Alpina 1L" automaticamente

**Expresion que aplica:**
```
footage('archivo.json').sourceData[thisComp.name][thisLayer.name]
```

---

### 2. Opacidad condicional

**Como funciona:** Controla que elementos visuales se muestran u ocultan por variacion. Si el valor del campo JSON coincide con el nombre de la capa, esa capa tiene opacidad 100; si no, opacidad 0.

**Caso de uso tipico:** Mostrar diferentes badges, iconos o elementos segun el tipo de producto, campana o segmento.

**Ejemplo:**
- Campo JSON: `"tipo_oferta"` con valor `"descuento_20"`
- Capa llamada `"descuento_20"` → opacidad 100 (visible)
- Capa llamada `"2x1"` → opacidad 0 (oculta)

**Expresion que aplica:**
```
var d = footage('archivo.json').sourceData[thisComp.name];
(d['tipo_oferta'] == thisLayer.name) ? 100 : 0
```

---

### 3. Color dinamico

**Como funciona:** Lee un valor de color desde el JSON y lo aplica a las capas seleccionadas via efecto Fill de AE.

**Formatos soportados en el JSON:**
- Hexadecimal: `"#E30613"` o `"E30613"`
- Array RGB 0-255: `[227, 6, 19]`
- Array RGBA 0-255: `[227, 6, 19, 255]`
- Array RGB normalizado 0-1: `[0.89, 0.02, 0.07]`

**Caso de uso tipico:** Variaciones de color de marca por segmento, temporada o linea de producto.

---

### 4. Imagen dinamica

**Como funciona:** Es el mecanismo mas sofisticado del script. Las capas de imagen se "marcan" con un comentario especial en AE. Cuando se ejecuta la actualizacion, el script escanea todas las capas buscando ese marcador y reemplaza la fuente de footage con el archivo que indica el JSON.

**Marcador que se usa:** El campo "Comment" de la capa en AE se setea con el prefijo `AE_JSON_IMG_KEY:` seguido del nombre del campo JSON.

**Ejemplo:**
- Capa de imagen en AE con comentario: `AE_JSON_IMG_KEY:imagen_producto`
- JSON: `{ "0": { "imagen_producto": "leche_alpina.png" } }`
- El script busca en el panel Proyecto de AE un footage item llamado `"leche_alpina.png"` y reemplaza la fuente de esa capa con ese footage

**Requisito importante:** Las imagenes referenciadas en el JSON deben estar importadas en el proyecto AE antes de ejecutar el script. El script busca por nombre exacto del footage item.

---

## Estructura del JSON que consume el script

El script acepta dos formatos de JSON:

### Formato objeto (por indice de composicion)

```json
{
  "0": {
    "nombre_producto": "Leche Alpina 1L",
    "precio": "$3.500",
    "imagen_producto": "leche_alpina.png",
    "color_marca": "#E30613",
    "tipo_oferta": "precio_especial"
  },
  "1": {
    "nombre_producto": "Yogurt Alpina Fresa",
    "precio": "$2.800",
    "imagen_producto": "yogurt_alpina.png",
    "color_marca": "#0057A8",
    "tipo_oferta": "2x1"
  }
}
```

### Formato array (con campo "Comp" como indice)

```json
[
  {
    "Comp": 0,
    "nombre_producto": "Leche Alpina 1L",
    "precio": "$3.500",
    "imagen_producto": "leche_alpina.png"
  },
  {
    "Comp": 1,
    "nombre_producto": "Yogurt Alpina Fresa",
    "precio": "$2.800",
    "imagen_producto": "yogurt_alpina.png"
  }
]
```

**Regla de correspondencia:** El nombre de la composicion en AE (o el valor del campo "Comp") determina que fila del JSON usa esa composicion. Si la composicion se llama "0", usa el indice 0 del JSON.

---

## Convencion de nombres — reglas criticas

Para que el script funcione correctamente, el proyecto AE debe seguir estas convenciones:

| Elemento | Convencion |
|---|---|
| Nombre de composicion | Indice numerico de su fila en el JSON: `"0"`, `"1"`, `"2"`... |
| Nombre de capa de texto | Exactamente igual a la clave JSON: `"nombre_producto"`, `"precio"`, etc. |
| Capa de imagen dinamica | Comentario en AE: `AE_JSON_IMG_KEY:nombre_campo_json` |
| Archivo de imagen en JSON | Nombre exacto del footage item importado en el proyecto AE |

---

## Modulo secundario: importador de Illustrator

El script incluye una seccion adicional independiente del flujo de datos. Usando BridgeTalk (el sistema de comunicacion inter-app de Adobe), permite importar directamente de Illustrator a AE:

- **Textos**: importados como capas de texto nativas en AE
- **Formas**: importadas como Shape Layers en AE, preservando colores solidos, gradientes lineales/radiales y trazos

Esta capacidad es util para el flujo de **creacion de componentes** (Lizeth construye elementos en Illustrator y los pasa a AE), no para el flujo de automatizacion de datos.

---

## Caminos de integracion con la plataforma

> Las dos opciones estan documentadas aqui como decisiones de arquitectura pendientes. No son mutuamente excluyentes — pueden adoptarse en fases distintas.

### Camino A: La plataforma genera el JSON (integracion de datos)

**Descripcion:** La plataforma reemplaza el trabajo manual de preparar el JSON. El usuario sube el CSV o conecta Google Sheets en la interfaz web, mapea las columnas a los campos del video, y el sistema genera automaticamente el JSON en el formato que el script de AE ya entiende.

**Flujo resultante:**
```
Cliente entrega datos
→ Cualquier persona del equipo sube CSV a la plataforma
→ Plataforma genera JSON en el formato correcto
→ JSON se descarga o se pasa al script de AE
→ Lizeth (o quien tenga AE) ejecuta el script y lanza el render
→ Videos se suben a la plataforma para QC y entrega
```

**Ventajas:**
- Adopcion inmediata — no requiere cambios en el proyecto AE ni en el workflow de Lizeth
- Elimina el trabajo manual de preparar el JSON (la tarea mas repetitiva)
- Cualquier persona del equipo puede hacer la configuracion de datos
- Riesgo tecnico bajo

**Limitaciones:**
- El render sigue siendo local (AE en la maquina de alguien)
- No escala a cientos de variaciones simultaneas
- Sigue dependiendo de que alguien con AE ejecute el proceso

**Cuando tiene sentido adoptar este camino:** etapa temprana de la plataforma, para validar el flujo con produccion real sin redisenar la arquitectura de AE. Buen "quick win" de valor demostrable.

---

### Camino B: AE como fabrica de componentes, Remotion como motor de escala

**Descripcion:** AE sigue siendo la herramienta de creacion de animaciones y componentes visuales. Sus outputs (videos con canal alfa) se registran como componentes en la plataforma. Remotion los compone con los datos del cliente y genera todas las variaciones en la nube.

**Flujo resultante:**
```
Lizeth crea animacion en AE (cortinilla, overlay, cierre)
→ Exporta con canal alfa (ProRes 4444 o WebM)
→ Sube el asset a la plataforma → queda registrado como componente
→ Producer selecciona el componente en la plataforma
→ Conecta datos (CSV/Sheets)
→ Plataforma genera variaciones con Remotion en la nube
→ Videos disponibles para QC y entrega sin render local
```

**Ventajas:**
- Render en la nube — escala ilimitada, sin bloquear maquinas
- Lizeth se libera completamente de la carga operativa de datos y renders
- El pipeline completo vive en la plataforma
- AE queda exclusivamente como herramienta de creacion de alta calidad

**Limitaciones:**
- Efectos muy complejos de AE (expressions avanzadas, plugins especificos) no son exportables directamente con transparencia
- Requiere que los componentes AE sean lo suficientemente "atomicos" para ser reutilizables
- Mayor esfuerzo de implementacion — requiere que la Fase 5 este completamente definida

**Cuando tiene sentido adoptar este camino:** cuando el volumen de produccion justifica la escala en la nube y cuando los componentes base ya son estables y reutilizables.

---

### Estrategia hibrida posible

Nada impide arrancar con el Camino A para los flujos urgentes mientras el Camino B madura. El Data Engine de la plataforma (Fase 3) que genera variaciones desde CSV/Sheets puede generar tambien el JSON en el formato del script de AE como un "modo de exportacion alternativo". Luego, conforme se construye la libreria de componentes Remotion (Fases 1 y 2), el Camino B se va activando componente por componente.

---

## Decisiones pendientes

Las siguientes preguntas deben resolverse antes de disenar la Fase 5 del roadmap:

| # | Pregunta | Impacto |
|---|---|---|
| D1 | ¿AE se queda en el pipeline de render o solo en el de creacion? | Define si se necesita un servidor con AE o si el render siempre es local |
| D2 | ¿Se adopta el Camino A, el B, o los dos en fases distintas? | Define la arquitectura de la Fase 5 y el orden de implementacion |
| D3 | ¿Como se manejan los templates AE existentes? | ¿Se migran a la convencion del script? ¿Se documenta la convencion para templates nuevos? |
| D4 | ¿Se puede automatizar el trigger de AE desde la plataforma? | `aerender` (CLI de AE) lo permite tecnicamente, pero requiere licencia en servidor |
| D5 | ¿Que efectos de AE son exportables con transparencia y cuales no? | Lizeth debe mapear que elementos de su libreria actual son "exportables" vs cuales requieren Camino A |

---

## Implicaciones para el equipo de desarrollo

### Data Engine (Fase 3)
Al disenar el modulo de exportacion de datos, incluir la opcion de generar el JSON en el formato del script AE (Camino A). Los campos mapeados en la UI se traducen directamente a claves del JSON indexadas por numero de composicion.

### Asset Manager (Fases 2-3)
Los assets de imagen que se referenciaran en el JSON del Camino A deben estar disponibles en la plataforma y tener nombres consistentes con los nombres de los footage items en AE.

### Component Registry (Fases 1-2)
Si se adopta el Camino B, los componentes registrados podran tener dos "fuentes": (a) componentes Remotion nativos o (b) videos con canal alfa exportados de AE. El registro debe soportar ambos tipos.

### Fase 5 — Puente AE
El alcance de esta fase debe definirse DESPUES de que el equipo resuelva las decisiones D1 a D5. No debe implementarse sobre supuestos.

---

## Implicaciones para el equipo de QA

- Los templates AE deben seguir la convencion de nombres documentada — cualquier desviacion hace que el script no vincule los datos correctamente
- Las imagenes referenciadas en el JSON deben existir en el proyecto AE con el nombre exacto — una diferencia de mayusculas o un espacio rompe el reemplazo de fuente
- El Camino A requiere verificar que el JSON generado por la plataforma produce el mismo resultado que el JSON preparado manualmente por Lizeth
- El Camino B requiere verificar que los videos con canal alfa exportados de AE se compositan correctamente en Remotion sin artefactos de transparencia

---

## Implicaciones para el equipo UX/UI

- En el Camino A, la interfaz de mapeo de columnas (Data Engine) debe generar como output un JSON descargable en el formato del script. Esto puede ser un boton "Exportar para AE" en la pantalla de mapping.
- En el Camino B, el flujo de "Subir componente" en el Asset Manager debe incluir la opcion de marcar un asset como "componente AE con canal alfa" y configurar sus parametros de composicion (duracion, posicion, escala).
- El perfil Designer/Lizeth debe tener acceso a gestionar tanto los componentes Remotion nativos como los assets AE registrados desde la misma interfaz.

---

*Documento creado con base en el analisis del script AE `Automation Script` y en las conversaciones de definicion del proyecto — Mayo 2026*
