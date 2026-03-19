# DMV Form Filler

A full-stack web application for filling out California DMV **REG-156** (Application for Replacement Plates, Stickers, Documents) forms. Users complete a multi-step wizard in the browser and receive a pre-filled, downloadable PDF.

---

## Architecture

```
dmv-form-filler/
├── shared/          # @dmv/shared — TypeScript interfaces shared between frontend & backend
│   └── src/types/form.types.ts
├── backend/         # NestJS REST API + PDF generation
│   ├── src/
│   │   ├── form/
│   │   │   ├── dto/              # class-validator DTOs
│   │   │   ├── pdf/
│   │   │   │   ├── pdf.service.ts         # Loads template, fills fields
│   │   │   │   └── pdf-field-mapper.ts    # Maps form data → PDF field names
│   │   │   ├── form.controller.ts         # POST /api/form/generate-pdf
│   │   │   └── form.module.ts
│   │   ├── common/http-exception.filter.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── scripts/create-template.mjs  # Generates the REG-156.pdf template
│   └── templates/REG-156.pdf        # Generated AcroForm PDF template
├── frontend/        # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormWizard.tsx               # Multi-step stepper orchestrator
│   │   │   └── steps/
│   │   │       ├── VehicleInfoStep.tsx
│   │   │       ├── OwnerInfoStep.tsx
│   │   │       ├── ItemsRequestedStep.tsx
│   │   │       ├── ReasonStep.tsx
│   │   │       └── CertificationStep.tsx
│   │   ├── validation/schemas.ts   # Zod validation schemas
│   │   ├── services/api.ts         # Axios client for PDF generation
│   │   ├── data/us-states.ts       # US states data (code + name)
│   │   ├── theme.ts                # MUI theme customisation
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts              # Dev server proxies /api → backend
├── package.json     # npm workspaces root
├── install.bat      # Windows install script
├── install.sh       # macOS / Linux install script
├── start.bat        # Windows start script
├── start.sh         # macOS / Linux start script
├── stop.bat         # Windows stop script
└── stop.sh          # macOS / Linux stop script
```

### Monorepo with npm Workspaces

The project uses **npm workspaces** with three packages:

| Package | Role |
|---------|------|
| `shared` | TypeScript interfaces (`FormData`, `VehicleInfo`, `Address`, etc.) consumed by both frontend and backend, ensuring a single source of truth for the data model. |
| `backend` | **NestJS** application exposing a single REST endpoint. Validates incoming JSON with `class-validator` / `class-transformer`, then fills a PDF template using `pdf-lib`. |
| `frontend` | **React 19** + **Vite** SPA. Uses **Material UI v6** for the UI, **React Hook Form** + **Zod** for client-side validation, and **Axios** for API calls. |

### Data Flow

```
Browser (React form)
  │  Zod validation
  ▼
POST /api/form/generate-pdf   (JSON body)
  │  class-validator DTO validation
  │  pdf-field-mapper → maps DTO fields to PDF AcroForm field names
  │  pdf-lib fills the REG-156.pdf template
  ▼
Response: application/pdf (binary)
  │
  ▼
Browser auto-downloads REG-156-filled.pdf
```

---

## Prerequisites

No manual prerequisites needed — the install scripts handle everything automatically.

If you prefer manual setup, ensure:
- **Node.js** v20 or later
- **npm** v9 or later (bundled with Node.js 20+)

---

## Installation

Run a single file and everything is set up automatically:

### Windows

```bat
install.bat
```

### macOS / Linux

```bash
chmod +x install.sh
./install.sh
```

The install scripts will:
1. **Check for Node.js** — if missing, install it automatically:
   - **Windows**: via `winget` (preferred) or MSI installer download
   - **macOS**: via Homebrew (installs Homebrew first if needed; may prompt for password)
   - **Linux**: via the appropriate package manager (`apt`, `dnf`, `yum`, `pacman`, `zypper`)
2. **Install all npm dependencies** across all workspaces (shared, backend, frontend)
3. **Generate the PDF template** (`REG-156.pdf`) if it doesn't already exist

### Manual Installation

```bash
cd dmv-form-filler
npm install
node backend/scripts/create-template.mjs   # generates the PDF template
```

---

## Running the Application

### Windows

```bat
start.bat
```

### macOS / Linux

```bash
chmod +x start.sh
./start.sh
```

### Manual Start

```bash
npm start
```

Or equivalently:

