function AIInsightsCard({ insights }) {

    if (!insights) {

        return (

            <div className="mt-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-xl">

                <h2 className="text-2xl font-bold text-white">
                    🤖 AI Financial Insights
                </h2>

                <p className="mt-3 animate-pulse text-zinc-400">
                    Analyzing your financial behaviour...
                </p>

            </div>

        );

    }

    return (

        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 shadow-2xl">

            {/* Header */}

            <div className="border-b border-zinc-800 p-7">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-3xl font-bold text-white">

                            🤖 AI Financial Insights

                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">

                            Personalized insights powered by Gemini AI

                        </p>

                    </div>

                    <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                        LIVE

                    </div>

                </div>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">

                {/* Health */}

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">

                    <div className="mb-4 flex items-center justify-between">

                <span className="text-zinc-400">

                    ❤️ Health Score

                </span>

                        <span className="text-3xl font-bold text-emerald-400">

                    {insights.healthScore}/100

                </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

                        <div

                            className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-700"

                            style={{
                                width: `${insights.healthScore}%`
                            }}

                        />

                    </div>

                </div>

                {/* Savings */}

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">

                    <p className="text-zinc-400">

                        💰 Savings Rate

                    </p>

                    <h3 className="mt-3 text-4xl font-bold text-sky-400">

                        {Number(insights.savingsRate).toFixed(2)}%

                    </h3>

                </div>

                {/* Top Spending */}

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">

                    <p className="text-zinc-400">

                        🍔 Top Spending

                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-red-400">

                        {insights.topSpendingCategory}

                    </h3>

                </div>

                {/* Status */}

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">

                    <p className="mb-4 text-zinc-400">

                        🏆 Financial Status

                    </p>

                    <span

                        className={`inline-flex rounded-full px-5 py-2 font-semibold

                ${
                            insights.financialStatus === "Excellent"

                                ? "bg-emerald-500/15 text-emerald-400"

                                : insights.financialStatus === "Good"

                                    ? "bg-blue-500/15 text-blue-400"

                                    : insights.financialStatus === "Average"

                                        ? "bg-yellow-500/15 text-yellow-400"

                                        : "bg-red-500/15 text-red-400"

                        }`}

                    >

                {insights.financialStatus}

            </span>

                </div>

            </div>

            {/* Recommendations */}

            <div className="border-t border-zinc-800 p-7">

                <h3 className="mb-5 text-2xl font-bold text-white">

                    📌 Smart Recommendations

                </h3>

                <div className="space-y-4">

                    {insights.recommendations.map((item, index) => (

                        <div

                            key={index}

                            className="
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900/60
                    p-5
                    transition
                    duration-300
                    hover:border-emerald-500/40
                    hover:bg-zinc-900
                "

                        >

                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">

                                ✓

                            </div>

                            <p className="leading-7 text-zinc-300">

                                {item}

                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default AIInsightsCard;