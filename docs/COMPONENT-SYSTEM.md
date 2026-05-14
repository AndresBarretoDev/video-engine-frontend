# OP Video Engine — Sistema de Componentes

**Version:** 1.1
**Fecha:** Abril 2026
**Cambio v1.1:** Agregado estado de implementacion por componente

---

## Filosofia: Atomic Design para Video

El sistema de componentes de OP Video Engine sigue el modelo de Atomic Design adaptado a video. La idea central es que cualquier video puede descomponerse en piezas reutilizables que se ensamblan como bloques de LEGO.

```
ATOMO          ->  Pieza minima, no se divide mas
                  Ejemplo: un texto animado, un badge de precio

MOLECULA       ->  Combinacion de atomos con una funcion
                  Ejemplo: una cortinilla de entrada (logo + texto + transicion)

ORGANISMO      ->  Template completo de video
                  Ejemplo: video promocional (intro + contenido + overlays + cierre)
```

Este modelo reemplaza lo que AtomX provee en After Effects, pero en codigo (Remotion/React), lo que permite parametrizacion por datos, rendering en la nube, y escala ilimitada.

---

## Estado de Implementacion

### Ubicacion en el repositorio

```
src/remotion/
  components/
    atoms/          -> TextBlock, LogoReveal, ShapeElement, PricePatch, VideoClip, AudioTrack, SubtitleTrack
    molecules/      -> CortinillaEntrada, CortinillaCierre, ProductOverlay, PromoBar, LowerThird
  compositions/     -> atom-previews, molecule-previews, organism-previews, format-showcase
  schemas/          -> Zod schemas para props de cada componente
  types/            -> Tipos TypeScript especificos de video
  utils/
    timing-utils.ts       -> Calculos de frames, delays
    animation-helpers.ts  -> Spring, easing, transiciones
    format-utils.ts       -> Conversion de resolucion (1:1, 9:16, 16:9)
```

### Estado por componente

| Tipo | Componente | Scaffolded | Implementado | Animaciones | Multi-formato |
|------|-----------|:----------:|:------------:|:-----------:|:-------------:|
| Atomo | TextBlock | Si | Pendiente | Pendiente | Pendiente |
| Atomo | PricePatch | Si | Pendiente | Pendiente | Pendiente |
| Atomo | LogoReveal | Si | Pendiente | Pendiente | Pendiente |
| Atomo | ImageFrame | No | Pendiente | Pendiente | Pendiente |
| Atomo | ShapeElement | Si | Pendiente | Pendiente | Pendiente |
| Atomo | VideoClip | Si | Pendiente | N/A | Pendiente |
| Atomo | AudioTrack | Si | Pendiente | N/A | N/A |
| Atomo | SubtitleTrack | Si | Pendiente | Pendiente | Pendiente |
| Molecula | CortinillaEntrada | Si | Pendiente | Pendiente | Pendiente |
| Molecula | CortinillaCierre | Si | Pendiente | Pendiente | Pendiente |
| Molecula | ProductOverlay | Si | Pendiente | Pendiente | Pendiente |
| Molecula | PromoBar | Si | Pendiente | Pendiente | Pendiente |
| Molecula | LowerThird | Si | Pendiente | Pendiente | Pendiente |
| Organismo | PromoVideoTemplate | Composicion | Pendiente | Pendiente | Pendiente |
| Organismo | StoryTemplate | Composicion | Pendiente | Pendiente | Pendiente |
| Organismo | CTVTemplate | Composicion | Pendiente | Pendiente | Pendiente |
| Organismo | BannerVideoTemplate | Composicion | Pendiente | Pendiente | Pendiente |

**"Scaffolded"** = archivos creados con tipos, props interface, y schema Zod definido.
**"Composicion"** = existe como composicion en Remotion Studio para preview, pero sin logica interna completa.
**"Implementado"** = logica de rendering, animaciones, y adaptacion de formato funcional.

### Remotion Studio & Preview

- `remotion.config.ts` configurado en el frontend
- Scripts: `pnpm remotion:studio` y `pnpm remotion:preview`
- Composiciones de preview: atom-previews, molecule-previews, organism-previews, format-showcase
- Storybook (v10.3) disponible para componentes UI (no Remotion)

