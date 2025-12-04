'use client';

import { useBudgetStore } from '@/store/useBudgetStore';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export function ClearDataButton() {
    const { clearData } = useBudgetStore();
    const [isConfirming, setIsConfirming] = useState(false);

    const handleClear = async () => {
        if (isConfirming) {
            await clearData();
            setIsConfirming(false);
        } else {
            setIsConfirming(true);
            setTimeout(() => setIsConfirming(false), 3000); // Reset after 3s
        }
    };

    return (
        <button
            onClick={handleClear}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isConfirming
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
            title="Clear all local data"
        >
            <Trash2 size={16} />
            <span>{isConfirming ? 'Confirm Clear?' : 'Clear Data'}</span>
        </button>
    );
}
