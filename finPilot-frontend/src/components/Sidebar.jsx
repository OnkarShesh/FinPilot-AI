import { NavLink, useNavigate } from "react-router-dom";
import {
    FiHome,
    FiDollarSign,
    FiBarChart2,
    FiCpu,
    FiLogOut,
    FiMail,
    FiX,
} from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

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

function Sidebar({ isOpen, setIsOpen }) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");

        navigate("/login");

    };

    const closeSidebar = () => {

        if (window.innerWidth < 768) {
            setIsOpen(false);
        }

    };

    return (
        <>

            {/* Mobile Overlay */}

            {isOpen && (

                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                />

            )}

            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    z-50
                    flex
                    h-screen
                    w-72
                    flex-col
                    border-r
                    border-zinc-800
                    bg-zinc-900
                    transition-transform
                    duration-300
                    md:sticky
                    md:top-0
                    md:translate-x-0
                    md:w-64
                    ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                }
                `}
            >

                {/* Logo */}

                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-6">

                    <div>

                        <h1 className="text-2xl font-bold text-white">

                            Fin
                            <span className="text-emerald-400">
                                Pilot
                            </span>

                        </h1>

                        <p className="mt-1 text-sm text-zinc-500">

                            AI Personal Finance

                        </p>

                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 md:hidden"
                    >

                        <FiX size={20} />

                    </button>

                </div>

                {/* Navigation */}

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                                        isActive
                                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`
                                }
                            >

                                <Icon size={20} />

                                <span className="font-medium">

                                    {item.name}

                                </span>

                            </NavLink>

                        );

                    })}
                </nav>

                {/* Bottom Section */}

                <div className="border-t border-zinc-800 p-4">

                    {/* Logout */}

                    <button
                        onClick={handleLogout}
                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            text-red-400
                            transition-all
                            duration-300
                            hover:bg-red-500/10
                        "
                    >

                        <FiLogOut size={20} />

                        <span className="font-medium">

                            Logout

                        </span>

                    </button>

                    {/* Developer Card */}

                    <div
                        className="
                            mt-5
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-950
                            p-4
                        "
                    >

                        <p className="text-xs uppercase tracking-widest text-zinc-500">

                            Developed By

                        </p>

                        <h3 className="mt-2 text-white font-semibold">

                            Onkar Shesh

                        </h3>

                        <p className="mt-1 text-sm text-zinc-400">

                            AI Full Stack Developer

                        </p>

                        <div className="mt-4 flex gap-3">

                            <a
                                href="mailto:your@email.com"
                                className="
                                    rounded-lg
                                    bg-zinc-800
                                    p-2
                                    text-zinc-300
                                    transition
                                    hover:bg-emerald-500
                                    hover:text-white
                                "
                            >

                                <FiMail size={18} />

                            </a>

                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    rounded-lg
                                    bg-zinc-800
                                    p-2
                                    text-zinc-300
                                    transition
                                    hover:bg-blue-600
                                    hover:text-white
                                "
                            >

                                <FaLinkedin size={18} />

                            </a>

                        </div>

                    </div>

                </div>

            </aside>

        </>

    );

}

export default Sidebar;