---
name: Smart Class
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#246a4f'
  on-secondary: '#ffffff'
  secondary-container: '#abf1cf'
  on-secondary-container: '#2c7055'
  tertiary: '#3e3fcc'
  on-tertiary: '#ffffff'
  tertiary-container: '#585be6'
  on-tertiary-container: '#f1eeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#abf1cf'
  secondary-fixed-dim: '#90d5b4'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#005139'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The design system is centered on clarity, accessibility, and mental focus. The target audience consists of students and educators who require a low-friction interface to manage complex academic schedules. 

The visual style is **Corporate / Modern** with a friendly, approachable twist. It leverages high-quality typography and generous whitespace to reduce cognitive load. The emotional response should be one of "organized calm"—transforming the stress of deadlines into a structured, manageable path. The UI remains predominantly flat but utilizes soft, tactile shadows to guide the user's eye toward interactive elements.

## Colors

The palette is anchored by a vibrant blue to signify reliability and intelligence. A soft mint secondary color is used sparingly as an accent for "completed" states or organizational tags to evoke a sense of progress and calm.

- **Primary:** Used for main actions, active navigation states, and key brand moments.
- **Secondary (Mint):** Reserved for organizational highlights, success indicators, and secondary illustrative elements.
- **Surface & Background:** A range of cool grays (Slate) provides a clean canvas that minimizes eye strain during long study sessions.
- **Semantic Colors:** Standardized red, yellow, and green are tuned for high legibility against white backgrounds to ensure accessibility for color-blind users.

## Typography

The design system utilizes **Inter** for its exceptional legibility and neutral, modern character. 

Hierarchy is established through significant weight shifts. Headlines are set with tight letter-spacing and bold weights to provide strong "anchors" for the eyes when scanning schedules. Body text maintains a standard tracking to ensure comfort during extended reading. For mobile views, large headlines scale down to prevent awkward word-breaks while maintaining their bold visual impact.

## Layout & Spacing

This design system uses an **8px linear grid** to ensure mathematical consistency across all components.

- **Mobile:** 4-column fluid grid with 20px outside margins. Navigation is handled via a persistent bottom bar with 24px icon sizes.
- **Desktop/Tablet:** 12-column grid with a max-width of 1280px. Sidebars are used for primary navigation to maximize vertical space for class lists and calendars.
- **Vertical Rhythm:** Consistent use of 16px (md) and 24px (lg) spacing between sections helps group related academic content (e.g., a course title and its subsequent assignments).

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Layering**. 

1. **Level 0 (Background):** The base layer using the neutral light gray (#F8FAFC).
2. **Level 1 (Cards/Surface):** Pure white surfaces with a very soft, diffused shadow (Blur: 10px, Y: 4px, Opacity: 4% Black). This is the default state for class cards and input groups.
3. **Level 2 (Interaction/Popovers):** Elements that require immediate focus (modals, dropdowns) use a deeper shadow (Blur: 20px, Y: 8px, Opacity: 8% Black) to lift them physically above the workspace.

Avoid heavy borders; use subtle 1px strokes in a slightly darker gray only when elements need to be differentiated on a pure white background.

## Shapes

The shape language is friendly and soft, utilizing a **Rounded (Level 2)** approach. 

Standard components like input fields and buttons feature an 8px (0.5rem) radius. Larger container elements, such as class cards or dashboard modules, utilize a 16px (1rem) radius (`rounded-lg`) to reinforce the "mobile-first" approachable feel. Selection indicators (like date pickers or chips) may use pill-shapes to distinguish them from structural containers.

## Components

- **Buttons:** Primary buttons are vibrant blue with white text. They use high-contrast bold labels. Secondary buttons use a light gray ghost style or the Mint accent for "positive" secondary actions.
- **Class Cards:** Feature a top-border accent color corresponding to the subject. They include a "Progress" chip and clear headline typography for the course name.
- **Inputs:** Fields use a 1px slate-200 border that thickens and changes to Primary Blue on focus. Labels sit permanently above the field in `label-sm` style for accessibility.
- **Chips:** Used for task status (e.g., "Due Tomorrow," "Submitted"). These are small, semi-transparent versions of the status colors with dark-tinted text.
- **Navigation:** Icon-heavy bottom bar for mobile. Icons should be "Outline" style for inactive states and "Solid/Filled" for the active state to provide clear visual feedback without relying solely on color.
- **Progress Bars:** Thin, 8px tall bars with fully rounded ends, utilizing the Mint color to show completion status.