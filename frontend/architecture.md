# BudgetBox Architecture

```mermaid
graph TD
    User[User] -->|Interacts| UI[Frontend UI (Next.js)]
    
    subgraph Client [Browser / Client Side]
        UI -->|Reads/Writes| Store[Zustand Store]
        Store -->|Persists| IDB[(IndexedDB)]
        Store -->|Syncs| SyncMgr[Sync Manager]
        SyncMgr -->|Monitors| Network[Network Status]
    end
    
    subgraph Server [Backend / API]
        SyncMgr -->|POST /sync| API[API Routes]
        API -->|Writes| DB[(PostgreSQL)]
    end
    
    IDB -.->|Hydrates| Store
    Network -.->|Triggers| SyncMgr
```

## Data Flow
1. **Write**: User inputs data -> Zustand Store updates -> Persist Middleware saves to IndexedDB -> UI updates immediately.
2. **Sync**: Sync Manager detects change/online status -> Sends data to `/api/budget/sync`.
3. **Read**: App loads -> Hydrates from IndexedDB -> Fetches latest from Server (optional background refresh).
