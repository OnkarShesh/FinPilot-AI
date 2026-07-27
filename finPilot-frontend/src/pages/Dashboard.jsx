import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense
} from "../services/expenseService";
import ExpenseForm from "../components/ExpenseForm";

function Dashboard() {

    // Expense List
    const [expenses, setExpenses] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Form States
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    // Fetch All Expenses
    const fetchExpenses = async () => {

        try {

            const response = await getExpenses();

            console.log(response.data);
            setExpenses(response.data);

        } catch (error) {

            console.log(error);

        }
    };
    const handleDelete = async (id) => {

        try {

            await deleteExpense(id);

            alert("Expense Deleted Successfully");

            fetchExpenses();

        } catch (error) {

            console.log(error);

        }
    };

    // Load Expenses on Dashboard Open
    useEffect(() => {
        fetchExpenses();
    }, []);

    // Add Expense
    const handleAddExpense = async () => {
        if (!title || !amount || !category || !date) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await addExpense({
                title,
                amount,
                category,
                date,
                description
            });

            alert("Expense Added Successfully");

            // Clear Form
            setTitle("");
            setAmount("");
            setCategory("");
            setDate("");
            setDescription("");

            // Refresh Expense List
            fetchExpenses();

        } catch (error) {

            console.log(error);

            alert("Failed To Add Expense");

        }
    };
    const handleEdit = (expense) => {

        console.log(expense);
        setEditingId(expense.id);

        setTitle(expense.title || "");
        setAmount(expense.amount ?? "");
        setCategory(expense.category || "");
        setDate(expense.date || "");
        setDescription(expense.description || "");
    };
    const handleUpdateExpense = async () => {
        try {

            await updateExpense(editingId, {
                title,
                amount,
                category,
                date,
                description
            });

            alert("Expense Updated Successfully");

            setEditingId(null);

            setTitle("");
            setAmount("");
            setCategory("");
            setDate("");
            setDescription("");

            fetchExpenses();

        } catch (error) {

            console.log(error);

            alert("Failed To Update Expense");

        }
    };

    return (
        <>
            <h1>Dashboard</h1>
            <ExpenseForm
                title={title}
                setTitle={setTitle}
                amount={amount}
                setAmount={setAmount}
                category={category}
                setCategory={setCategory}
                date={date}
                setDate={setDate}
                description={description}
                setDescription={setDescription}
                editingId={editingId}
                handleAddExpense={handleAddExpense}
                handleUpdateExpense={handleUpdateExpense}
            />

            <h2>My Expenses</h2>

            {
                expenses.length === 0 ? (

                    <p>No Expenses Found</p>

                ) : (

                    expenses.map((expense) => (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))
                )
            }

        </>
    );
}

export default Dashboard;