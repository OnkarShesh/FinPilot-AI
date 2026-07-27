function ExpenseCard({ expense, handleEdit, handleDelete }) {
    return (
        <div
            style={{
                border: "1px solid gray",
                padding: "10px",
                marginBottom: "10px"
            }}
        >
            <h3>{expense.title}</h3>

            <p><b>Amount:</b> ₹ {expense.amount}</p>

            <p><b>Category:</b> {expense.category}</p>

            <p><b>Date:</b> {expense.date}</p>

            <p><b>Description:</b> {expense.description}</p>

            <button onClick={() => handleEdit(expense)}>
                Edit
            </button>

            <button onClick={() => handleDelete(expense.id)}>
                Delete
            </button>
        </div>
    );
}

export default ExpenseCard;