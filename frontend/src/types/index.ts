export type ExpenseCategory = 'bills' | 'food' | 'transport' | 'subscriptions' | 'miscellaneous';

export interface Expenses {
    bills: number;
    food: number;
    transport: number;
    subscriptions: number;
    miscellaneous: number;
}

export interface Budget {
    id: string; // e.g., "2023-10" or UUID
    month: string; // YYYY-MM
    income: number;
    expenses: Expenses;
    updatedAt: number; // timestamp
    isSynced: boolean; // true if synced with server
}

export type SyncStatus = 'local-only' | 'sync-pending' | 'synced' | 'offline';

export interface BudgetState {
    budgets: Record<string, Budget>; // Keyed by month string "YYYY-MM"
    activeMonth: string; // "YYYY-MM"
    syncStatus: SyncStatus;

    // Actions
    setIncome: (amount: number) => void;
    setExpense: (category: ExpenseCategory, amount: number) => void;
    setActiveMonth: (month: string) => void;
    loadBudget: (budget: Budget) => void;
    setSyncStatus: (status: SyncStatus) => void;
    markSynced: (month: string) => void;
    clearData: () => Promise<void>;
}
