import { create } from 'zustand';
import type {RecurringTransaction, Recurrence} from '../types/RecurringTransaction';

interface RecurringTransactionStore {
    transactions: RecurringTransaction[];
    loading: boolean;
    error: string | null;

    fetchTransactions: () => Promise<void>;
    addTransaction: (tx: Omit<RecurringTransaction, 'id' | 'createdAt'>) => Promise<void>;
}

export const recurringTransactionStore = create<RecurringTransactionStore>((set) => ({
    transactions: [],
    loading: false,
    error: null,

    fetchTransactions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/recurring-transactions');
            if (!res.ok) throw new Error('Failed to fetch recurring transactions');
            const data = await res.json();
            set({ transactions: data._embedded["recurring-transactions"], loading: false });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message, loading: false });
        }
    },

    addTransaction: async (txData) => {
        // Spring data rest expects the ID to be in this format
        txData.account = "/accounts/" + txData.account;
        try {
            const res = await fetch('/api/recurring-transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(txData),
            });
            if (!res.ok) throw new Error('Failed to create recurring transaction');
            const newTx: RecurringTransaction = await res.json();

            set((state) => ({
                transactions: [...state.transactions, newTx],
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message });
        }
    },
}));
