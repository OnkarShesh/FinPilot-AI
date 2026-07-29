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
}) {

    return (

        <div className="
            rounded-3xl
            border
            border-zinc-800
            bg-gradient-to-b
            from-zinc-900
            to-zinc-950
            p-7
            shadow-2xl
            lg:p-8
        ">

            {/* Heading */}

            <div className="mb-8">

                <div className="inline-flex rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400">

                    FINPILOT AI

                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">

                    {editingId
                        ? "Update Transaction"
                        : "Add New Transaction"}

                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">

                    Record every income and expense to keep your financial
                    insights accurate.

                </p>

            </div>

            {/* Title */}

            <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-zinc-300">

                    Transaction Title

                </label>

                <input
                    type="text"
                    placeholder="Netflix Subscription"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-zinc-700
                        bg-zinc-900
                        px-4
                        py-3.5
                        text-white
                        placeholder:text-zinc-500
                        outline-none
                        transition-all
                        duration-300
                        hover:border-zinc-500
                        focus:border-emerald-500
                        focus:ring-2
                        focus:ring-emerald-500/20
                    "
                />

            </div>

            {/* Amount + Category */}

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium text-zinc-300">

                        Amount

                    </label>

                    <input
                        type="number"
                        placeholder="₹ 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-900
                            px-4
                            py-3.5
                            text-white
                            placeholder:text-zinc-500
                            outline-none
                            transition-all
                            duration-300
                            hover:border-zinc-500
                            focus:border-emerald-500
                            focus:ring-2
                            focus:ring-emerald-500/20
                        "
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium text-zinc-300">

                        Category

                    </label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-900
                            px-4
                            py-3.5
                            text-white
                            outline-none
                            transition-all
                            duration-300
                            hover:border-zinc-500
                            focus:border-emerald-500
                            focus:ring-2
                            focus:ring-emerald-500/20
                        "
                    >

                        <option value="">Select Category</option>

                        <option value="Food">🍔 Food</option>
                        <option value="Travel">✈️ Travel</option>
                        <option value="Shopping">🛒 Shopping</option>
                        <option value="Bills">💡 Bills</option>
                        <option value="Entertainment">🎬 Entertainment</option>
                        <option value="Health">🏥 Health</option>
                        <option value="Salary">💰 Salary</option>
                        <option value="Other">📦 Other</option>

                    </select>

                </div>

            </div>

            {/* Transaction Type */}

            <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-zinc-300">

                    Transaction Type

                </label>

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="
                        w-full
                        rounded-2xl
                        border
                        border-zinc-700
                        bg-zinc-900
                        px-4
                        py-3.5
                        text-white
                        outline-none
                        transition-all
                        duration-300
                        hover:border-zinc-500
                        focus:border-emerald-500
                        focus:ring-2
                        focus:ring-emerald-500/20
                    "
                >

                    <option value="EXPENSE">
                        💸 Expense
                    </option>

                    <option value="INCOME">
                        💰 Income
                    </option>

                </select>

            </div>

            {/* Date */}

            <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Date
                </label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="
            w-full
            rounded-2xl
            border
            border-zinc-700
            bg-zinc-900
            px-4
            py-3.5
            text-white
            outline-none
            transition-all
            duration-300
            hover:border-zinc-500
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-500/20
        "
                />

            </div>

            {/* Description */}

            <div className="mb-8">

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Description
                </label>

                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some notes about this transaction..."
                    className="
            w-full
            resize-none
            rounded-2xl
            border
            border-zinc-700
            bg-zinc-900
            px-4
            py-3.5
            text-white
            placeholder:text-zinc-500
            outline-none
            transition-all
            duration-300
            hover:border-zinc-500
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-500/20
        "
                />

            </div>

            {/* Button */}

            <button
                onClick={
                    editingId
                        ? handleUpdateExpense
                        : handleAddExpense
                }
                className="
        group
        flex
        w-full
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-r
        from-emerald-500
        to-green-600
        px-6
        py-4
        text-base
        font-semibold
        text-white
        shadow-lg
        shadow-emerald-500/20
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-emerald-500/40
        active:scale-95
    "
            >

                {editingId
                    ? "✓ Update Transaction"
                    : "+ Add Transaction"}

            </button>

            <div className="mt-6 border-t border-zinc-800 pt-5">

                <p className="text-center text-xs text-zinc-500">

                    Your transactions are securely stored and used to generate
                    AI-powered financial insights.

                </p>

            </div>

        </div>

    );

}

export default ExpenseForm;