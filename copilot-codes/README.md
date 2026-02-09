# Copilot Notes for Label Studio (this repo)

This folder is a **curated map** of the most important code paths and “how to run it” notes, focused on getting started quickly and on **object detection (bounding boxes)**.

## Where to start

- If you just want to **run Label Studio**: see [STARTING.md](STARTING.md).
- If you want to do **object detection**: see [OBJECT-DETECTION.md](OBJECT-DETECTION.md).
- If you want a “what file does what” map: see [FILE-MAP.md](FILE-MAP.md).

## Key mental model

- **Backend (Python/Django):** `label_studio/` (APIs, DB, auth, import/export)
- **Frontend (NX/React):** `web/` (annotation UI, project UI)
- **Templates / labeling configs:** `label_studio/annotation_templates/` and `label_studio/core/examples/`

## Primary entrypoints

- CLI command `label-studio` -> Python entrypoint: `label_studio/server.py:main` (declared in `pyproject.toml`)
- Dev server entrypoint: `label_studio/manage.py` (Django `runserver`)
- Docker Compose stack: `docker-compose.yml` (nginx + app + postgres)
