import { useEffect, useMemo, useState } from "react";

import SectionTitle from "../components/ui/SectionTitle";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import { getExpenses } from "../services/ExpenseService";

const COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316"
];

function Analytics() {

    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = async () => {

        try {

            const response = await getExpenses();

            setExpenses(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchExpenses();

    }, []);

    const analytics = useMemo(() => {

        const monthlyMap = {};

        const categoryMap = {};

        let income = 0;

        let expense = 0;

        expenses.forEach((item) => {

            const month = new Date(item.date).toLocaleString("default", {

                month: "short"

            });

            if (!monthlyMap[month]) {

                monthlyMap[month] = {

                    month,

                    income: 0,

                    expense: 0

                };

            }

            if (item.type === "INCOME") {

                income += item.amount;

                monthlyMap[month].income += item.amount;

            }

            else {

                expense += item.amount;

                monthlyMap[month].expense += item.amount;

            }

            if (item.type === "EXPENSE") {

                categoryMap[item.category] =

                    (categoryMap[item.category] || 0)

                    + item.amount;

            }

        });

        const monthlyData = Object.values(monthlyMap);

        const categoryData = Object.entries(categoryMap)

            .map(([name, value]) => ({

                name,

                value

            }))

            .sort((a, b) => b.value - a.value);

        const topCategory =

            categoryData.length > 0

                ? categoryData[0]

                : null;

        const averageExpense =

            expenses.length === 0

                ? 0

                : expense /

                expenses.filter(

                    e => e.type === "EXPENSE"

                ).length;

        return {

            monthlyData,

            categoryData,

            topCategory,

            income,

            expense,

            averageExpense

        };

    }, [expenses]);
    return (

        <div className="space-y-10">

            <SectionTitle
                title="Analytics"
                subtitle="Visualize your financial behaviour with powerful insights."
            />

            {/* Monthly Charts */}

            <div className="grid gap-8 xl:grid-cols-2">

                {/* Income vs Expense */}

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

                    <h2 className="mb-6 text-xl font-bold text-white">

                        📊 Monthly Income vs Expense

                    </h2>

                    <ResponsiveContainer width="100%" height={320}>

                        <BarChart data={analytics.monthlyData}>

                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>

                            <XAxis
                                dataKey="month"
                                stroke="#a1a1aa"
                            />

                            <YAxis stroke="#a1a1aa"/>

                            <Tooltip/>

                            <Legend/>

                            <Bar
                                dataKey="income"
                                fill="#10b981"
                                radius={[8,8,0,0]}
                            />

                            <Bar
                                dataKey="expense"
                                fill="#ef4444"
                                radius={[8,8,0,0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                {/* Spending Trend */}

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

                    <h2 className="mb-6 text-xl font-bold text-white">

                        📈 Spending Trend

                    </h2>

                    <ResponsiveContainer width="100%" height={320}>

                        <LineChart data={analytics.monthlyData}>

                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>

                            <XAxis
                                dataKey="month"
                                stroke="#a1a1aa"
                            />

                            <YAxis stroke="#a1a1aa"/>

                            <Tooltip/>

                            <Legend/>

                            <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="#3b82f6"
                                strokeWidth={4}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* Expense Distribution */}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

                <h2 className="mb-6 text-xl font-bold text-white">

                    🥧 Expense Category Distribution

                </h2>

                <ResponsiveContainer width="100%" height={380}>

                    <PieChart>

                        <Pie

                            data={analytics.categoryData}

                            dataKey="value"

                            nameKey="name"

                            outerRadius={130}

                            label

                        >

                            {

                                analytics.categoryData.map(

                                    (_, index)=>(

                                        <Cell

                                            key={index}

                                            fill={

                                                COLORS[
                                                index % COLORS.length
                                                    ]

                                            }

                                        />

                                    )

                                )

                            }

                        </Pie>

                        <Tooltip/>

                        <Legend/>

                    </PieChart>

                </ResponsiveContainer>

            </div>
            {/* Bottom Analytics */}

            <div className="grid gap-8 xl:grid-cols-2">

                {/* Top Categories */}

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

                    <h2 className="mb-6 text-xl font-bold text-white">

                        🏆 Top Spending Categories

                    </h2>

                    <div className="space-y-4">

                        {

                            analytics.categoryData.length === 0 ? (

                                <p className="text-zinc-500">

                                    No expense data available.

                                </p>

                            ) : (

                                analytics.categoryData
                                    .slice(0,5)
                                    .map((item,index)=>(

                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-emerald-500/30 transition"
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="h-4 w-4 rounded-full"
                                                    style={{
                                                        background:
                                                            COLORS[index % COLORS.length]
                                                    }}
                                                />

                                                <div>

                                                    <p className="font-semibold text-white">

                                                        {item.name}

                                                    </p>

                                                    <p className="text-sm text-zinc-500">

                                                        Rank #{index+1}

                                                    </p>

                                                </div>

                                            </div>

                                            <span className="font-bold text-red-400">

                                        ₹{item.value.toLocaleString("en-IN")}

                                    </span>

                                        </div>

                                    ))

                            )

                        }

                    </div>

                </div>

                {/* Financial Insights */}

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

                    <h2 className="mb-6 text-xl font-bold text-white">

                        🤖 Financial Analysis

                    </h2>

                    <div className="space-y-4">

                        <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-800">

                            <p className="text-zinc-400 text-sm">

                                Highest Spending Category

                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-red-400">

                                {

                                    analytics.topCategory

                                        ? analytics.topCategory.name

                                        : "-"

                                }

                            </h3>

                        </div>

                        <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-800">

                            <p className="text-zinc-400 text-sm">

                                Average Expense

                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-amber-400">

                                ₹{

                                analytics.averageExpense.toFixed(0)

                            }

                            </h3>

                        </div>

                        <div className="rounded-2xl bg-zinc-950 p-5 border border-zinc-800">

                            <p className="text-zinc-400 text-sm">

                                Total Expense Categories

                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-sky-400">

                                {

                                    analytics.categoryData.length

                                }

                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* Smart AI Observation */}

            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-zinc-900 to-zinc-900 p-8">

                <h2 className="text-2xl font-bold text-white">

                    💡 Smart Financial Observations

                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                    <div className="rounded-2xl bg-zinc-950 p-5">

                        <p className="text-zinc-400">

                            Highest Spending Category

                        </p>

                        <h3 className="mt-3 text-xl font-bold text-red-400">

                            {

                                analytics.topCategory

                                    ? analytics.topCategory.name

                                    : "No Data"

                            }

                        </h3>

                    </div>

                    <div className="rounded-2xl bg-zinc-950 p-5">

                        <p className="text-zinc-400">

                            Total Categories Used

                        </p>

                        <h3 className="mt-3 text-xl font-bold text-sky-400">

                            {

                                analytics.categoryData.length

                            }

                        </h3>

                    </div>

                    <div className="rounded-2xl bg-zinc-950 p-5">

                        <p className="text-zinc-400">

                            Monthly Average Expense

                        </p>

                        <h3 className="mt-3 text-xl font-bold text-yellow-400">

                            ₹{

                            analytics.averageExpense.toFixed(0)

                        }

                        </h3>

                    </div>

                    <div className="rounded-2xl bg-zinc-950 p-5">

                        <p className="text-zinc-400">

                            Expense Ratio

                        </p>

                        <h3 className="mt-3 text-xl font-bold text-emerald-400">

                            {

                                analytics.income === 0

                                    ? "0%"

                                    : (

                                        analytics.expense

                                        / analytics.income

                                        *100

                                    ).toFixed(1)

                            }%

                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Analytics;