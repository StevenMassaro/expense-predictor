import { useState } from "react";

export default function EditableTransactionAmountCell({ entry }) {
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(Math.abs(entry.amount).toFixed(2));

    const handleBlur = () => {
        setIsEditing(false);
        const signedAmount = parseFloat(amount);
        console.log('Updated amount:', signedAmount);
        // Replace the above with an API call as needed
        // Refresh
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
                    {entry.amount < 0 ? '-' : '+'}${amount}
                </>
            )}
        </td>
    );
}
