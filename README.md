# NurseMatch Triage

A high-velocity clinical reconciliation tool designed for Nurse Navigators to safely and efficiently match hospital rosters with clinic records.

## Quick Start

1. **Install dependencies:** `pnpm install`
2. **Run locally:** `pnpm dev`
3. **Access the app:** `http://localhost:5173`

---

## Key UX Decisions & Tradeoffs

### 1. High-Velocity Ergonomics
The UI is optimized for high-throughput triage sessions with a focus on minimal physical friction:
* **Natural Progression:** Upon a decision, the app automatically advances to and focuses the next record in the queue.
* **Keyboard-First:** Selection automatically shifts focus to the primary action area, enabling navigators to process an entire list using only the keyboard.

### 2. High-Contrast Auditing
* **Conflict Highlighting:** To prevent misidentification, field-level discrepancies are surfaced via high-contrast styling. This allows the navigator to skip matching data and focus exclusively on conflicts requiring human judgment.
* **Historical Context:** Triaged records transform into a read-only audit state. This view clearly preserves the decision timestamp, rejection reasons, and nurse narratives, making it easy to review or modify previous entries at a glance.

### 3. Adaptive Appearance
The UI supports native Light and Dark modes, inheriting settings directly from the user's device. This accommodates varying clinical environments and reduces eye strain during long shifts or low-light conditions.

### 4. Workflow Resilience
* **Undo State:** A non-intrusive toast notification provides an immediate "Undo" path for accidental decisions without forcing the user to leave their current place in the queue.
* **Contextual Speed Bumps:** "Accept" is a single-click action, while Rejections/Follow-ups use a modal to capture mandatory justification without cluttering the main view.
* **State Persistence:** All decisions are synced to LocalStorage via Pinia, ensuring work-in-progress is preserved across browser refreshes or power loss.

---

## Technical Highlights

* **Modern Stack:** Built with Vue 3, Vite, and Tailwind CSS.
* **Package Management:** Utilizes **pnpm** for fast, disk-efficient dependency management.
* **Type Safety & Linting:** 
    * **TypeScript:** Strictly typed data structures for hospital and clinic records.
    * **Pre-commit Hooks:** Integrated **Husky** and **lint-staged** to enforce **ESLint** and **Prettier** standards automatically before every commit.
* **State Management:** Pinia with persistent storage for robust session handling.
* **Device Optimization:** Fully responsive and optimized for high-density Desktop and Tablet workstations.

---

## Future Roadmap

1. **Smart Matching:** Implement detection for minor variations (e.g., "Jon" vs. "Jonathan") to flag them as warnings rather than hard mismatches.
2. **Bulk Actions:** Add a "Select All High Confidence" feature for matches with a score above 99% to clear the obvious queue quickly.
3. **Mobile UX Overhaul:** Further refine the stacking logic and touch targets to provide a native-feeling experience for smartphone viewports.
4. **Keyboard Macros:** Map specific rejection reasons to numeric keys for faster resolution within modals.