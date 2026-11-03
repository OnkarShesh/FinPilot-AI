import { Edit2, Trash2, Calendar, Tag } from "lucide-react";

function ExpenseCard({ expense, handleEdit, handleDelete }) {
    const formattedDate = new Date(expense.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const isIncome = expense.type === "INCOME";
    const amountVal = Number(expense.amount || 0);

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 shadow-lg transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/90 backdrop-blur-sm ${
                isIncome
                    ? "hover:border-l-4 hover:border-l-emerald-400"
                    : "hover:border-l-4 hover:border-l-rose-400"
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                {/* Left Info */}
                <div className="flex items-start gap-3.5">
                    <div
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                            isIncome
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                    >
                        {isIncome ? "↓" : "↑"}
                    </div>
                    <div>
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                            {expense.title}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-md border border-zinc-700/80 bg-zinc-800/80 px-2 py-0.5 text-zinc-300 font-medium">
                                {expense.category}
                            </span>
                            <span
                                className={`rounded-md px-2 py-0.5 font-semibold text-[11px] ${
                                    isIncome
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                            >
                                {isIncome ? "Income" : "Expense"}
                            </span>
                            <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                                <Calendar size={12} /> {formattedDate}
                            </span>
                        </div>
                        {expense.description && (
                            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed max-w-md">
                                {expense.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-zinc-800/80 pt-2.5 sm:pt-0">
                    <span
                        className={`text-lg sm:text-xl font-extrabold font-mono tracking-tight tabular-nums ${
                            isIncome ? "text-emerald-400" : "text-rose-400"
                        }`}
                    >
                        {isIncome ? "+" : "-"}₹{amountVal.toLocaleString("en-IN")}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                        {handleEdit && (
                            <button
                                type="button"
                                onClick={() => handleEdit(expense)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 active:scale-90 transition-all cursor-pointer"
                                title="Edit transaction"
                                aria-label="Edit transaction"
                            >
                                <Edit2 size={13} />
                            </button>
                        )}
                        {handleDelete && (
                            <button
                                type="button"
                                onClick={() => handleDelete(expense.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-90 transition-all cursor-pointer"
                                title="Delete transaction"
                                aria-label="Delete transaction"
                            >
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseCard;
