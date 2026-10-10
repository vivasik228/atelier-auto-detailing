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
