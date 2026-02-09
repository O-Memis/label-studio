# Object Detection (Bounding Boxes) in this repo

## The labeling config you want

Object detection with bounding boxes uses the **`<RectangleLabels>`** control tag.

You can use the built-in template config:

- Template definition (gallery entry + config):
  - `label_studio/annotation_templates/computer-vision/object-detection-with-bounding-boxes/config.yml`
- Minimal example config:
  - `label_studio/core/examples/image_bbox/config.xml`

The minimal config looks like:

```xml
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Airplane" background="green"/>
    <Label value="Car" background="blue"/>
  </RectangleLabels>
</View>
```

## Where `RectangleLabels` is implemented

- Frontend tag implementation:
  - `web/libs/editor/src/tags/control/RectangleLabels.jsx`

That file registers the tag name `rectanglelabels` into the editor registry so the UI knows how to render and serialize bounding boxes.

## How to use it in the UI (quick checklist)

1) Start Label Studio (see `STARTING.md`).
2) Create a new project.
3) Choose the template: **“Object Detection with Bounding Boxes”** (or paste your own config with `<RectangleLabels>`).
4) Import tasks that contain an `image` field (URL or uploaded image).
5) Draw rectangles and assign labels.

## Results / export (high level)

- A bounding box region becomes a result item with `type: "rectanglelabels"`.
- For training, you typically export into formats like COCO or YOLO (the repo test suite references these formats, and Label Studio generally supports them via export).

If you want to see examples of import/export for bounding boxes, look at:
- `label_studio/tests/data_import.tavern.yml` (pre-annotated bbox examples)
- `label_studio/tests/export.tavern.yml` (export formats tagged with object detection)
