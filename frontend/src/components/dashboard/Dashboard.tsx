'use client';

import { useBudgetStore } from '@/store/useBudgetStore';
import { useMemo, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getDaysInMonth, getDate } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Dashboard() {
    const { budgets, activeMonth } = useBudgetStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const budget = budgets[activeMonth];

    const stats = useMemo(() => {
        if (!budget) return null;

        const totalExpenses = Object.values(budget.expenses).reduce((a, b) => a + b, 0);
        const income = budget.income;
        const burnRate = income > 0 ? (totalExpenses / income) * 100 : 0;
        const savings = income - totalExpenses;

        // Prediction
        const today = new Date();
        const currentDay = getDate(today);
        const daysInMonth = getDaysInMonth(today);
        // Only predict if active month is current month
        const isCurrentMonth = activeMonth === today.toISOString().slice(0, 7);
        const predictedSpend = isCurrentMonth && currentDay > 0
            ? (totalExpenses / currentDay) * daysInMonth
            : totalExpenses;

        const data = Object.entries(budget.expenses).map(([name, value]) => ({ name, value }));

        // Warnings
        const warnings = [];
        if (budget.expenses.food > income * 0.4) warnings.push("Food spend is over 40% of income!");
        if (budget.expenses.subscriptions > income * 0.3) warnings.push("Subscriptions are over 30% of income!");
        if (savings < 0) warnings.push("Expenses exceed income!");

        return { totalExpenses, income, burnRate, savings, predictedSpend, data, warnings };
    }, [budget, activeMonth]);

    if (!mounted || !stats) return null;

    return (
        <div className="space-y-6 pb-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Burn Rate</h3>
                    <div className="mt-2">
                        <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-words">{stats.burnRate.toFixed(1)}%</p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Savings Potential</h3>
                    <div className="mt-2">
                        <p className={`text-2xl sm:text-3xl font-bold ${stats.savings < 0 ? 'text-red-500' : 'text-green-500'} break-words`}>
                            ${stats.savings.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Predicted Month-End</h3>
                    <div className="mt-2">
                        <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-words">${stats.predictedSpend.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Warnings */}
            {stats.warnings.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        ⚠️ Anomaly Warnings
                    </h3>
                    <ul className="list-disc list-inside text-red-600 dark:text-red-300 space-y-1">
                        {stats.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
            )}

            {/* Chart */}
            <div className="h-[25rem] bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 pb-12 shadow-sm">
                <h3 className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={stats.data}
                            cx="50%"
                            cy="45%"
                            innerRadius={80}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {stats.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="square" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
