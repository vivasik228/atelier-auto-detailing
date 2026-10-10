# Care planner implementation plan

> **For agentic workers:** Use executing-plans to implement each task with verification.

**Goal:** Implement the ten approved additions around one coherent service planning workflow.

**Architecture:** Keep the existing static site and visual composition. A pure care-plan module normalizes selected services/zones and creates downloadable text. A browser module owns planner interactions and connects to the existing service panel and demo booking form.

**Tech Stack:** HTML, CSS, ES modules, native dialogs, Node test runner.

- [x] Add tested plan normalization/export: valid IDs, deduplication, zones imply PPF, no private contact data in exports.
- [x] Add selectable body diagram, coating comparison, three editable preset programs and seven-service checklist.
- [x] Add optional questionnaire to booking; include plan and answers in the booking payload and text export.
- [x] Add plan download/copy, current-service aftercare download and service image zoom dialog.
- [x] Add practical booking FAQ and mobile contextual booking action.
- [x] Check all workflows, keyboard/dialog behavior, phone layout and no-overflow behavior; run domain tests and syntax checks.
- [x] Publish to GitHub Pages and verify the live behavior and screenshot.
