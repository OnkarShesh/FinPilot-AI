import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseForm from "../components/ExpenseForm";
import StatCard from "../components/ui/StatCard";
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
} from "../services/ExpenseService";

function Dashboard() {

    const [expenses, setExpenses] = useState([]);

    const [dashboard, setDashboard] = useState({
        totalIncome: 0,
        totalExpense: 0,
        savings: 0,
        totalTransactions: 0,
    });

    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("EXPENSE");

    const [aiInsights, setAIInsights] = useState(null);

    const fetchExpenses = async () => {
        try {
            const response = await getExpenses();
            setExpenses(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchDashboard = async () => {
        try {
            const response = await getDashboardSummary();
            setDashboard(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAIInsights = async () => {

        try {

            const response = await getAIInsights();

            setAIInsights(response.data);

            localStorage.setItem(
                "aiInsights",
                JSON.stringify(response.data)
            );

        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);

            setAIInsights({
                error: true,
                message:
                    error.response?.data?.detail ||
                    "Unable to load AI Insights."
            });

        }

    };

    useEffect(() => {
        fetchExpenses();
        fetchDashboard();

        const cached = localStorage.getItem("aiInsights");

        if (cached) {
            setAIInsights(JSON.parse(cached));
        } else {
            fetchAIInsights();   
        }

    }, []);

    const clearForm = () => {
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");
        setDescription("");
        setType("EXPENSE");
        setEditingId(null);
    };

    const refreshDashboard = () => {
        fetchExpenses();
        fetchDashboard();
    };

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
                type,
            });

            clearForm();
            refreshDashboard();
            fetchAIInsights();

            alert("Transaction Added Successfully");

        } catch (err) {
            console.log(err);
            alert("Failed To Add Transaction");
        }

    };

    const handleEdit = (expense) => {

        setEditingId(expense.id);

        setTitle(expense.title);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDate(expense.date);
        setDescription(expense.description || "");
        setType(expense.type);

    };
    const handleUpdateExpense = async () => {

        try {

            await updateExpense(editingId, {
                title,
                amount,
                category,
                date,
                description,
                type,
            });

            clearForm();
            refreshDashboard();
            fetchAIInsights();

            alert("Transaction Updated Successfully");

        } catch (err) {

            console.log(err);
            alert("Failed To Update Transaction");

        }

    };

    const handleDelete = async (id) => {

        try {

            await deleteExpense(id);

            refreshDashboard();
            fetchAIInsights();

            alert("Transaction Deleted Successfully");

        } catch (err) {

            console.log(err);
            alert("Failed To Delete Transaction");

        }

    };
    console.log("AI Insights State:", aiInsights);

    return (

        <div className="space-y-10">

            {/* Hero */}

            <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-8 shadow-2xl">

                <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"></div>

                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl"></div>

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                    <div className="max-w-2xl">

                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">

                            FinPilot AI

                        </span>

                        <h1 className="mt-5 text-4xl font-bold text-white">

                            Welcome Back 👋

                        </h1>

                        <p className="mt-4 text-zinc-400 leading-7">

                            Track every transaction, monitor your financial health,
                            visualize spending trends and receive AI-powered
                            recommendations to improve your savings.

                        </p>

                    </div>

                    <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/80 p-7 backdrop-blur">

                        <p className="text-sm text-zinc-500">

                            Total Transactions

                        </p>

                        <h2 className="mt-3 text-5xl font-bold text-white">

                            {dashboard.totalTransactions}

                        </h2>

                        <div className="mt-6 grid grid-cols-2 gap-4">

                            <div>

                                <p className="text-xs text-zinc-500">

                                    Income

                                </p>

                                <p className="mt-1 font-semibold text-emerald-400">

                                    ₹{dashboard.totalIncome.toLocaleString("en-IN")}

                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-zinc-500">

                                    Expense

                                </p>

                                <p className="mt-1 font-semibold text-red-400">

                                    ₹{dashboard.totalExpense.toLocaleString("en-IN")}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Summary Cards */}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

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

            {/* AI Insights */}

            <div>

                <SectionTitle
                    title="AI Financial Insights"
                    subtitle="Smart recommendations based on your spending."
                />

                <div className="mt-5">
                    <AIInsightsCard insights={aiInsights} />
                </div>

            </div>

            {/* Bottom Section */}

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

                {/* Transactions */}

                <div className="space-y-6 xl:col-span-2">

                    <SectionTitle
                        title="Recent Transactions"
                        subtitle="Latest 5 transactions from your account."
                    />

                    {expenses.length === 0 ? (

                        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 py-20 text-center">

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

                {/* Expense Form */}

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

            </div>

        </div>

    );

}

export default Dashboard;