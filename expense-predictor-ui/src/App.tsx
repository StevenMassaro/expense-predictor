import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import {accountStore} from "./store/AccountStore.tsx";
import {useEffect} from "react";

function App() {

    const fetchAccounts = accountStore((s) => s.fetchAccounts);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

  return (
      <Router>
          <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
              <header className="bg-white shadow p-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Cashflow Manager</h1>
                  <nav className="space-x-4">
                      <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
                      <Link to="/transactions" className="text-blue-600 hover:underline">Transactions</Link>
                      <Link to="/accounts" className="text-blue-600 hover:underline">Accounts</Link>
                  </nav>
              </header>

              <main className="flex-1 p-6">
                  <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/accounts" element={<Accounts />} />
                  </Routes>
              </main>

              <footer className="p-4 text-center text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} Cashflow Manager
              </footer>
          </div>
      </Router>
  )
}

export default App
