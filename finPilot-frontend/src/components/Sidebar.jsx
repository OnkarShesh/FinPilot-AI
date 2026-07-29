import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiDollarSign,
    FiBarChart2,
    FiCpu,
    FiLogOut,
} from "react-icons/fi";

const navItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: FiHome,
    },
    {
        name: "Transactions",
        path: "/transactions",
        icon: FiDollarSign,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: FiBarChart2,
    },
    {
        name: "AI Advisor",
        path: "/advisor",
        icon: FiCpu,
    },
];

function Sidebar() {
    return (
        <aside className="hidden md:flex h-screen w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">

            {/* Logo */}

            <div className="border-b border-zinc-800 px-6 py-6">

                <h1 className="text-2xl font-bold text-white">

                    Fin<span className="text-emerald-400">Pilot</span>

                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    AI Personal Finance
                </p>

            </div>

            {/* Navigation */}

            <nav className="flex-1 space-y-2 overflow-y-auto p-4">

                {navItems.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                }`
                            }
                        >

                            <Icon className="shrink-0" size={20} />

                            <span className="font-medium">

                                {item.name}

                            </span>

                        </NavLink>

                    );

                })}

            </nav>

            {/* Logout */}

            <div className="border-t border-zinc-800 p-4">

                <button
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-zinc-400
                        transition-all
                        duration-200
                        hover:bg-red-500/10
                        hover:text-red-400
                    "
                >

                    <FiLogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;