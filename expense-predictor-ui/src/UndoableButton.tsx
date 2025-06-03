import {useEffect, useState} from "react";

interface UndoableButtonProps<T> {
    object: T;
    countdownCompletedCallback: (object: T) => void;
    buttonText: string;
}

export default function UndoableButton<T>({ object, countdownCompletedCallback, buttonText }: UndoableButtonProps<T>) {

    const [isPaid, setisPaid] = useState(false);
    const [undoCountdown, setUndoCountdown] = useState<number | null>(null);
    const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (undoCountdown === 0) {
            setUndoCountdown(null);
            setTimerId(null);
            countdownCompletedCallback(object);
            // if (onFinalized) onFinalized();
        } else if (undoCountdown !== null) {
            const id = setTimeout(() =>
                    setUndoCountdown((prev) => (prev !== null ? prev - 1 : null)),
                1000
            );
            setTimerId(id);
            return () => clearTimeout(id);
        }
    }, [undoCountdown
        // , onFinalized
    ]);

    const handleButtonClick = () => {
        setisPaid(true);
        setUndoCountdown(3);
    };

    const handleUndoClick = () => {
        setisPaid(false);
        setUndoCountdown(null);
        if (timerId) clearTimeout(timerId);
    };

    if (!isPaid) {
        return (
            <button
                onClick={handleButtonClick}
                className="px-2 py-1 text-sm bg-blue-500 text-black rounded"
            >
                {buttonText}
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