```bash
npm run dev
```

Both commands launch the backend and frontend concurrently.

Once running:

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |

The Vite dev server proxies `/api` requests to the backend automatically.

### Stopping the Application

| OS | Command |
|----|---------|
| Windows | `stop.bat` |
| macOS / Linux | `./stop.sh` |

The stop scripts terminate all Node processes associated with the project and free up ports 3000 and 5173.

---

## Running Tests

```bash
# All tests (backend + frontend)
npm test

# Backend only (Jest)
npm run test:backend

# Frontend only (Vitest)
npm run test:frontend

# Frontend in watch mode
npm run test:watch --workspace=frontend

# Backend with coverage
npm run test:cov --workspace=backend
```

### Test Stack

| Layer | Runner | Environment | Tests |
|-------|--------|-------------|-------|
| Backend unit | Jest + ts-jest | Node | DTO validation, PDF field mapping, PDF service |
| Backend integration | Jest + supertest | Node | `POST /api/form/generate-pdf` endpoint |
| Frontend unit | Vitest | happy-dom | Zod schemas, US states data |

---

## API Reference

### `POST /api/form/generate-pdf`

Accepts form data as JSON and returns a filled PDF.

**Request**

```
Content-Type: application/json
```

```json
{
  "vehicleInfo": {
    "licensePlate": "7ABC123",
    "make": "Toyota",
    "vin": "1HGCM82633A004352"
  },
  "ownerInfo": {
    "fullName": "John Doe",
    "physicalAddress": {
      "street": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "zip": "90001"
    }
  },
  "itemsRequested": {
    "registrationCard": true
  },
  "reason": {
    "type": "lost"
  },
  "certification": {
    "name": "John Doe",
    "phone": "555-123-4567",
    "date": "03/18/2026"
  }
}
```

**Response**

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="REG-156-filled.pdf"
```

Binary PDF bytes (the filled REG-156 form).

**Error Response** (400)

```json
{
  "statusCode": 400,
  "message": ["licensePlate should not be empty", "..."],
  "error": "Bad Request"
}
```

This endpoint can be tested directly with tools like Postman or curl.

---

## Design Decisions

### Dual Validation Strategy

Validation is implemented on **both** layers:

- **Frontend (Zod)**: Provides immediate, per-step feedback as the user navigates the form wizard. Each step has its own schema, enabling partial validation. A snackbar notification appears when required fields are missing.
- **Backend (class-validator)**: Guards the API boundary independently. Uses `@Transform` decorators to normalize empty strings to `undefined` for optional fields, `@IsDefined` + `@ValidateNested` to enforce presence of nested objects, and a custom `AtLeastOneItemConstraint` to ensure at least one checkbox is selected in Items Requested.

This ensures the API remains safe even when called outside the browser (e.g., Postman, scripts).

### PDF Template Generation

Rather than using a pre-existing static PDF, the template is **generated programmatically** via `pdf-lib` in `create-template.mjs`. This approach:

- Gives full control over field positions, sizes, and fonts
- Makes the template reproducible and version-controllable
- Includes interactive Print and Clear Form buttons (JavaScript actions work in Adobe Acrobat)

### Shared Type Package

The `@dmv/shared` package defines all TypeScript interfaces in one place. Both frontend and backend import from it, so changes to the data model are caught at compile time across the entire stack.

### Auto-Fill UX

When the user fills in the VIN field and tabs away, the "Last 5 of VIN" field is automatically populated. The State field uses an Autocomplete dropdown sourced from a centralized data file (`us-states.ts`), making it easy to update.

### Process Management Scripts

Start/stop scripts for both Windows and macOS/Linux handle cleanup of orphaned Node processes and occupied ports, preventing `EADDRINUSE` errors during development.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start both backend and frontend in development mode |
| `npm run dev` | Same as `npm start` |
| `npm run build` | Build shared → backend → frontend for production |
| `npm test` | Run all tests |
| `npm run test:backend` | Run backend tests only |
| `npm run test:frontend` | Run frontend tests only |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19, Vite 6, Material UI 6, React Hook Form, Zod |
| Backend | NestJS 11, class-validator, class-transformer |
| PDF | pdf-lib |
| Shared Types | TypeScript interfaces (npm workspace) |
| Backend Tests | Jest 30, supertest |
| Frontend Tests | Vitest 4, Testing Library, happy-dom |
| Package Manager | npm workspaces |
