# AE Script → Remotion Mapping (Quick Reference)

**Source of truth**: `docs/AE-INTEGRATION.md`
**Related**: `.claude/plans/phase-1-video-engine.md`, `docs/COMPONENT-SYSTEM.md`

## 🎯 Propósito

Este documento mapea las 4 capacidades del script JSX de Lizeth (Automation Script en After Effects) a sus equivalentes en componentes Remotion. Es la referencia para developers que implementen Phase 1 (Motor de Componentes) bajo la Estrategia Híbrida (Camino A + Camino B).

**Estrategia adoptada**: Híbrida
- **Camino A** (corto plazo): Data Engine genera JSON formato AE para que Lizeth use con su script existente.
- **Camino B** (largo plazo): Componentes Remotion replican las 4 capacidades AE y renderizan en nube.

## 🔄 Las 4 capacidades AE → Remotion

### 1. Texto dinámico

| Aspecto | After Effects | Remotion |
|---------|--------------|----------|
| Mecanismo | Expresión: `footage('archivo.json').sourceData[thisComp.name][thisLayer.name]` | Prop directa: `<TextBlock content={data.field} />` |
| Convención | Nombre de capa = clave JSON exacta | Prop name = data field (mapeado por Data Engine) |
| Schema | N/A | `z.object({ content: z.string() })` |
| Componentes afectados | Layers de texto | `TextBlock`, `PricePatch`, `LowerThird` |

**Ejemplo end-to-end**:
```typescript
// AE: Capa "nombre_producto" en composición "0" + JSON: { "0": { "nombre_producto": "Leche Alpina 1L" } }
// Remotion equivalente:
<TextBlock content="Leche Alpina 1L" fontFamily={brand.typography.heading} />
```

### 2. Opacidad condicional

| Aspecto | After Effects | Remotion |
|---------|--------------|----------|
| Mecanismo | Expresión: `(d['campo'] == thisLayer.name) ? 100 : 0` | Conditional render: `{value === 'matchKey' && <Component />}` |
| Convención | Nombre de capa = valor matcheable del JSON | Prop boolean o conditional logic en parent |
| Caso típico | Badges según tipo: `descuento_20`, `2x1`, `liquidación` | Renderizado condicional con switch o map |
| Componentes afectados | Cualquier capa | Cualquier atom o molecule |

**Ejemplo end-to-end**:
```typescript
// AE: JSON tiene "tipo_oferta": "descuento_20" → capas "descuento_20" visibles, otras ocultas
// Remotion equivalente:
{data.tipo_oferta === 'descuento_20' && <DiscountBadge percentage={20} />}
{data.tipo_oferta === '2x1' && <TwoForOneBadge />}
```

### 3. Color dinámico

| Aspecto | After Effects | Remotion |
|---------|--------------|----------|
| Mecanismo | Efecto Fill con valor de JSON: hex/RGB | Prop `color`: directo o desde BrandTokens |
| Formatos JSON | hex (`#E30613`), RGB array `[227, 6, 19]`, RGB normalizado `[0.89, 0.02, 0.07]` | hex string (`#E30613`). Si viene RGB, Data Engine lo normaliza a hex |
| Caso típico | Variaciones de color por segmento, temporada | Prop `color` o `backgroundColor` en TextBlock/ShapeElement |
| Componentes afectados | Capas con efecto Fill | `TextBlock`, `PricePatch`, `ShapeElement` |

**Ejemplo end-to-end**:
```typescript
// AE: JSON tiene "color_marca": "#E30613" → efecto Fill aplica color
// Remotion equivalente:
<TextBlock content="Oferta" color={data.color_marca} />
<ShapeElement type="rectangle" color={data.color_marca} />
```

### 4. Imagen dinámica

| Aspecto | After Effects | Remotion |
|---------|--------------|----------|
| Mecanismo | Comentario `AE_JSON_IMG_KEY:campo` + footage matching por nombre | Prop `src`: URL absoluta resuelta por Data Engine + Asset Manager |
| Convención | Nombre archivo en JSON = nombre footage en AE (case-sensitive) | URL/path en JSON = asset registrado en Asset Manager |
| Caso típico | Cambiar packshot, hero image, logo por variation | Prop `src` en `<Img>` o `<ImageFrame>` |
| Componentes afectados | Capas de imagen | `ImageFrame`, `LogoReveal` |

