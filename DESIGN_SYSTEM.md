# Seoul City Tour Tiger Bus — Design System

> **Purpose:** Reference for building out the Figma design system.
> All tokens are sourced from `src/app/globals.css` `@theme {}` block.
> All component patterns are derived from `src/components/` and `src/app/booking/`.

---

## 1. Color Tokens

### Brand Colors
| Token | Hex | Usage |
|---|---|---|
| `brand-red` | `#E20021` | Primary CTA, header bars, booking button, step indicators |
| `brand-dark-red` | `#CC0000` | Hover state of brand-red |
| `brand-cream` | `#FFFEED` | Header background, mobile nav, footer background |
| `brand-maroon` | `#6A1E1E` | Footer links, secondary nav text |

### Text Colors
| Token | Hex | Usage |
|---|---|---|
| `text-dark` | `#333333` | Body text, headings, phone numbers |
| `text-gray` | `#666666` | Secondary body text, footer addresses |
| `text-light-gray` | `#888888` | Tertiary text, placeholders |

### Semantic / One-off Colors
| Color | Hex | Context |
|---|---|---|
| Dark Navy | `#001C2C` | Course carousel overlay background |
| Night Yellow | `#FCD700` | Night View course accent |
| Panorama Red | `#C41E3A` | Panorama course accent |
| Navy Blue | `#000080` | Tour 01 label badge |
| White | `#FFFFFF` | Text on dark backgrounds, modal backgrounds |
| Light BG | `#f5f5f5` | Card backgrounds, hover states |
| Overlay Black | `rgba(0,0,0,0.8)` | Modal backdrops |
| Translucent Dark | `rgba(58,58,58,0.9)` | Carousel nav buttons |

### Gradient Backgrounds
| Name | Value | Context |
|---|---|---|
| Template Page | `linear-gradient(180deg, #E20021 0%, #FFFFFF 100%)` | Booking, Discounts pages |
| Course 1 (Palace) | `linear-gradient(180deg, #C6F5FF 0%, #E1F7FF 30.56%, #E2601E 100%)` | Hero gradient below carousel |
| Course 2 (Night) | `linear-gradient(180deg, #C6F5FF 5%, #FF8C36 80%, #E2601E 100%)` | Hero gradient below carousel |
| Course 3 (Panorama) | `linear-gradient(180deg, #FFB3B3 0%, #E24C5E 50%, #C41E3A 100%)` | Hero gradient below carousel |

---

## 2. Typography

### Font Families
| Token | Family | Weights | Usage |
|---|---|---|---|
| `font-copperplate` | Copperplate | normal | Navigation buttons (BOOKING, MY BOOKING), prominent CTAs |
| `font-sans-semibold` | GeneralSans-Semibold | 600 | Header utility text, phone numbers |
| `font-sans-medium` | GeneralSans-Medium | 500 | Footer links, secondary UI |
| `font-sans-regular` | GeneralSans-Regular | 400 | Body text |
| Fallback | sans-serif | — | System fallback |

> All fonts are self-hosted at `/public/fonts/` as `.otf` files.

### Type Scale (from usage)
| Name | Size | Weight | Usage |
|---|---|---|---|
| Hero Heading | `text-4xl` (36px) | 600 | Course title banner |
| Section Heading | `text-2xl` / 24px | 600 | Carousel overlays |
| Nav Links | `clamp(14px, 1.4vw, 20px)` | 600 | Desktop navigation |
| Nav Buttons | `clamp(14px, 1.4vw, 20px)` | bold | Booking/My Booking CTAs |
| Nav Buttons (compact) | `clamp(11px, 1.1vw, 14px)` | bold | Large tablet nav |
| Mobile Nav Buttons | `text-xs` (12px) | bold | Mobile header |
| Phone Number (footer) | 32px | 600 | Contact number |
| Phone Number (header) | 22px | 600 | Top bar phone |
| Body / Paragraph | `text-sm` (14px) | 400 | Footer address, descriptions |
| Price Large | 19px | 600 | Sale price in carousel |
| Price Small | 13px | 400 | Original/from pricing |
| Badge / Label | `text-sm` (14px) | 600 | Tour labels, "Popular" badge |

---

## 3. Spacing & Layout

