What the character says, over any app. Built to stay readable on unknown backgrounds.

```jsx
<SpeechBubble tail="bottom" tailOffset="24px">화면 아래 승차권 예매를 눌러주세요.</SpeechBubble>
```

- Never transparent, never blurred: opaque fill + 3px `--border-ink` outline + `--shadow-overlay`.
- One sentence. If you need two, you need two bubbles.
- `tone="accent"` for encouragement ("잘하셨어요!").
