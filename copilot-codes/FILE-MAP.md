# File Map (important code paths)

This is a practical map of “what to read first” in the repo.

## Runtime / deployment

- `README.md` — install/run options (Docker, Compose, pip, local dev)
- `docker-compose.yml` — nginx + app + postgres local stack
- `Dockerfile*` — container build variants
- `deploy/` — nginx config, entrypoints, prod-ish scripts

## Python backend (Django)

- `pyproject.toml`
  - Declares the CLI entrypoint: `label-studio = "label_studio.server:main"`
- `label_studio/server.py`
  - CLI orchestration: parses args, sets env, runs migrations, starts Django `runserver`
- `label_studio/manage.py`
  - Standard Django management entrypoint used for local development

Core backend areas (organized as Django apps):
- `label_studio/core/` — settings, URLs, shared utilities
- `label_studio/projects/` — projects and labeling config storage
- `label_studio/tasks/` — tasks, annotations, import/export flows
- `label_studio/data_import/` and `label_studio/data_export/` — import/export logic
- `label_studio/users/` and `label_studio/organizations/` — auth & multi-user/org logic
- `label_studio/ml/`, `label_studio/ml_models/`, `label_studio/ml_model_providers/` — ML backends integration

## Templates / configs (what you select in the UI)

- `label_studio/annotation_templates/` — template gallery entries (YAML with a `config:` XML block)
  - Object detection bbox template:
    - `label_studio/annotation_templates/computer-vision/object-detection-with-bounding-boxes/config.yml`
- `label_studio/core/examples/` — small example configs
  - BBox example:
    - `label_studio/core/examples/image_bbox/config.xml`

## Frontend (annotation editor and app UI)

- `web/README.md` — NX + Yarn dev workflow
- `web/apps/labelstudio/` — main Label Studio web app shell
- `web/libs/editor/` — Label Studio Frontend (annotation editor)
  - `web/libs/editor/src/tags/control/RectangleLabels.jsx` — bounding box tag implementation
- Keyboard-assisted box editing (object detection)
  - `web/libs/editor/src/tools/Selection.js` — Move tool; arrow keys nudge selected box
  - `web/libs/editor/src/tools/ArrowResize.js` — Resize-assist tool; arrow keys adjust width/height
  - `web/libs/editor/src/tools/ArrowRotate.js` — Rotate-assist tool; arrow keys rotate by degrees
  - `web/libs/editor/src/tools/index.js` — tool exports/registry
  - `web/libs/editor/src/tags/object/Image/Image.js` — wires the tools into the Image tool manager (right toolbar)
- `web/libs/datamanager/` — data exploration / task browsing UI

Frontend build outputs (what the running app actually serves):
- `web/dist/apps/labelstudio/` — production bundle built from `web/` sources

Static serving notes (why you might “see no changes” after editing frontend sources):
- If you run the pip-installed CLI (`label-studio`), it can serve frontend assets from the installed package.
- If you run from the repo checkout, `label_studio/manage.py collectstatic` builds backend static assets into:
  - `label_studio/core/static_build/`

## Tests that are useful for object detection

- `label_studio/tests/data_import.tavern.yml` — includes bbox import examples (`preannotated_from_fields=bbox`)
- `label_studio/tests/create_project_and_import_data.tavern.yml` — creates projects with `RectangleLabels`
- `label_studio/tests/export.tavern.yml` — export formats including object detection

## Local workflow notes (PowerShell)

- `copilot-codes/HOW-TO-START-IN-POWERSHELL.txt` — the daily driver workflow used in this repo on Windows
