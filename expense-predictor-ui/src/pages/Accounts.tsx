import { useState } from 'react';

const initialAccounts = [
    { id: 'checking', name: 'Checking Account', balance: 5000 },
    { id: 'savings', name: 'Savings Account', balance: 2000 },
];

export default function Accounts() {
    const [accounts, setAccounts] = useState(initialAccounts);
    const [form, setForm] = useState({ name: '', balance: '' });

    function updateBalance(id, newBalance) {
        setAccounts(accs =>
            accs.map(a => (a.id === id ? { ...a, balance: parseFloat(newBalance) } : a))
        );
    }

    function handleFormChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function handleAddAccount(e) {
        e.preventDefault();
        if (!form.name.trim()) return;

        const id = form.name.toLowerCase().replace(/\s+/g, '-');
        const newAccount = {
            id,
            name: form.name,
            balance: parseFloat(form.balance || 0),
        };
        setAccounts(prev => [...prev, newAccount]);
        setForm({ name: '', balance: '' });
    }

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
                </tr>
                </thead>
                <tbody>
                {accounts.map(account => (
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
