import {useEffect, useState} from 'react';
import UndoableButton from "../UndoableButton.tsx";
import {type Account, accountStore} from "../store/AccountStore.tsx";

export default function Accounts() {
    const [form, setForm] = useState({ name: '', balance: '' });
    const {
        accounts,
        fetchAccounts,
        addAccount,
        updateAccountBalance,
    } = accountStore();

    function updateBalance(id: string, newBalance: string) {
        updateAccountBalance(id, parseFloat(newBalance));
    }

    function handleFormChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function handleAddAccount(e) {
        e.preventDefault();
        if (!form.name.trim()) return;

        const newAccount = {
            name: form.name,
            balance: parseFloat(form.balance || 0),
        };
        addAccount(newAccount);
        setForm({ name: '', balance: '' });
    }

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold">Accounts</h2>

            {/* Add Account Form */}
            <form onSubmit={handleAddAccount} className="grid gap-4 bg-white p-4 rounded shadow md:grid-cols-2 max-w-xl">
                <input
                    type="text"
                    name="name"
                    placeholder="Account Name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="balance"
                    placeholder="Starting Balance"
                    value={form.balance}
                    onChange={handleFormChange}
                    className="p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-black px-4 py-2 rounded md:col-span-2 w-fit"
                >
                    Add Account
                </button>
            </form>

            {/* Accounts Table */}
            <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3">Account</th>
                    <th className="p-3 text-right">Current Balance</th>
                    <th className="p-3 text-right">Update</th>
                    <th className="p-3 text-right">Delete</th>
                </tr>
                </thead>
                <tbody>
                {accounts.map((account: Account) => (
                    <tr key={account.id} className="border-t">
                        <td className="p-3">{account.name}</td>
                        <td className="p-3 text-right">${account.balance.toFixed(2)}</td>
                        <td className="p-3 text-right">
                            <input
                                type="number"
                                className="border p-1 w-24 text-right"
                                defaultValue={account.balance}
                                onBlur={e => updateBalance(account.id, e.target.value)}
                            />
                        </td>
                        <UndoableButton
                            object={account}
                            countdownCompletedCallback={(account) => {console.log("deleted account " + account.id)}}
                            buttonText={"Delete"}
                        />
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
