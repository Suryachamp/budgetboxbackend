'use client';

import { useBudgetStore } from '@/store/useBudgetStore';
import { ExpenseCategory } from '@/types';
import { useEffect, useState } from 'react';

export function BudgetForm() {
    const { budgets, activeMonth, setIncome, setExpense } = useBudgetStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-6 animate-pulse">Loading budget...</div>;

    const budget = budgets[activeMonth] || {
        income: 0,
        expenses: { bills: 0, food: 0, transport: 0, subscriptions: 0, miscellaneous: 0 }
    };

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Monthly Budget for {activeMonth}</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Monthly Income</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                        <input
                            type="number"
                            value={budget.income || ''}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            className="w-full pl-7 p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['bills', 'food', 'transport', 'subscriptions', 'miscellaneous'] as ExpenseCategory[]).map((cat) => (
                        <div key={cat}>
                            <label className="block text-sm font-medium mb-1.5 capitalize text-zinc-700 dark:text-zinc-300">{cat}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                                <input
                                    type="number"
                                    value={budget.expenses[cat] || ''}
                                    onChange={(e) => setExpense(cat, Number(e.target.value))}
                                    className="w-full pl-7 p-2 border rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
