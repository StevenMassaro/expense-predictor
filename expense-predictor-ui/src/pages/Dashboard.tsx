import { useEffect } from 'react';
import EditableTransactionAmountCell from "../EditableTransactionAmountCell.tsx";
import UndoableButton from "../UndoableButton.tsx";
import {type DashboardEntry, dashboardStore} from "../store/DashboardStore.tsx";
import {paidTransactionStore} from "../store/PaidTransactionStore.tsx";

export default function Dashboard() {
    const {
        fetchDashboard,
        entries
    } = dashboardStore();

    const {
        createPaidTransaction
    } = paidTransactionStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    function markPaid(entry: DashboardEntry) {
        createPaidTransaction({
            parentRecurringTransaction: entry.recurringTransactionId.toString(),
            amount: entry.amount,
            originalTransactionDate: entry.date,
        })
        // refresh list
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Account</th>
                        <th className="p-3 text-right">Before</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3 text-right">After</th>
                        <th className="p-3 text-right">Paid</th>
                    </tr>
                    </thead>
                    <tbody>
                    {entries.map(entry => (
                        <tr className="border-t">
                            <td className="p-3">{entry.date}</td>
                            <td className="p-3">{entry.description}</td>
                            <td className="p-3 capitalize">{entry.accountName}</td>
                            <td className={`p-3 text-right ${entry.amount < 0 ? 'text-red-600' : 'text-black'}`}>${entry.before.toFixed(2)}</td>
                            <EditableTransactionAmountCell entry={entry} />
                            <td className={`p-3 text-right ${entry.amount < 0 ? 'text-red-600' : 'text-black'}`}>${entry.after.toFixed(2)}</td>
                            <UndoableButton
                                object={entry}
                                countdownCompletedCallback={(entry: DashboardEntry) => markPaid(entry)}
                                buttonText={"Paid"}
                            />
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
