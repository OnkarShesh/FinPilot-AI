import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Layers, Trash2 } from "lucide-react";

import SectionTitle from "../components/ui/SectionTitle";
import ExpenseCard from "../components/ExpenseCard";
import { getExpenses, deleteExpense } from "../services/ExpenseService";

function Transactions() {
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");

    const fetchExpenses = async () => {
        try {
            const response = await getExpenses();
            setExpenses(response.data || []);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            toast.error("Failed to load transactions");
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            toast.success("Transaction deleted successfully");
            fetchExpenses();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete transaction");
        }
    };

    const totalIncome = useMemo(() => {
        return expenses
            .filter((e) => e.type === "INCOME")
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    }, [expenses]);

    const totalExpense = useMemo(() => {
        return expenses
            .filter((e) => e.type === "EXPENSE")
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    }, [expenses]);

    const filteredExpenses = useMemo(() => {
        let data = [...expenses];

        // Search filter
        if (search.trim()) {
            data = data.filter((e) =>
                (e.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (e.category || "").toLowerCase().includes(search.toLowerCase())
            );
        }

        // Type filter
        if (typeFilter !== "ALL") {
            data = data.filter((e) => e.type === typeFilter);
        }

        // Sorting
        switch (sortBy) {
            case "NEWEST":
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "OLDEST":
                data.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "HIGH":
                data.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
                break;
            case "LOW":
                data.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
                break;
            default:
                break;
        }

        return data;
    }, [expenses, search, typeFilter, sortBy]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <SectionTitle
                title="Transactions Ledger"
                subtitle="Search, filter, and audit all recorded financial activities."
            />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <span>Total Ledger Volume</span>
                        <Layers size={18} className="text-sky-400" />
                    </div>
                    <h3 className="mt-2 text-3xl font-extrabold text-white">
                        {expenses.length} <span className="text-xs font-medium text-zinc-500">records</span>
                    </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <span>Total Inflow</span>
                        <ArrowUpRight size={18} className="text-emerald-400" />
                    </div>
                    <h3 className="mt-2 text-3xl font-extrabold text-emerald-400">
                        ₹{totalIncome.toLocaleString("en-IN")}
                    </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <span>Total Outflow</span>
                        <ArrowDownRight size={18} className="text-rose-400" />
                    </div>
                    <h3 className="mt-2 text-3xl font-extrabold text-rose-400">
                        ₹{totalExpense.toLocaleString("en-IN")}
                    </h3>
                </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-sm">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or category (e.g. Salary, Rent, Food)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Type Pills */}
                    <div className="flex rounded-xl bg-zinc-950/80 p-1 border border-zinc-800">
                        {["ALL", "INCOME", "EXPENSE"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${typeFilter === t
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                        : "text-zinc-400 hover:text-white"
                                    }`}
                            >
                                {t === "ALL" ? "All" : t === "INCOME" ? "Income" : "Expense"}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-3.5 py-2 text-xs font-medium text-white outline-none focus:border-emerald-500"
                    >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                        <option value="HIGH">Amount: High to Low</option>
                        <option value="LOW">Amount: Low to High</option>
                    </select>
                </div>
            </div>

            {/* Transactions List */}
            {filteredExpenses.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-16 text-center">
                    <p className="text-zinc-400 font-medium">No matching transactions found.</p>
                    <p className="mt-1 text-xs text-zinc-500">Try modifying your search or filter criteria.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredExpenses.map((expense) => (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            handleEdit={() => {
                                window.location.href = "/dashboard";
                            }}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Transactions;
