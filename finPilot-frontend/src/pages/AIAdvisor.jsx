import { useEffect, useState } from "react";
import {
    HeartPulse,
    TrendingUp,
    Wallet,
    Sparkles,
    ShieldCheck,
    Loader2,
    AlertCircle,
    PieChart,
    ArrowUpRight
} from "lucide-react";
import {
    getExpenses,
    getAIInsights
} from "../services/ExpenseService";

function AIAdvisor() {

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expenses, setExpenses] = useState([]);


    useEffect(() => {

        fetchExpenses();

        const cached = localStorage.getItem("aiInsights");

        if (cached) {
            setAnalysis(JSON.parse(cached));
            setLoading(false);
        } else {
            fetchAnalysis();
        }

    }, []);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);

            const res = await getAIInsights();

            console.log(res.data);

            setAnalysis(res.data);
            localStorage.setItem(
                "aiInsights",
                JSON.stringify(res.data)
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Unable to load AI Insights."
            );

        } finally {
            setLoading(false);
        }
    };
    const fetchExpenses = async () => {
        try {
            const res = await getExpenses();

            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <div className="flex items-center gap-3 text-cyan-400">

                    <Loader2
                        className="animate-spin"
                        size={35}
                    />

                    <span className="text-xl font-semibold">
                        AI is analyzing your finances...
                    </span>

                </div>

            </div>

        );

    }

    if (error) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <div className="bg-red-500/10 border border-red-500 rounded-xl p-8 flex items-center gap-3">

                    <AlertCircle className="text-red-400" />

                    <span className="text-red-300 text-lg">
                        {error}
                    </span>

                </div>

            </div>

        );

    }

    const expenseTransactions = expenses.filter(
        expense => expense.type === "EXPENSE"
    );

    const categoryTotals = {};

    expenseTransactions.forEach(expense => {

        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0) +
            expense.amount;

    });

    const totalExpense = Object.values(categoryTotals).reduce(
        (sum, value) => sum + value,
        0
    );

    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);

    const highestExpense = sortedCategories[0];

    return (         <div className="min-h-screen bg-slate-950 text-white p-8">

        {/* Header */}

        <div className="rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 mb-8 shadow-2xl">

            <div className="flex items-center gap-4">

                <div className="bg-white/20 p-4 rounded-2xl">

                    <Sparkles size={35} />

                </div>

                <div>

                    <h1 className="text-4xl font-bold">
                        AI Financial Advisor
                    </h1>

                    <p className="text-blue-100 mt-2">
                        Personalized financial insights powered by AI
                    </p>

                </div>

            </div>

        </div>

        {/* Overview */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

            {/* Financial Health */}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-cyan-500 transition-all duration-300">

                <div className="flex justify-between">

                    <div>

                        <p className="text-gray-400 text-sm">
                            Financial Health
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {analysis?.healthScore}
                        </h2>

                        <p className="text-green-400 mt-2">
                            Excellent Score
                        </p>

                    </div>

                    <HeartPulse
                        className="text-cyan-400"
                        size={42}
                    />

                </div>

            </div>

            {/* Savings */}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-green-500 transition-all duration-300">

                <div className="flex justify-between">

                    <div>

                        <p className="text-gray-400 text-sm">
                            Savings Rate
                        </p>

                        <h2 className="text-4xl font-bold mt-3">
                            {analysis?.savingsRate}%
                        </h2>

                        <p className="text-green-400 mt-2">
                            Healthy Saving Habit
                        </p>

                    </div>

                    <TrendingUp
                        className="text-green-400"
                        size={42}
                    />

                </div>

            </div>

            {/* Financial Status */}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-purple-500 transition-all duration-300">

                <div className="flex justify-between">

                    <div>

                        <p className="text-gray-400 text-sm">
                            Financial Status
                        </p>

                        <h2 className="text-2xl font-bold mt-3">
                            {analysis?.financialStatus}
                        </h2>

                        <p className="text-purple-400 mt-3">
                            AI Evaluation
                        </p>

                    </div>

                    <ShieldCheck
                        className="text-purple-400"
                        size={42}
                    />

                </div>

            </div>

            {/* Top Spending */}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-orange-500 transition-all duration-300">

                <div className="flex justify-between">

                    <div>

                        <p className="text-gray-400 text-sm">
                            Highest Spending
                        </p>

                        <h2 className="text-2xl font-bold mt-3">
                            {analysis?.topSpendingCategory}
                        </h2>

                        <p className="text-orange-400 mt-3">
                            Needs Attention
                        </p>

                    </div>

                    <Wallet
                        className="text-orange-400"
                        size={42}
                    />

                </div>

            </div>

        </div>

        {/* PART 2 starts below */}
        {/* Spending Breakdown */}

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <div className="flex items-center gap-3 mb-8">

                <PieChart
                    size={28}
                    className="text-cyan-400"
                />

                <h2 className="text-2xl font-bold">
                    Spending Breakdown
                </h2>

            </div>

            <div className="space-y-6">

                {
                    sortedCategories.length > 0 ? (

                        sortedCategories.map(([category, amount]) => {

                            const percentage =
                                totalExpense === 0
                                    ? 0
                                    : ((amount / totalExpense) * 100).toFixed(1);

                            return (

                                <div key={category}>

                                    <div className="flex justify-between mb-2">

                                        <div>

                                            <h3 className="font-semibold">
                                                {category}
                                            </h3>

                                            <p className="text-gray-400 text-sm">
                                                {percentage}% of total expenses
                                            </p>

                                        </div>

                                        <div>

                                            <p className="font-bold">
                                                ₹{amount.toLocaleString()}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="w-full h-3 bg-slate-700 rounded-full">

                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        })

                    ) : (

                        <p className="text-gray-400">
                            No expense data available.
                        </p>

                    )
                }

            </div>

        </div>

        {/* Highest Expense + Alert */}

        <div className="grid lg:grid-cols-2 gap-6 mt-10">

            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">

                <div className="flex items-center gap-3 mb-5">

                    <Wallet
                        className="text-orange-400"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold">
                        Highest Expense
                    </h2>

                </div>

                {
                    highestExpense ? (

                        <>

                            <h1 className="text-4xl font-bold">

                                {highestExpense[0]}

                            </h1>

                            <p className="text-orange-400 text-xl mt-3">

                                ₹{highestExpense[1].toLocaleString()}

                            </p>

                        </>

                    ) : (

                        <p className="text-gray-400">

                            No expenses available.

                        </p>

                    )
                }

            </div>

            <div className="bg-slate-900 rounded-3xl border border-red-500/30 p-8">

                <div className="flex items-center gap-3 mb-5">

                    <AlertCircle
                        className="text-red-400"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold">
                        Spending Alert
                    </h2>

                </div>

                {
                    analysis.topSpendingCategory ? (

                        <p className="text-gray-300 leading-8">

                            Your highest spending is in

                            <span className="text-red-400 font-bold">
                                    {" "}{analysis.topSpendingCategory}
                                </span>

                            . Consider reducing expenses in this category to improve your savings.

                        </p>

                    ) : (

                        <p className="text-gray-400">

                            No alerts available.

                        </p>

                    )
                }

            </div>

        </div>

        {/* PART 3 starts below */}
            {/* AI Recommendations */}

            <div className="mt-10 bg-slate-900 border border-slate-800 rounded-3xl p-8">

                <div className="flex items-center gap-3 mb-6">

                    <Sparkles
                        className="text-cyan-400"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold">
                        AI Recommendations
                    </h2>

                </div>

                <div className="space-y-4">

                    {
                        analysis?.recommendations?.length > 0 ? (

                            analysis.recommendations.map((tip, index) => (

                                <div
                                    key={index}
                                    className="flex items-start gap-4 bg-slate-800 rounded-xl p-4"
                                >

                                    <ArrowUpRight
                                        className="text-cyan-400 mt-1"
                                        size={20}
                                    />

                                    <p className="text-gray-300">
                                        {tip}
                                    </p>

                                </div>

                            ))

                        ) : (

                            <p className="text-gray-400">
                                No AI recommendations available.
                            </p>

                        )
                    }

                </div>

            </div>

            {/* Smart Tips */}

            <div className="mt-10 grid md:grid-cols-3 gap-6">

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                        💰 Save More
                    </h3>

                    <p className="text-gray-400">
                        Try saving at least 20% of your monthly income for long-term financial stability.
                    </p>

                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

                    <h3 className="text-lg font-semibold text-green-400 mb-3">
                        📊 Track Expenses
                    </h3>

                    <p className="text-gray-400">
                        Review your spending every week to identify unnecessary expenses.
                    </p>

                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

                    <h3 className="text-lg font-semibold text-orange-400 mb-3">
                        🎯 Budget Goal
                    </h3>

                    <p className="text-gray-400">
                        Set category-wise budgets and monitor them regularly to improve your financial health.
                    </p>

                </div>

            </div>

        </div>

    );

}

export default AIAdvisor;

