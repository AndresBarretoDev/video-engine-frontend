---
version: alpha
name: "Bancolombia Personas"
description: "Typography baseline relies on CIBFont Sans for primary hero headline — large, bold, tight leading."
colors:
  bancolombia-yellow: "#fdda24"
  deep-pink-surface: "#f9d3e1"
  light-gray-surface: "#f4f4f4"
  off-white-surface: "#f7f7f7"
  pure-white: "#ffffff"
  soft-pink-accent: "#f5b6cd"
  dark-charcoal: "#212529"
  near-black-text: "#2c2a29"
  pure-black: "#000000"
  coral-orange: "#ff7f41"
typography:
  hero-heading:
    fontFamily: "CIBFont Sans"
    fontSize: "56px"
    fontWeight: "700"
    lineHeight: "55px"
    letterSpacing: "-0.47px"
  section-heading-bold:
    fontFamily: "CIBFontSans-Bold"
    fontSize: "18px"
    fontWeight: "700"
    lineHeight: "20px"
    letterSpacing: "-0.3px"
  body-default:
    fontFamily: "CIBFontSans-Light"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  body-small:
    fontFamily: "CIBFontSans-Light"
    fontSize: "12px"
    fontWeight: "400"
    lineHeight: "16px"
    letterSpacing: "-0.17px"
  ui-label-regular:
    fontFamily: "OpenSans-Regular"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "18px"
    letterSpacing: "-0.2px"
  ui-label-medium:
    fontFamily: "OpenSans-Regular"
    fontSize: "16px"
    fontWeight: "600"
    lineHeight: "21px"
    letterSpacing: "-0.3px"
  ui-body:
    fontFamily: "OpenSans-Regular"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  small-label:
    fontFamily: "Open Sans"
    fontSize: "12px"
    fontWeight: "400"
    lineHeight: "16px"
    letterSpacing: "-0.17px"
  icon-font:
    fontFamily: "Font Icon Regular"
    fontSize: "30px"
    fontWeight: "400"
    lineHeight: "30px"
rounded:
  radius-flat: "0px"
  radius-sm: "4px"
  radius-md: "5px"
  radius-card: "6px"
  radius-lg: "20px"
  radius-xl: "30px"
  radius-2xl: "40px"
  radius-pill: "60px"
  radius-full: "100px"
spacing:
  spacing-1: "5px"
  spacing-2: "6px"
  spacing-3: "8px"
  spacing-4: "10px"
  spacing-5: "12px"
  spacing-6: "13px"
  spacing-7: "15px"
  spacing-8: "16px"
  spacing-9: "18px"
  spacing-10: "19px"
  spacing-11: "20px"
  spacing-12: "24px"
  spacing-13: "25px"
  spacing-14: "29px"
  spacing-15: "32px"
  spacing-16: "40px"
---

## Overview

Typography baseline relies on CIBFont Sans for primary hero headline — large, bold, tight leading.

This system uses a 5px base grid with scale values 5, 6, 8, 10, 12, 13, 15, 16, 18, 19, 20, 24, 25, 29, 32, 40, 70.

**Signature traits:**
- Core token rhythm: Token evidence indicates consistent color, spacing, and radius rhythm across visible UI.

## Colors

The palette uses 10 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **action-background** maps to `bancolombia-yellow`: Role "background" is grounded by usage context "Primary CTA buttons (Entrar), carousel navigation arrows, promotional highlights".
- **action-text** maps to `near-black-text`: Role "text" is grounded by usage context "Primary body text, headings, icon button borders, main brand color".
- **content-text** maps to `dark-charcoal`: Role "text" is grounded by usage context "Hero and footer text, generic content foreground".
- **surface-background** maps to `pure-white`: Role "background" is grounded by usage context "Main nav background, card surfaces, popover backgrounds, top-bar text".

