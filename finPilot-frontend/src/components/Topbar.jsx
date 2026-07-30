import { FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";

function Topbar({ setIsSidebarOpen }) {

    const location = useLocation();

    const pageData = {
        "/dashboard": {
            title: "Dashboard",
            subtitle: "Track your income, expenses and financial performance.",
        },
        "/transactions": {
            title: "Transactions",
            subtitle: "Manage every income and expense in one place.",
        },
        "/analytics": {
            title: "Analytics",
            subtitle: "Visualize your financial trends with interactive insights.",
        },
        "/advisor": {
            title: "AI Advisor",
            subtitle: "Receive AI-powered financial recommendations.",
        },
    };

    const currentPage = pageData[location.pathname] || {
        title: "FinPilot",
        subtitle: "Smart Personal Finance Platform",
    };


    const name = localStorage.getItem("name") || "User";
    const firstName = name.split(" ")[0];
    const initial = name.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md">

            <div className="flex h-16 items-center justify-between px-4 lg:px-8">

                {/* Left */}

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-800 md:hidden"
                    >
                        <FiMenu size={22} />
                    </button>

                    <div>

                        <h1 className="mt-1 text-3xl font-bold text-white">
                            {currentPage.title}
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500">
                            {currentPage.subtitle}
                        </p>

                    </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-3">

                    <div className="hidden text-right sm:block">

                        <p className="font-semibold text-white">
                            {name}
                        </p>

                        <p className="text-xs text-zinc-500">
                            Member
                        </p>

                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white shadow-lg">

                        {initial}

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;