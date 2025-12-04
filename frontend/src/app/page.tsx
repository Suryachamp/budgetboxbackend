import { BudgetForm } from '@/components/BudgetForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SyncIndicator } from '@/components/SyncIndicator';
import { ClearDataButton } from '@/components/ClearDataButton';
import { ExportButton } from '@/components/ExportButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">BudgetBox</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Offline-first personal budgeting</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton />
            <ClearDataButton />
            <SyncIndicator />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Edit Budget</h2>
            <BudgetForm />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <Dashboard />
          </section>
        </div>
      </div>
    </main>
  );
}
