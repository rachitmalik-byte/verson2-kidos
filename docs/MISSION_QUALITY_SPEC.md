# PolyQuest — Level Parity & Focus-Mode Spec

## 1. Reference standard

Mission 1 (`mission-01-raincoat/RaincoatMission.tsx`) is the quality bar. Before touching any other mission, re-read that file's structure, image set, and interaction flow, and match it — don't reinvent per mission.

---

## 2. Image parity checklist (apply to every experiment)

For each core experiment in a mission, require:

- [ ] Clean **"before"** state image
- [ ] Clean **"after"** state image — same framing, lighting, and crop as "before" so the transformation reads instantly
- [ ] A **"mid-transition"** frame where the transformation itself is the lesson (burning, melting, snapping, soaking) — not just a start/end jump cut
- [ ] Microscope zoom images (100x / 250x / 500x) if fiber/material structure is part of the concept
- [ ] Transparent PNG background (alpha channel) — verified programmatically after generation, not assumed
- [ ] Studio lighting and art style consistent with Mission 1 across every mission
- [ ] No text, logos, or watermarks baked into the image
- [ ] Crop tight enough that the specific detail teaching the concept (ash texture, melted bead, frayed fiber) is clearly visible

Before generating, output a table: `filename | subject | state | zoom level | what concept it teaches`. Review this table before code is written.

---

## 3. Transition & effect requirements

No hard before/after cuts. Every transformation needs an animation sequence matched to its physics, not a generic opacity crossfade:

| Experiment | Expected effect |
|---|---|
| Burning (cotton/polyester) | Flame overlay animation → glow/color shift → ash particle dissolve or melt-droplet formation, synced with `flameIgnite()` sound |
| Snapping (tensile test) | Building tension shake/vibration → snap frame with fray-particle burst (cotton) vs. smooth hold with slight stretch (nylon), synced with `tensionSnap()` |
| Melting (polyester) | Shape softening/blur → droplet formation, not an instant swap |
| Water/soak tests | Droplet animation, absorption spreading vs. beading-and-rolling-off physics |

Use Framer Motion keyframe sequences triggered by the actual interaction (button press, weight drop, burner ignite) — the animation should show the *process* happening, not just reveal a final-state image.

---

## 4. Focus mode (spotlight) — required on every experiment

When an experiment is actively running (weight dropped, burner lit, fabric soaked):

- Dim/blur all non-essential chrome: nav bars, mission title, instruction text, unrelated buttons/controls
- Reuse the existing spotlight pattern already built for the Mystery Object Quiz (`backdrop-blur-xl bg-slate-950/85`) as a **shared component** — do not reimplement a bespoke dim treatment per mission
- Keep at full brightness only: the experiment stage itself, the control currently in use, and essential real-time readouts (current weight, temperature, etc.)
- Restore full UI brightness once the result settles and the child needs to read the explanation

Build this as one reusable component (e.g. extend the existing `TryWithMeEngine` spotlight system) that every mission calls, not a one-off per file.

---

## 5. Remove fluff during interaction moments

Audit every mission for:
- Decorative badges or icons with no functional purpose during the active step
- Instructional text still fully visible after the child has already read it once
- Secondary buttons irrelevant to the current phase
- Anything competing visually with the one thing the child should be looking at right now

Rule: one primary focal point per phase. Apply progressive disclosure — instructions shrink or fade once interaction begins.

---

## 6. Tracking table (fill in as missions are upgraded)

| Mission | Before/After images | Transition effect | Focus mode | Fluff removed |
|---|---|---|---|---|
| 1 — Raincoat | ✅ (reference) | ✅ | ✅ | ✅ |
| 2 — Sorting | ✅ | ✅ | ✅ | ✅ |
| 3 — Strength | ✅ | ✅ | ✅ | ✅ |
| 4 — Fire Safety | ✅ | ✅ | ✅ | ✅ |
| 5–13 (Dynamic Engine) | ✅ | ✅ | ✅ | ✅ |
