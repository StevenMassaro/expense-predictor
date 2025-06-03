import { useState } from "react";
import {customRecurringTransactionStore} from "./store/CustomRecurringTransactionStore.tsx";
import {type DashboardEntry, dashboardStore} from "./store/DashboardStore.tsx";

interface EditableTransactionAmountCellProps {
    entry: DashboardEntry;
}

export default function EditableTransactionAmountCell({ entry }: EditableTransactionAmountCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(Math.abs(entry.amount).toFixed(2));

    const {
        createCustomRecurringTransaction
    } = customRecurringTransactionStore();

    const {
        fetchDashboard
    } = dashboardStore();

    const handleBlur = async () => {
        setIsEditing(false);
        const signedAmount = parseFloat(amount);
        await createCustomRecurringTransaction({
            parentRecurringTransaction: entry.recurringTransactionId.toString(),
            amount: signedAmount,
            originalTransactionDate: entry.date,
            paid: false
        }).then(() => fetchDashboard());
    };

    const handleClick = () => {
        setIsEditing(true);
    };

    return (
        <td
            className={`p-3 text-right cursor-pointer ${entry.amount < 0 ? 'text-red-600' : 'text-green-600'}`}
            onClick={handleClick}
        >
            {isEditing ? (
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                    className="w-full text-right bg-white border rounded px-1"
                />
            ) : (
                <>
                    ${amount}
                </>
            )}
        </td>
    );
}
