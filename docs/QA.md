# Verification — 10 October 2026

- Node syntax checks: app.js, domain.js, server.mjs.
- Node test runner: 4 tests passed; invalid/valid telephone and booking fields, unknown service, gallery category filtering. Missing validation/filter behavior produced 3 expected failing tests before implementation.
- Local HTTP preview: 200.
- Browser viewports: desktop 1280/1440, tablet 768×1024, mobile 390×844 and 320×780. Checked hero, navigation, philosophy, service collection, gallery, booking. No document overflow at measured viewports; loaded image checks returned no broken assets.
- Services: keyboard ArrowDown selected PPF; receipt and panel updated. Direct service URL initialization reproduced a ReferenceError before fix; after moving initial hash handling, ceramic deep link and navigation both work.
- Navigation: dialog opens, Escape closes and restores dock focus; mobile panel opens from bottom; selecting a section scrolls and focuses its heading.
- Gallery: interior filter leaves one project; project dialog opens and closes with Escape.
- Booking: empty submission displays errors; formatted telephone and selected service produce honest demo confirmation, with no network submission.
- Reduced motion: footer toggle disables decorative movement and reveals masked content. System media-query branch was inspected in source; system preference emulation was not available through the browser tool.
- Scroll reveal: browser reproduced a visible-in-viewport heading that remained fully clipped. Observer now tracks unclipped parents; philosophy heading verified visible afterward.
- Independent read-only review: fixed service deep-link initialization, no-JavaScript submit fallback, experience text contrast, duplicate hero preload, social image URL, missing credits and unsupported registered mark.
- Seven real photographs reviewed visually and source licenses checked. Unsplash+ candidates rejected. Fonts hosted locally with their SIL OFL licenses.

Saved browser screenshots are in the local ignored `qa/` directory. No Lighthouse score, field Core Web Vitals or CRM delivery is claimed. The business owner must supply real company information, portfolio cases and a booking endpoint before customer-facing use.

## Refinement — 10 October 2026

Two visual passes in the in-app browser: graphite sticky header with Russian studio descriptor and visible anchor links; grey surfaces #b7bab8, darker supporting type, wider philosophy photograph. Removed pointer ring, reflection overlay, repeating scan line, ornamental orbit and intro pause; retained service montage, photographic reveal, craft dial, gallery interactions and reduced-motion controls. Five retained individual decisions: outlined editorial headline, material-focused service selector, progress dial, asymmetric photographic journal and selected-service receipt.

Checked 1440×900, 768×1024, 390×844 and 320×780. A narrow-screen craft grid overflow found in pass two was fixed with minmax(0,1fr); final 320 viewport clientWidth/scrollWidth both 305 including browser scrollbar. Header links scroll below sticky header; ceramic selection updates receipt; navigation dialog closes with Escape. Loaded-image inspection found no broken source images. Domain tests: 4 passed. Demo booking endpoint remains unconfigured. No new photographs, dependencies or remote runtime assets.

## Full art-direction pass — 10 October 2026

Two additional visual audit/implementation cycles, beyond the prior grey/header change. Reviewed hero, services, section index, photographic interlude, craft, gallery, philosophy on tablet, phone hero and phone navigation. Desktop 1440×900, tablet 768×1024, phone 390×844 and 320×780. 320 final scroll/client widths matched; tablet matched. All nine section destinations exist. Navigation link places focus on the heading and closes dialog. Gallery interior filter leaves one item; image dialog closes with Escape. Invalid phone produces error; valid demo submission explicitly states no sending. Reduced-motion toggle produces animation:none and clip-path:none. System reduced-motion branch inspected in source only, not emulated. Local source image inspection: no broken loaded images. No new photo downloads or JS libraries; existing responsive/local assets retained. No Lighthouse/field performance score claimed.

Independent code review found a single-element selector incorrectly used with forEach in the chapter observer. Fixed to querySelectorAll helper; browser confirmed current-section aria-current=location. Keyboard ArrowDown selects PPF from ceramic, Escape restores focus to the header index, aria-expanded resets false.
