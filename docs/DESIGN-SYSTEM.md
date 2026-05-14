# OP Video Engine — Design System

**Version:** 1.1
**Fecha:** Abril 2026
**Design System:** Vibe Coding
**Estado:** Implementado — tokens en codigo, CSS variables generadas, integrado con Tailwind v4
**Cambio v1.1:** Agregada seccion de implementacion real en el repo

---

## Descripcion General

El design system de OP Video Engine se llama **Vibe Coding** y esta definido a traves de archivos JSON que actuan como fuente de verdad (Source of Truth) para toda decision visual del proyecto. Estos tokens gobiernan tanto la interfaz web de la plataforma (Next.js + Tailwind + shadcn/ui) como los componentes de video (Remotion).

Ningun color, tipografia, espaciado, radio, borde o animacion debe hardcodearse. Todo debe referenciar los tokens definidos en estos archivos.

---

## Archivos Fuente (Source of Truth)

| Archivo | Categoria | Version | Descripcion |
|---|---|---|---|
| `colors_system.json` | Colores | 2.0.0 | Paleta raw (op_blue 50-950), colores semanticos por superficie y componente (button, card, secondary actions), transparencias con escala alpha |
| `typography_system.json` | Tipografia | 2.2.0 | Familia Mulish. Escalas: display (2xl-m), headings (h1-h4), body (large-xsmall), caption, CTA. Pesos, line-heights y paragraph-spacing por nivel |
| `spacing_system.json` | Espaciado | 1.0.0 | Padding y gap semantico por contexto: button, card, field, container, navigation. Incluye utility gaps (4-32px) y negativos |
| `grid_system.json` | Layout | 1.1.0 | Grid de 12 columnas. Contenedor main (1376px), altern (1135px con sidebar). Sidebar 141px. Gutters 24/16px. Margenes desktop 32/24px |
| `motion_system.json` | Animacion | 1.0.0 | Duraciones (fast 120ms, standard 300ms, slow 400ms, story 600ms). Easings (ui, premium, editorial). Reglas semanticas por componente (button, card, modal, dropdown, tooltip). Desplazamientos y guias de performance |
| `strokes_and_radius_system.json` | Bordes y Radios | 1.0.0 | Strokes (none/thin 1px/medium 2px/thick 4px). Border-radius escala (2-32px + infinite). Regla de nested radius: outer - padding = inner |
| `status_colors.json` | Estados | 1.1.0 | Colores semanticos de estado: approved, rejected, warning, pending, in_review, delivered, client_approved. Cada estado con background, text, border e icon. Incluye mapeo de estados de render job a colores |

---

## Implementacion en el Repositorio

### Ubicacion de archivos

```
src/styles/tokens/
  source/                     <-- SOURCE OF TRUTH (7 JSONs)
    colors_system.json
    typography_system.json
    spacing_system.json
    grid_system.json
    motion_system.json
    strokes_and_radius_system.json
    status_colors.json
  colors.css                  <-- CSS variables generadas
  typography.css
  spacing.css
  grid.css
  motion.css
  borders.css
  status.css

src/styles/main.css           <-- Importa los 7 archivos CSS
src/app/globals.css           <-- Tailwind v4 @theme con tokens, shadcn/ui variables
```

### Flujo de tokens

```
JSON source files -> CSS variables (var(--nombre)) -> Tailwind v4 @theme -> Clases utilitarias
```

1. Los JSONs en `source/` son la verdad absoluta
2. Cada JSON se traduce a un archivo CSS con variables (ej: `--op-blue-600: #4361EF`)
3. `globals.css` mapea estas variables al `@theme inline` de Tailwind v4
4. Los componentes usan clases Tailwind (`bg-op-blue-600`) o variables CSS directamente

### Integracion con shadcn/ui

Las variables semanticas de shadcn/ui estan mapeadas a los tokens de Vibe Coding en `globals.css`:
- `:root` = light mode (para compatibilidad con shadcn/ui)
- `.dark` = Vibe Coding surfaces (modo por defecto)
- `<html className="dark">` aplicado en layout.tsx

### Fuente tipografica

**Mulish** cargada via Next.js font optimization en `layout.tsx`. Reemplaza Geist (default de Next.js).

### Component-to-Token Mapping

