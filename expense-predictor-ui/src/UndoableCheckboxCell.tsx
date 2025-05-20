import {useEffect, useState} from "react";

export default function UndoableCheckboxCell({tx} ) {

    function markPaid(id: number) {
        console.log("paid " + id);
        // send api call
        // refresh list
    }

    const [isPaid, setIsPaid] = useState(false);
    const [undoCountdown, setUndoCountdown] = useState(null);
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        if (undoCountdown === 0) {
            setUndoCountdown(null);
            setTimerId(null);
            markPaid(tx.id);
            // if (onFinalized) onFinalized();
        } else if (undoCountdown !== null) {
            const id = setTimeout(() => setUndoCountdown((prev) => prev - 1), 1000);
            setTimerId(id);
            return () => clearTimeout(id);
        }
    }, [undoCountdown
        // , onFinalized
    ]);

    const handlePaidClick = () => {
        setIsPaid(true);
        setUndoCountdown(3);
    };

    const handleUndoClick = () => {
        setIsPaid(false);
        setUndoCountdown(null);
        if (timerId) clearTimeout(timerId);
    };

    if (!isPaid) {
        return (
            <button
                onClick={handlePaidClick}
                className="px-2 py-1 text-sm bg-blue-500 text-black rounded"
            >
                Paid
            </button>
        );
    }

    if (undoCountdown !== null) {
        return (
            <button
                onClick={handleUndoClick}
                className="px-2 py-1 text-sm bg-yellow-500 text-black rounded"
            >
                Undo ({undoCountdown})
            </button>
        );
    }
}