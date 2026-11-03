import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    HeartPulse,
    TrendingUp,
    Wallet,
    Sparkles,
    ShieldCheck,
    Loader2,
    AlertCircle,
    PieChart,
    ArrowUpRight,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { getExpenses, getAIInsights } from "../services/ExpenseService";

function AIAdvisor() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [expensesLoaded, setExpensesLoaded] = useState(false);

    const fetchAnalysis = async (isManual = false) => {
        try {
            if (isManual) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError("");

            const res = await getAIInsights();
            setAnalysis(res.data);
            localStorage.setItem("aiInsights", JSON.stringify(res.data));
            if (isManual) {
                toast.success("AI Insights refreshed!");
            }
        } catch (err) {
            console.error("AI Advisor error:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Unable to load AI Insights. Please ensure the backend and AI services are running."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            const res = await getExpenses();
            setExpenses(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setExpensesLoaded(true);
        }
    };

    useEffect(() => {
        fetchExpenses();

        const cached = localStorage.getItem("aiInsights");
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed && !parsed.error && typeof parsed.healthScore === "number") {
                    setAnalysis(parsed);
                    setLoading(false);
                } else {
                    localStorage.removeItem("aiInsights");
                    fetchAnalysis();
                }
            } catch (e) {
                localStorage.removeItem("aiInsights");
                fetchAnalysis();
            }
        } else {
            fetchAnalysis();
        }
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Loader2 className="animate-spin text-emerald-400" size={32} />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white">Analyzing Your Financial Behavior...</h3>
                <p className="text-sm text-zinc-400 max-w-sm">
                    Gemini AI is examining your income patterns, category drains, and savings rate.
                </p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 max-w-md text-center backdrop-blur-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                        <AlertCircle size={28} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">Analysis Could Not Complete</h3>
                    <p className="mt-2 text-xs text-rose-200/80 leading-relaxed">{error}</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem("aiInsights");
                            fetchAnalysis(true);
                        }}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition cursor-pointer shadow-lg shadow-rose-600/20"
                    >
                        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Retry Analysis
                    </button>
                </div>
            </div>
        );
    }

    const healthScore = Number(analysis?.healthScore ?? 0);
    const savingsRate = Number(analysis?.savingsRate || 0);
    const topCategory = analysis?.topSpendingCategory || "None";
    const status = analysis?.financialStatus || "Evaluating";
    const recommendations = Array.isArray(analysis?.recommendations) ? analysis.recommendations : [];

    const totalIncome = expenses
        .filter((e) => e.type === "INCOME")
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const expenseTransactions = expenses.filter((e) => e.type === "EXPENSE");
    const categoryTotals = {};
    expenseTransactions.forEach((e) => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount || 0);
    });

    const totalExpense = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const highestExpense = sortedCategories[0];

    const getScoreBadge = (score) => {
        if (score >= 75) return { label: "Excellent Standing", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" };
        if (score >= 50) return { label: "Moderate Shape", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30" };
        if (score >= 30) return { label: "Needs Improvement", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" };
        return { label: "Critical Attention", color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/30" };
    };

    const badge = getScoreBadge(healthScore);

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full min-w-0">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-black p-4 sm:p-6 lg:p-8 shadow-2xl">
                <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

                <div className="relative flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                            <Sparkles size={24} />
                        </div>
                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                Autonomous Advisory
                            </div>
                            <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white truncate">
                                AI Financial Advisor
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-400 truncate">
                                Real-time Gemini AI diagnostic guidance
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem("aiInsights");
                            fetchAnalysis(true);
                        }}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition cursor-pointer disabled:opacity-50 active:scale-95 w-full sm:w-auto shrink-0"
                    >
                        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                        {refreshing ? "Evaluating Data..." : "Re-Run AI Analysis"}
                    </button>
                </div>

                {/* Helpful Banner when income is zero */}
                {expensesLoaded && totalIncome === 0 && expenseTransactions.length > 0 && (
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 sm:p-4 text-xs">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="font-bold text-amber-300">Baseline Income Missing (Current: ₹0)</p>
                                <p className="mt-0.5 text-zinc-300 leading-relaxed">
                                    Your health score is evaluated low because you have recorded expenses without any income. Add your monthly salary in the Dashboard to unlock accurate savings rates!
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 hover:bg-amber-300 transition whitespace-nowrap text-xs shrink-0"
                        >
                            + Add Income <ArrowRight size={14} />
                        </Link>
                    </div>
                )}
            </div>

            {/* 4 Score Gauges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                {/* Health Score */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate">Health Score</span>
                        <HeartPulse className="text-emerald-400 shrink-0" size={22} />
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
                        <span className={`text-4xl sm:text-5xl font-black ${badge.color}`}>
                            {healthScore}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-zinc-500">/ 100</span>
                    </div>
                    <div className="mt-2.5 sm:mt-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold ${badge.bg} ${badge.color}`}>
                            {badge.label}
                        </span>
                    </div>
                </div>

                {/* Savings Rate */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm hover:border-sky-500/40 transition-all duration-300 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate">Savings Rate</span>
                        <TrendingUp className="text-sky-400 shrink-0" size={22} />
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <span className="text-4xl sm:text-5xl font-black text-sky-400 font-mono">
                            {savingsRate.toFixed(1)}%
                        </span>
                    </div>
                    <p className="mt-2.5 sm:mt-3 text-xs text-zinc-400 truncate">
                        {savingsRate >= 30 ? "Superb surplus accumulation" : savingsRate > 0 ? "Modest saving trajectory" : "Zero savings (Add income)"}
                    </p>
                </div>

                {/* Financial Status */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate">AI Standing</span>
                        <ShieldCheck className="text-purple-400 shrink-0" size={22} />
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <span className="text-2xl sm:text-3xl font-black text-purple-300 truncate block">
                            {status}
                        </span>
                    </div>
                    <p className="mt-2.5 sm:mt-3 text-xs text-zinc-400">Synthesized by LLM Model</p>
                </div>

                {/* Top Spending */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm hover:border-rose-500/40 transition-all duration-300 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate">Highest Drain</span>
                        <Wallet className="text-rose-400 shrink-0" size={22} />
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <span className="text-2xl sm:text-3xl font-black text-rose-400 truncate block">
                            {topCategory}
                        </span>
                    </div>
                    <p className="mt-2.5 sm:mt-3 text-xs text-zinc-400">Main expenditure channel</p>
                </div>
            </div>

            {/* Split Section: Spending Breakdown & AI Recommendations */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 min-w-0">
                {/* Left: Spending Breakdown */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 lg:p-8 backdrop-blur-sm min-w-0">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                            <PieChart size={22} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-white truncate">Category Allocation</h2>
                            <p className="text-[11px] sm:text-xs text-zinc-400 truncate">Expense distribution across categories</p>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {sortedCategories.length > 0 ? (
                            sortedCategories.map(([cat, amt]) => {
                                const pct = totalExpense === 0 ? 0 : ((amt / totalExpense) * 100).toFixed(1);
                                return (
                                    <div key={cat} className="space-y-1.5 min-w-0">
                                        <div className="flex items-center justify-between text-xs gap-2">
                                            <span className="font-semibold text-zinc-200 truncate">{cat}</span>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-zinc-400 font-mono">₹{amt.toLocaleString("en-IN")}</span>
                                                <span className="font-bold text-emerald-400">{pct}%</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-xs text-zinc-500">
                                No expense records to visualize. Add an expense in the Dashboard.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: AI Recommendations */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 lg:p-8 backdrop-blur-sm min-w-0">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                            <Sparkles size={22} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-white truncate">Smart Action Items</h2>
                            <p className="text-[11px] sm:text-xs text-zinc-400 truncate">Algorithmic advice tailored to your balance</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {recommendations.length > 0 ? (
                            recommendations.map((tip, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-2.5 sm:gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-3.5 sm:p-4 transition duration-200 hover:border-emerald-500/30 min-w-0"
                                >
                                    <CheckCircle2 className="mt-0.5 text-emerald-400 shrink-0" size={17} />
                                    <p className="text-xs text-zinc-200 leading-relaxed">{tip}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-zinc-500">
                                No AI recommendations available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Smart Financial Tips Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 min-w-0">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-emerald-400 mb-1">💡 50/30/20 Rule</h4>
                    <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                        Aim for 50% on Needs (Rent, Bills), 30% on Wants, and allocate at least 20% directly into Savings/Investments.
                    </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-teal-400 mb-1">🛡️ Emergency Buffer</h4>
                    <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                        Keep 3-6 months of essential living expenses liquid in a high-yield account before taking large financial bets.
                    </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-purple-400 mb-1">🚀 Velocity Discipline</h4>
                    <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                        Log every micro-transaction. Unrecorded weekend dining and subscriptions are the #1 cause of month-end budget leakages.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AIAdvisor;
