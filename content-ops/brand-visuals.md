# brand-visuals.md — _fixture

**Status:** TEST FIXTURE.

---

## Palette
```yaml
colors:
  primary:
    hex: "#1A1A1A"
    usage: "headings, primary text"
  accent:
    hex: "#FFB300"
    usage: "CTAs, hero accents"
  background:
    hex: "#FAFAFA"
    usage: "default background"
```

## Typography
```yaml
fonts:
  display:
    family: "Inter"
    weights: [800]
  body:
    family: "Inter"
    weights: [400, 500]
```

## Style kits (per visuals.md §9.7.6)
```yaml
style_kits:
  - name: "talking-head-default"
    base_aesthetic: "Minimalist"
    substyle: "Neo-Minimalism"
    palette: ["#FAFAFA", "#1A1A1A", "#FFB300"]
    light: "soft, side-key from window"
    contrast: "low"
    texture: "clean"
    composition: "centered with negative space"
    motion: "slow push-in every 5s (per visuals.md §12.4.1 Goldfish cadence)"
```

## Capture defaults (per visuals.md §12.3)
- Resolution: 4K (3840×2160)
- FPS: 30
- WB: locked to window source
- Aspect: 9:16 vertical

## Aesthetic defaults
- Base aesthetic: Minimalist
- Lighting source default: window (per visuals.md §9.3.1)
