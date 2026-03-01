# UI/UX Guide — Mobile-First, Web-Ready

> **Audience:** Developers who want to ensure a consistent, mobile-first user experience within the Richi ecosystem.
> **Reference:** Consistent mobile-first patterns across all projects.

---

## 1 — Core Principle: Mobile First, Desktop Enhanced

Every UI decision is made **for mobile (< 768px) first**.
Desktop (≥ 768px) **extends** the mobile layout — it does not replace it.

```
Mobile = Base version (100% of functionality)
Desktop = Enhanced presentation (more space, additional comfort features)
```

### Breakpoints (mandatory)

| Token       | Width     | Description                    |
|-------------|-----------|--------------------------------|
| `sm`        | ≥ 640px   | Large phones (landscape)       |
| `md`        | ≥ 768px   | Tablets / desktop threshold    |
| `lg`        | ≥ 1024px  | Desktop                        |
| `xl`        | ≥ 1280px  | Large displays                 |

**`md` is the primary switch point** between mobile and desktop layout.

---

## 2 — Navigation

### 2.1 Mobile: Bottom Navigation Bar

- **Position:** `fixed bottom-0`, full width, `z-50`
- **Height:** 64px (h-16)
- **Content:** 3–4 icon buttons + "More" menu (DropdownMenu, opens upward)
- **No text** below icons (space saving)
- **Active state:** `bg-secondary` background on the active icon
- **Glass effect:** `backdrop-blur` + semi-transparent background

```
┌──────────────────────────────┐
│  Content Area                │
│                              │
│                              │
├──────────────────────────────┤
│ 🏠    📦    👤    ⋯         │  ← Bottom Nav (fixed)
└──────────────────────────────┘
```

**"More" menu contains:**
- Theme toggle (Sun/Moon)
- Language selection (all supported languages)
- Settings link (if authenticated)
- Admin link (if admin)
- Login/Logout

### 2.2 Desktop: Top Navigation Bar

- **Position:** `fixed top-0`, full width, `z-50`
- **Height:** 64px (h-16)
- **Left:** Logo + product name (link to home page)
- **Center:** Nav icons (same items as mobile)
- **Right:** Language, theme toggle, user dropdown (avatar + name)

```
┌──────────────────────────────────────────┐
│ 🔷 Richi    🏠 📦 👤    🌐 🌙 [Avatar ▼]│  ← Top Nav (fixed)
├──────────────────────────────────────────┤
│  Content Area                            │
│                                          │
└──────────────────────────────────────────┘
```

### 2.3 Spacing Rules (critical!)

```css
main {
  padding-bottom: 4rem;   /* pb-16 — space for mobile bottom nav */
  padding-top: 0;         /* Mobile: no top padding */
}

@media (min-width: 768px) {
  main {
    padding-bottom: 0;    /* md:pb-0 — no bottom nav on desktop */
    padding-top: 4rem;    /* md:pt-16 — space for top nav */
  }
}
```

> **Why:** Without this spacing, content will be obscured by the fixed navigation.

---

## 3 — Layout Patterns

### 3.1 Container

```html
<div class="container mx-auto px-4">
  <!-- Content -->
</div>
```

- `container` limits the maximum width
- `px-4` provides minimum spacing on small screens
- Do not hard-code `max-width` — Tailwind's `container` handles that

### 3.2 Card Grids

| Breakpoint | Columns | Example Class                      |
|------------|---------|-------------------------------------|
| Mobile     | 1       | `grid grid-cols-1 gap-4`           |
| `sm`       | 2       | `sm:grid-cols-2`                   |
| `md`       | 2–3     | `md:grid-cols-2` or `md:grid-cols-3` |
| `lg`       | 3–4     | `lg:grid-cols-3`                   |

### 3.3 Detail Views (Profile, Platform)

**Mobile:**
- Vertical arrangement: Header/Banner → Avatar → Info → Tabs → Content
- Full-width sections
- Tabs as horizontal scroll (`overflow-x-auto`)

**Desktop:**
- Banner as wide header image
- Avatar optionally overlapping with banner
- Info beside avatar (flex-row)
- Tabs and content at full container width

### 3.4 Forms and Sheets

**All forms** (edit profile, create platform, settings) are presented as **Sheets** (slide-in panels):

| Platform | Behavior                                        |
|-----------|--------------------------------------------------|
| Mobile    | Sheet from bottom (`side="bottom"`), nearly fullscreen |
| Desktop   | Sheet from right (`side="right"`), `sm:max-w-sm`  |