### Header Stack Heights
| Token | Value | Component |
|---|---|---|
| `--promo-bar-height` | `45px` | Red marquee bar (top) |
| `--notification-bar-height` | `45px` | Red utility bar (directions + phone) |
| `--mobile-header-height` | `60px` | Mobile logo/nav bar |
| Total desktop offset | `135px` | `padding-top` on `<body>` |
| Total desktop (promo closed) | `90px` | When promo bar is dismissed |

### Content Max Widths
| Usage | Value |
|---|---|
| Footer inner | `max-w-[1400px]` |
| Homepage carousel | `max-width: 1200px` |
| Tour info / content blocks | `max-w-[460px]` |
| Section padding (≥1200px) | `10%` left/right |
| Section padding (≥1600px) | `15%` left/right |
| Section padding (≥2000px) | `20%` left/right |

### Common Spacing
| Value | Usage |
|---|---|
| `gap-[60px]` | Footer 3-column grid gap (desktop) |
| `pt-[60px]` | Footer top padding (desktop) |
| `px-10` (40px) | Footer / notification bar horizontal padding |
| `p-6` (24px) | Booking step content padding |
| `p-5` (20px) | Mobile content padding |
| `gap-5` (20px) | Footer nav link list gap |
| `gap-[15px]` | Social icon row gap |
| `gap-[8px]` | Carousel dots gap |
| `mb-5` (20px) | Booking form section gaps |

---

## 4. Border Radius
| Value | Usage |
|---|---|
| `rounded-[20px]` | Carousel container, course card, hero gradient box |
| `rounded-xl` (12px) | Tour image display in booking, modal popup |
| `rounded-[10px]` | Desktop nav CTA buttons |
| `rounded-lg` (8px) | Compact nav buttons, dropdown menus |
| `rounded-[6px]` | Carousel action buttons |
| `rounded-[5px]` | Mobile nav buttons |
| `rounded-full` | Step indicator circles, carousel nav arrows |
| `rounded` (4px) | Tour label badges, price amount chip |
| `rounded-t-[20px]` | Course title banner (rounded top only) |

---

## 5. Shadows & Elevation
| Shadow | Usage |
|---|---|
| `box-shadow: 0 4px 6px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)` | Desktop main nav |
| `box-shadow: 0 1px 8px rgba(0,0,0,0.1)` | Mobile header |
| `shadow-[0_2px_8px_rgba(0,0,0,0.1)]` | Language dropdown |
| `box-shadow: 0 2px 8px rgba(0,0,0,0.15)` | Carousel nav buttons |
| `box-shadow: 0 20px 60px rgba(0,0,0,0.4)` | Map popup modal |
| `shadow-[0_-4px_10px_rgba(0,0,0,0.1)]` | Course title banner (upward shadow) |

---

## 6. Z-Index Scale
| Token | Value | Layer |
|---|---|---|
| `--z-nav` | 100 | Carousel controls, within-section |
| `--z-sticky` | 500 | Fixed header bars |
| `--z-dropdown` | 600 | Dropdowns, calendar pickers |
| `--z-nav-overlay` | 700 | Fullscreen mobile nav |
| `--z-cart-bar` | 800 | Floating cart bar |
| `--z-backdrop` | 900 | Modal backdrops |
| `--z-modal` | 1000 | Modals |
| `--z-modal-over` | 1100 | Modals above modals |
| `--z-toast` | 1200 | Toast notifications |

---

## 7. Components

### 7.1 Button — Primary (Booking CTA)
```
Background: brand-red (#E20021)
Text: white
Font: Copperplate, bold
Border-radius: 10px (desktop), 5px (mobile)
Padding: 0.55em 1.1em (desktop), 6px 8px (mobile)
Icon: booking icon image, left-aligned
Hover: brand-dark-red (#CC0000)
```

### 7.2 Button — Secondary (My Booking)
```
Background: #FFF6D6 (light yellow, mobile) / transparent (desktop)
Text: text-dark (#333)
Font: Copperplate, bold
Border-radius: 10px (desktop), 5px (mobile)
Padding: 0.55em 1.1em (desktop), 6px 8px (mobile)
Icon: account icon image, left-aligned
```

### 7.3 Button — Ghost (Carousel More Info)
```
Background: transparent
Text: white
Border: 1px solid rgba(255,255,255,0.5)
Border-radius: 6px
Padding: 8px 12px
Font-size: 12px
Hover: background rgba(255,255,255,0.1), border rgba(255,255,255,0.8)
```