### Text Scale
- **Dark Charcoal** (#212529): Hero and footer text, generic content foreground. Role: text. {authored: rgb(33, 37, 41), space: rgb}
- **Near-Black Text** (#2c2a29): Primary body text, headings, icon button borders, main brand color. Role: text. {authored: rgb(44, 42, 41), space: rgb}
- **Pure Black** (#000000): Footer text, high-contrast labels. Role: text. {authored: rgb(0, 0, 0), space: rgb}

### Interactive
- **Coral Orange** (#ff7f41): Status border color indicator. Role: border. {authored: rgb(255, 127, 65), space: rgb}

### Surface & Shadows
- **Bancolombia Yellow** (#fdda24): Primary CTA buttons (Entrar), carousel navigation arrows, promotional highlights. Role: background. {authored: rgb(253, 218, 36), space: rgb}
- **Deep Pink Surface** (#f9d3e1): Status background, secondary promotional surface. Role: background. {authored: rgb(249, 211, 225), space: rgb}
- **Light Gray Surface** (#f4f4f4): Section backgrounds, subtle surface fills in hero and footer areas. Role: background. {authored: rgb(244, 244, 244), space: rgb}
- **Off-White Surface** (#f7f7f7): Alternate section backgrounds, card surface variants. Role: background. {authored: rgb(247, 247, 247), space: rgb}
- **Pure White** (#ffffff): Main nav background, card surfaces, popover backgrounds, top-bar text. Role: background. {authored: rgb(255, 255, 255), space: rgb}
- **Soft Pink Accent** (#f5b6cd): Trámites digitales card background tint, promotional accent fills. Role: background. {authored: rgb(245, 182, 205), space: rgb}

## Typography

Typography uses CIBFont Sans, CIBFontSans-Bold, CIBFontSans-Light, OpenSans-Regular, Open Sans, Font Icon Regular across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes CIBFont Sans and CIBFontSans-Bold and CIBFontSans-Light and OpenSans-Regular and Open Sans and Font Icon Regular for visual contrast. Weight range spans bold, regular, semi-bold. Sizes range from 12px to 56px.

### Font Roles
- **Headline Font**: CIBFontSans-Light
- **Body Font**: CIBFontSans-Light

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Primary hero headline — large, bold, tight leading | CIBFont Sans | 56px | 700 | 55px | -0.47px | CIBFont Sans | Extracted token |
| Card titles, section sub-headings | CIBFontSans-Bold | 18px | 700 | 20px | -0.3px | CIBFontSans-Bold | Extracted token |
| Primary body copy, navigation labels, general content | CIBFontSans-Light | 16px | 400 | 24px | normal | CIBFontSans-Light, sans-serif | Extracted token |
| Captions, metadata, fine print | CIBFontSans-Light | 12px | 400 | 16px | -0.17px | CIBFontSans-Light, sans-serif | Extracted token |
| Navigation links, button labels, UI control text | OpenSans-Regular | 14px | 400 | 18px | -0.2px | OpenSans-Regular | Extracted token |
| Emphasized UI labels, active nav items, CTA text | OpenSans-Regular | 16px | 600 | 21px | -0.3px | OpenSans-Regular | Extracted token |
| Secondary body text, descriptive paragraphs | OpenSans-Regular | 16px | 400 | 24px | normal | OpenSans-Regular | Extracted token |
| Micro labels, tags, badge text | Open Sans | 12px | 400 | 16px | -0.17px | Open Sans, sans-serif | Extracted token |
| UI icons rendered via icon font | Font Icon Regular | 30px | 400 | 30px | normal | Font Icon Regular; features: "liga" | Extracted token |

## Layout

Responsive system uses 4 breakpoint tier(s): mobile, tablet, desktop, wide.

### Responsive Strategy
- **mobile (1-1440px)**: Constrain layout for small viewports and prioritize vertical stacking.
- **tablet (761-1199.98px)**: Increase spacing and column structure for medium-width viewports.
- **desktop (1200-9999px)**: Expand layout density and horizontal composition for wide viewports.
- **wide (>= 1440px)**: Stretch composition with generous gutters and wider layout spans.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| spacing-1 | 5px | 5 | Extracted spacing token |
| spacing-2 | 6px | 6 | Extracted spacing token |
| spacing-3 | 8px | 8 | Extracted spacing token |
| spacing-4 | 10px | 10 | Extracted spacing token |
| spacing-5 | 12px | 12 | Extracted spacing token |
| spacing-6 | 13px | 13 | Extracted spacing token |
| spacing-7 | 15px | 15 | Extracted spacing token |
| spacing-8 | 16px | 16 | Extracted spacing token |
| spacing-9 | 18px | 18 | Extracted spacing token |
| spacing-10 | 19px | 19 | Extracted spacing token |
| spacing-11 | 20px | 20 | Extracted spacing token |
| spacing-12 | 24px | 24 | Extracted spacing token |
| spacing-13 | 25px | 25 | Extracted spacing token |
| spacing-14 | 29px | 29 | Extracted spacing token |
| spacing-15 | 32px | 32 | Extracted spacing token |
| spacing-16 | 40px | 40 | Extracted spacing token |
| spacing-17 | 70px | 70 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| shadow-card | 1 | 0px 1px 8px 0px rgba(0, 0, 0, 0.1) |
| shadow-popover | 2 | 0px 0px 2px 0px rgba(0, 0, 0, 0.16) |
| shadow-section | 1 | 0px 3px 12px 0px rgba(0, 0, 0, 0.1) |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | outline-color | rgb(33, 37, 41) ; rgb(255, 255, 255) ; rgb(44, 42, 41) |
| Light | outline-width | 3px |
| Light | outline-offset | 0px |
| Light | transform | matrix(1, 0, 0, 1, 0, 0) ; matrix(1, 0, 0, 1, -2220, 0) ; matrix(1, 0, 0, 1, -25, 25) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| radius-flat | 0px | 0 | Hairline corner |
| radius-sm | 4px | 4 | Subtle corner |
| radius-md | 5px | 5 | Subtle corner |
| radius-card | 6px | 6 | Subtle corner |
| radius-lg | 20px | 20 | Card corner |
| radius-xl | 30px | 30 | Large surface corner |
| radius-2xl | 40px | 40 | Large surface corner |
| radius-pill | 60px | 60 | Large surface corner |
| radius-full | 100px | 100 | Large surface corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| radius-flat | 0px | px |
| radius-sm | 4px | px |
| radius-md | 5px | px |
| radius-card | 6px | px |
| radius-lg | 20px | px |
| radius-xl | 30px | px |
| radius-2xl | 40px | px |
| radius-pill | 60px | px |
| radius-full | 100px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Core token rhythm without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <= 1px | (max-width: 1px) |
| Mobile | <= 320px | (max-width: 320px) |
| Mobile | <= 350px | screen and (max-width: 350px) |
| Mobile | <= 374px | (max-width: 374px) |
| Mobile | <= 375px | (max-width: 375px) |
| Mobile | <= 413px | only screen and (max-width: 413px) |
| Mobile | <= 420px | screen and (max-width: 420px) |
| Mobile | <= 425px | (max-width: 425px) |
| Mobile | <= 426px | (max-width: 426px) |
| Mobile | <= 430px | (max-width: 430px) |
| Mobile | <= 456px | (max-width: 456px) |
| Mobile | <= 469px | only screen and (max-width: 469px) |
| Mobile | <= 479px | (max-width: 479px) |
| Mobile | <= 575px | (max-width: 575px) |
| Mobile | <= 575.98px | (max-width: 575.98px) |
| Mobile | <= 576px | (max-height: 576px), (max-width: 576px) |
| Mobile | <= 578px | (max-width: 578px) |
| Mobile | <= 600px | (max-width: 600px) |
| Mobile | <= 760px | screen and (max-width: 760px) |
| Mobile | <= 767px | (max-width: 767px) |

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
