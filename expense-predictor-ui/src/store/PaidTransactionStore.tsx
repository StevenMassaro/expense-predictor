import { create } from 'zustand';

export interface PaidTransaction {
    parentRecurringTransaction: string; // HAL-style URI (e.g., "/recurringTransactions/1")
    amount: number;
    originalTransactionDate: string; // ISO format: "YYYY-MM-DD"
}

interface PaidTransactionStore {
    createPaidTransaction: (transaction: PaidTransaction) => Promise<void>;
}

export const paidTransactionStore = create<PaidTransactionStore>(() => ({
    createPaidTransaction: async (transaction) => {
        // Spring data rest expects the ID to be in this format
        transaction.parentRecurringTransaction = "/recurring-transactions/" + transaction.parentRecurringTransaction;
        const res = await fetch('/api/paid-transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || 'Failed to create PaidTransaction');
        }
    },
}));