### 7.4 Navigation Link
```
Color: #A50000 (deep red)
Font: semibold
Text-decoration: none
Font-size: clamp(14px, 1.4vw, 20px) — fluid
```

### 7.5 Footer Link
```
Color: brand-maroon (#6A1E1E)
Font: GeneralSans-Medium
Font-size: text-xl (20px) desktop, text-lg (18px) mobile
Font-weight: light (300)
```

### 7.6 Header — Top Bar (Notification Bar)
```
Background: brand-red (#E20021)
Height: 45px
Content: Directions link (left) | Phone + Language selector (right)
Text: white, semibold
Padding: py-2.5 px-10
Position: fixed, top: 45px (below promo bar)
```

### 7.7 Header — Promo Bar (Marquee)
```
Background: #FF0000
Height: 45px
Content: Scrolling marquee text (white, bold)
Position: fixed, top: 0
Animation: 37s linear infinite (desktop), 30s (mobile)
```

### 7.8 Header — Desktop Nav Bar
```
Background: brand-cream (#FFFEED)
Padding: py-[15px]
Position: fixed, top: 90px
Shadow: 0 4px 6px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)
Layout: logo + nav links (left) | CTA buttons (right)
```

### 7.9 Header — Mobile Header
```
Background: brand-cream (#FFFEED)
Height: 60px
Content: Logo (200px wide) | compact CTA buttons
Position: fixed, top: 90px
```

### 7.10 Mobile Menu (Fullscreen Overlay)
```
Background: brand-cream (#FFFEED)
Position: fixed, inset: 0
Z-index: --z-nav-overlay (700)
Links: text-2xl, color #A50000, centered
Close button: top-right ×
Bottom: red tiger bus logo
```

### 7.11 Language Dropdown
```
Background: white
Border-radius: rounded-lg
Shadow: 0 2px 8px rgba(0,0,0,0.1)
Items: py-3 px-5, text-dark
Hover: bg #f5f5f5
Trigger: globe SVG icon
```

### 7.12 Tour Card (Course Carousel)
```
Image: full-width, border-radius: 20px
Overlay: dark navy rgba(0,28,44,0.95), top-right, width ~35%, border-radius: 12px
Content in overlay: tour title (h2, 24px, white), pricing rows, action buttons
Actions: 2 buttons side by side (50/50) — Book Ticket (red) + More Info (ghost)
```

### 7.13 Add-on Card
```
Grid: 3 cards per row (desktop), scrollable on mobile
Flex: 0 0 calc((100% - 40px) / 3)
Gap: 20px
CTA: "More Info" button — brand-red background, white text
Hover: brand-dark-red
```

### 7.14 Step Indicator (Booking Wizard)
```
Shape: circle, size-8 (32px)
Background: brand-red
Text: white, font-semibold, base (16px)
Divider below: border-b border-[#eee]
Label: text-lg, font-semibold, text-dark
```

### 7.15 Tour Image Display (Booking)
```
Container: h-[200px], rounded-xl, bg-[#f5f5f5]
Image: cover, full size
Gradient overlay: bottom, black/80
Tour label badge: bottom-left, colored bg (per tour), text-sm, white
Popular badge: top-right, bg-[#E31E24], text-sm, white
```

### 7.16 Select / Dropdown Input
```
Width: full
Border: 1px solid #ddd
Border-radius: rounded-lg
Padding: px-4 py-3.5
Font-size: 15px
Custom arrow: SVG, right: 16px
Appearance: none
```

### 7.17 Modal / Popup
```
Backdrop: fixed inset-0, rgba(0,0,0,0.8), z-index: --z-modal
Container: max-width 90%, max-height 90%, white, border-radius: 12px
Shadow: 0 20px 60px rgba(0,0,0,0.4)
Close button: top-right, 36px circle, dark bg, white ×
Close hover: #D40004, scale(1.1)
```

### 7.18 Price Badge
```
Background: brand-red (#E20021)
Text: white
Padding: 2px 6px
Border-radius: 3px
Font-size: 19px, font-weight: 600
```

### 7.19 Footer
```
Background: brand-cream (#FFFEED)
Layout: 3-column grid (logo/address | links | contact/social)
Max-width: 1400px, centered, px-10
Bottom: full-width city illustration image
Social icons: 45×45px each
```

