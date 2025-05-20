import { useState } from 'react';

const initialTransactions = [
    {
        id: 1,
        description: 'Rent',
        amount: -1500,
        frequency: 'Monthly',
        schedule: '1st of every month',
        accountId: 'checking',
    },
    {
        id: 2,
        description: 'Paycheck',
        amount: 2500,
        frequency: 'Biweekly',
        schedule: 'Every other Friday',
        accountId: 'checking',
    },
];

export default function Transactions() {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [form, setForm] = useState({
        description: '',
        amount: '',
        frequency: 'Monthly',
        schedule: '',
        accountId: 'checking',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function handleAdd(e) {
        e.preventDefault();
        const newTx = {
            ...form,
            id: Date.now(),
            amount: parseFloat(form.amount),
        };
        setTransactions([...transactions, newTx]);
        setForm({ description: '', amount: '', frequency: 'Monthly', schedule: '', accountId: 'checking' });
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Recurring Transactions</h2>

            <form onSubmit={handleAdd} className="mb-6 grid gap-4 bg-white p-4 rounded shadow md:grid-cols-2">
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <select name="frequency" value={form.frequency} onChange={handleChange} className="p-2 border rounded">
                    <option value="Weekly">Weekly</option>
                    <option value="Biweekly">Biweekly</option>
                    <option value="Monthly">Monthly</option>
                </select>
                <input
                    type="text"
                    name="schedule"
                    placeholder="Schedule (e.g., '1st of every month')"
                    value={form.schedule}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <select name="accountId" value={form.accountId} onChange={handleChange} className="p-2 border rounded">
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded self-start">
                    Add Transaction
                </button>
            </form>

            <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Schedule</th>
                    <th className="p-3">Account</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map(tx => (
                    <tr key={tx.id} className="border-t">
                        <td className="p-3">{tx.description}</td>
                        <td className={`p-3 ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="p-3">{tx.frequency}</td>
                        <td className="p-3">{tx.schedule}</td>
                        <td className="p-3 capitalize">{tx.accountId}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
