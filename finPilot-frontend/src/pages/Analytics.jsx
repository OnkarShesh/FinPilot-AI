import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Wallet,
    PieChart as PieIcon,
    BarChart3,
    Sparkles,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Percent,
    Layers,
    Plus,
    Activity
} from "lucide-react";
import { getExpenses } from "../services/ExpenseService";

const PALETTE = [
    "#10b981", // Emerald
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#f97316", // Orange
    "#ef4444", // Rose
    "#14b8a6", // Teal
    "#a855f7"  // Violet
];

// Custom Dark Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/95 p-3.5 shadow-2xl backdrop-blur-md">
                <p className="text-xs font-semibold text-zinc-400 mb-2">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5 capitalize text-zinc-300">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: entry.color || entry.fill }}
                                />
                                {entry.name}:
                            </span>
                            <span className="text-white font-mono">
                                ₹{Number(entry.value).toLocaleString("en-IN")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

// Custom Pie Tooltip
const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md">
                <p className="text-xs font-bold text-white flex items-center gap-2">
                    <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: data.payload.fill }}
                    />
                    {data.name}
                </p>
                <p className="mt-1 text-sm font-extrabold text-emerald-400 font-mono">
                    ₹{Number(data.value).toLocaleString("en-IN")}
                </p>
            </div>
        );
    }
    return null;
};