### 7.20 Carousel Nav Button
```
Shape: circle (50px desktop, 44px mobile, 28px mobile card carousel)
Background: rgba(58,58,58,0.9) (desktop), rgba(255,255,255,0.95) (mobile)
Icon: Font Awesome chevron, white (desktop) / dark (mobile)
Position: absolute left/right, vertically centered
Hover: scale(1.05)
```

---

## 8. Animation & Motion
| Name | Value | Usage |
|---|---|---|
| `animate-marquee` | `37s linear infinite` | Promo bar text (desktop) |
| `animate-marquee-mobile` | `30s linear infinite` | Promo bar text (mobile) |
| Slide transition | `opacity 0.3s ease, visibility 0.3s ease` | Course carousel slide in/out |
| Card carousel | `transform 0.4s ease` | Card track sliding |
| Header collapse | `top 0.3s ease` | Nav repositioning on promo close |
| Course bg | `background 0.5s ease` | Hero gradient change on slide switch |
| Scale hover | `transform 0.2s ease` | Modal close button |

---

## 9. Breakpoints
| Name | Value | Notes |
|---|---|---|
| Mobile | `max-width: 768px` | Primary mobile breakpoint |
| Tablet / small desktop | `max-width: 1024px` (lg) | Nav shrinks |
| Compact desktop | `max-width: 375px` | Smallest phones |
| Wide | `min-width: 1200px` | Section padding starts at 10% |
| XL | `min-width: 1600px` | Section padding 15% |
| XXL | `min-width: 2000px` | Section padding 20% |

---

## 10. Imagery & Assets
| Asset | Path | Notes |
|---|---|---|
| Main logo (red, full) | `/imgs/redlogo-tigerbus.png` | Footer, mobile menu |
| Small logo (nav) | `/imgs/smalllogo.png` | Desktop nav, mobile header |
| SVG logo | `/imgs/logo.svg` | Homepage hero overlay |
| Booking icon | `/imgs/bookingicon.png` | Booking button (20px) |
| Account icon | `/imgs/myaccounticon.png` | My Booking button (20px) |
| Globe icon | `/imgs/globe.svg` | Language selector (24px) |
| Google icon | `/imgs/googleicon.png` | Directions link (25×20px) |
| Naver icon | `/imgs/navericon.png` | Directions link (22×20px) |
| Footer city illustration | `/imgs/footerimg.png` | Footer bottom, max-w 700px |
| Tour 01 image | `imgs/tour01__.png` | Booking step 1 |
| Tour 02 image | `imgs/panorama.png` | Booking step 1 |
| Tour 04 image | `imgs/tour02__.png` | Booking step 1 |
| Course icon 1 | `/imgs/palacetour01.png` | Hero gradient section |
| Course icon 2 | `/imgs/nighttouricon.png` | Hero gradient section |
| Course icon 3 | `/imgs/sctbbusicon.png` | Hero gradient section |
| Social icons | `/imgs/footericon-1/2/3.png` | Instagram, Visit Seoul, Blog |

---

## 11. Page Templates

### Standard Page
- `body` gets `padding-top: 135px` (desktop) — space for 3 fixed header bars
- Background: white

### Template Page (Booking / Discounts)
- Class: `body.template-page`
- Background: `linear-gradient(180deg, #E20021 0%, #FFFFFF 100%)`

### Homepage
- Class: `body.index-page`
- Mobile: `padding-top: 0` — hero handles its own offset internally
- Section widths are constrained with percentage padding at wide viewports

---

## 12. Figma Setup Guide

### Variables to create
1. **Color styles** — all tokens from Section 1
2. **Text styles** — all entries from Section 2 Type Scale
3. **Effect styles** — shadows from Section 5

### Component frames to build
Priority order for the design system in Figma:

1. **Buttons** — Primary (Booking), Secondary (My Booking), Ghost (More Info), Carousel action
2. **Navigation** — Top Bar, Notification Bar, Desktop Nav, Mobile Header, Mobile Menu
3. **Cards** — Tour Card with overlay, Add-on Card
4. **Booking Wizard** — Step indicator, Tour image display, Select input, Summary row
5. **Modals** — Backdrop + container pattern, close button
6. **Footer** — 3-column grid + city illustration
7. **Badges** — Tour label, Popular, Price amount chip
8. **Carousel** — Nav arrows (desktop + mobile), dot indicators

### Font setup in Figma
- Copperplate — available via system or license from foundry
- General Sans — available from Fontshare (free, open license)
