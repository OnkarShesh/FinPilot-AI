import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
    Wallet, 
    TrendingUp, 
    ArrowDownRight, 
    ArrowUpRight, 
    Layers, 
    Sparkles, 
    ArrowRight,
    PlusCircle,
    X,
    Edit2,
    Trash2,
    Calendar
} from "lucide-react";

import ExpenseForm from "../components/ExpenseForm";
import StatCard from "../components/ui/StatCard";
import AIInsightsCard from "../components/AIInsightsCard";
import SectionTitle from "../components/ui/SectionTitle";
import WhatsAppModal from "../components/WhatsAppModal";
import { FaWhatsapp } from "react-icons/fa";

import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getDashboardSummary,
    getAIInsights
} from "../services/ExpenseService";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [dashboard, setDashboard] = useState({
        totalIncome: 0,
        totalExpense: 0,
        savings: 0,
        totalTransactions: 0,
    });

    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [description, setDescription] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [aiInsights, setAIInsights] = useState(null);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

    const userName = localStorage.getItem("name") || "User";

    const fetchExpenses = async () => {
        try {
            const response = await getExpenses();
            setExpenses(response.data || []);
        } catch (err) {
            console.error("Failed to load expenses:", err);
        } finally {
            setLoadingExpenses(false);
        }
    };

    const fetchDashboard = async () => {
        try {
            const response = await getDashboardSummary();
            setDashboard(response.data);
        } catch (err) {
            console.error("Failed to load dashboard summary:", err);
        }
    };

    const fetchAIInsights = async () => {
        try {
            const response = await getAIInsights();
            setAIInsights(response.data);
            localStorage.setItem("aiInsights", JSON.stringify(response.data));
        } catch (error) {
            console.error("AI Insights error:", error);
            setAIInsights({
                error: true,
                message: error.response?.data?.detail || "Unable to load AI Insights at this moment."
            });
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchDashboard();

        const handleHash = () => {
            if (window.location.hash === "#new") {
                clearForm();
                setIsModalOpen(true);
                window.history.replaceState(null, "", window.location.pathname);
            } else if (window.location.hash === "#whatsapp") {
                setIsWhatsAppOpen(true);
                window.history.replaceState(null, "", window.location.pathname);
            }
        };

        const handleOpenWhatsAppEvent = () => {
            setIsWhatsAppOpen(true);
        };

        handleHash();
        window.addEventListener("hashchange", handleHash);
        window.addEventListener("open-whatsapp-bot", handleOpenWhatsAppEvent);

        const cached = localStorage.getItem("aiInsights");
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed && !parsed.error && typeof parsed.healthScore === "number") {
                    setAIInsights(parsed);
                } else {
                    localStorage.removeItem("aiInsights");
                    fetchAIInsights();
                }
            } catch (e) {
                localStorage.removeItem("aiInsights");
                fetchAIInsights();
            }
        } else {
            fetchAIInsights();
        }

        return () => {
            window.removeEventListener("hashchange", handleHash);
            window.removeEventListener("open-whatsapp-bot", handleOpenWhatsAppEvent);
        };
    }, []);

    const clearForm = () => {
        setTitle("");
        setAmount("");
        setCategory("");
        setDate(new Date().toISOString().split("T")[0]);
        setDescription("");
        setType("EXPENSE");
        setEditingId(null);
        setIsModalOpen(false);
    };

    const refreshDashboard = () => {
        fetchExpenses();
        fetchDashboard();
    };

    const handleAddExpense = async () => {
        if (!title.trim() || !amount || !category) {
            toast.error("Please fill in Title, Amount, and Category");
            return;
        }

        try {
            await addExpense({
                title: title.trim(),
                amount: parseFloat(amount),
                category,
                date: date || new Date().toISOString().split("T")[0],
                description,
                type,
            });

            toast.success(`${type === "INCOME" ? "Income" : "Expense"} added successfully!`);
            clearForm();
            setIsModalOpen(false);
            refreshDashboard();
            fetchAIInsights();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add transaction. Please check your inputs.");
        }
    };

    const handleEdit = (expense) => {
        setEditingId(expense.id);
        setTitle(expense.title);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDate(expense.date);
        setDescription(expense.description || "");
        setType(expense.type);
        setIsModalOpen(true);
    };

    const handleUpdateExpense = async () => {
        if (!title.trim() || !amount || !category) {
            toast.error("Please fill in Title, Amount, and Category");
            return;
        }

        try {
            await updateExpense(editingId, {
                title: title.trim(),
                amount: parseFloat(amount),
                category,
                date: date || new Date().toISOString().split("T")[0],
                description,
                type,
            });

            toast.success("Transaction updated successfully!");
            clearForm();
            setIsModalOpen(false);
            refreshDashboard();
            fetchAIInsights();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update transaction.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            toast.success("Transaction deleted successfully");
            refreshDashboard();
            fetchAIInsights();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete transaction.");
        }
    };

    // Quick starter demo helper
    const handleQuickSeed = async () => {
        try {
            const today = new Date().toISOString().split("T")[0];
            await addExpense({
                title: "Monthly Salary",
                amount: 60000,
                category: "Salary",
                date: today,
                description: "Primary Job Income",
                type: "INCOME"
            });
            await addExpense({
                title: "Apartment Rent",
                amount: 18000,
                category: "Rent",
                date: today,
                description: "Monthly Rent",
                type: "EXPENSE"
            });
            toast.success("Added demo Salary (₹60k) & Rent (₹18k)!");
            refreshDashboard();
            fetchAIInsights();
        } catch (err) {
            toast.error("Failed to initialize demo data.");
        }
    };

    const savingsAmount = Number(dashboard?.savings || 0);

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full min-w-0">
            {/* 1. Header Hero */}
            <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-black p-4 sm:p-6 lg:p-8 shadow-2xl">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

                <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-400">
                            <Sparkles size={13} /> Smart Financial Copilot
                        </div>
                        <h1 className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{userName}</span> 👋
                        </h1>
                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm lg:text-base text-zinc-400 max-w-xl leading-relaxed">
                            Monitor cash flow, log expenses instantly, and explore actionable AI insights in real time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        {/* Primary Instant Add Button */}
                        <button
                            onClick={() => {
                                clearForm();
                                setIsModalOpen(true);
                            }}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 sm:px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition cursor-pointer"
                        >
                            <PlusCircle size={15} /> + Add Transaction
                        </button>

                        {/* WhatsApp Copilot 24/7 Button */}
                        <button
                            onClick={() => setIsWhatsAppOpen(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 sm:px-4 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500 active:scale-95 transition cursor-pointer shadow-sm"
                            title="Log expenses hands-free via WhatsApp"
                        >
                            <FaWhatsapp className="text-sm text-emerald-400" />
                            <span>WhatsApp Copilot</span>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </button>

                        {!loadingExpenses && expenses.length === 0 && (
                            <button
                                onClick={handleQuickSeed}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 sm:px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition cursor-pointer"
                            >
                                <Sparkles size={14} /> + Demo Data
                            </button>
                        )}

                        <Link
                            to="/advisor"
                            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 sm:px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-700 transition cursor-pointer backdrop-blur-sm"
                        >
                            AI Advisor <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Top Metric Stat Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                <StatCard
                    title="Net Savings"
                    value={`₹${savingsAmount.toLocaleString("en-IN")}`}
                    valueColor={savingsAmount >= 0 ? "text-white" : "text-rose-400"}
                    icon={<Wallet size={22} />}
                    trend={savingsAmount >= 0 ? "Surplus / Savings" : "Deficit (Overspending)"}
                    trendType={savingsAmount >= 0 ? "positive" : "negative"}
                />

                <StatCard
                    title="Total Income"
                    value={`₹${Number(dashboard?.totalIncome || 0).toLocaleString("en-IN")}`}
                    valueColor="text-emerald-400"
                    icon={<ArrowUpRight size={22} />}
                    trend="Inflow Total"
                    trendType="positive"
                />

                <StatCard
                    title="Total Expenses"
                    value={`₹${Number(dashboard?.totalExpense || 0).toLocaleString("en-IN")}`}
                    valueColor="text-rose-400"
                    icon={<ArrowDownRight size={22} />}
                    trend="Outflow Total"
                    trendType="negative"
                />

                <StatCard
                    title="Transactions"
                    value={dashboard?.totalTransactions ?? 0}
                    valueColor="text-sky-400"
                    icon={<Layers size={22} />}
                    trend="Recorded Events"
                    trendType="positive"
                />
            </div>

            {/* 3. Balanced 50/50 Workspace: Add Transaction (Left) & Recent Transactions Feed (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
                {/* Left Side (50%): Form Card */}
                <div className="h-full min-w-0">
                    <ExpenseForm
                        title={title}
                        setTitle={setTitle}
                        amount={amount}
                        setAmount={setAmount}
                        category={category}
                        setCategory={setCategory}
                        date={date}
                        setDate={setDate}
                        description={description}
                        setDescription={setDescription}
                        type={type}
                        setType={setType}
                        editingId={editingId}
                        handleAddExpense={handleAddExpense}
                        handleUpdateExpense={handleUpdateExpense}
                        clearForm={clearForm}
                    />
                </div>

                {/* Right Side (50%): Compact Unified Recent Transactions Feed Card */}
                <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-4 sm:p-6 shadow-2xl backdrop-blur-sm flex flex-col justify-between h-full min-w-0">
                    <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-800/80 mb-3 gap-2">
                            <div className="min-w-0">
                                <span className="inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-sky-400 uppercase tracking-wider">
                                    Ledger Activity
                                </span>
                                <h2 className="mt-1 text-base sm:text-lg lg:text-xl font-bold text-white flex items-center gap-1.5 truncate">
                                    Recent Transactions
                                    <span className="text-xs font-semibold text-zinc-500 font-mono">
                                        ({expenses.length})
                                    </span>
                                </h2>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <button
                                    onClick={() => {
                                        clearForm();
                                        setIsModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30 bg-emerald-500/10 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition cursor-pointer"
                                    title="Open Modal Entry"
                                >
                                    <PlusCircle size={12} /> <span className="hidden xs:inline">+ Quick</span>
                                </button>
                                <Link
                                    to="/transactions"
                                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-zinc-300 hover:text-white transition px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900"
                                >
                                    View All <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>

                        {/* Transactions List */}
                        {loadingExpenses ? (
                            <div className="space-y-2 py-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-14 rounded-xl bg-zinc-900/60 border border-zinc-800/40 animate-pulse" />
                                ))}
                            </div>
                        ) : expenses.length === 0 ? (
                            <div className="py-12 sm:py-16 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/60 text-zinc-500">
                                    <Wallet size={22} />
                                </div>
                                <h3 className="mt-3 text-sm font-semibold text-white">No transactions recorded yet</h3>
                                <p className="mt-1 text-xs text-zinc-500 max-w-xs mx-auto">
                                    Use the form on the left or top to add your first income or expense entry.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800/60">
                                {expenses.slice(0, 5).map((expense) => {
                                    const isIncome = expense.type === "INCOME";
                                    const formattedDate = new Date(expense.date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                    });
                                    const amountVal = Number(expense.amount || 0);

                                    return (
                                        <div
                                            key={expense.id}
                                            className="group flex items-center justify-between py-2 sm:py-2.5 px-1 sm:px-1.5 transition-colors hover:bg-zinc-800/30 rounded-xl min-w-0"
                                        >
                                            {/* Left Icon & Title */}
                                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                                <div
                                                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm transition-transform group-hover:scale-105 ${
                                                        isIncome
                                                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                                    }`}
                                                >
                                                    {isIncome ? "↓" : "↑"}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors leading-snug">
                                                        {expense.title}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                                                        <span className="text-[9px] sm:text-[10px] font-medium text-zinc-400 rounded bg-zinc-800/80 px-1.5 py-0.2 truncate max-w-[90px] sm:max-w-none">
                                                            {expense.category}
                                                        </span>
                                                        <span className="text-[9px] sm:text-[10px] text-zinc-500 shrink-0">
                                                            {formattedDate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Amount & Actions */}
                                            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
                                                <span
                                                    className={`text-xs sm:text-sm md:text-base font-extrabold font-mono tracking-tight tabular-nums whitespace-nowrap ${
                                                        isIncome ? "text-emerald-400" : "text-rose-400"
                                                    }`}
                                                >
                                                    {isIncome ? "+" : "-"}₹{amountVal.toLocaleString("en-IN")}
                                                </span>

                                                <div className="flex items-center gap-0.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(expense)}
                                                        className="p-1 sm:p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition cursor-pointer"
                                                        title="Edit entry"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="p-1 sm:p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                                                        title="Delete entry"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Card Footer: Quick Ledger Summary */}
                    {expenses.length > 0 && (
                        <div className="pt-3 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                            <span className="text-[10px] sm:text-[11px] text-zinc-500">Latest 5 ledger transactions</span>
                            <Link to="/transactions" className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] sm:text-xs flex items-center gap-1">
                                Full History ({expenses.length}) <ArrowRight size={12} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. AI Financial Insights (Positioned cleanly below transactions) */}
            <div className="w-full min-w-0">
                <AIInsightsCard insights={aiInsights} />
            </div>

            {/* 5. Focused Modal Popup (Opens on "+ Add Transaction" click from anywhere) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl">
                        <ExpenseForm
                            title={title}
                            setTitle={setTitle}
                            amount={amount}
                            setAmount={setAmount}
                            category={category}
                            setCategory={setCategory}
                            date={date}
                            setDate={setDate}
                            description={description}
                            setDescription={setDescription}
                            type={type}
                            setType={setType}
                            editingId={editingId}
                            handleAddExpense={handleAddExpense}
                            handleUpdateExpense={handleUpdateExpense}
                            clearForm={clearForm}
                        />
                    </div>
                </div>
            )}

            {/* 6. WhatsApp Copilot 24/7 Simulator & Setup Modal */}
            <WhatsAppModal
                isOpen={isWhatsAppOpen}
                onClose={() => setIsWhatsAppOpen(false)}
                onTransactionLogged={() => {
                    refreshDashboard();
                    fetchAIInsights();
                }}
            />
        </div>
    );
}

export default Dashboard;