```tsx
<Sheet>
  <SheetContent side="right"> {/* Tailwind responsive via CSS */}
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* Form content */}
  </SheetContent>
</Sheet>
```

> **No separate form pages.** Everything stays in context via Sheet.

---

## 4 — Touch Targets & Interaction

### 4.1 Minimum Sizes

| Element         | Mobile Minimum | Desktop Minimum |
|-----------------|----------------|-----------------|
| Buttons         | 44×44px        | 36×36px         |
| Nav icons       | 48×48px (h-12 w-12) | 40×40px (h-10 w-10) |
| Tap targets     | 44×44px        | —               |
| Input fields    | Height 44px    | Height 36px     |

### 4.2 Spacing Between Touch Targets

- At least **8px** spacing between clickable elements on mobile
- Prevents accidental taps with the thumb

### 4.3 Interaction Patterns

| Action            | Mobile                          | Desktop                         |
|-------------------|---------------------------------|---------------------------------|
| Primary action    | Prominent, full-width button    | Standard button                 |
| Edit              | Sheet (bottom)                  | Sheet (right)                   |
| Dropdown menu     | `side="top"` (due to bottom nav)| `side="bottom"` (standard)      |
| Delete/Dangerous  | AlertDialog (centered)          | AlertDialog (centered)          |
| Navigation        | Bottom bar icon tap             | Top bar + breadcrumbs           |
| Context actions   | DropdownMenu on "⋯" button     | DropdownMenu on "⋯" button     |

---

## 5 — Typography & Readability

### 5.1 Font Sizes (responsive)

| Element          | Mobile            | Desktop            |
|------------------|-------------------|--------------------|
| H1 (page title)  | `text-2xl` (24px) | `text-3xl` or `text-4xl` |
| H2 (section)     | `text-xl` (20px)  | `text-2xl`         |
| Body             | `text-sm` (14px)  | `text-base` (16px) |
| Caption/Meta     | `text-xs` (12px)  | `text-sm` (14px)   |

### 5.2 Line Length

- **Maximum line length:** 65–75 characters for body text
- Achieved through `container` + `max-w-prose` or similar
- On mobile, line length is naturally determined by screen width

---

## 6 — Images & Media

### 6.1 Responsive Images

```html
<img
  src={imageUrl}
  alt="Descriptive text"
  loading="lazy"
  class="w-full h-auto object-cover rounded-xl"
/>
```

- **Always** `loading="lazy"` for images below the viewport
- **Always** `alt` attribute (use i18n key)
- `object-cover` for consistent display in containers
- Use `aspect-ratio` for consistent placeholders before loading

### 6.2 Avatars

| Context          | Mobile         | Desktop        |
|------------------|----------------|----------------|
| Navigation       | 28×28px (w-7)  | 28×28px (w-7)  |
| Profile header   | 80×80px        | 96–128px       |
| Cards            | 40×40px        | 48×48px        |

- Always `rounded-full` for user avatars
- Always `rounded-xl` or `rounded-lg` for platform logos

---

## 7 — Feedback & States

### 7.1 Four Mandatory States Per View

Every screen must support these four states:

1. **Loading** — Skeleton components (no spinners)
2. **Error** — Error message + retry button
3. **Empty** — Helpful message + CTA (next step)
4. **Success** — Data display

### 7.2 Toast Messages

- **Position mobile:** Top (`top-center`), above content
- **Position desktop:** Top right (`top-right`)
- **Duration:** 3–5 seconds
- **Variants:** `default`, `destructive`
- Never more than one toast at a time

### 7.3 Loading States

```tsx
// ✅ Correct: Skeleton
<Skeleton className="h-8 w-3/4" />
<Skeleton className="h-4 w-full" />

// ❌ Wrong: Centered spinner for full screen
<div className="flex justify-center"><Spinner /></div>
```

---

## 8 — Accessibility (a11y)

### 8.1 Mandatory Requirements

- **Skip links:** `<SkipLinks />` as the first element in the DOM
- **Landmarks:** `<nav>`, `<main>`, `<footer>` with `role` and `aria-label`
- **Focus management:** Visible focus ring (`focus:ring-2 focus:ring-ring`)
- **ARIA labels:** For all icon-only buttons (`<span className="sr-only">`)
- **Semantic HTML:** `<button>` for actions, `<a>` for navigation
- **Contrast:** Minimum 4.5:1 for text, 3:1 for large text/icons

