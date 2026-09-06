A numbered permission step with room for a real screenshot or illustration.

```jsx
<PermissionCard step={1} title="접근성 켜기" icon="settings"
  description="설정에서 길잡이를 찾아 켜주세요." />
```

- One card per screen during onboarding. Never two steps at once.
- Leave `illustration` empty and the dashed frame shows where real artwork must go.
