import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseForm from "../components/ExpenseForm";
import StatCard from "../components/ui/StatCard.jsx";
import AIInsightsCard from "../components/AIInsightsCard";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getDashboardSummary,
    getAIInsights
} from "../services/ExpenseService.js";

function Dashboard() {

    // Expense List
    const [expenses, setExpenses] = useState([]);

    // Dashboard Summary
    const [dashboard, setDashboard] = useState({
        totalIncome: 0,
        totalExpense: 0,
        savings: 0,
        totalTransactions: 0
    });

    const [editingId, setEditingId] = useState(null);

    // Form States
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [aiInsights, setAIInsights] = useState(null);

    // Fetch Expenses
    const fetchExpenses = async () => {
        try {
            const response = await getExpenses();
            setExpenses(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchAIInsights = async () => {

        try {

            const response = await getAIInsights();

            console.log(response.data);

            setAIInsights(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    // Fetch Dashboard Summary
    const fetchDashboard = async () => {
        try {
            const response = await getDashboardSummary();
            setDashboard(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        fetchExpenses();
        fetchDashboard();
        fetchAIInsights();

    }, []);

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
                description,
                type
            });

            alert("Transaction Added Successfully");

            setTitle("");
            setAmount("");
            setCategory("");
            setDate("");
            setDescription("");
            setType("EXPENSE");

            fetchExpenses();
            fetchDashboard();
            fetchAIInsights();

        } catch (error) {

            console.log(error);
            alert("Failed To Add Transaction");

        }
    };

    const handleEdit = (expense) => {

        setEditingId(expense.id);

        setTitle(expense.title || "");
        setAmount(expense.amount ?? "");
        setCategory(expense.category || "");
        setDate(expense.date || "");
        setDescription(expense.description || "");
        setType(expense.type || "EXPENSE");
    };

    const handleUpdateExpense = async () => {

        try {

            await updateExpense(editingId, {
                title,
                amount,
                category,
                date,
                description,
                type
            });

            alert("Transaction Updated Successfully");

            setEditingId(null);

            setTitle("");
            setAmount("");
            setCategory("");
            setDate("");
            setDescription("");
            setType("EXPENSE");

            fetchExpenses();
            fetchDashboard();
            fetchAIInsights();

        } catch (error) {

            console.log(error);
            alert("Failed To Update Transaction");

        }
    };

    const handleDelete = async (id) => {

        try {

            await deleteExpense(id);

            alert("Transaction Deleted Successfully");

            fetchExpenses();
            fetchDashboard();
            fetchAIInsights();

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div className="space-y-10">

            {/* Hero */}

            <div
                className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl">

                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"></div>

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">

                            FinPilot AI

                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-white">

                            Welcome Back 👋

                        </h1>

                        <p className="mt-3 max-w-xl text-zinc-400">

                            Track every transaction, analyze your spending,
                            and receive AI-powered financial recommendations.

                        </p>

                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 px-8 py-6">

                        <p className="text-sm text-zinc-400">

                            Total Transactions

                        </p>

                        <h2 className="mt-2 text-5xl font-bold text-white">

                            {dashboard.totalTransactions}

                        </h2>

                    </div>

                </div>

            </div>

            {/* Summary */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Net Worth"
                    value={`₹${dashboard.savings.toLocaleString("en-IN")}`}
                    valueColor="text-white"
                />

                <StatCard
                    title="Income"
                    value={`₹${dashboard.totalIncome.toLocaleString("en-IN")}`}
                    valueColor="text-emerald-400"
                />

                <StatCard
                    title="Expenses"
                    value={`₹${dashboard.totalExpense.toLocaleString("en-IN")}`}
                    valueColor="text-red-400"
                />

                <StatCard
                    title="Savings"
                    value={`₹${dashboard.savings.toLocaleString("en-IN")}`}
                    valueColor={
                        dashboard.savings >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                    }
                />

            </div>
            {/* Main Content */}

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

                {/* Left */}

                <div className="xl:sticky xl:top-24 xl:self-start">

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
                        type={type}
                        setType={setType}
                        editingId={editingId}
                        handleAddExpense={handleAddExpense}
                        handleUpdateExpense={handleUpdateExpense}
                    />

                </div>

                {/* Right */}

                <div className="space-y-8 xl:col-span-2">

                    <SectionTitle
                        title="Recent Transactions"
                        subtitle="Latest activity from your account."
                    />

                    {expenses.length === 0 ? (

                        <div className="rounded-2xl border border-dashed border-zinc-700 py-16 text-center">

                            <p className="text-zinc-500">

                                No transactions found.

                            </p>

                        </div>

                    ) : (

                        <>

                            {expenses
                                .slice(0, 5)
                                .map((expense) => (

                                    <ExpenseCard
                                        key={expense.id}
                                        expense={expense}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                    />

                                ))}

                            <div className="flex justify-end">

                                <Button className="w-auto rounded-xl px-7 py-3">

                                    View All Transactions →

                                </Button>

                            </div>

                        </>

                    )}

                </div>

            </div>

            {/* AI Section */}

            <AIInsightsCard insights={aiInsights}/>

        </div>

    );
}

export default Dashboard;