# 길잡이 (Giljabi) — Design System

**Product:** AI 디지털 약자 내비게이터 — an Android app that watches the user's current screen and guides them, one step at a time, to the thing they wanted to do. A character guide moves across the screen and points at what to tap.

**Who it is for:** older adults and anyone unfamiliar with smartphones. Every decision in this system assumes reduced vision, unsteady hands, and low tolerance for cognitive load.

## Sources

No codebase, Figma file, logo, or brand assets were provided. Everything here was authored from the written brief (product overview, accessibility numbers, brand direction: "신뢰감 있는 파랑 + 따뜻한 보조색", "따뜻하되 과하지 않게"). Two substitutions are flagged below and need your confirmation:

- **Typeface:** Pretendard (CDN) stands in for an unspecified brand font. Excellent Hangul coverage and very legible at large sizes.
- **Icons:** Lucide (CDN) stands in for an unspecified icon set. Bold, single-weight, geometric — holds up at 48px+.
- **Logo:** none supplied, so none was drawn. The brand name is set in type wherever a mark would go.
- **Character:** "길이" is placeholder CSS geometry. The *contract* (four states, 3px ink outline, drop shadow) is real; the artwork is not.

## Design principles

1. **Accessibility first.** 18sp text floor, 48dp touch floor, AA contrast minimum and AAA wherever the information matters.
2. **One action per screen.** If a screen asks two things, it is two screens.
3. **Warm, never patronising.** Adult vocabulary, encouraging tone, warm neutrals instead of clinical grey.
4. **Overlays survive any background.** Opaque fills, 3px ink outlines, deep shadows — because we never know what app is underneath.

Each token below carries its accessibility reason inline in the CSS.

## Content fundamentals

Korean, 해요체 throughout. Soft requests, never commands: "눌러주세요", not "누르시오" or "탭". Address the user as 사용자 implicitly — no 당신, no honorific stacking, no 어르신 (it labels them).

- **One instruction per sentence, one sentence per bubble.** "화면 아래 승차권 예매를 눌러주세요."
- **Name what is on screen, in the words printed on it.** "승차권 예매를 눌러주세요", not "예매 메뉴로 이동하세요".
- **No jargon.** 탭/스와이프/앱 권한/설정 경로 → 눌러주세요 / 밀어주세요 / 허락해주세요.
- **Praise before the next step.** "잘하셨어요. 이제 날짜를 골라볼까요?"
- **Errors say what to do, not what failed.** "번호를 다시 확인해주세요."
- **Length:** guidance lines stay under ~22 Korean characters per line (`--text-measure`).
- **No emoji.** Warmth comes from the character and the amber accent, not from glyphs.

Sample lines are collected in `guidelines/voice.card.html`.

## Visual foundations

