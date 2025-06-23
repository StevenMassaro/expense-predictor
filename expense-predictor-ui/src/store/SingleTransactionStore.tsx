import { create } from 'zustand';
import type {SingleTransaction} from "../types/SingleTransaction.tsx";
import {API_BASE_URL} from "../App.tsx";

interface SingleTransactionStore {
    transactions: SingleTransaction[];
    loading: boolean;
    error: string | null;

    fetchTransactions: () => Promise<void>;
    addTransaction: (tx: Omit<SingleTransaction, 'id' | 'createdAt'>) => Promise<void>;
    markSingleTransactionPaid: (id: number) => Promise<void>;
}

export const singleTransactionStore = create<SingleTransactionStore>((set) => ({
    transactions: [],
    loading: false,
    error: null,

    fetchTransactions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/single-transactions?sort=date&sort=name`);
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
            const res = await fetch(`${API_BASE_URL}/single-transactions`, {
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

    markSingleTransactionPaid: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/single-transactions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paid: true }),
            });
            if (!res.ok) throw new Error('Failed to mark transaction as paid');

            set((state) => ({
                transactions: state.transactions.map((t) =>
                    t.id === id ? { ...t, paid: true } : t
                ),
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message });
        }
    }
}));