**Ejemplo end-to-end**:
```typescript
// AE: Capa con comentario AE_JSON_IMG_KEY:imagen_producto + JSON: { imagen_producto: "leche_alpina.png" }
// Remotion equivalente:
<ImageFrame
  src={data.imagen_producto}  // URL absoluta resuelta por Asset Manager
  alt={data.nombre_producto}
  objectFit="cover"
/>
```

## 📐 Convenciones que se preservan

Para mantener compatibilidad bidireccional (Data Engine genera JSON que funciona en AE Y en Remotion):

| Convención AE | Equivalente plataforma |
|---------------|----------------------|
| Composición indexada (`"0"`, `"1"`, `"2"`) | `variationIndex` 0-based en Data Engine |
| Nombre capa = clave JSON | Field name del CSV mapeado a prop |
| Comentario `AE_JSON_IMG_KEY:` | Field name marcado como `type: "asset"` en Column Mapping |
| Color hex o RGB | hex normalizado por Data Engine |

## 🚨 Edge cases y gotchas

### Camino A (JSON para AE)
- **Case sensitivity**: AE matchea footage items por nombre exacto. El Data Engine debe preservar capitalización en los nombres de archivo.
- **Espacios en nombres**: AE no acepta espacios donde el JSON espera nombres limpios. Preferir snake_case o kebab-case sin espacios.
- **Imágenes deben pre-existir en AE**: el script no descarga assets — Lizeth los importa antes.

### Camino B (Remotion nativo)
- **Animaciones complejas de AE**: expressions avanzadas y plugins NO son exportables. Solo elementos atómicos (shapes, texto, video con canal alfa) son portables.
- **Brand Tokens vs hardcoded**: los componentes Remotion DEBEN usar Brand Tokens. NO hardcodear colores de marca aunque el AE original los tuviera fijos.
- **Performance**: Remotion renderiza por frame. Animaciones que en AE eran "gratis" pueden ser caras (filtros, blurs heavy).

### Camino Híbrido
- **Componentes con AE**: si un componente complejo se mantiene en AE (video con canal alfa), se registra en Component Registry como `source: "ae-export"`.
- **Componentes nativos Remotion**: se registran como `source: "remotion-native"`.
- **Data Engine debe exportar AMBOS**: JSON formato AE (para script JSX) Y props formato Remotion (para render Lambda).

## 🔗 Relación con planes técnicos

### Phase 1 (Motor de Componentes)
Implementa los atoms con las 4 capacidades del script AE como props:
- `TextBlock`: capacidades 1 (texto) + 3 (color)
- `ImageFrame`: capacidad 4 (imagen dinámica)
- `PricePatch`: capacidades 1, 3 (color de fondo dinámico)
- `ShapeElement`: capacidad 3 + soporte para opacidad condicional via prop
- `LogoReveal`: capacidad 4 + animación

### Phase 3 (Data Engine)
Debe exportar dos formatos:
1. **Formato AE** (Camino A): JSON indexado por composición siguiendo convención del script JSX
2. **Formato Remotion** (Camino B): array de variation objects con props para `<Composition>` defaultProps

### Phase 5 (Puente AE) — bloqueada
Pendiente sesión Omnicom para resolver D1-D5 del `docs/AE-INTEGRATION.md`. NO implementar este puente sobre supuestos.

## 📋 Checklist para developers de Phase 1

Antes de implementar un componente Remotion:

- [ ] Identificar qué capacidad(es) del script AE soporta (texto, opacidad, color, imagen)
- [ ] Definir props que reciben los valores dinámicos
- [ ] Validar con Zod schema (props como `z.string()`, `z.boolean()`, etc.)
- [ ] Diseñar el componente para usar Brand Tokens (NO hardcodear)
- [ ] Documentar en `COMPONENT-SYSTEM.md` qué capacidades AE soporta
- [ ] Considerar export con canal alfa si el componente es candidato a "AE-export" (Camino B híbrido)

## 📚 Referencias

- `docs/AE-INTEGRATION.md` — Documento principal con el análisis del script JSX
- `docs/Final_Scripts_Automation_4_DynamicImage 4.jsx` — Script de Lizeth (referencia directa)
- `docs/COMPONENT-SYSTEM.md` — Taxonomía de componentes (atoms/molecules/organisms)
- `.claude/plans/phase-1-video-engine.md` — Plan técnico de implementación
- `.claude/references/component-token-mapping.md` — Tokens para UI web (NO confundir con Brand Tokens de video)