### Skills de Remotion Best Practices

Documentadas en `.agents/skills/remotion-best-practices/` con reglas para:
- Imagenes, text animations, assets, captions
- Light leaks, measuring text, parameters, Tailwind
- Get video duration, transcribe captions

---

## Anatomia de un Video

Todo video producido por la plataforma sigue una estructura modular:

```
+-------------------------------------------------+
|  INTRO (Cortinilla de Entrada)                  |
|  Molecula: logo + transicion + jingle           |
|  Duracion tipica: 1-3 segundos                  |
+-------------------------------------------------+
|  CONTENIDO PRINCIPAL                            |
|  Video base / clip / secuencia de imagenes      |
|  Duracion: variable (5-60 segundos)             |
|                                                 |
|  +-------------------------+                    |
|  |  OVERLAY: ProductOverlay |  <- aparece en    |
|  |  (imagen + precio)       |    momento X      |
|  +-------------------------+                    |
|                                                 |
|  +-------------------------+                    |
|  |  OVERLAY: PromoBar       |  <- aparece en    |
|  |  (mensaje promocional)   |    momento Y      |
|  +-------------------------+                    |
|                                                 |
|  +-------------------------+                    |
|  |  OVERLAY: LowerThird    |  <- aparece en     |
|  |  (titulo + subtitulo)    |    momento Z      |
|  +-------------------------+                    |
+-------------------------------------------------+
|  OUTRO (Cortinilla de Cierre / EndCard)         |
|  Molecula: logo + CTA + legal                   |
|  Duracion tipica: 2-4 segundos                  |
+-------------------------------------------------+
```

---

## Catalogo de Atomos

### TextBlock
Texto animado con multiples estilos de entrada.

| Prop | Tipo | Descripcion |
|---|---|---|
| content | string | Texto a mostrar |
| fontFamily | string | Fuente (del design system de la marca) |
| fontSize | number | Tamano en px |
| fontWeight | number | Peso (400, 600, 700, 900) |
| color | string | Color del texto |
| backgroundColor | string? | Fondo opcional (chip/badge) |
| animation | enum | "fade-in", "slide-up", "slide-left", "slide-right", "scale-up", "typewriter", "bounce" |
| delay | number | Frames de delay antes de animar |
| duration | number | Frames que dura la animacion de entrada |
| maxWidth | number? | Ancho maximo antes de wrap |
| textAlign | enum | "left", "center", "right" |

### PricePatch
Badge de precio con soporte para descuento.

| Prop | Tipo | Descripcion |
|---|---|---|
| price | string | Precio actual (ej: "$12.990") |
| originalPrice | string? | Precio original tachado (si hay descuento) |
| currency | string | Moneda (COP, EUR, USD) |
| backgroundColor | string | Color del badge |
| textColor | string | Color del texto del precio |
| size | enum | "small", "medium", "large" |
| animation | enum | "pop", "slide-in", "fade" |
| delay | number | Frames de delay |

### LogoReveal
Logo de marca con animacion de entrada.

| Prop | Tipo | Descripcion |
|---|---|---|
| logoUrl | string | URL del logo (SVG o PNG) |
| width | number | Ancho del logo |
| height | number | Alto del logo |
| animation | enum | "scale-bounce", "fade-in", "slide-down", "spin-in", "morph" |
| delay | number | Frames de delay |
| duration | number | Duracion de la animacion |

### ImageFrame
Imagen o packshot con efectos visuales.

| Prop | Tipo | Descripcion |
|---|---|---|
| src | string | URL de la imagen |
| width | number | Ancho |
| height | number | Alto |
| objectFit | enum | "cover", "contain", "fill" |
| animation | enum | "fade-in", "zoom-in", "parallax", "ken-burns", "slide" |
| borderRadius | number? | Radio de borde |
| shadow | boolean | Sombra drop |
| overlay | string? | Color de overlay semitransparente |
| delay | number | Frames de delay |

### ShapeElement
Formas decorativas animadas.

