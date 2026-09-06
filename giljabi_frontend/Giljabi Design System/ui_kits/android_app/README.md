# UI kit — AI 디지털 약자 내비게이터 (Android)

Four surfaces, built entirely from this system's components. No new visual decisions are made here.

| File | What it holds |
| --- | --- |
| `Phone.jsx` | 360×740 Android frame with a minimal status bar. |
| `Screens.jsx` | `Onboarding`, `Home`, `Overlay`, `Complete`, plus `HostAppScreen` — a neutral stand-in for whatever third-party app the user is being guided through. |
| `index.html` | Click-through: onboarding steps → home → overlay guidance → completion, alongside static copies of each screen. |

Screen notes:

- **Onboarding** — one permission per screen, progress dots, an always-available "나중에 할게요".
- **Home** — a greeting from the character, a search field, then four `GoalCard`s. Nothing else competes for attention.
- **Overlay** — the character, one bubble, one arrow, one ring, and a step counter chip. Everything is opaque and outlined because the host app's colours are unknown.
- **Complete** — celebration first, then exactly two ways forward.

The host app mock is deliberately generic; it is not a recreation of any real product.
