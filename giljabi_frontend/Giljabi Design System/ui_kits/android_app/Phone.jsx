const { useState } = React;

function Phone({ children, dark }) {
  return (
    <div style={{ width: 360, height: 740, position: "relative", borderRadius: 36, overflow: "hidden",
      background: dark ? "#101418" : "var(--surface-page)", border: "10px solid #16181c",
      boxShadow: "0 24px 60px rgba(20,24,32,.28)", fontFamily: "var(--font-core)" }}>
      <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px", fontSize: 13, fontWeight: 600, color: dark ? "#fff" : "var(--text-secondary)" }}>
        <span>9:41</span><span>LTE ▮</span>
      </div>
      <div style={{ position: "absolute", inset: "28px 0 0", overflow: "hidden" }}>{children}</div>
    </div>
  );
}
Object.assign(window, { Phone });
