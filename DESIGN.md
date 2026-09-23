---
name: IOU Finance Admin
description: A restrained, brand-led operating system for managing IOU Finance service content.
colors:
  brand-red: "#990000"
  brand-red-hover: "#7f0000"
  brand-red-bright: "#d22d2d"
  canvas-warm: "#f5f3f1"
  surface: "#ffffff"
  surface-subtle: "#faf9f8"
  sidebar: "#111111"
  ink: "#151515"
  text-muted: "#665f5b"
  border: "#dfdcda"
  field-border: "#d6d1ce"
  published-surface: "#e5f3e8"
  published-ink: "#245f31"
  draft-surface: "#eeeae7"
  draft-ink: "#6d6661"
  danger: "#a21b1b"
typography:
  display:
    fontFamily: "Faculty Glyphic, Arial, sans-serif"
    fontSize: "42px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter Tight, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter Tight, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: "Inter Tight, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Inter Tight, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  control-sm: "8px"
  field: "9px"
  control: "10px"
  media: "12px"
  panel: "16px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
  4xl: "36px"
  5xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand-red-hover}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "9px 11px"
    height: "42px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  status-published:
    backgroundColor: "{colors.published-surface}"
    textColor: "{colors.published-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
    height: "24px"
  status-draft:
    backgroundColor: "{colors.draft-surface}"
    textColor: "{colors.draft-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
    height: "24px"
---

# Design System: IOU Finance Admin

## Overview

**Creative North Star: "The Service Ledger"**

The admin surface translates the IOU Finance brand into a calm operating environment: warm paper-like neutrals, black structural navigation, and a single deep-red action color. It should feel dependable and deliberate rather than promotional. Density is compact enough for frequent content work, while generous panel padding and a clear two-pane hierarchy keep the editor easy to scan.

Brand expression is concentrated in the logo, the Faculty Glyphic page title, and restrained red accents. Everything used to search, edit, order, publish, or delete content stays in Inter Tight and follows familiar application conventions. State must remain legible without relying on accent color alone.

**Key Characteristics:**

- Warm-neutral workspace with crisp white editing surfaces.
- Black navigation structure with rare, deliberate IOU red accents.
- Editorial display type only at brand and page-title moments.
- Compact, familiar controls with explicit saved, draft, published, disabled, and destructive states.
- Flat panels, fine borders, restrained motion, and shadow reserved for transient feedback.
- A desktop sidebar that becomes persistent bottom navigation on narrow screens.

## Colors

The palette is a warm monochrome working environment punctuated by a deep finance-red accent and quiet semantic state colors.

### Primary

- **IOU Ledger Red:** The sole action and focus color; use it for primary buttons, active switches, overlines, inline text actions, and focus borders.
- **Pressed Ledger Red:** The darker hover state for primary actions.
- **Signal Red:** A brighter red used only for the small active navigation mark against the black sidebar.

### Secondary

- **Published Green Pair:** A pale green surface with dark green text communicates content already visible on the public site.

### Tertiary

- **Destructive Red:** Reserved for deletion and irreversible intent, separate from the primary action treatment.

### Neutral

- **Warm Canvas:** The page-level workspace behind all panels.
- **Clean Paper:** The primary editing, button, and field surface.
- **Soft Paper:** Toolbars, publish rows, upload fields, and secondary hover surfaces.
- **Ledger Black:** Sidebar, toast, and strongest structural contrast.
- **Working Ink:** Primary text and titles.
- **Warm Muted Ink:** Supporting copy, counts, labels, and metadata.
- **Hairline Border:** Primary panel boundaries.
- **Field Border:** Form-control boundaries before focus.
- **Draft Stone Pair:** A neutral stone surface with darker stone text communicates unpublished content.

### Named Rules

**The One Red Rule.** Brand red is an operational signal, not decoration; keep it rare enough that save, publish, focus, and active states remain unmistakable.

**The State Pair Rule.** Published and draft status always use both a filled pill and a text label, never color alone.

## Typography

**Display Font:** Faculty Glyphic (with Arial and sans-serif fallbacks)  
**Body Font:** Inter Tight (with Arial and sans-serif fallbacks)

**Character:** Faculty Glyphic carries the recognizable IOU voice at brand scale; Inter Tight keeps the working interface compact, neutral, and highly scannable.

### Hierarchy

- **Display** (400, 42px, 1.1): Page title only; reduces to 36px at the mobile breakpoint.
- **Headline** (500, 20px, 1.25): Panel and editor titles.
- **Title** (500, 16px, 1.25): Form-section headings and prominent item labels.
- **Body** (400, 14px, 1.4): Inputs, editing copy, and standard operational text.
- **Label** (500, 12px, 0.08em tracking): Uppercase overlines and compact UI labels; status pills use 11px without uppercase tracking.

### Named Rules

**The Brand-Moment Rule.** Faculty Glyphic is reserved for the page title and brand moments; all navigation, metrics, controls, fields, state labels, and editor copy use Inter Tight.

**The Medium-Weight Rule.** Operational emphasis uses weight 500; heavier display weights are not part of this surface.

## Layout

The desktop shell uses a sticky 248px sidebar and a flexible workspace. The content area is capped at 1500px and holds a two-pane grid: a sticky 320–380px service library beside a fluid editor, separated by a 20px gutter. The workspace uses 36px top spacing, fluid horizontal padding from 24px to 64px, and 64px bottom spacing.

At 1100px, the sidebar compresses to 88px and navigation becomes mark-led. At 820px, the shell becomes a single column: navigation moves to a fixed 64px bottom bar, the editor stacks below the library, metrics form a two-by-two grid, and the page reserves 78px for the mobile navigation. At 560px, top actions, list tools, form columns, image fields, and editor footer actions collapse into touch-friendly one-column or balanced two-column arrangements.