### 8.2 Keyboard Navigation (Desktop)

- All interactive elements reachable via `Tab`
- `Escape` closes modals/sheets/dropdowns
- `Enter`/`Space` activates buttons
- No keyboard traps

### 8.3 Reduced Motion

```tsx
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const prefersReducedMotion = useReducedMotion();
// Only animate when !prefersReducedMotion
```

---

## 9 — Theming & Design Tokens

### 9.1 Core Rule

> **Never** use fixed color values (`text-white`, `bg-black`, `#ff0000`) in components.
> **Always** use semantic design tokens.

### 9.2 Mandatory Tokens

| Token                | Usage                            |
|----------------------|----------------------------------|
| `--background`       | Page background                  |
| `--foreground`       | Default text color               |
| `--primary`          | Primary action color             |
| `--primary-foreground` | Text on primary              |
| `--secondary`        | Secondary surfaces               |
| `--muted`            | Subtle backgrounds               |
| `--muted-foreground` | Subtle text                      |
| `--accent`           | Accent/highlight                 |
| `--destructive`      | Dangerous actions                |
| `--border`           | Border color                     |
| `--ring`             | Focus ring                       |
| `--popover`          | Dropdown/popover background      |

### 9.3 Dark Mode

- **Mandatory:** Every project must support light and dark mode
- Tokens are defined in `:root` (light) and `.dark` (dark)
- Never use `dark:` classes with fixed colors — always via tokens

---

## 10 — Responsive Checklist (per Feature)

Go through the following checklist before every release:

### Mobile (< 768px)
- [ ] Bottom navigation visible and functional
- [ ] No content obscured by bottom nav (pb-16)
- [ ] Touch targets ≥ 44×44px
- [ ] Forms as bottom sheets
- [ ] Dropdowns open upward (`side="top"`)
- [ ] Text readable without horizontal scrolling
- [ ] Images load lazily
- [ ] Skeleton states instead of spinners

### Desktop (≥ 768px)
- [ ] Top navigation visible and functional
- [ ] No content obscured by top nav (pt-16)
- [ ] Card grids use available width (2–4 columns)
- [ ] Forms as right sheets
- [ ] User dropdown shows avatar + name
- [ ] Hover states present
- [ ] Keyboard navigation works

### Both
- [ ] Four states (Loading, Error, Empty, Success) implemented
- [ ] Dark mode tested
- [ ] i18n keys for all visible strings
- [ ] `aria-label` on icon buttons
- [ ] Skip links present
- [ ] No overflow/horizontal scrolling (except tabs)

---

## 11 — Anti-Patterns (avoid!)

| ❌ Wrong                                | ✅ Correct                              |
|-----------------------------------------|-----------------------------------------|
| Hamburger menu on mobile                | Bottom navigation bar                   |
| Modal dialogs for forms                 | Sheet (slide-in panel)                  |
| Fixed pixel values for layout           | Tailwind responsive classes             |
| `text-white`, `bg-gray-900`             | `text-foreground`, `bg-background`      |
| Spinner for page load states            | Skeleton components                     |
| Separate mobile and desktop components  | One component with responsive classes   |
| Show desktop navigation on mobile       | `hidden md:flex` / `md:hidden`          |
| Dropdown opens downward on mobile       | `side="top"` due to bottom nav          |
| Hover-only interactions                 | Touch-friendly alternatives             |
| Custom scroll containers                | Native scroll + ScrollArea when needed  |

---

## 12 — Reference Implementation

Reference implementation files for all patterns listed above:

| Pattern              | File                                   |
|----------------------|-----------------------------------------|
| Navigation           | `src/components/layout/Navbar.tsx`      |
| Layout spacing       | `src/App.tsx` (main element)            |
| Sheet forms          | `src/components/profile/ProfileEditSheet.tsx` |
| Skeleton states      | `src/components/ui/skeleton-card.tsx`   |
| Design tokens        | `src/index.css`                         |
| Accessibility        | `src/components/ui/skip-links.tsx`      |
| Responsive hook      | `src/hooks/use-mobile.tsx`              |
| Reduced motion       | `src/hooks/use-reduced-motion.ts`       |
| Footer               | `src/components/layout/Footer.tsx`      |

---

*Last updated: February 2026 — Richi AI*