| Prop | Tipo | Descripcion |
|---|---|---|
| type | enum | "circle", "rectangle", "star", "line", "wave", "blob" |
| color | string | Color de relleno |
| strokeColor | string? | Color de borde |
| strokeWidth | number? | Ancho de borde |
| width | number | Ancho |
| height | number | Alto |
| animation | enum | "scale-up", "rotate", "pulse", "draw-in", "morph" |
| opacity | number | Opacidad (0-1) |
| delay | number | Frames de delay |

### VideoClip
Clip de video como capa.

| Prop | Tipo | Descripcion |
|---|---|---|
| src | string | URL del video |
| startFrom | number | Frame de inicio del clip |
| endAt | number? | Frame de fin (opcional, usa duracion completa) |
| volume | number | Volumen (0-1) |
| playbackRate | number | Velocidad (0.5x - 2x) |
| objectFit | enum | "cover", "contain" |
| hasAlpha | boolean | Si el video tiene canal alfa |
| loop | boolean | Si se repite |

### AudioTrack
Capa de audio (musica de fondo, SFX, voiceover).

| Prop | Tipo | Descripcion |
|---|---|---|
| src | string | URL del audio |
| volume | number | Volumen (0-1) |
| fadeInDuration | number | Frames de fade in |
| fadeOutDuration | number | Frames de fade out |
| startFrom | number | Frame de inicio |
| loop | boolean | Si se repite |

### SubtitleTrack
Subtitulos sincronizados con el audio.

| Prop | Tipo | Descripcion |
|---|---|---|
| segments | array | Lista de {text, startFrame, endFrame} |
| fontFamily | string | Fuente |
| fontSize | number | Tamano |
| color | string | Color del texto |
| backgroundColor | string? | Fondo del subtitulo |
| position | enum | "bottom", "top", "center" |
| animation | enum | "fade", "slide-up", "pop" |

---

## Catalogo de Moleculas

### CortinillaEntrada
Intro animado de marca.

**Composicion:** LogoReveal + ShapeElement[] + TextBlock (claim) + AudioTrack (jingle)

| Prop | Tipo | Descripcion |
|---|---|---|
| brandId | string | ID de la marca (carga tokens automaticamente) |
| claim | string? | Texto adicional bajo el logo |
| variant | enum | "minimal", "energetic", "elegant" |
| duration | number | Duracion en frames |

### CortinillaCierre (EndCard)
Cierre con CTA y logo.

**Composicion:** LogoReveal + TextBlock (CTA) + ShapeElement[] + TextBlock (legal)

| Prop | Tipo | Descripcion |
|---|---|---|
| brandId | string | ID de la marca |
| ctaText | string | Texto del call to action |
| legalText | string? | Texto legal (letra pequena) |
| variant | enum | "standard", "bold", "minimal" |
| duration | number | Duracion en frames |

### ProductOverlay
Overlay de producto con precio.

**Composicion:** ImageFrame (packshot) + PricePatch + TextBlock (nombre) + TextBlock? (peso/detalle)

| Prop | Tipo | Descripcion |
|---|---|---|
| productName | string | Nombre del producto |
| productImage | string | URL de la imagen del producto |
| price | string | Precio |
| originalPrice | string? | Precio original (si descuento) |
| weight | string? | Peso o detalle adicional |
| position | enum | "bottom-right", "bottom-left", "center", "full-width" |
| animation | enum | "slide-in", "pop", "fade" |

### PromoBar
Barra de mensaje promocional.

**Composicion:** ShapeElement (fondo) + TextBlock (mensaje) + ShapeElement? (icono)

| Prop | Tipo | Descripcion |
|---|---|---|
| message | string | Mensaje promocional |
| backgroundColor | string | Color de fondo de la barra |
| textColor | string | Color del texto |
| position | enum | "top", "bottom" |
| icon | string? | URL de icono opcional |
| animation | enum | "slide-in", "expand", "fade" |

### LowerThird
Titulo + subtitulo con barra inferior.

**Composicion:** ShapeElement (barra) + TextBlock (titulo) + TextBlock (subtitulo)

| Prop | Tipo | Descripcion |
|---|---|---|
| title | string | Titulo principal |
| subtitle | string? | Subtitulo |
| barColor | string | Color de la barra |
| position | enum | "bottom-left", "bottom-right" |
| animation | enum | "slide-in", "wipe", "fade" |

---

