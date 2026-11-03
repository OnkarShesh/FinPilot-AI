import { PlusCircle, Edit3, X, IndianRupee, Tag, Calendar, FileText } from "lucide-react";

function ExpenseForm({
    title,
    setTitle,
    amount,
    setAmount,
    category,
    setCategory,
    date,
    setDate,
    description,
    setDescription,
    type,
    setType,
    editingId,
    handleAddExpense,
    handleUpdateExpense,
    clearForm,
}) {
    const isIncome = type === "INCOME";

    const expenseCategories = [
        "Food",
        "Rent",
        "Bills",
        "Shopping",
        "Travel",
        "Entertainment",
        "Health",
        "Other"
    ];

    const incomeCategories = [
        "Salary",
        "Freelance",
        "Investment",
        "Business",
        "Bonus",
        "Other"
    ];

    const currentCategories = isIncome ? incomeCategories : expenseCategories;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            handleUpdateExpense();
        } else {
            handleAddExpense();
        }
    };

    return (
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-4 sm:p-6 shadow-2xl backdrop-blur-sm flex flex-col justify-between h-full min-w-0 w-full">
            <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-800/80">
                    <div>
                        <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                            FinPilot Entry
                        </span>
                        <h2 className="mt-1 text-base sm:text-lg lg:text-xl font-bold text-white">
                            {editingId ? "Edit Transaction" : "Quick Add Transaction"}
                        </h2>
                    </div>
                    {clearForm && (
                        <button
                            type="button"
                            onClick={clearForm}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition px-2.5 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 cursor-pointer active:scale-95"
                        >
                            <X size={14} /> {editingId ? "Cancel" : "Clear"}
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                    {/* Segmented Type Switcher */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950/80 rounded-2xl border border-zinc-800">
                        <button
                            type="button"
                            onClick={() => {
                                setType("EXPENSE");
                                if (isIncome && !expenseCategories.includes(category)) setCategory("");
                            }}
                            className={`flex items-center justify-center gap-1.5 py-2.5 min-h-[40px] rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                                !isIncome
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            <span>💸</span> Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setType("INCOME");
                                if (!isIncome && !incomeCategories.includes(category)) setCategory("");
                            }}
                            className={`flex items-center justify-center gap-1.5 py-2.5 min-h-[40px] rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                                isIncome
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            <span>💰</span> Income
                        </button>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                            Title / Note
                        </label>
                        <input
                            type="text"
                            placeholder={isIncome ? "e.g. Monthly Salary, Freelance project" : "e.g. Grocery, Rent, Coffee"}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-3.5 py-2.5 text-base sm:text-sm text-white placeholder:text-zinc-500 outline-none transition hover:border-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Amount & Date Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                Amount (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">₹</span>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 pl-7 pr-3 py-2.5 text-base sm:text-sm font-bold font-mono text-white placeholder:text-zinc-500 outline-none transition hover:border-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 tabular-nums"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-3 py-2.5 text-base sm:text-sm text-white outline-none transition hover:border-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Category Preset Pills */}
                    <div>
                        <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                            Category
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {currentCategories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 text-xs rounded-xl font-medium transition cursor-pointer border min-h-[34px] flex items-center justify-center active:scale-95 ${
                                        category === cat
                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm"
                                            : "bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:border-zinc-600 hover:text-white"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description (Optional) */}
                    <div>
                        <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="Additional details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-3.5 py-2 text-base sm:text-xs text-white placeholder:text-zinc-500 outline-none transition hover:border-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full mt-2 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-lg active:scale-[0.98] active:brightness-95 ${
                            isIncome
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20"
                                : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-500/20"
                        }`}
                    >
                        {editingId ? (
                            <>
                                <Edit3 size={15} /> Save Changes
                            </>
                        ) : (
                            <>
                                <PlusCircle size={15} /> {isIncome ? "Record Income" : "Add Expense"}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ExpenseForm;
