import Card from "./Card";

function StatCard({
    title,
    value,
    icon,
    trend,
    trendType = "positive",
    valueColor = "text-white",
}) {
    const isNegative = trendType === "negative" || valueColor.includes("rose") || valueColor.includes("red");
    const isSavings = title.toLowerCase().includes("savings") || title.toLowerCase().includes("net");
    const isTransactions = title.toLowerCase().includes("transactions");

    let iconBoxStyle = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    let trendColor = "text-emerald-400";

    if (isNegative) {
        iconBoxStyle = "bg-rose-500/15 text-rose-400 border border-rose-500/30";
        trendColor = "text-rose-400";
    } else if (isSavings) {
        iconBoxStyle = "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30";
        trendColor = isNegative ? "text-rose-400" : "text-cyan-400";
    } else if (isTransactions) {
        iconBoxStyle = "bg-sky-500/15 text-sky-400 border border-sky-500/30";
        trendColor = "text-sky-400";
    }

    return (
        <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60 bg-zinc-900/70 backdrop-blur-md">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {title}
                    </p>

                    <h2 className={`mt-3 text-3xl font-extrabold font-mono tracking-tight tabular-nums ${valueColor}`}>
                        {value}
                    </h2>

                    {trend && (
                        <p className={`mt-2.5 text-xs font-semibold flex items-center gap-1.5 ${trendColor}`}>
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                            {trend}
                        </p>
                    )}
                </div>

                {icon && (
                    <div
                        className={`
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            shadow-md
                            transition-transform
                            duration-300
                            group-hover:scale-105
                            ${iconBoxStyle}
                        `}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}

export default StatCard;
