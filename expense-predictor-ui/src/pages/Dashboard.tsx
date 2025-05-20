import { useEffect, useState } from 'react';

// Mock Data (normally fetched from an API)
const mockAccounts = [
    { id: 'checking', name: 'Checking Account', initialBalance: 5000 },
    { id: 'savings', name: 'Savings Account', initialBalance: 2000 },
];

const mockTransactions = [
    {
        id: 1,
        date: '2025-05-15',
        description: 'Rent Payment',
        amount: -1500,
        accountId: 'checking',
    },
    {
        id: 2,
        date: '2025-05-16',
        description: 'Paycheck',
        amount: 2500,
        accountId: 'checking',
    },
    {
        id: 3,
        date: '2025-05-17',
        description: 'Transfer to Savings',
        amount: -500,
        accountId: 'checking',
    },
    {
        id: 4,
        date: '2025-05-17',
        description: 'Transfer from Checking',
        amount: 500,
        accountId: 'savings',
    },
];

function calculateRunningBalances(accounts, transactions) {
    // Clone the initial balances
    const balances = Object.fromEntries(accounts.map(a => [a.id, a.initialBalance]));
    const ledger = [];

    // Sort by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    for (const tx of sorted) {
        const before = balances[tx.accountId];
        balances[tx.accountId] += tx.amount;
        const after = balances[tx.accountId];

        ledger.push({
            ...tx,
            beforeBalance: before,
            afterBalance: after,
        });
    }

    return ledger;
}

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const ledger = calculateRunningBalances(mockAccounts, mockTransactions);
        setTransactions(ledger);
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Account</th>
                        <th className="p-3 text-right">Before</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3 text-right">After</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id} className="border-t">
                            <td className="p-3">{tx.date}</td>
                            <td className="p-3">{tx.description}</td>
                            <td className="p-3 capitalize">{tx.accountId}</td>
                            <td className="p-3 text-right">${tx.beforeBalance.toFixed(2)}</td>
                            <td className={`p-3 text-right ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                            </td>
                            <td className="p-3 text-right">${tx.afterBalance.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