function Analytics() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState("ALL"); // "ALL" | "THIS_MONTH"

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await getExpenses();
            setExpenses(response.data || []);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Filter by timeframe if applicable
    const filteredExpenses = useMemo(() => {
        if (timeframe === "THIS_MONTH") {
            const now = new Date();
            const curMonth = now.getMonth();
            const curYear = now.getFullYear();
            return expenses.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === curMonth && d.getFullYear() === curYear;
            });
        }
        return expenses;
    }, [expenses, timeframe]);

    const analytics = useMemo(() => {
        const monthlyMap = {};
        const categoryMap = {};
        const categoryCountMap = {};

        let income = 0;
        let expense = 0;

        filteredExpenses.forEach((item) => {
            const itemDate = new Date(item.date);
            const month = isNaN(itemDate.getTime())
                ? "Recent"
                : itemDate.toLocaleString("default", { month: "short", year: "2-digit" });

            if (!monthlyMap[month]) {
                monthlyMap[month] = {
                    month,
                    rawDate: itemDate.getTime() || 0,
                    income: 0,
                    expense: 0,
                    net: 0
                };
            }

            const amt = Number(item.amount) || 0;

            if (item.type === "INCOME") {
                income += amt;
                monthlyMap[month].income += amt;
            } else {
                expense += amt;
                monthlyMap[month].expense += amt;
                categoryMap[item.category] = (categoryMap[item.category] || 0) + amt;
                categoryCountMap[item.category] = (categoryCountMap[item.category] || 0) + 1;
            }

            monthlyMap[month].net = monthlyMap[month].income - monthlyMap[month].expense;
        });

        // Sorted chronological monthly data
        const monthlyData = Object.values(monthlyMap).sort((a, b) => a.rawDate - b.rawDate);

        // Sorted category breakdown
        const categoryData = Object.entries(categoryMap)
            .map(([name, value], idx) => ({
                name,
                value,
                count: categoryCountMap[name] || 1,
                fill: PALETTE[idx % PALETTE.length],
                percentage: expense > 0 ? ((value / expense) * 100).toFixed(1) : "0"
            }))
            .sort((a, b) => b.value - a.value);

        const topCategory = categoryData.length > 0 ? categoryData[0] : null;
        const totalExpenseCount = filteredExpenses.filter((e) => e.type === "EXPENSE").length;
        const averageExpense = totalExpenseCount > 0 ? expense / totalExpenseCount : 0;
        const savings = income - expense;
        const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
        const expenseRatio = income > 0 ? ((expense / income) * 100).toFixed(1) : (expense > 0 ? 100 : 0);

        return {
            monthlyData,
            categoryData,
            topCategory,
            income,
            expense,
            savings,
            savingsRate,
            averageExpense,
            expenseRatio,
            totalExpenseCount
        };
    }, [filteredExpenses]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-black p-6 sm:p-8 shadow-2xl">
                <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            <Activity size={14} /> Financial Intelligence
                        </div>
                        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                            Analytics & Trends
                        </h1>
                        <p className="mt-1 text-sm sm:text-base text-zinc-400 max-w-xl">
                            Gain deep visibility into your cash inflows, monthly burn rate, and category distribution.
                        </p>
                    </div>

                    {/* Timeframe Toggle */}
                    <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-1.5 self-start md:self-auto backdrop-blur-md">
                        <button
                            onClick={() => setTimeframe("ALL")}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                                timeframe === "ALL"
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            All Time
                        </button>
                        <button
                            onClick={() => setTimeframe("THIS_MONTH")}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                                timeframe === "THIS_MONTH"
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            This Month
                        </button>
                    </div>
                </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Income */}
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Income</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-black text-emerald-400 font-mono">
                        ₹{analytics.income.toLocaleString("en-IN")}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                        <span>Total verified inflow</span>
                    </div>
                </div>

                {/* Total Expense */}
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm hover:border-rose-500/40 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Expenses</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ArrowDownRight size={20} />
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-black text-rose-400 font-mono">
                        ₹{analytics.expense.toLocaleString("en-IN")}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                        <span>Across {analytics.totalExpenseCount} transactions</span>
                    </div>
                </div>

                {/* Net Savings */}
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Net Cash Flow</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <p className={`mt-4 text-3xl font-black font-mono ${analytics.savings >= 0 ? "text-cyan-400" : "text-rose-400"}`}>
                        ₹{analytics.savings.toLocaleString("en-IN")}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                        <span>{analytics.savings >= 0 ? "Surplus retained" : "Deficit recorded"}</span>
                    </div>
                </div>

                {/* Savings Rate */}
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Savings Rate</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Percent size={20} />
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-black text-purple-400 font-mono">
                        {analytics.savingsRate}%
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                        <span>Of gross income saved</span>
                    </div>
                </div>
            </div>

            {/* Empty State when zero transactions */}
            {expenses.length === 0 && !loading && (
                <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400">
                        <BarChart3 size={32} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">No Financial Records Available</h3>
                    <p className="mt-1 text-sm text-zinc-400 max-w-md mx-auto">
                        Add your first income or expense to populate interactive cash flow and category charts.
                    </p>
                    <Link
                        to="/dashboard"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
                    >
                        <Plus size={16} /> Add First Transaction
                    </Link>
                </div>
            )}

            {/* Charts Section */}
            {expenses.length > 0 && (
                <>
                    {/* Monthly Inflow vs Outflow & Spending Trend */}
                    <div className="grid gap-8 xl:grid-cols-2">
                        {/* Monthly Bar Chart */}
                        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-7 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <BarChart3 size={20} className="text-emerald-400" /> Monthly Cash Flow
                                    </h2>
                                    <p className="text-xs text-zinc-400 mt-1">Income vs Expense comparison</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1.5 text-emerald-400">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Income
                                    </span>
                                    <span className="flex items-center gap-1.5 text-rose-400">
                                        <span className="h-2 w-2 rounded-full bg-rose-500"></span> Expense
                                    </span>
                                </div>
                            </div>

                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#71717a"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={{ stroke: "#27272a" }}
                                        />
                                        <YAxis
                                            stroke="#71717a"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="income"
                                            name="Income"
                                            fill="#10b981"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={45}
                                        />
                                        <Bar
                                            dataKey="expense"
                                            name="Expense"
                                            fill="#ef4444"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={45}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Expense Trend Area Chart */}
                        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-7 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <TrendingUp size={20} className="text-cyan-400" /> Spending Trend
                                    </h2>
                                    <p className="text-xs text-zinc-400 mt-1">Expense curve progression</p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                                    Trendline
                                </span>
                            </div>

                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics.monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="expenseTrendGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#71717a"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={{ stroke: "#27272a" }}
                                        />
                                        <YAxis
                                            stroke="#71717a"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="expense"
                                            name="Expense"
                                            stroke="#06b6d4"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#expenseTrendGrad)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Donut Chart & Category Leaderboard */}
                    <div className="grid gap-8 xl:grid-cols-12">
                        {/* Donut Chart (5 cols) */}
                        <div className="xl:col-span-5 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-7 backdrop-blur-sm flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <PieIcon size={20} className="text-purple-400" /> Spending Distribution
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1">Portfolio share by category</p>
                            </div>

                            <div className="relative my-4 h-64 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.categoryData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={65}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            cornerRadius={4}
                                        >
                                            {analytics.categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} stroke="#18181b" strokeWidth={2} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Center Donut Label */}
                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-xs font-semibold text-zinc-400">Total Drained</span>
                                    <span className="text-lg font-extrabold text-white font-mono">
                                        ₹{analytics.expense >= 1000 ? `${(analytics.expense / 1000).toFixed(1)}k` : analytics.expense}
                                    </span>
                                </div>
                            </div>

                            {/* Mini Category Badges */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/80">
                                {analytics.categoryData.slice(0, 6).map((item) => (
                                    <span
                                        key={item.name}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-300"
                                    >
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                                        {item.name}: <span className="font-semibold text-white">{item.percentage}%</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Category Leaderboard (7 cols) */}
                        <div className="xl:col-span-7 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-7 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Layers size={20} className="text-amber-400" /> Category Breakdown
                                    </h2>
                                    <p className="text-xs text-zinc-400 mt-1">Ranked by total expenditure</p>
                                </div>
                                <span className="text-xs font-semibold text-zinc-500">
                                    {analytics.categoryData.length} Active Categories
                                </span>
                            </div>

                            <div className="space-y-4">
                                {analytics.categoryData.length === 0 ? (
                                    <p className="text-xs text-zinc-500 py-8 text-center">No category spending recorded yet.</p>
                                ) : (
                                    analytics.categoryData.map((item, index) => (
                                        <div
                                            key={item.name}
                                            className="group rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/80 text-xs font-bold text-zinc-400 font-mono">
                                                        #{index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold text-sm text-white">{item.name}</p>
                                                        <p className="text-xs text-zinc-500">
                                                            {item.count} transaction{item.count > 1 ? "s" : ""} • {item.percentage}% of total
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm text-rose-400 font-mono">
                                                        ₹{item.value.toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                        backgroundColor: item.fill
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial Diagnostics Strip */}
                    <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-black p-6 sm:p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="text-emerald-400" size={20} />
                            <h2 className="text-lg font-bold text-white">Diagnostics & Efficiency Summary</h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                                <p className="text-xs text-zinc-400 font-semibold">Biggest Spending Drain</p>
                                <p className="mt-2 text-xl font-bold text-rose-400">
                                    {analytics.topCategory ? analytics.topCategory.name : "None"}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    {analytics.topCategory ? `₹${analytics.topCategory.value.toLocaleString("en-IN")}` : "No expenses"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                                <p className="text-xs text-zinc-400 font-semibold">Average Expense / Txn</p>
                                <p className="mt-2 text-xl font-bold text-amber-400 font-mono">
                                    ₹{analytics.averageExpense.toFixed(0)}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Based on {analytics.totalExpenseCount} transactions
                                </p>
                            </div>

                            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                                <p className="text-xs text-zinc-400 font-semibold">Expense-to-Income Ratio</p>
                                <p className="mt-2 text-xl font-bold text-emerald-400 font-mono">
                                    {analytics.expenseRatio}%
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    {Number(analytics.expenseRatio) <= 50 ? "Healthy cash runway" : "Attention recommended"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                                <p className="text-xs text-zinc-400 font-semibold">AI Insights Status</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-base font-bold text-white">Active</span>
                                </div>
                                <Link
                                    to="/advisor"
                                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                                >
                                    Open AI Advisor &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Analytics;
