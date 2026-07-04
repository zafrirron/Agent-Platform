# Military symbology — MIL-STD-2525D / NATO APP-6(D) (web-scan verified)

> Depth reference for the C2 symbology capability. Distilled from the **MIL-STD-2525D** standard (US DoD, JCS) and **NATO APP-6(D)** (STANAG 2019), cross-checked against the FreeTAKServer symbology docs and the Esri JMSML schema. This is **domain UI/UX + information-semantics** knowledge — the rendering library that draws the SVGs is adjacent (`stack-geospatial`).

## The two standards are harmonized
- **MIL-STD-2525** = US DoD standard; **APP-6** = NATO equivalent (STANAG 2019). Current revisions **2525D / APP-6(D)** are deliberately harmonized: same Symbol Identification Code (SIDC) structure, same icon library, same modifier slots. A system that implements 2525D correctly renders APP-6D with a configuration flag. 2525D adds some US-specific intel/SOF symbols APP-6D omits — implement **2525D internally** and treat APP-6 as a national profile at the rendering boundary.

## The SIDC is a fixed-offset record, not a parsed string
The modern SIDC is **20 digits, purely numeric, positional** — validate it as a fixed-offset record, not by parsing a legacy function-ID string.

| Digits | Field |
|--------|-------|
| 1–2 | Version |
| 3 | Standard identity **context** (reality / exercise / simulation) |
| 4 | **Affiliation** (see table) — drives frame color |
| 5–6 | **Symbol set** — the most important field; routes everything after it |
| 7 | Status (present vs planned/anticipated) |
| 8 | HQ / task-force / dummy(feint) indicator |
| 9–10 | Amplifier descriptor (echelon / mobility) |
| 11–16 | Entity / entity-type / entity-subtype (3-level hierarchy) |
| 17–18, 19–20 | Two modifier slots |

## Symbol = frame + icon + modifiers + amplifiers (compose, don't enumerate)
2525D builds every symbol from **components** rather than pre-defining all symbols. The renderer must **compose** independent flags, not switch on one symbol type:

- **Frame** — the geometric border. Conveys **standard identity (affiliation) + battle dimension + status**. Affiliation → frame color (friend blue, hostile red, neutral green, unknown yellow) and **frame shape** (friend = rounded rect, hostile = diamond, neutral = square, unknown = quatrefoil). *Never rely on color alone — the shape carries affiliation too (friendly-fire-safe).*
- **Icon** — the entity glyph inside the frame.
- **Status** — **present = solid frame, anticipated/planned = dashed frame.** Applies to the frame stroke only, must not affect fill or icon. (A very common renderer bug.)
- **HQ** — extends a **staff line** down from the frame. **Task force** — wraps the frame in a **bracket**. **Dummy/feint** — adds a **dashed extension**. Echelon/HQ/TF/status are **independent** — compose them.

### Affiliation values (SIDC digit 4)
`P` pending · `U` unknown · `A` assumed friend · `F` friend · `N` neutral · `S` suspect · `H` hostile · `J` joker · `K` faker · plus exercise variants (`G/W/D/L/M`).

### Echelon (amplifier Field B, drawn above the frame)
Team/crew → squad → section → platoon/detachment → company/battery/troop → battalion/squadron → regiment/group → brigade → division → corps → army → army group/front → region → command. Rendered as dots / vertical bars / X marks.

## Amplifier fields you will actually use (A–Y)
- **B** echelon/mobility · **T** unique designation (unit name/number) · **H** additional info · **W** date-time group · **J** evaluation/reliability rating · **C** quantity · **Q** direction-of-movement arrow · **AA** special HQ staff indicator.

## Implementation pitfalls (real, from C2-dashboard engineering)
1. **Write modifiers to the correct positional slot** — a value in the wrong slot renders as the wrong symbol or nothing. **Validate every modifier against the JMSML schema, not ad-hoc.**
2. **Echelon offset** — the echelon glyph sits above the frame; forget the offset and it collides with the border, so operators read a different unit type.
3. **Frame/icon pixel alignment** — frame and icon come from different pipeline stages; render both to the **same integer pixel grid** or symbols look "soft" and operators call the picture "ugly" without knowing why.
4. **Status stroke** — dashed (planned) must touch only the frame stroke, never the fill/icon.

## Sources (verified 2026-07-04)
- MIL-STD-2525D — US DoD / Joint Chiefs of Staff, public standard.
- NATO APP-6(D) / STANAG 2019 — NATO Joint Military Symbology.
- Esri **JMSML** (joint-military-symbology-xml) — machine-readable schema of the standard; validate SIDCs/modifiers against it.
- FreeTAKServer symbology docs (EPL-2.0) + Corvus Intelligence symbology-engineering references — corroborating implementation detail.
