import RecurringTransactions from "./RecurringTransactions.tsx";
import SingleTransactions from "./SingleTransactions.tsx";
import {accountStore} from "../store/AccountStore.tsx";
import {useEffect} from "react";

export default function Transactions() {
    const {
        fetchAccounts
    } = accountStore();

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return (
        <span>
            <RecurringTransactions/>
            <SingleTransactions/>
        </span>
    );
}
