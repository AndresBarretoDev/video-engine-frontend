# OP Video Engine — Analisis Competitivo

**Version:** 1.0
**Fecha:** Marzo 2026
**Fuente:** Evaluacion interna del equipo Omnicom Production

---

## Resumen Ejecutivo

El equipo evaluo 5 herramientas del mercado para video automation. Ninguna cubre el caso de uso completo. Todas tienen al menos una limitacion critica: costo prohibitivo, dependencia de After Effects, bulk production no funcional, o animaciones demasiado basicas. La decision es construir una solucion propia con Remotion como base.

---

## Herramientas Evaluadas

### 1. Templater (dataclay.com)

**Que es:** Plugin de After Effects para crear videos data-driven desde Google Sheets o TSV.

**Ventajas:**
- Facil de entender y usar pese a documentacion antigua
- Conexion nativa con Google Sheets con actualizacion casi en tiempo real
- Archivos relativamente ligeros (assets en carpeta externa, no dentro del proyecto)
- Sistema de naming funcional con sufijos/prefijos
- Sistema QUE con bots guiados por IA para automatizar procesos
- Permite cargar Google Sheet externa para que terceros hagan ajustes sin intervencion humana

**Desventajas:**
- Costo elevado: ~$1.500.000 COP/mes (Templater) + ~$2.800.000 COP/mes (QUE). POR USUARIO.
- Sin el sistema QUE, todo lo hace el script de Automation manualmente
- No permite ajustes manuales una vez configurado el pipeline

**Veredicto:** Hace bien la conexion datos→video, pero el costo es prohibitivo para escalar a multiples usuarios.

---

### 2. Plainly (plainlyvideos.com)

**Que es:** Plataforma cloud para automatizar rendering de proyectos After Effects sin equipo local.

**Funcionalidades clave:**
- Automatizacion de AE: convierte .aep en videos dinamicos masivamente
- Integracion de datos: Google Sheets, CSV, API con "auto-match"
- Elementos dinamicos: sustitucion automatica de texto, imagen, color, audio
- Logica condicional: visibilidad de capas On/Off con reglas True/False
- Rendering escalable en la nube

**Ventajas:**
- Integracion nativa con AE via plugin gratuito (sincronizacion directa)
- Gestion multi-formato automatica
- Automatizacion de campos dinamicos (bindings con prefijo "edit")
- Versatilidad CSV para automatizar color, imagen, audio, visibilidad de capas
- Nomenclatura de salida personalizable, soporta MP4 y MOV

**Desventajas:**
- Sin gestion de activos nativos: necesita HUB externo para URLs de imagenes
- Restricciones con controladores: problemas con capas que tienen muchos controladores AE
- Estabilidad de integraciones: fallos intermitentes con elementos dinamicos
- Conflictos de formato de texto: bug con All Caps que genera errores en exportacion

**Veredicto:** Buena arquitectura conceptual (especialmente la logica condicional y el cloud rendering), pero la ejecucion es inestable y sigue dependiendo de After Effects como fuente.

---

### 3. AIVE

**Que es:** Plataforma enfocada en edicion y optimizacion de contenido audiovisual con IA.

**Funcionalidades clave:**
- Analisis automatizado de escenas y estructura del video mediante IA
- Adaptacion automatica a multiples proporciones y formatos
- Generacion automatica de subtitulos sincronizados
- Creacion y gestion de multiples versiones derivadas
- Exportacion individual de cada pieza adaptada

**Ventajas:**
- Analisis automatizado de video (reconocimiento de escenas sin intervencion manual)
- Adaptacion de formatos y proporciones para multiples plataformas sociales
- Generacion de subtitulos con IA
- Flujo de trabajo centralizado para video
- Interfaz enfocada exclusivamente en video

**Desventajas:**
- Subtitulos con errores que requieren correccion manual
- Descarga individual obligatoria (no bulk/batch download)
- Integraciones limitadas (no conecta Google Sheets ni recursos estructurados)
- Precision variable de IA (requiere supervision humana constante)
- No soporta videos con canal alfa/transparencia

**Veredicto:** Buenas capacidades de IA (analisis de escenas, subtitulos, resizing), pero funciona como isla aislada sin integraciones. Util como referencia de features para la Fase 6.

---

### 4. CreateTotally

**Que es:** Herramienta compatible con multiples archivos de trabajo (AE, Figma, GWD, PSD) con enfoque en QC y revision.

**Funcionalidades clave:**
- Soporte multi-archivo: After Effects, Figma, GWD para anuncios HTML
- Plataforma de QC: comentarios, comparacion de versiones, aprobaciones
- Integra hojas de calculo para datos dinamicos

**Ventajas:**
- Facil de manejar una vez entendido
- Admite varios tipos de archivos (video y estaticos: PSD, AI, AE, Figma, GWD)
- Buena para personas que no manejan Adobe
- Revisiones de comparacion (version anterior vs nueva, con comentarios en sitios especificos)
- Plugin propio para AE que verifica nombres y empaqueta correctamente
- Soporta Expresiones de AE, dando flexibilidad en animaciones (ej: CTA se adapta a extension del texto)

