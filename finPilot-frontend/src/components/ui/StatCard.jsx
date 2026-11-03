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
        <Card className="group relative overflow-hidden p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60 bg-zinc-900/70 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 truncate">
                        {title}
                    </p>

                    <h2 className={`mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums truncate ${valueColor}`} title={typeof value === 'string' ? value : String(value)}>
                        {value}
                    </h2>

                    {trend && (
                        <p className={`mt-2 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 truncate ${trendColor}`}>
                            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" />
                            <span className="truncate">{trend}</span>
                        </p>
                    )}
                </div>

                {icon && (
                    <div
                        className={`
                            flex
                            h-10
                            w-10
                            sm:h-12
                            sm:w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            sm:rounded-2xl
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
