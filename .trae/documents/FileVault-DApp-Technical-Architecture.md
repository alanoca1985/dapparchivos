## 1. Architecture Design
```mermaid
flowchart TB
  A["UI Layer: React Components (Sidebar, TopBar, FileGrid, FileCard, ToastHost)"] --> B["State Layer: useState (cards, activeNav, toasts)"]
  B --> C["Data Layer: Mock file metadata + per-card preview URLs (in-memory)"]
  A --> D["Browser APIs: file picker + URL.createObjectURL + download via <a>"]
  A --> E["Styling: Tailwind CSS + custom CSS variables (dark glass theme)"]
```

## 2. Technology Description
- Frontend: React + TypeScript
- Styling: Tailwind CSS (dark theme, glassmorphism, responsive grid)
- Bundler: Vite
- State management: React useState (no external store)
- Data: mock data only (no backend, no external API calls)
- Notifications: lightweight in-app toast system (no external toast dependency)

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | Single-page dashboard for browsing and managing file cards |

## 4. API Definitions (if backend exists)
No backend. No APIs.

## 5. Server Architecture Diagram (if backend exists)
Not applicable.

## 6. Data Model (in-memory)

### 6.1 Data Model Definition
- File cards are stored as an array in component state.
- Each card stores its own preview reference (object URL) and editable name.
- Toasts are stored as a short-lived array with timestamps/IDs.

```mermaid
erDiagram
  FILE_CARD {
    string id
    string kind
    string name
    string sizeLabel
    string storageType
    string badgeVariant
    string previewUrl
    string createdAt
  }

  TOAST {
    string id
    string message
    string variant
    string createdAt
  }
```

### 6.2 Data Definition Language
Not applicable (no database).
