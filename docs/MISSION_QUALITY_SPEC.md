# PolyQuest — Level Parity, Focus-Mode & Interaction Density Spec

## 1. Reference standard

Mission 1 (`mission-01-raincoat/RaincoatMission.tsx`) is the quality bar. Before touching any other mission, re-read that file's structure, image set, and interaction flow, and match it — don't reinvent per mission.

---

## 2. Image parity checklist (apply to every experiment)

For each core experiment in a mission, require:

- [ ] Clean **"before"** state image
- [ ] Clean **"after"** state image — same framing, lighting, and crop as "before" so the transformation reads instantly
- [ ] A **"mid-transition"** frame where the transformation itself is the lesson (burning, melting, snapping, soaking) — not just a start/end jump cut
- [ ] Microscope zoom images (1x / 40x / 400x / 1,500x SEM) with authentic scale bars
- [ ] Transparent PNG background (alpha channel) — verified programmatically after generation, not assumed
- [ ] Studio lighting and art style consistent with Mission 1 across every mission
- [ ] No text, logos, or watermarks baked into the image
- [ ] Crop tight enough that the specific detail teaching the concept (ash texture, melted bead, frayed fiber) is clearly visible

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

---

## 5. Remove fluff during interaction moments

Audit every mission for:
- Decorative badges or icons with no functional purpose during the active step
- Instructional text still fully visible after the child has already read it once
- Secondary buttons irrelevant to the current phase
- Anything competing visually with the one thing the child should be looking at right now

Rule: one primary focal point per phase. Apply progressive disclosure — instructions shrink or fade once interaction begins.

---

## 6. Tracking table

| Mission | Before/After images | Transition effect | Focus mode | Fluff removed | Interaction Density |
|---|---|---|---|---|---|
| 1 — Raincoat | ✅ (reference) | ✅ | ✅ | ✅ | ✅ (Zero filler clicks) |
| 2 — Sorting | ✅ | ✅ | ✅ | ✅ | ✅ (Merged hook, auto-advance) |
| 3 — Strength | ✅ | ✅ | ✅ | ✅ | ✅ (Merged hook, auto-advance) |
| 4 — Fire Safety | ✅ | ✅ | ✅ | ✅ | ✅ (Merged hook, auto-advance) |
| 5–13 (Dynamic Engine) | ✅ | ✅ | ✅ | ✅ | ✅ (Auto-settle transitions) |
| Theme 1 (Super Senses) | ✅ | ✅ | ✅ | ✅ | ✅ (Paced transitions) |
| Theme 2/4 (Water Labs) | ✅ | ✅ | ✅ | ✅ | ✅ (Paced transitions) |
| Theme 3/5 (Shelter Labs) | ✅ | ✅ | ✅ | ✅ | ✅ (Paced transitions) |

---

## 7. Interaction Density & Click Fatigue Prevention (Core Law)

Every tap from a child must be an act of **learning, discovery, or genuine choice** — never a filler click to navigate past empty text screens.

### 5 Rules of Interaction Density:

1. **MERGE, DON'T CHAIN:**
   - Eliminate standalone "Enter Lab" / "Let's Start" introductory screens.
   - Present the interactive stage directly with Pip's concise prompt: the child's very first action IS the experiment (spraying, dragging, heating, testing).

2. **PROGRESSION = THE ACTION, NOT A BUTTON AFTER IT:**
   - When an experiment reaches completion (e.g. all fabrics sprayed, both wires tested in circuit, all items sorted), the experiment result automatically advances into the explanation phase after a natural **1.0–1.5 second settle pause**.
   - Do NOT require an auxiliary "Continue" button immediately following an experiment action.

3. **EXPLANATIONS AND SUMMARIES STAY TAP-GATED:**
   - Do NOT auto-advance past reading comprehension moments, "Golden Science Law" breakdowns, or conceptual synthesis cards.
   - The child controls reading pace and taps explicitly to confirm understanding when ready.

4. **ONE PRIMARY ACTION PER SCREEN:**
   - Never display a functional action button and a redundant filler "Continue" button on the same screen.

5. **PRESERVE GENUINE CHOICES & CHECKPOINTS:**
   - Scaffolded answer builders, multiple choice questions, and material selection cards must remain tap-gated.
