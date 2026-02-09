# Templates in this repo

Templates are stored as YAML files under `label_studio/annotation_templates/`.

Each template typically includes:
- metadata (title, group, preview image)
- a `config:` field containing the labeling interface definition in XML (Label Studio labeling config language)

For object detection (bounding boxes):
- `label_studio/annotation_templates/computer-vision/object-detection-with-bounding-boxes/config.yml`

Example “raw” bbox config is also available under:
- `label_studio/core/examples/image_bbox/config.xml`
