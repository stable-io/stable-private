# Component Structure

## Categories & Principles

**Elements** - Provide a single, focused piece of UI functionality (UI Primitives).

- Examples: `Button`, `Input`, `WalletChip`, `ChainSelect`.
- **Internal Subcomponents**: Elements CAN be broken down into internal subcomponents for organizational clarity if their own implementation is complex (e.g., `ChainSelect` uses `ChainSelectButton`, `ChainSelectMenu`). These subcomponents are implementation details of the parent Element and are NOT intended for independent use elsewhere.
- **Purpose**: To be a reusable building block, like a custom HTML element.

**Compounds** - Orchestrate multiple, often independently reusable, Elements (or other Compounds) to deliver a larger piece of domain-specific functionality or a feature.

- Examples: `BridgeWidget` (uses `TransferInput`, `TransferOutput`, etc).
- **Constituent Parts**: The Elements used within a Compound ARE typically designed for broader reusability.
- **Purpose**: To compose Elements into a specific feature or user flow.

**Sections** - Major structural areas of a page.

- Examples: `Header`, `Footer`, `TopSection`.

**Layouts** - Top-level page structure, defining the arrangement of Sections.

- Examples: `BridgeLayout`, `LandingLayout`.

## General Structure for any Component Type

```
ComponentName/
├── ComponentName.tsx    # Main component logic & orchestration
├── ComponentPartA.tsx   # Optional: Internal subcomponent or constituent element
├── ComponentPartB.tsx   # Optional: Another internal subcomponent/constituent
└── index.ts            # Exports the main ComponentName and its Props type
```
