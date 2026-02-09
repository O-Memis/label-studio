# Label Studio Fork

This repository is a fork of the original Label Studio project (upstream: https://github.com/HumanSignal/label-studio). <br> <br>

In this fork, the **primary focus is make computer vision annotations easier**. The main goal is to make it easy for contributors and users of this fork to find the relevant labeling configuration, UI implementation details, and quick-start steps. <br><br>


# Box Annotation (Object Detection): Keyboard-Assisted Editing

This note documents the custom functionality added in this repo to make **bounding-box editing** easier when mouse control isn’t sensitive/precise enough. <br><br>

Scope: this is specifically about **rectangle regions** created via `<RectangleLabels>` (object detection with bounding boxes). <br>

## What changed (UX)

In the image labeling UI’s **right-side toolbar**, under the existing **Move** tool, there are now two additional assist tools: <br><br>

- **Resize assist** — uses arrow keys to change the selected box’s width/height. <br>
- **Rotate assist** — uses arrow keys to rotate the selected box. <br>

These assist modes are intentionally **tool-driven**: <br>

- Arrow keys only apply when one of these tools is selected. <br>
- Switching back to drawing boxes (e.g., selecting labels in the bottom label area / rectangle drawing modes) disables the assist behavior because a different tool is active. <br><br>

## How it works (behavior)

All three modes operate only when: <br>

- Exactly **one** region is selected <br>
- Focus is **not** inside a text input/textarea/contenteditable <br><br>

### 1) Move assist (Move tool)

When the **Move** tool is selected: <br>

- Arrow keys **nudge** the selected box by **1px** per key press. <br><br>

### 2) Resize assist

When **Resize assist** is selected: <br>

- Left/Right: width **-1px / +1px** <br>
- Up/Down: height **+1px / -1px** <br>
- Width/height are clamped to a minimum of **1px**. <br><br>

### 3) Rotate assist

When **Rotate assist** is selected: <br>

- Left/Right: rotate by **-1° / +1°** <br>
- Up/Down: no-op <br><br>

## Where the code lives

Key implementation files: <br>

- `web/libs/editor/src/tools/Selection.js` <br>
  - Adds arrow-key nudging when the Move tool is selected.
- `web/libs/editor/src/tools/ArrowResize.js`<br>
  - Implements the resize-assist tool.
- `web/libs/editor/src/tools/ArrowRotate.js`<br>
  - Implements the rotate-assist tool.
- `web/libs/editor/src/tags/object/Image/Image.js`<br>
  - Registers these tools into the Image tool manager so they appear in the right toolbar.