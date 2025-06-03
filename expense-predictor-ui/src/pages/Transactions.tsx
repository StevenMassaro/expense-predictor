import RecurringTransactions from "./RecurringTransactions.tsx";
import SingleTransactions from "./SingleTransactions.tsx";

export default function Transactions() {
    return (
        <span>
            <RecurringTransactions/>
            <SingleTransactions/>
        </span>
    );
}
