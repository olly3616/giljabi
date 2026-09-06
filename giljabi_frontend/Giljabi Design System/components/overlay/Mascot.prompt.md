The guide character, "길이". Four states, one per moment in the journey.

```jsx
<Mascot state="point" size={96} facing="right" />
```

- Frame states `walk_1` / `walk_2` are the static step poses; `walk` animates between them. Names match the exported PNG filenames.
- `idle` breathes at 2.6s; `walk` bobs at 720ms; `point` leans; `celebrate` is the only bouncy motion in the system.
- Always a 3px `--border-ink` outline and `--shadow-mascot` — it has to read on top of any app.
- Current geometry is a placeholder for real illustration; keep the state names and the outline rules when swapping in artwork.
