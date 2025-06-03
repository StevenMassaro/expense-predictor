import { create } from 'zustand';
import type {SingleTransaction} from "../types/SingleTransaction.tsx";

interface SingleTransactionStore {
    transactions: SingleTransaction[];
    loading: boolean;
    error: string | null;

    fetchTransactions: () => Promise<void>;
    addTransaction: (tx: Omit<SingleTransaction, 'id' | 'createdAt'>) => Promise<void>;
}

export const singleTransactionStore = create<SingleTransactionStore>((set) => ({
    transactions: [],
    loading: false,
    error: null,

    fetchTransactions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/single-transactions');
            if (!res.ok) throw new Error('Failed to fetch single transactions');
            const data = await res.json();
            set({ transactions: data._embedded["single-transactions"], loading: false });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message, loading: false });
        }
    },

    addTransaction: async (txData) => {
        // Spring data rest expects the ID to be in this format
        txData.account = "/accounts/" + txData.account;
        try {
            const res = await fetch('/api/single-transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(txData),
            });
            if (!res.ok) throw new Error('Failed to create single transaction');
            const newTx: SingleTransaction = await res.json();

            set((state) => ({
                transactions: [...state.transactions, newTx],
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message });
        }
    },
}));
