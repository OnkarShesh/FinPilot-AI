import { Sparkles, HeartPulse, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

function AIInsightsCard({ insights }) {
    if (!insights) {
        return (
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-8 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Sparkles size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">AI Financial Insights</h2>
                        <p className="mt-1 text-sm text-zinc-400">Analyzing your transactions with Gemini AI...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (insights?.error) {
        return (
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-400 shrink-0" size={24} />
                    <div>
                        <h2 className="text-base font-semibold text-amber-300">AI Insights Temporarily Unavailable</h2>
                        <p className="mt-1 text-sm text-zinc-400">{insights.message || "Please try refreshing in a moment."}</p>
                    </div>
                </div>
            </div>
        );
    }

    const healthScore = Number(insights?.healthScore ?? 0);
    const savingsRate = Number(insights?.savingsRate || 0);
    const topSpending = insights?.topSpendingCategory || "None";
    const status = insights?.financialStatus || "Evaluating";
    const recommendations = Array.isArray(insights?.recommendations) ? insights.recommendations : [];

    const getScoreColor = (score) => {
        if (score >= 75) return "text-emerald-400";
        if (score >= 50) return "text-blue-400";
        if (score >= 30) return "text-amber-400";
        return "text-rose-400";
    };

    const getScoreBadge = (score) => {
        if (score >= 75) return { text: "Strong", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
        if (score >= 50) return { text: "Moderate", bg: "bg-blue-500/15 text-blue-400 border-blue-500/30" };
        if (score >= 30) return { text: "Needs Attention", bg: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
        return { text: "Critical / No Income", bg: "bg-rose-500/15 text-rose-400 border-rose-500/30" };
    };

    const scoreBadge = getScoreBadge(healthScore);

    return (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 shadow-2xl transition-all duration-300 min-w-0 w-full">
            {/* Header */}
            <div className="border-b border-zinc-800/80 p-4 sm:p-6 lg:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                            <Sparkles size={22} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white truncate">AI Financial Insights</h2>
                            <p className="mt-0.5 text-xs text-zinc-400 truncate">Powered by Google Gemini 3.5 Flash</p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-emerald-400 shrink-0">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        LIVE ENGINE
                    </div>
                </div>

                {/* Helpful Tip if user has 0 income and expenses */}
                {healthScore === 0 && topSpending !== "None" && (
                    <div className="mt-4 sm:mt-5 flex items-start gap-2.5 sm:gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 sm:p-4 text-xs text-amber-200">
                        <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="font-semibold text-amber-300">Notice: No Income Recorded</p>
                            <p className="mt-0.5 text-zinc-300 leading-relaxed">
                                You have expenses in <span className="font-bold text-white">{topSpending}</span>, but your total recorded income is <span className="font-bold text-white">₹0</span>. Add your monthly salary in the form below so Gemini AI can calculate your real savings rate and health score!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:p-6 lg:p-7">
                {/* Health Score */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 hover:border-zinc-700 transition min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">Health Score</span>
                        <HeartPulse className="text-emerald-400 shrink-0" size={20} />
                    </div>
                    <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
                        <span className={`text-3xl sm:text-4xl font-extrabold ${getScoreColor(healthScore)}`}>
                            {healthScore}
                        </span>
                        <span className="text-xs text-zinc-500">/ 100</span>
                    </div>
                    <div className="mt-2.5 sm:mt-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] sm:text-xs font-medium ${scoreBadge.bg}`}>
                            {scoreBadge.text}
                        </span>
                    </div>
                </div>

                {/* Savings Rate */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 hover:border-zinc-700 transition min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">Savings Rate</span>
                        <TrendingUp className="text-sky-400 shrink-0" size={20} />
                    </div>
                    <h3 className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl font-extrabold text-sky-400 font-mono truncate">
                        {savingsRate.toFixed(1)}%
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500 truncate">
                        {savingsRate >= 30 ? "Exceeds target (20%+)" : savingsRate > 0 ? "Below ideal target" : "Zero savings recorded"}
                    </p>
                </div>

                {/* Top Spending */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 hover:border-zinc-700 transition min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">Top Spending</span>
                        <AlertTriangle className="text-rose-400 shrink-0" size={20} />
                    </div>
                    <h3 className="mt-2.5 sm:mt-3 text-xl sm:text-2xl font-bold text-rose-400 truncate">
                        {topSpending}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500 truncate">Highest outflow category</p>
                </div>

                {/* Financial Status */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 hover:border-zinc-700 transition min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">Financial Status</span>
                        <ShieldCheck className="text-purple-400 shrink-0" size={20} />
                    </div>
                    <h3 className="mt-2.5 sm:mt-3 text-xl sm:text-2xl font-bold text-purple-300 truncate">
                        {status}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500 truncate">Evaluated by Gemini AI</p>
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="border-t border-zinc-800/80 p-4 sm:p-6 lg:p-7">
                    <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3 sm:mb-4">
                        💡 AI Actionable Recommendations
                    </h3>
                    <div className="grid gap-2.5 sm:gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {recommendations.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2.5 sm:gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3.5 sm:p-4 transition duration-200 hover:border-emerald-500/30 hover:bg-zinc-900/70 min-w-0"
                            >
                                <CheckCircle2 className="mt-0.5 text-emerald-400 shrink-0" size={17} />
                                <p className="text-xs text-zinc-300 leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AIInsightsCard;
