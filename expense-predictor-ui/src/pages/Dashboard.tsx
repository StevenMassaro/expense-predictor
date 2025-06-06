import { useEffect } from 'react';
import EditableTransactionAmountCell from "../EditableTransactionAmountCell.tsx";
import UndoableButton from "../UndoableButton.tsx";
import {type DashboardEntry, dashboardStore} from "../store/DashboardStore.tsx";
import {customRecurringTransactionStore} from "../store/CustomRecurringTransactionStore.tsx";
import {accountStore} from "../store/AccountStore.tsx";

export default function Dashboard() {
    const {
        fetchDashboard,
        entries
    } = dashboardStore();

    const {
        fetchAccounts
    } = accountStore();

    const {
        createCustomRecurringTransaction
    } = customRecurringTransactionStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    async function markPaid(entry: DashboardEntry) {
        await createCustomRecurringTransaction({
            parentRecurringTransaction: entry.recurringTransactionId.toString(),
            amount: entry.amount,
            originalTransactionDate: entry.date,
            paid: true
        }).then(() => {
            fetchDashboard()
            fetchAccounts()
        })
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
                            <td className={`p-3 text-right ${entry.before < 0 ? 'font-black text-red-600' : 'text-black'}`}>${entry.before.toFixed(2)}</td>
                            <EditableTransactionAmountCell entry={entry} />
                            <td className={`p-3 text-right ${entry.after < 0 ? 'font-black text-red-600' : 'text-black'}`}>${entry.after.toFixed(2)}</td>
                            <UndoableButton
                                key={"paid-button-" + entry.date + entry.description + entry.accountName}
                                object={entry}
                                countdownCompletedCallback={async (entry: DashboardEntry) => await markPaid(entry)}
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
