import { create } from 'zustand';
import {API_BASE_URL} from "../App.tsx";

export interface DashboardEntry {
    recurringTransactionId: number;
    date: string; // ISO string from `LocalDate`
    description: string;
    accountName: string;
    before: number;
    amount: number;
    after: number;
}

interface DashboardState {
    entries: DashboardEntry[];
    loading: boolean;
    error: string | null;
    fetchDashboard: () => Promise<void>;
}

export const dashboardStore = create<DashboardState>((set) => ({
    entries: [],
    loading: false,
    error: null,
    fetchDashboard: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/dashboard`);
            if (!res.ok) throw new Error('Failed to fetch dashboard');
            const data = await res.json();
            set({ entries: data, loading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to fetch dashboard data', loading: false });
        }
    },
}));