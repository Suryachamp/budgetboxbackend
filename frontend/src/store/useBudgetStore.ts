import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { BudgetState, ExpenseCategory } from '@/types';
import { format } from 'date-fns';

const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        console.log(name, 'has been retrieved');
        return (await get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        console.log(name, 'with value', value, 'has been saved');
        await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        console.log(name, 'has been deleted');
        await del(name);
    },
};

const initialMonth = format(new Date(), 'yyyy-MM');

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set, get) => ({
            budgets: {},
            activeMonth: initialMonth,
            syncStatus: 'local-only',

            setIncome: (amount) => {
                const { activeMonth, budgets } = get();
                const currentBudget = budgets[activeMonth] || {
                    id: activeMonth,
                    month: activeMonth,
                    income: 0,
                    expenses: { bills: 0, food: 0, transport: 0, subscriptions: 0, miscellaneous: 0 },
                    updatedAt: Date.now(),
                    isSynced: false,
                };

                set({
                    budgets: {
                        ...budgets,
                        [activeMonth]: {
                            ...currentBudget,
                            income: amount,
                            updatedAt: Date.now(),
                            isSynced: false,
                        },
                    },
                    syncStatus: 'sync-pending',
                });
            },

            setExpense: (category, amount) => {
                const { activeMonth, budgets } = get();
                const currentBudget = budgets[activeMonth] || {
                    id: activeMonth,
                    month: activeMonth,
                    income: 0,
                    expenses: { bills: 0, food: 0, transport: 0, subscriptions: 0, miscellaneous: 0 },
                    updatedAt: Date.now(),
                    isSynced: false,
                };

                set({
                    budgets: {
                        ...budgets,
                        [activeMonth]: {
                            ...currentBudget,
                            expenses: {
                                ...currentBudget.expenses,
                                [category]: amount,
                            },
                            updatedAt: Date.now(),
                            isSynced: false,
                        },
                    },
                    syncStatus: 'sync-pending',
                });
            },

            setActiveMonth: (month) => set({ activeMonth: month }),

            loadBudget: (budget) => {
                set((state) => ({
                    budgets: { ...state.budgets, [budget.month]: budget }
                }));
            },

            setSyncStatus: (status) => set({ syncStatus: status }),

            markSynced: (month) => {
                const { budgets } = get();
                if (budgets[month]) {
                    set({
                        budgets: {
                            ...budgets,
                            [month]: { ...budgets[month], isSynced: true }
                        },
                        syncStatus: 'synced'
                    });
                }
            },

            clearData: async () => {
                set({ budgets: {}, syncStatus: 'local-only' });
                await del('budget-storage');
                window.location.reload();
            }
        }),
        {
            name: 'budget-storage',
            storage: createJSONStorage(() => storage),
        }
    )
);
