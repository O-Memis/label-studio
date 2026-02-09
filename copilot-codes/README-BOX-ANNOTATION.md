# Box Annotation (Object Detection): Keyboard-Assisted Editing

This note documents the custom functionality added in this repo to make **bounding-box editing** easier when mouse control isn’t sensitive/precise enough.

Scope: this is specifically about **rectangle regions** created via `<RectangleLabels>` (object detection with bounding boxes).

## What changed (UX)

In the image labeling UI’s **right-side toolbar**, under the existing **Move** tool, there are now two additional assist tools:

- **Resize assist** — uses arrow keys to change the selected box’s width/height.
- **Rotate assist** — uses arrow keys to rotate the selected box.

These assist modes are intentionally **tool-driven**:

- Arrow keys only apply when one of these tools is selected.
- Switching back to drawing boxes (e.g., selecting labels in the bottom label area / rectangle drawing modes) disables the assist behavior because a different tool is active.

## How it works (behavior)

All three modes operate only when:

- Exactly **one** region is selected
- Focus is **not** inside a text input/textarea/contenteditable

### 1) Move assist (Move tool)

When the **Move** tool is selected:

- Arrow keys **nudge** the selected box by **1px** per key press.

### 2) Resize assist

When **Resize assist** is selected:

- Left/Right: width **-1px / +1px**
- Up/Down: height **+1px / -1px**
- Width/height are clamped to a minimum of **1px**.

### 3) Rotate assist

When **Rotate assist** is selected:

- Left/Right: rotate by **-1° / +1°**
- Up/Down: no-op

## Where the code lives

Key implementation files:

- `web/libs/editor/src/tools/Selection.js`
  - Adds arrow-key nudging when the Move tool is selected.
- `web/libs/editor/src/tools/ArrowResize.js`
  - Implements the resize-assist tool.
- `web/libs/editor/src/tools/ArrowRotate.js`
  - Implements the rotate-assist tool.
- `web/libs/editor/src/tags/object/Image/Image.js`
  - Registers these tools into the Image tool manager so they appear in the right toolbar.

## Notes about “seeing changes” after edits

If you’re changing frontend/editor source code under `web/`, you typically need to rebuild the frontend bundle before the running app will reflect those edits.

In this repo, the production build output directory is:

- `web/dist/apps/labelstudio/`

Depending on how you start Label Studio (pip-installed CLI vs repo checkout), the app may serve assets from different locations; if you don’t see changes, confirm you’re rebuilding the bundle that your running server is actually using.
