import { create } from 'zustand';

export interface Account {
    id: string;
    name: string;
    balance: number;
}

interface AccountStore {
    accounts: Account[];
    loading: boolean;
    error: string | null;

    fetchAccounts: () => Promise<void>;
    addAccount: (account: Account) => void;
    updateAccountBalance: (id: string, newBalance: number) => void;
}

export const accountStore = create<AccountStore>((set) => ({
    accounts: [],
    loading: false,
    error: null,

    fetchAccounts: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/accounts');
            if (!res.ok) throw new Error('Failed to fetch accounts');
            const data = await res.json();
            set({ accounts: data._embedded.accounts, loading: false });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            set({ error: message, loading: false });
        }
    },

    addAccount: (account: Account) =>
        set((state) => ({
            accounts: [...state.accounts, account],
        })),

    updateAccountBalance: (id: string, newBalance: number) =>
        set((state) => ({
            accounts: state.accounts.map((acc) =>
                acc.id === id ? { ...acc, balance: newBalance } : acc
            ),
        })),
}));
