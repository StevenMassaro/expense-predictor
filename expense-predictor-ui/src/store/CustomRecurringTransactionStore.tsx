import { create } from 'zustand';
import { API_BASE_URL } from '../App';

export interface CustomRecurringTransaction {
    id: number;
    parentRecurringTransaction: string; // HAL-style URI (e.g., "/recurringTransactions/1")
    amount: number;
    originalTransactionDate: string; // ISO format: "YYYY-MM-DD"
    paid: boolean;
}

interface CustomRecurringTransactionStore {
    upsertCustomRecurringTransaction: (transaction: CustomRecurringTransaction) => Promise<void>;
}

export const customRecurringTransactionStore = create<CustomRecurringTransactionStore>(() => ({
    upsertCustomRecurringTransaction: async (transaction) => {
        // Spring data rest expects the ID to be in this format
        transaction.parentRecurringTransaction = "/recurring-transactions/" + transaction.parentRecurringTransaction;
        const res = await fetch(`${API_BASE_URL}/custom-recurring-transactions${transaction.id === null ? "" : `/${transaction.id}`}`, {
            method: transaction.id === null ? 'POST' : 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || 'Failed to create CustomRecurringTransaction');
        }
    },
}));
