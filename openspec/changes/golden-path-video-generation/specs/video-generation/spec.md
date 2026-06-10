# Delta for video-generation

> Re-scoped 2026-06-09 to Capa 2 (PRODUCT.md §0.5): producto único. CSV/batch diferido a Capa 3.

## ADDED Requirements

### Requirement: Template-first entry point

The system MUST present a Template Gallery as the entry point for creating a video (NOT a CSV-upload screen). Each template card MUST show a live looping `@remotion/player` preview.

#### Scenario: Gallery is the first screen
- GIVEN a logged-in Producer
- WHEN they start "Create video"
- THEN they MUST see the Template Gallery before any data step
- AND each card MUST render a live looping preview.

### Requirement: Single-product authoring with live preview

The authoring view MUST let the Producer fill a single product's fields and MUST update the live preview within 400ms of any field change, with no save action. CSV/batch input is OUT of scope for this capability.

#### Scenario: Preview reacts to input
- GIVEN the Producer is in the authoring view
- WHEN they type into the product name field
- THEN the preview text MUST update within 400ms without a save action.

#### Scenario: No batch surface present
- GIVEN the authoring view for this capability
- WHEN it loads
- THEN it MUST NOT expose CSV upload or variation-grid controls.

### Requirement: Automatic brand application

On template selection the system MUST auto-apply the active Brand's config (colors, fonts, logo) without any user configuration step.

#### Scenario: Brand applied on select
- GIVEN a Brand with logo, accent #E5002B, heading font "Nunito"
- WHEN the Producer selects the LoopingProductPromo template
- THEN the preview MUST show that logo, accent color, and font with no brand step.

### Requirement: Multi-format auto-layout

The user MUST be able to select one or more formats (9:16, 1:1, 16:9); the organism MUST auto-adapt layout per format with zero manual repositioning.

#### Scenario: Switching format repositions elements
- GIVEN filled product data
- WHEN the Producer switches from 9:16 to 16:9
- THEN the organism MUST reposition all elements for horizontal layout
- AND no element MUST overflow the canvas.

### Requirement: Validation gates render

Render MUST be blocked while any required field is missing, with the reason shown.

#### Scenario: Missing image blocks render
- GIVEN a product missing the required image
- WHEN the Producer attempts to render
- THEN the render action MUST be disabled and the missing field MUST be flagged.

### Requirement: Real output matches preview

Rendering MUST produce real, playable MP4 files (one per selected format), each visually matching its in-browser preview (Supuesto A).

#### Scenario: One product, three formats
- GIVEN 1 product and the 3 formats selected
- WHEN all render jobs complete
- THEN 3 MP4 files MUST be downloadable, each playable
- AND each MUST visually match its preview.

### Requirement: Feedback states

The system MUST present explicit loading, empty, and error states. Skeletons MUST match the final layout with zero layout shift.

#### Scenario: Gallery loading and empty
- GIVEN templates are loading
- WHEN the gallery mounts
- THEN a skeleton matching the card grid MUST show (no layout shift on load)
- AND if zero templates exist, an empty state with a clear next action MUST show.

#### Scenario: Render failure is recoverable
- GIVEN a render job fails
- WHEN the Producer views it
- THEN the failure MUST be shown with a reason and a retry action.

### Requirement: Accessibility & long-render feedback

The authoring and render UI MUST meet WCAG 2.1 AA (labels, roles, keyboard operability, visible focus). Render progress (30–90s) MUST be announced via `aria-live` so it is perceivable without watching the screen.

#### Scenario: Render progress is announced
- GIVEN a render is in progress
- WHEN its percentage advances
- THEN the update MUST be exposed via an `aria-live` region
- AND all controls MUST be reachable and operable by keyboard.

### Requirement: Mobile-first authoring

The authoring view MUST be usable on mobile (mobile-first), with the live preview accessible (e.g., a preview sheet) without losing the form.

#### Scenario: Preview on small screens
- GIVEN a viewport < 768px
- WHEN the Producer authors a product
- THEN the form MUST remain usable AND the live preview MUST be reachable without leaving the screen.