**Colour.** Trust Blue (`--blue-600` #1A4FD0) carries every action, focus ring and the character's body. Warm Amber (`--amber-300`/`--amber-400`) carries encouragement, highlights and the pointer — it is the "look here" colour and is never used for a tappable in-app control, so the two roles never blur. Neutrals are warmed (#FAF9F7 page, #1A1815 ink) so the app reads friendly rather than institutional. Two background colours in total: page and card. Contrast for every pairing is printed on the Colors cards.

**Type.** Pretendard, 400–800. Seven roles only: Display 40 / Title 32 / Heading 26 / Guide 24 / Button 22 / Body 20 / Caption 18. Nothing renders below 18sp. Korean gets slightly negative tracking (−0.01em body, −0.02em display); line height is generous (1.45–1.6) because dense Hangul is hard to track.

**Spacing.** 4px base. 24px screen gutter, 20px between blocks, 12px between an icon and its label. Controls are 64dp; the primary action and goal cards are 80dp.

**Backgrounds.** Flat colour. No gradients, no photography, no patterns, no texture — the single exception is the character's body, which uses a soft radial to keep it from looking like a flat sticker.

**Cards.** White fill, 24px radius, 2px `--neutral-200` border, and a two-part shadow: a 2px solid warm-grey ledge plus a 12px soft blur. They sit on the page; they do not float.

**Borders.** 2px everywhere a control has an edge, 3px on overlay elements and on focused inputs. Never 1px — hairlines disappear for the target user.

**Shadows.** Two systems. In-app: warm, low, subtle (`--shadow-card`, `--shadow-raised`). Overlay: cool, deep, doubled (`--shadow-overlay`, `--shadow-mascot`) and always paired with a solid outline, since a shadow alone cannot separate an element from an unknown host screen.

**Transparency and blur.** Used once: the scrim behind a modal (`--surface-overlay-scrim`, 55% ink). Overlay content itself is never translucent and never blurred — legibility on an unknown background wins.

**Animation.** Slower than platform default by design. 220ms press, 380ms fade, 600ms screen change, 900ms for the character to walk to a new target. Standard easing is a decelerating curve with no overshoot; `--ease-celebrate` is the only springy curve and appears only on the completion screen. The character breathes at 2.6s when idle; the highlight ring pulses at 1.8s.

**Press states.** Darken + scale to 0.97. Never colour-only, never opacity-only.

**Focus states.** Border thickens 2px → 3px in `--blue-700`, plus a 4px `--blue-100` halo. Visible on touch as well as keyboard.

**Selected / disabled states.** Always three simultaneous signals — fill, border weight, and an icon or label change — so nothing depends on colour perception alone.

**Radii.** 8 / 16 / 24 / 32 / 999. Controls 16, cards 24, chips and rings full.

**Imagery.** None supplied. Illustration slots (`PermissionCard.illustration`, `CompletionBadge.illustration`) render a dashed blue frame until real artwork exists — deliberately obvious, so placeholders never ship by accident.

## Character asset spec (길이)

The system ships placeholder CSS geometry. Production artwork should arrive as **transparent-background PNG**, one file per state, named to match the `Mascot` `state` prop exactly:

| File | State | Required |
| --- | --- | --- |
| `idle.png` | waiting | yes |
| `walk_1.png` | step frame 1 | yes |
| `walk_2.png` | step frame 2 | yes |
| `point.png` | indicating a control | yes |
| `celebrate.png` | completion screen | recommended |

- Square canvas, ≥8% padding, 288×288px at xxhdpi.
- Walking is the two frames alternated at ~350ms; travel to a new target takes 900ms (`--duration-travel`, `--ease-walk`), then the state switches straight to `point`.
- Bake the 3dp ink outline into the image. Do **not** bake the shadow — use Android `elevation` so it matches `--shadow-mascot`.
- **No JPEG** (no transparency — leaves a white box behind the character). GIF not recommended (dirty transparent edges, weak Android support). WebP is an acceptable PNG substitute but buys little at demo stage. Lottie (JSON) is the stretch option: lighter and smoother, needs the Lottie library and more production effort.
- **Consistency is the hard part.** All five states must read as the same character: hold eye spacing, mouth size, body colour, outline weight and cheek position fixed; change only pose and expression. If generating the art, the `Character › States` card is the reference sheet.

## Iconography

Lucide (CDN, v0.446), rendered through the `Icon` component. No brand icon font, sprite or SVG set was provided; this is a flagged substitution.

- Stroke 2.5px at 24–32px, 2.25px at 48px+, round caps and joins.
- Sizes: 24 (inline) / 32 (in controls) / 48 (goal chips) / 64 (hero, permission steps).
- Icons are always paired with a text label. An icon is never the only carrier of meaning or state.
- No emoji anywhere in the product. No Unicode glyphs used as icons.
- Colour: `--blue-600` on light chips, `currentColor` inside buttons, `--neutral-900` on amber.

## Index

| Path | What |
| --- | --- |
| `styles.css` | Entry point — imports every token file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`. |
| `guidelines/` | 18 specimen cards: colour ramps and contrast pairings, type scale, spacing, touch targets, radii, elevation, motion, voice, iconography, plus the Character group (states, walk cycle, asset spec, overlay stress test on busy backgrounds). |
| `components/` | The component library, below. |
| `ui_kits/android_app/` | The four app screens, click-through. |
| `SKILL.md` | Agent-skill wrapper for use outside this project. |

### Components

- **`components/core/`** — `Icon`, `BigButton`, `TextField`
- **`components/cards/`** — `GoalCard`, `PermissionCard`
- **`components/overlay/`** — `Mascot`, `SpeechBubble`, `HighlightRing`, `PointerArrow`
- **`components/feedback/`** — `CompletionBadge`

Every component has a sibling `.d.ts` (props + accessibility notes) and `.prompt.md` (usage).

### Intentional additions

- **`Icon`** — a wrapper was needed to enforce one stroke weight and one size ladder across a CDN glyph set.
- **`PointerArrow`** — split out of the highlight element in the brief, because the arrow and the ring are placed independently on screen.

## Open questions for you

1. Real font files, or is Pretendard acceptable?
2. Is there an icon set, or does Lucide stand?
3. Character artwork — who is drawing "길이", and in what format (SVG states or Lottie)?
4. Is there a logo?
