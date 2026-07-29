import Card from "./Card";

function StatCard({
                      title,
                      value,
                      icon,
                      trend,
                      trendType = "positive",
                      valueColor = "text-white",
                  }) {
    const trendColor =
        trendType === "positive"
            ? "text-emerald-400"
            : "text-red-400";

    return (
        <Card className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-start justify-between">

                <div className="min-w-0">

                    <p className="text-sm font-medium text-zinc-400">
                        {title}
                    </p>

                    <h2 className={`mt-3 text-3xl font-bold ${valueColor}`}>
                        {value}
                    </h2>

                    {trend && (
                        <p className={`mt-3 text-sm font-medium ${trendColor}`}>
                            {trend}
                        </p>
                    )}

                </div>

                {icon && (
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-500/10
                            text-emerald-400
                        "
                    >
                        {icon}
                    </div>
                )}

            </div>

        </Card>
    );
}

export default StatCard;