**Desventajas:**
- Requiere un archivo por cada medida/formato (9:16, 16:9, 1:1 = 3 archivos separados)
- No se pueden cambiar colores, tipografias, diagramacion directamente en la plataforma (hay que hacerlo local y volver a cargar)
- Tiempo de produccion largo (~10 minutos por render)
- No se pueden corregir errores detectados a mitad de camino (hay que reiniciar desde cero)
- Produccion Bulk NO funciona (aun en Beta): hay que llenar campos a mano
- Al pegar informacion para bulk, algunos campos se reinician causando errores
- No posee metodo de naming automatico

**Veredicto:** Excelente sistema de QC y revision de comparacion. Pero la produccion bulk esta rota y la edicion requiere ir y volver al software local. No sirve como motor de produccion, pero su flujo de QC es referencia para la Fase 4.

---

### 5. Celtra

**Que es:** Plataforma cloud para crear videos y estaticos con datos dinamicos, optimizada para produccion a escala.

**Funcionalidades clave:**
- Integracion de datos dinamicos via hojas de calculo incorporadas
- Preview y QC avanzado con filtrado de piezas para campanas de gran volumen
- Resizing automatico con IA
- Renderizado en la nube

**Ventajas:**
- Creacion 100% en la nube (sin software externo ni licencias adicionales)
- Interfaz simple y amigable
- Biblioteca compartida entre video y estaticos (elementos vinculados se actualizan en ambos)
- Multi-usuario: trabajo sincronico en un mismo proyecto
- Presets de animacion que agilizan el proceso

**Desventajas:**
- Videos simples: solo permite procesos basicos (escala, posicion, rotacion, opacidad)
- Sin expresiones: a diferencia de AE, no se pueden potenciar animaciones con codigo
- Efectos limitados: sin VFX ni opciones esteticas avanzadas
- Errores impredecibles: ocasionalmente imagenes movidas, textos desbordados, objetos desalineados

**Veredicto:** Mejor experiencia cloud del grupo (simple, multi-usuario, sin dependencia de AE). Pero las animaciones son demasiado basicas para el nivel de produccion que necesitamos. Buena referencia para la experiencia de usuario de la plataforma.

---

## Matriz Comparativa

| Capacidad | Templater | Plainly | AIVE | CreateTotally | Celtra | **OP Video Engine** |
|---|---|---|---|---|---|---|
| Cloud native | No | Si | Si | Si | Si | **Si** |
| Sin dependencia AE | No | No | Si | Parcial | Si | **Si (hibrido)** |
| Data-driven (CSV/Sheets) | Si | Si | No | Beta rota | Si | **Si** |
| Bulk production | Si | Si | No | No | Si | **Si** |
| Multi-formato automatico | No | Si | Si | No | Si | **Si** |
| Animaciones avanzadas | Si (AE) | Si (AE) | Basicas | Si (AE) | Basicas | **Si (Remotion)** |
| QC y aprobacion | No | No | No | Si | Si | **Si** |
| Canal alfa | Si (AE) | Si (AE) | No | Si (AE) | No | **Si** |
| Costo por usuario | Alto | Medio | Medio | Medio | Alto | **Bajo (propio)** |
| Asset management | No | No | No | Parcial | Si | **Si** |
| Logica condicional | No | Si | No | No | No | **Si** |
| IA integrada | Parcial | No | Si | No | Si | **Si (Fase 6)** |

---

## Conclusiones para OP Video Engine

### Que copiar (las mejores ideas del mercado):
1. **De Plainly:** Logica condicional con reglas True/False, auto-match de campos, bindings dinamicos
2. **De Celtra:** Experiencia cloud simple, multi-usuario, biblioteca compartida
3. **De CreateTotally:** Sistema de QC con comparacion de versiones y comentarios
4. **De AIVE:** Analisis de escenas con IA, subtitulos automaticos, resizing inteligente
5. **De Templater:** Conexion Google Sheets en tiempo real, sistema de naming

### Que evitar (errores del mercado):
1. No depender de After Effects como motor obligatorio
2. No cobrar por usuario de forma prohibitiva
3. No lanzar bulk production hasta que funcione perfectamente
4. No ignorar la gestion de assets (necesita repositorio nativo)
5. No sacrificar calidad de animacion por simplicidad (el error de Celtra)

### Ventaja diferencial de OP Video Engine:
- **Remotion como motor:** Animaciones en codigo tan poderosas como AE, pero escalables en la nube
- **Pipeline unificado:** Desde assets hasta entrega al cliente, todo en un lugar
- **Sin costo de licencia por usuario:** Stack open source (Remotion, React, PostgreSQL)
- **Puente hibrido con AE:** No elimina AE, lo complementa para casos complejos
- **Construido para el workflow real de Omnicom:** No es un producto generico, es LA herramienta del equipo

---

*Documento basado en evaluacion interna del equipo — Febrero/Marzo 2026*
