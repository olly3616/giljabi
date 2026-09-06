The screen's single action — full width, 80dp tall, 22sp bold.

```jsx
<BigButton icon="check" onClick={next}>네, 켜겠어요</BigButton>
<BigButton variant="secondary" iconEnd="arrow-right">다음에 할게요</BigButton>
```

- One `primary` per screen. Everything else is `secondary` or `quiet`.
- Disabled state changes fill, text colour AND removes the shadow — never colour alone.
- Press feedback: darken + 3% shrink over 220ms.
