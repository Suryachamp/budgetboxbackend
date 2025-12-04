'use client';

import { useBudgetStore } from '@/store/useBudgetStore';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SyncIndicator() {
    const { syncStatus, markSynced, activeMonth, budgets } = useBudgetStore();
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSync = async () => {
        if (!isOnline) return;
        setIsSyncing(true);
        setError(null);

        try {
            const budget = budgets[activeMonth];
            if (!budget) {
                setIsSyncing(false);
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${apiUrl}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budget)
            });

            const data = await res.json();

            if (res.ok) {
                markSynced(activeMonth);
            } else {
                console.error("Sync failed", data.error);
                setError(data.error || "Sync failed");
            }
        } catch (e) {
            console.error("Sync failed", e);
            setError("Network error");
        } finally {
            setIsSyncing(false);
        }
    };

    if (!isOnline) {
        return (
            <div className="flex items-center gap-2 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full text-sm font-medium">
                <CloudOff size={16} />
                <span>Offline</span>
            </div>
        );
    }

    if (error) {
        return (
            <button
                onClick={handleSync}
                className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title={error}
            >
                <AlertCircle size={16} />
                <span>Retry (Error)</span>
            </button>
        );
    }

    if (syncStatus === 'synced') {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle size={16} />
                <span>Synced</span>
            </div>
        );
    }

    if (syncStatus === 'sync-pending') {
        return (
            <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
            >
                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Pending'}</span>
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full text-sm font-medium">
            <Cloud size={16} />
            <span>Local Only</span>
        </div>
    );
}
