import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Layers, ArrowUpRight, ArrowDownRight, Trash2, Check, CheckSquare, Square, X, AlertTriangle } from "lucide-react";

import SectionTitle from "../components/ui/SectionTitle";
import ExpenseCard from "../components/ExpenseCard";
import { getExpenses, deleteExpense, batchDeleteExpenses } from "../services/ExpenseService";

function Transactions() {
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);

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

    // Instant Optimistic Single Delete (Zero Lag, Zero Refresh)
    const handleDelete = async (id) => {
        const previousExpenses = [...expenses];
        const previousSelected = [...selectedIds];

        // 1. Immediately remove from UI (Optimistic Update)
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        toast.success("Transaction deleted");

        try {
            // 2. Call backend in background
            await deleteExpense(id);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete transaction. Reverting...");
            // Revert state on failure
            setExpenses(previousExpenses);
            setSelectedIds(previousSelected);
        }
    };

    // Instant Optimistic Bulk Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        const count = selectedIds.length;
        const toDelete = [...selectedIds];
        const previousExpenses = [...expenses];

        // 1. Immediately remove all selected items from UI
        setExpenses((prev) => prev.filter((e) => !toDelete.includes(e.id)));
        setSelectedIds([]);
        toast.success(`${count} transaction${count > 1 ? "s" : ""} deleted`);

        try {
            setIsDeletingBulk(true);
            await batchDeleteExpenses(toDelete);
        } catch (error) {
            console.error("Bulk delete error:", error);
            toast.error("Some transactions could not be deleted. Re-syncing...");
            fetchExpenses();
        } finally {
            setIsDeletingBulk(false);
        }
    };

    // Selection toggle for individual transaction
    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Select All / Deselect All visible transactions
    const handleToggleSelectAll = () => {
        const visibleIds = filteredExpenses.map((e) => e.id);
        const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
        } else {
            const combined = Array.from(new Set([...selectedIds, ...visibleIds]));
            setSelectedIds(combined);
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

    const isAllVisibleSelected =
        filteredExpenses.length > 0 &&
        filteredExpenses.every((e) => selectedIds.includes(e.id));

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full min-w-0 pb-16">
            <SectionTitle
                title="Transactions Ledger"
                subtitle="Search, filter, select, and manage all recorded financial activities."
            />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <span>Total Ledger Volume</span>
                        <Layers size={18} className="text-sky-400" />
                    </div>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white truncate">
                        {expenses.length} <span className="text-xs font-medium text-zinc-500">records</span>
                    </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <span>Total Inflow</span>
                        <ArrowUpRight size={18} className="text-emerald-400" />
                    </div>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono truncate">
                        ₹{totalIncome.toLocaleString("en-IN")}
                    </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <span>Total Outflow</span>
                        <ArrowDownRight size={18} className="text-rose-400" />
                    </div>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono truncate">
                        ₹{totalExpense.toLocaleString("en-IN")}
                    </h3>
                </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 sm:p-4 backdrop-blur-sm min-w-0">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3.5 top-3 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 pl-10 pr-4 py-2.5 text-base sm:text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3">
                    {/* Type Pills */}
                    <div className="flex rounded-xl bg-zinc-950/80 p-1 border border-zinc-800 flex-1 sm:flex-initial justify-center">
                        {["ALL", "INCOME", "EXPENSE"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex-1 sm:flex-initial text-center active:scale-95 ${
                                    typeFilter === t
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
                        className="rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-3 py-2 text-xs font-medium text-white outline-none focus:border-emerald-500 shrink-0 [color-scheme:dark]"
                    >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                        <option value="HIGH">High to Low</option>
                        <option value="LOW">Low to High</option>
                    </select>
                </div>
            </div>

            {/* Selection Toolbar (Select All & Bulk Delete Bar) */}
            {filteredExpenses.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-2.5 backdrop-blur-sm min-w-0">
                    <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-300 cursor-pointer select-none">
                        <div
                            onClick={handleToggleSelectAll}
                            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all ${
                                isAllVisibleSelected
                                    ? "bg-emerald-500 border-emerald-400 text-black shadow-sm"
                                    : selectedIds.length > 0
                                    ? "bg-emerald-500/30 border-emerald-500 text-emerald-400"
                                    : "border-zinc-700 bg-zinc-950/60 hover:border-zinc-500 text-transparent"
                            }`}
                        >
                            <Check size={11} strokeWidth={3.5} className={selectedIds.length > 0 ? "opacity-100" : "opacity-0"} />
                        </div>
                        <span>
                            Select All <span className="text-zinc-500">({filteredExpenses.length})</span>
                        </span>
                    </label>

                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto animate-fade-in">
                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                                {selectedIds.length} Selected
                            </span>

                            <button
                                type="button"
                                onClick={handleBulkDelete}
                                disabled={isDeletingBulk}
                                className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition-all shadow-md shadow-rose-950/40 cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                                <Trash2 size={13} />
                                <span>Delete Selected ({selectedIds.length})</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition cursor-pointer"
                                title="Clear selection"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Transactions List */}
            {filteredExpenses.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-10 sm:p-16 text-center">
                    <p className="text-zinc-400 font-medium text-sm">No matching transactions found.</p>
                    <p className="mt-1 text-xs text-zinc-500">Try modifying your search or filter criteria.</p>
                </div>
            ) : (
                <div className="space-y-3 min-w-0">
                    {filteredExpenses.map((expense) => (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            isSelected={selectedIds.includes(expense.id)}
                            onToggleSelect={handleToggleSelect}
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
