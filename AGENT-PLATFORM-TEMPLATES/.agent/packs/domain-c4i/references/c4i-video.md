# C2 / C4ISR — full-motion video integration (application layer)

> Video-in-C2 as a **domain UI/UX capability**. This pack owns how video is *integrated into the application and the COP*. The raw codec/decoder and stream transport are the adjacent `stack-fmv-decode` pack — do not put codec/container/RTP details here.

## Feeds as first-class COP citizens
- A video feed is a domain entity: it has identity, a source/sensor, a state (live / stale / lost), and it correlates to what it observes.
- Feeds dock into the screen-zone system (see `c4i-ux.md`) — a video panel is a first-class zone, not a floating afterthought.

## Video ↔ map correlation (the core capability)
- **Video-on-map:** draw the sensor's field-of-view / footprint / look-point on the COP from geo-metadata (KLV / MISB — see below).
- **Map-in-video:** overlay geo-registered metadata and COP objects onto the video frame.
- **Single truth:** metadata reported by the feed must reconcile to the same track/place the COP holds — same target, same location, across map and video.

## FMV metadata standard — MISB ST 0601 / STANAG 4609 / KLV (web-scan verified)
The interoperable way geo-metadata rides with FMV. Know these as the **data contract** the application consumes; the codec/container/transport that carries them is adjacent (`stack-fmv-decode`).

- **KLV** (Key-Length-Value, SMPTE ST 336) — bandwidth-efficient binary metadata encoding. **MISB ST 0601** defines the **UAS Datalink Local Set (LS)** of KLV items; **STANAG 4609** is the NATO agreement to use it for UAS.
- **Transport:** the KLV LS is **multiplexed into an MPEG-2 Transport Stream** alongside the compressed motion imagery (EO/IR). **Metadata↔imagery synchronization is the system designer's responsibility** — do not assume the container guarantees frame-accurate sync; verify it.
- **Key ST 0601 items the app needs** to compute footprint / target location / geo-registration: Unix timestamp, Sensor Latitude/Longitude/Altitude, Platform Heading/Pitch/Roll, Horizontal FOV, Sensor Relative Azimuth/Elevation/Roll, slant range. Missing any of these degrades footprint accuracy — surface reduced confidence, don't fake precision.
- **Parsing libraries** (study, license-check before use): `klvdata` (Python), `misb.js` (JS). The app layer consumes parsed values; it does not re-implement SMPTE ST 336.
- **Archived vs live:** the same LS works parsed from a recorded `.ts` file (DVR/after-action) or a live datalink — reuse one metadata path for both.

## Operator video workflows
- **Slew-to-cue:** click a track/point on the COP → controllable camera slews to it.
- **Click-in-video → map:** click a point in the frame → drop/hand-off a geo point or track onto the COP.
- **Snapshot → track / clip → annotate → share:** capture a still or clip, annotate, and push to the COP / to another operator.
- **Multi-feed grid & saved video layouts:** watch several feeds; save/restore video layouts per role/phase.
- **DVR / replay synced to mission timeline:** scrub video together with COP replay for after-action.

## Degraded / DIL video UX
- A lost or late feed shows **last-good-frame + staleness**, never a frozen frame pretending to be live.
- DIL-aware quality fallback (resolution/frame-rate) is surfaced to the operator, not silent.
- Bandwidth pressure prioritizes mission-critical feeds; operator can pin/drop feeds.

## Trust & marking (with security overlay)
- Treat inbound video metadata (KLV/MISB) as **untrusted input** — validate/bound before it touches the COP.
- Video products carry classification/marking; export/share is marking-aware (see `security-agent.overlay.md`).

## Adjacent (NOT this pack)
`stack-fmv-decode` (codec/decoder/container, RTP/RTSP/SRT transport, GPU decode) · `stack-geospatial` (map rendering of the overlays) · `platform-tactical-edge` (capture hardware / edge decode).
