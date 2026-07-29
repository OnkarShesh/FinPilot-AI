function ExpenseCard({ expense, handleEdit, handleDelete }) {

    const formattedDate = new Date(expense.date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );

    const isIncome = expense.type === "INCOME";

    return (

        <div
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-zinc-800
                bg-gradient-to-br
                from-zinc-900
                via-zinc-900
                to-zinc-950
                p-6
                shadow-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-emerald-500/40
                hover:shadow-emerald-500/10
            "
        >

            {/* Glow */}

            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            {/* Top */}

            <div className="relative flex items-start justify-between">

                <div>

                    <h3 className="text-xl font-bold text-white">

                        {expense.title}

                    </h3>

                    <div className="mt-3 flex items-center gap-2">

                        <span
                            className="
                                rounded-full
                                border
                                border-zinc-700
                                bg-zinc-800
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-zinc-300
                            "
                        >
                            {expense.category}
                        </span>

                        <span
                            className={`
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-semibold

                                ${
                                isIncome
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : "bg-red-500/15 text-red-400"
                            }
                            `}
                        >

                            {isIncome ? "Income" : "Expense"}

                        </span>

                    </div>

                </div>

                <div className="text-right">

                    <p className="text-xs uppercase tracking-widest text-zinc-500">

                        Amount

                    </p>

                    <h2
                        className={`
                            mt-2
                            text-3xl
                            font-bold

                            ${
                            isIncome
                                ? "text-emerald-400"
                                : "text-red-400"
                        }
                        `}
                    >

                        {isIncome ? "+" : "-"}₹{expense.amount}

                    </h2>

                </div>

            </div>

            {/* Description */}

            <div className="relative mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">

                <p className="text-sm leading-7 text-zinc-400">

                    {expense.description || "No description added."}

                </p>

            </div>

            {/* Footer */}

            <div className="relative mt-6 flex items-center justify-between border-t border-zinc-800 pt-5">

                <div>

                    <p className="text-xs uppercase tracking-widest text-zinc-500">

                        Date

                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-300">

                        {formattedDate}

                    </p>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => handleEdit(expense)}
                        className="
                            rounded-xl
                            border
                            border-blue-500/20
                            bg-blue-500/10
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-blue-400
                            transition
                            hover:bg-blue-500/20
                        "
                    >

                        ✏️ Edit

                    </button>

                    <button
                        onClick={() => handleDelete(expense.id)}
                        className="
                            rounded-xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-red-400
                            transition
                            hover:bg-red-500/20
                        "
                    >

                        🗑 Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ExpenseCard;