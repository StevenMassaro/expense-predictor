import { useState } from 'react';

const initialAccounts = [
    { id: 'checking', name: 'Checking Account', balance: 5000 },
    { id: 'savings', name: 'Savings Account', balance: 2000 },
];

export default function Accounts() {
    const [accounts, setAccounts] = useState(initialAccounts);

    function updateBalance(id, newBalance) {
        setAccounts(accs =>
            accs.map(a => (a.id === id ? { ...a, balance: parseFloat(newBalance) } : a))
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Accounts</h2>

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
