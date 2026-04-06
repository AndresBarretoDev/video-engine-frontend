# Component → Token Mapping (Quick Reference)

**Full details**: `.claude/knowledge/critical-constraints.md` → Regla 10

## 🔴 RULE: ZERO Hardcoded Visual Values

Every color, radius, spacing, and transition in component CSS files (`src/styles/components/`)
MUST come from token CSS variables (`src/styles/tokens/*.css`).

**Before writing any component style:**
1. Read `src/styles/tokens/source/*.json` → find the design token
2. Check `src/styles/tokens/*.css` → find the exact CSS variable name
3. Use `var(--variable-name)` → never a hex, px magic number, or ms literal

## Button Tokens

| Property | Variable | Value |
|----------|----------|-------|
| Primary bg (base) | `--btn-principal-light-medium` | #4361EF (OP Blue 600) |
| Primary bg (light) | `--btn-principal-light` | #6689F4 |
| Primary bg (dark) | `--btn-principal-medium` | #2C40E4 |
| Primary bg (darkest) | `--btn-principal-dark` | #2327AA |
| Primary text | `--btn-principal-text` | #FFFFFF |
| Disabled bg light | `--btn-disable-light` | #545454 |
| Disabled bg dark | `--btn-disable-dark` | #202020 |
| Disabled text | `--btn-disable-text` | #545454 |

## Secondary Action Tokens

| Property | Variable |
|----------|----------|
| Fill invisible | `--secondary-fill-invisible` |
| Fill default | `--secondary-fill-default` |
| Fill hover | `--secondary-fill-hover` |
| Stroke default | `--secondary-stroke-default-light` |
| Stroke shadow | `--secondary-stroke-default-shadow` |
| Stroke hover | `--secondary-stroke-hover-light` |

## Motion Tokens (for buttons)

| Property | Variable |
|----------|----------|
| Button press | `--transition-btn-press` |
| Button hover content | `--transition-btn-hover-content` |

## Radius Tokens

| Usage | Variable |
|-------|----------|
| Pill/circle buttons | `--radius-infinite` (9999px) |
| Standard buttons | `--radius-8` or `--radius-10` |
| Cards | `--radius-12` |
| Large containers | `--radius-16` |

## Process Checklist

- [ ] Did I read the source JSON before writing styles?
- [ ] Are ALL colors using `var(--token-name)` instead of hex?
- [ ] Are ALL radius values using `var(--radius-*)` instead of px?
- [ ] Are ALL transitions using `var(--transition-*)` or `var(--duration-*)` + `var(--easing-*)`?
- [ ] Did I check `src/styles/tokens/*.css` for exact variable names?
