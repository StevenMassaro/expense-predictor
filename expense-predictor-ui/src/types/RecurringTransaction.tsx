export type Recurrence = 'monthly' | 'yearly'; // Adjust as needed

export interface RecurringTransaction {
    id: number;
    name: string;
    amount: number;
    recurrence: Recurrence;
    recurrenceDay: number;
    createdAt: string; // ISO date string
}
