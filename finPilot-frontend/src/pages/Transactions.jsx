import { useEffect, useMemo, useState } from "react";

import SectionTitle from "../components/ui/SectionTitle";
import ExpenseCard from "../components/ExpenseCard";
import Button from "../components/ui/Button";

import {
    getExpenses,
    deleteExpense
} from "../services/ExpenseService";

function Transactions() {

    const [expenses, setExpenses] = useState([]);

    const [search, setSearch] = useState("");

    const [typeFilter, setTypeFilter] = useState("ALL");

    const [sortBy, setSortBy] = useState("NEWEST");

    const fetchExpenses = async () => {

        try {

            const response = await getExpenses();

            setExpenses(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchExpenses();

    }, []);

    const handleDelete = async (id) => {

        try {

            await deleteExpense(id);

            fetchExpenses();

        } catch (error) {

            console.log(error);

        }

    };

    const filteredExpenses = useMemo(() => {

        let data = [...expenses];

        // Search

        data = data.filter((expense) =>

            expense.title
                .toLowerCase()
                .includes(search.toLowerCase())

        );

        // Type Filter

        if (typeFilter !== "ALL") {

            data = data.filter(

                (expense) => expense.type === typeFilter

            );

        }

        // Sorting

        switch (sortBy) {

            case "NEWEST":

                data.sort(

                    (a, b) =>

                        new Date(b.date) - new Date(a.date)

                );

                break;

            case "OLDEST":

                data.sort(

                    (a, b) =>

                        new Date(a.date) - new Date(b.date)

                );

                break;

            case "HIGH":

                data.sort(

                    (a, b) => b.amount - a.amount

                );

                break;

            case "LOW":

                data.sort(

                    (a, b) => a.amount - b.amount

                );

                break;

            default:

                break;

        }

        return data;

    }, [expenses, search, typeFilter, sortBy]);

    return (

        <div className="space-y-8">

            <SectionTitle

                title="Transactions"

                subtitle="Manage every income and expense from one place."

            />

            {/* Summary */}

            <div className="grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                    <p className="text-zinc-400">

                        Total Transactions

                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-white">

                        {expenses.length}

                    </h2>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                    <p className="text-zinc-400">

                        Income

                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-emerald-400">

                        {

                            expenses.filter(

                                e => e.type === "INCOME"

                            ).length

                        }

                    </h2>

                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                    <p className="text-zinc-400">

                        Expenses

                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-red-400">

                        {

                            expenses.filter(

                                e => e.type === "EXPENSE"

                            ).length

                        }

                    </h2>

                </div>

            </div>
            {/* Search & Filters */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

                <div className="grid gap-5 lg:grid-cols-3">

                    {/* Search */}

                    <input
                        type="text"
                        placeholder="🔍 Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-950
                            px-5
                            py-3
                            text-white
                            outline-none
                            transition
                            focus:border-emerald-500
                        "
                    />

                    {/* Type */}

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-950
                            px-5
                            py-3
                            text-white
                            outline-none
                            focus:border-emerald-500
                        "
                    >

                        <option value="ALL">All Transactions</option>

                        <option value="INCOME">Income</option>

                        <option value="EXPENSE">Expense</option>

                    </select>

                    {/* Sort */}

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-950
                            px-5
                            py-3
                            text-white
                            outline-none
                            focus:border-emerald-500
                        "
                    >

                        <option value="NEWEST">
                            Newest First
                        </option>

                        <option value="OLDEST">
                            Oldest First
                        </option>

                        <option value="HIGH">
                            Highest Amount
                        </option>

                        <option value="LOW">
                            Lowest Amount
                        </option>

                    </select>

                </div>

            </div>

            {/* Transaction List */}

            <div className="space-y-5">

                {filteredExpenses.length === 0 ? (

                    <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 py-20 text-center">

                        <h2 className="text-2xl font-bold text-white">

                            No Transactions Found

                        </h2>

                        <p className="mt-3 text-zinc-500">

                            Try changing the search or filter.

                        </p>

                    </div>

                ) : (

                    filteredExpenses.map((expense) => (

                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            handleDelete={handleDelete}

                            handleEdit={() => {}}
                        />

                    ))

                )}

            </div>

            {/* Footer */}

            <div className="flex items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

                <div>

                    <h3 className="text-lg font-semibold text-white">

                        Showing {filteredExpenses.length} of {expenses.length}

                    </h3>

                    <p className="text-sm text-zinc-500">

                        All your financial records in one place.

                    </p>

                </div>

                <Button className="w-auto px-6">

                    + Add Transaction

                </Button>

            </div>

        </div>

    );

}

export default Transactions;