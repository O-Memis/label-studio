# Starting Label Studio (beginner-friendly)

This repo supports several ways to start Label Studio. Pick the simplest one for your goal.

## Want it to auto-open a browser tab?

If you start Label Studio via the **Python CLI** (`label-studio`), it will open a localhost tab by default.

- Works: local install via `pip` / `poetry` (runs on your machine)
- Doesn’t work: Docker / Docker Compose (runs in containers; they can’t launch a browser on the host)

If you use Docker, you’ll still start via a command, but you must manually open the URL.

## Option A (simplest): Docker run (single container)

Good when you want to try object detection quickly.

1) Install **Docker Desktop** on Windows.
2) From a terminal, run:

```bash
docker pull heartexlabs/label-studio:latest
docker run -it -p 8080:8080 -v ${PWD}/mydata:/label-studio/data heartexlabs/label-studio:latest
```

3) Open: `http://localhost:8080`

Data is persisted in `./mydata` (DB file + uploads).

## Option B: Docker Compose (production-ish: nginx + postgres)

Good when you want a more realistic deployment locally.

From the repo root:

```bash
docker compose up
```

Then open `http://localhost:8080` (nginx publishes `8080:8085` in this repo’s compose file).

Persistent data:
- App data: `./mydata/`
- Postgres data: `./postgres-data/` (or `POSTGRES_DATA_DIR` if set)

## Option C: Local dev (run from this repository with Poetry)

Good if you plan to modify backend code.

Prereqs:
- Python >= 3.10
- Poetry

Typical flow (from repo root):

```bash
pip install poetry
poetry install
python label_studio/manage.py migrate
python label_studio/manage.py collectstatic
python label_studio/manage.py runserver
```

Open `http://localhost:8080`.

## Option D: Local install (PowerShell/CMD) + auto-open browser

This is the simplest way to meet your exact workflow: “run a command, it opens localhost in my browser”.

Prereqs:
- Python >= 3.10 installed and on PATH (`python --version`)

From PowerShell:

```powershell
python -m pip install -U pip
python -m pip install label-studio

# Starts server and auto-opens your browser
label-studio
```

### Using a virtual environment (Windows)

This keeps Label Studio and dependencies isolated (recommended).

PowerShell:

```powershell
# From any folder where you want to keep the environment
py -3.11 -m venv .venv

# Activate
.\.venv\Scripts\Activate.ps1

# Upgrade pip inside the venv
python -m pip install -U pip

# Install Label Studio
python -m pip install label-studio

# Run (auto-opens browser)
label-studio
```

CMD:

```bat
py -3.11 -m venv .venv
call .venv\Scripts\activate.bat
python -m pip install -U pip
python -m pip install label-studio
label-studio
```

### Troubleshooting: `ImportError: cannot import name 'find_loader' from 'pkgutil'`

If you see this error and your traceback mentions a path like `C:\\Python314\\...`, you’re running a **very new Python** (3.12+ / 3.13+ / 3.14+) where `pkgutil.find_loader` was removed.

Label Studio itself supports Python >= 3.10, but one of its dependencies (`django-environ` / `environ`) may break on newer Python versions.

Fix (recommended): use **Python 3.11** (or 3.10) for your venv.

```powershell
deactivate 2>$null
Remove-Item -Recurse -Force .venv

# Check what Python versions you have installed
py -0p

# Create venv with Python 3.11 specifically
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1

python --version
python -m pip install -U pip
python -m pip install label-studio
label-studio
```

If PowerShell refuses to activate (`Activate.ps1` blocked), you can run (once) in an elevated PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

To exit the venv:

```powershell
deactivate
```

Useful variants:

```powershell
# Choose a port
label-studio start --port 9090

# Store all LS data (DB, uploads) in a specific folder
label-studio start --data-dir .\mydata

# Don’t auto-open browser
label-studio start --no-browser
```

## Frontend development (optional)

Only needed if you’re changing the React/NX frontend.

- See `web/README.md` (NX + Yarn commands). Typical is `yarn install` then `yarn dev` from `web/`.
- The annotation editor library lives under `web/libs/editor/`.

## Common “where is my data?”

- In Docker/Docker Compose, Label Studio stores data under `/label-studio/data` inside the container.
- The repo examples mount that to `./mydata` on your machine.

## If port 8080 is busy

The CLI tries the next ports automatically unless debug mode is used.
You can also choose a port explicitly:

```bash
label-studio start --port 9090
```
