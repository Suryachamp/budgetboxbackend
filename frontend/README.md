# BudgetBox

BudgetBox is an **Offline-First Personal Budgeting App** built with Next.js 15, Zustand, and IndexedDB. It allows you to manage your monthly budget without an internet connection and syncs your data when you're back online.

## Features

- **Offline-First**: Works completely offline. Data is saved to IndexedDB.
- **Auto-Save**: Every change is instantly saved locally.
- **Sync**: Syncs with the server when online.
- **Dashboard**: Real-time analytics (Burn Rate, Savings Potential, Predictions).
- **Anomaly Warnings**: Alerts for high spending in specific categories.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS 4
- **State Management**: Zustand + IndexedDB (idb-keyval)
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd budget-box
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Offline Demo Instructions

1. Open the app in your browser.
2. Open DevTools (F12) -> Network tab.
3. Set "Throttling" to **Offline**.
4. Make changes to the budget (e.g., update Income or Food expenses).
5. Notice the **"Offline"** indicator in the top right.
6. Reload the page. Your changes should persist (loaded from IndexedDB).
7. Turn off "Offline" mode (set to "No throttling").
8. The indicator should change to **"Sync Pending"** (if changes were made) or **"Synced"**.
9. Click **"Sync Pending"** (or wait for auto-sync if implemented) to sync with the server.

## Architecture

- **Store**: `useBudgetStore` handles all state. It uses `persist` middleware with `idb-keyval` to save to IndexedDB.
- **Sync**: The `SyncIndicator` component monitors `navigator.onLine` and the store's `syncStatus`. It triggers the `/api/budget/sync` endpoint.
- **Backend**: Next.js API Routes (`/api/budget/sync`, `/api/budget/latest`) handle data persistence (Mocked for demo, ready for PostgreSQL).

## License

MIT
