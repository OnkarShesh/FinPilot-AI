import { Edit2, Trash2, Calendar, Tag, Check, Loader2 } from "lucide-react";

function ExpenseCard({ 
    expense, 
    handleEdit, 
    handleDelete, 
    isSelected = false, 
    onToggleSelect = null,
    isDeleting = false 
}) {
    const formattedDate = new Date(expense.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const isIncome = expense.type === "INCOME";
    const amountVal = Number(expense.amount || 0);

    return (
        <div
            onClick={() => onToggleSelect && onToggleSelect(expense.id)}
            className={`group relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-lg transition-all duration-200 backdrop-blur-sm min-w-0 w-full ${
                onToggleSelect ? "cursor-pointer" : ""
            } ${
                isSelected
                    ? "border-emerald-500/70 bg-emerald-950/25 ring-1 ring-emerald-500/40"
                    : isIncome
                    ? "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900/90 hover:border-l-4 hover:border-l-emerald-400"
                    : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900/90 hover:border-l-4 hover:border-l-rose-400"
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
                {/* Left Info */}
                <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                    {/* Select Checkbox */}
                    {onToggleSelect && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSelect(expense.id);
                            }}
                            className={`mt-1 sm:mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                    ? "bg-emerald-500 border-emerald-400 text-black shadow-md shadow-emerald-500/20 scale-105"
                                    : "border-zinc-700 bg-zinc-950/80 hover:border-zinc-500 text-transparent"
                            }`}
                            aria-label="Select transaction"
                            role="checkbox"
                            aria-checked={isSelected}
                        >
                            <Check size={12} strokeWidth={3.5} className={isSelected ? "opacity-100" : "opacity-0"} />
                        </div>
                    )}

                    {/* Transaction Icon */}
                    <div
                        className={`mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl font-black text-xs sm:text-sm shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                            isIncome
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                    >
                        {isIncome ? "↓" : "↑"}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug truncate" title={expense.title}>
                            {expense.title}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                            <span className="rounded-md border border-zinc-700/80 bg-zinc-800/80 px-2 py-0.5 text-zinc-300 font-medium truncate max-w-[120px] sm:max-w-none">
                                {expense.category}
                            </span>
                            <span
                                className={`rounded-md px-1.5 sm:px-2 py-0.5 font-semibold text-[10px] sm:text-[11px] ${
                                    isIncome
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}
                            >
                                {isIncome ? "Income" : "Expense"}
                            </span>
                            <span className="text-zinc-500 flex items-center gap-1 text-[10px] sm:text-[11px] shrink-0">
                                <Calendar size={11} /> {formattedDate}
                            </span>
                        </div>
                        {expense.description && (
                            <p className="mt-1 text-xs text-zinc-400 leading-relaxed max-w-md truncate">
                                {expense.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-zinc-800/80 pt-2.5 sm:pt-0 shrink-0">
                    <span
                        className={`text-sm sm:text-lg md:text-xl font-extrabold font-mono tracking-tight tabular-nums whitespace-nowrap ${
                            isIncome ? "text-emerald-400" : "text-rose-400"
                        }`}
                    >
                        {isIncome ? "+" : "-"}₹{amountVal.toLocaleString("en-IN")}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                        {handleEdit && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(expense);
                                }}
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
                                disabled={isDeleting}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(expense.id);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-90 transition-all cursor-pointer disabled:opacity-50"
                                title="Delete transaction"
                                aria-label="Delete transaction"
                            >
                                {isDeleting ? (
                                    <Loader2 size={13} className="animate-spin text-rose-400" />
                                ) : (
                                    <Trash2 size={13} />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseCard;