## Catalogo de Organismos (Templates)

### PromoVideoTemplate
Video promocional estandar para redes sociales y display.

**Estructura:**
1. CortinillaEntrada (1-3s)
2. VideoClip o ImageFrame (contenido principal)
3. ProductOverlay (aparece durante el contenido)
4. PromoBar (aparece durante el contenido)
5. CortinillaCierre (2-4s)

**Formatos:** 16:9, 9:16, 1:1

### StoryTemplate
Video vertical optimizado para Stories/Reels/TikTok.

**Estructura:**
1. Hook visual (0.5-1s) — ShapeElement + TextBlock impactante
2. Contenido rapido — VideoClip o secuencia de ImageFrames
3. ProductOverlay (centrado, grande)
4. CTA final con swipe-up indicator

**Formatos:** 9:16 (principal), 4:5

### CTVTemplate
Video largo para Connected TV.

**Estructura:**
1. CortinillaEntrada (3-5s, mas elaborada)
2. Contenido largo (15-60s)
3. Overlays periodicos (productos, datos, mensajes)
4. CortinillaCierre (3-5s, con contacto/web)

**Formatos:** 16:9

### BannerVideoTemplate
Video corto para display ads animados.

**Estructura:**
1. ImageFrame/VideoClip (fondo)
2. TextBlock (mensaje principal)
3. PricePatch (si aplica)
4. LogoReveal + TextBlock (CTA)

**Formatos:** Multiples (300x250, 728x90, 160x600, etc.)

---

## Sistema de Brand Config

Cada marca tiene un archivo de configuracion que define sus tokens y componentes predeterminados.

En el backend, los Brand Tokens se almacenan como JSON en el campo `tokens` del modelo Brand (Prisma). Se acceden via `GET /api/brands/:id/tokens`.

```typescript
interface BrandConfig {
  id: string
  name: string

  // Design Tokens
  tokens: {
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
      textInverse: string
    }
    fonts: {
      heading: { family: string, weights: number[] }
      body: { family: string, weights: number[] }
    }
    animation: {
      defaultEasing: string
      defaultDuration: number
      springConfig: { damping: number, stiffness: number, mass: number }
    }
    spacing: {
      padding: number
      gap: number
    }
  }

  // Assets de marca
  assets: {
    logo: { url: string, width: number, height: number }
    logoWhite?: { url: string, width: number, height: number }
    jingle?: string
    sfxTransition?: string
    fonts: string[]
  }

  // Componentes predeterminados de la marca
  defaults: {
    cortinillaEntrada: string
    cortinillaCierre: string
    promoBarStyle: "top" | "bottom"
    productOverlayPosition: "bottom-right" | "bottom-left" | "center"
  }
}
```

---

## Reglas de Responsividad

Cada componente debe adaptarse automaticamente segun el formato del video:

### 16:9 (Horizontal — YouTube, CTV, Display)
- Overlays en esquinas o bordes
- Texto con tamano estandar
- Logo en esquina superior
- Mas espacio para contenido visual

### 9:16 (Vertical — TikTok, Stories, Reels)
- Overlays centrados o full-width
- Texto mas grande (legibilidad en movil)
- Logo centrado arriba
- Contenido vertical-first

### 1:1 (Cuadrado — Instagram Feed, Facebook)
- Layout balanceado centro
- Texto mediano
- Overlays en mitad inferior
- Composicion simetrica

**Implementacion:** Cada componente recibe `format` como prop y ajusta su layout interno. El organismo decide la posicion general, el componente decide su layout interno.

---

## Flujo de Creacion de un Nuevo Componente

1. **Diseno:** El disenador crea el componente visual en Figma con todas sus variantes
2. **Spec:** Se documenta: props, animaciones, tokens que usa, formatos soportados
3. **Implementacion:** Developer crea el componente Remotion siguiendo la spec
4. **Preview:** Se verifica en Remotion Studio con datos de prueba
5. **Test:** Se prueba en todos los formatos (16:9, 9:16, 1:1)
6. **Registro:** Se registra en el Component Registry con su schema Zod
7. **Documentacion:** Se agrega al catalogo con ejemplo y preview

---

*Documento vivo — el catalogo crece con cada sprint*
