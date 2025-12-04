'use client';

import { useBudgetStore } from '@/store/useBudgetStore';
import { Download } from 'lucide-react';
import { useState } from 'react';

export function ExportButton() {
    const { budgets } = useBudgetStore();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            const dataStr = JSON.stringify(budgets, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `budget_box_data_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 transition-colors"
            title="Export data to JSON"
        >
            <Download size={16} />
            <span>{isExporting ? 'Exporting...' : 'Export JSON'}</span>
        </button>
    );
}