Existe una referencia explicita en `.claude/references/component-token-mapping.md` que mapea cada propiedad de componente CSS a su variable exacta. Ejemplo:

| Componente | Propiedad | Variable CSS | JSON Source |
|---|---|---|---|
| Button primary | background | `--btn-principal-light` a `--btn-principal-medium` | colors_system.json |
| Button primary | border-radius | `--radius-infinite` | strokes_and_radius_system.json |
| Card | background | `--surface-level-2` | colors_system.json |
| Card | border-radius | `--radius-16` | strokes_and_radius_system.json |

**Regla critica:** Nunca hardcodear valores en archivos CSS de componentes. Siempre usar `var(--token)`.

---

## Jerarquia de Tokens

El sistema opera en dos niveles:

### 1. Platform Tokens (UI de la plataforma)

Los 7 JSONs definen la apariencia de toda la interfaz web: dashboard, formularios, sidebar, modales, tablas, botones, cards, etc. Estos tokens se aplican via Tailwind CSS y shadcn/ui.

Se consumen directamente por el frontend Next.js.

### 2. Brand Tokens (componentes de video por marca)

Cada marca registrada en el sistema tiene su propia configuracion de tokens visuales para los componentes Remotion. El Brand Config (definido en COMPONENT-SYSTEM.md) hereda la estructura base pero la sobreescribe con la identidad de cada marca.

Los Platform Tokens del design system Vibe Coding NO se aplican a los videos — los videos usan los Brand Tokens de la marca activa.

En el backend, los Brand Tokens se almacenan como JSON en el campo `tokens` del modelo Brand en Prisma. Se acceden via `GET /api/brands/:id/tokens`.

---

## Principios del Design System

### Dark Mode First
La paleta de superficies va de `#000000` (level_0) a `#3B3B3B` (level_6). La interfaz de la plataforma es dark por defecto. Implementado con `<html className="dark">`.

### Jerarquia por Superficie
El contraste se maneja con pares background/contrast por nivel. Level_0 = maximo contraste (#000/#FFF), Level_6 = minimo (#3B3B3B/#3B3B3B).

### Color Principal: OP Blue
El azul principal es `#4361EF` (op_blue_600). Toda la escala va de 50 a 950 para estados hover, active, disabled y decorativos.

### Tipografia Unica: Mulish
Una sola familia tipografica con variaciones de peso (300-800) y escalas semanticas (display, heading, body, caption, CTA). Sin fuentes secundarias en la plataforma.

### Motion con Intencion
Las animaciones siguen una jerarquia de "shine": lo que importa mas se anima mas lento y suave (premium easing), lo operacional es rapido y directo (ui easing). Nunca animar por decorar.

### Espaciado Semantico
No se usan valores arbitrarios de padding/gap. Cada contexto (button, card, field, container) tiene sus valores predefinidos que mantienen consistencia visual.

---

## Reglas de Uso

1. **Nunca hardcodear valores visuales.** Todo color, tamano, espaciado, radio y duracion de animacion debe venir de los tokens.
2. **Los tokens de plataforma aplican a la UI web, no a los videos.** Los videos Remotion usan Brand Tokens de la marca activa.
3. **Respetar la regla de nested radius:** Si un contenedor tiene radius-16 y padding-8, el elemento interno debe tener radius-8.
4. **Priorizar superficies sobre bordes** para separar secciones (usar background-colors, no strokes).
5. **Respetar prefers-reduced-motion** en la UI: desactivar animaciones de desplazamiento, mantener solo cambios de color/opacidad.
6. **Las propiedades animables** se limitan a: opacity, transform, background-position, color, box-shadow. Nunca animar width, height, margin, padding.
7. **Al modificar tokens:** SIEMPRE leer el JSON source primero, luego actualizar el CSS. Nunca al reves.
8. **Al crear componentes CSS:** SIEMPRE consultar el component-token-mapping antes de escribir estilos.

---

## Relacion con Otros Documentos

- **ARCHITECTURE.md** -> Referencia este documento como fuente del design system del stack frontend
- **COMPONENT-SYSTEM.md** -> Define Brand Tokens y BrandConfig que sobreescriben estos tokens para componentes de video
- **PRD-PHASES.md** -> Fase 0 incluye "Design System en Codigo" como entregable (completado)

---

*Documento vivo — los tokens evolucionan con el producto*
