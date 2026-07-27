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
                         editingId,
                         handleAddExpense,
                         handleUpdateExpense
                     }) {

    return (
        <>
            <h2>{editingId ? "Update Expense" : "Add Expense"}</h2>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br /><br />

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />

            <br /><br />

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <br /><br />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <br /><br />

            <button
                onClick={editingId ? handleUpdateExpense : handleAddExpense}
            >
                {editingId ? "Update Expense" : "Add Expense"}
            </button>
        </>
    );
}

export default ExpenseForm;