Panel interiors use an 18–28px rhythm. Inputs and compact controls use 8–12px internal gaps; primary content groups use 18–24px gaps. Maintain at least 44px height for primary buttons and 42px for text controls.

**The Two-Pane Rule.** Keep selection context visible beside editing context whenever the viewport can support it; stack only when width would compromise field readability.

**The Mobile Dock Rule.** On narrow screens, core navigation stays fixed at the bottom and the content always reserves safe space for it.

## Elevation & Depth

The system is flat by default. Depth comes from warm tonal layering, white panels, and fine neutral borders rather than card shadows. The only implemented shadow belongs to the transient notice, which must float above the workspace without making persistent surfaces feel elevated.

### Shadow Vocabulary

- **Notice Float** (`0 18px 48px rgba(0, 0, 0, 0.2)`): Reserved for save, error, and storage-limit feedback.

### Named Rules

**The Flat Workspace Rule.** Persistent panels are border-defined and shadowless; elevation is reserved for transient feedback.

## Shapes

The form language is softly rectangular, not pill-heavy. Major list and editor panels use a 16px radius. Upload containers use 12px; standard controls and list rows use 8–10px; form fields use 9px. Full pills are reserved for compact status chips and switches. Borders stay one pixel and warm-neutral; dashed borders identify image-upload regions.

**The Radius Hierarchy Rule.** Larger containment earns larger rounding: 16px panels, 12px media fields, 8–10px controls, and pills only for status or binary state.

## Components

### Buttons

Buttons are restrained and workmanlike, with enough weight to read clearly without looking promotional.

- **Shape:** Soft rectangle (10px radius), 44px minimum height, 10px by 16px padding.
- **Primary:** IOU Ledger Red fill, white text, matching red border, 14px medium Inter Tight.
- **Hover / Focus:** Darker red on hover; all interactive controls use a 3px translucent-red focus outline with 2px offset.
- **Secondary:** White surface, dark ink, warm-gray border; hover shifts to Soft Paper and a darker border.
- **Disabled:** Muted warm-gray fill and text, no pointer affordance.
- **Destructive:** Text-only destructive red, used for deletion after confirmation.

### Chips

- **Style:** 24px minimum-height status pills with 4px by 8px padding and 11px medium labels.
- **State:** Published uses the green pair; Draft uses the neutral stone pair. Neither state is represented by color alone.

### Cards / Containers

- **Corner Style:** Major panels use softly rounded 16px corners.
- **Background:** Clean Paper over the Warm Canvas; Soft Paper distinguishes tools and subordinate rows.
- **Shadow Strategy:** No shadow at rest.
- **Border:** One-pixel warm-neutral outline, with lighter internal dividers.
- **Internal Padding:** Panel headers use roughly 22–28px; editor sections use 28px, reducing to 18–22px on small screens.

### Inputs / Fields

- **Style:** White surface, 1px warm-gray border, 9px radius, 14px Inter Tight; standard fields are at least 42px high.
- **Focus:** Border changes to IOU Ledger Red with a 3px translucent-red outer ring.
- **Error / Disabled:** Errors are delivered as explicit notice text; disabled actions visibly mute both fill and label.

### Navigation

The desktop navigation is a vertical black sidebar with 48px rows, muted default labels, and a dark-red active surface plus a bright-red square mark. At 1100px it reduces to icon-like marks; at 820px it becomes a fixed bottom bar with two labeled destinations. Hover and keyboard focus lift labels to white without motion beyond a 160ms color transition.

### Service Row

Each service is a 72px minimum-height selectable row with a 46×50px thumbnail, ellipsized title and slug, and an explicit status chip. Hover adds a quiet warm surface; selection adds a pale red surface. On very small screens the status chip moves below the text rather than compressing the title.

### Image Upload Field

Image controls use a 12px rounded, dashed-border Soft Paper container with a dedicated preview well and explicit type/size guidance. The layout is preview-plus-actions on larger screens and stacked on narrow screens. Card and detail images accept JPG, PNG, or WebP files up to 5MB. In the local CMS, uploads are written through `POST /api/cms/images` into `public/uploads`; the returned URL is saved immediately to the selected service so the image survives refreshes. Textual CMS content and image URL references remain in browser storage, with clear quota-recovery feedback.

### Publish Switch

The 42×24px switch uses a neutral track when off and IOU Ledger Red when on, with an 18px white thumb and a 160ms translation. The adjacent label explains the public-site consequence; keyboard focus is visible around the track.

## Do's and Don'ts

### Do:

- **Do** preserve the black, white, warm-neutral, and deep-red hierarchy across new admin screens.
- **Do** keep Faculty Glyphic to the page title or a genuine brand moment and use Inter Tight for all operational UI.
- **Do** use familiar list, field, button, switch, and confirmation conventions for content-management tasks.
- **Do** pair status color with explicit text and preserve high contrast for interactive states.
- **Do** use 12–16px radii for meaningful surfaces and 8–10px radii for controls.
- **Do** protect unsaved edits before selection changes or new-record creation, recover safely from invalid local records, and surface storage-limit or validation failures in plain language.
- **Do** preserve the responsive progression from full sidebar to compact rail to fixed bottom navigation.

### Don't:

- **Don't** spread brand red across large backgrounds or use it as general decoration.
- **Don't** use Faculty Glyphic for form labels, table rows, metrics, buttons, or dense editor copy.
- **Don't** add persistent card shadows, glass effects, gradients, or ornamental motion to the working surface.
- **Don't** communicate published, draft, disabled, selected, or destructive state through color alone.
- **Don't** reduce primary touch targets below the implemented 42–44px control floor.
- **Don't** introduce a new product promise or marketing claim into the admin design contract.
