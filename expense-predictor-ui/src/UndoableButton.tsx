import {useEffect, useState} from "react";

interface UndoableButtonProps {
    object: any;
    countdownCompletedCallback: (tx: any) => void;
    buttonText: string;
}

export default function UndoableButton({ object, countdownCompletedCallback, buttonText }: UndoableButtonProps) {

    const [isCompleted, setisCompleted] = useState(false);
    const [undoCountdown, setUndoCountdown] = useState(null);
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        if (undoCountdown === 0) {
            setUndoCountdown(null);
            setTimerId(null);
            countdownCompletedCallback(object);
            // if (onFinalized) onFinalized();
        } else if (undoCountdown !== null) {
            const id = setTimeout(() => setUndoCountdown((prev) => prev - 1), 1000);
            setTimerId(id);
            return () => clearTimeout(id);
        }
    }, [undoCountdown
        // , onFinalized
    ]);

    const handleButtonClick = () => {
        setisCompleted(true);
        setUndoCountdown(3);
    };

    const handleUndoClick = () => {
        setisCompleted(false);
        setUndoCountdown(null);
        if (timerId) clearTimeout(timerId);
    };

    if (!isCompleted) {
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