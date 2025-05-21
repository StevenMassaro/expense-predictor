import { useEffect, useState } from 'react';
import { recurringTransactionStore } from '../store/RecurringTransactionStore';

export default function Transactions() {
    const {
        transactions,
        fetchTransactions,
        addTransaction,
        loading,
        error,
    } = recurringTransactionStore();

    const [form, setForm] = useState({
        name: '',
        amount: '',
        recurrence: 'monthly',
        recurrenceDay: '',
        account: '',
    });

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        try {
            await addTransaction({
                name: form.name,
                amount: parseFloat(form.amount),
                recurrence: form.recurrence as any,
                recurrenceDay: parseInt(form.recurrenceDay, 10),
                account: form.account,
            });
            setForm({
                name: '',
                amount: '',
                recurrence: 'MONTHLY',
                recurrenceDay: '',
                account: '',
            });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Recurring Transactions</h2>

            <form onSubmit={handleAdd} className="mb-6 grid gap-4 bg-white p-4 rounded shadow md:grid-cols-2">
                <input
                    type="text"
                    name="name"
                    placeholder="Description"
                    value={form.name}
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
                <select
                    name="recurrence"
                    value={form.recurrence}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                </select>
                <input
                    type="number"
                    name="recurrenceDay"
                    placeholder="Recurrence day (e.g. 15)"
                    value={form.recurrenceDay}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <select name="accountId" value={form.account} onChange={handleChange} className="p-2 border rounded">
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                </select>
                <button type="submit" className="bg-blue-600 text-black px-4 py-2 rounded self-start">
                    Add Transaction
                </button>
            </form>

            {loading && <p>Loading transactions...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Recurrence Day</th>
                    <th className="p-3">Account</th>
                </tr>
                </thead>
                <tbody>
                {transactions && transactions.map(tx => (
                    <tr key={tx.id} className="border-t">
                        <td className="p-3">{tx.name}</td>
                        <td className={`p-3 ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="p-3 capitalize">{tx.recurrence}</td>
                        <td className="p-3">{tx.recurrenceDay}</td>
                        <td className="p-3">account</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
