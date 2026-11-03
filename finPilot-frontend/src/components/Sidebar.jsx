import { NavLink, useNavigate, Link } from "react-router-dom";
import {
    LayoutDashboard,
    ArrowLeftRight,
    TrendingUp,
    Sparkles,
    LogOut,
    Mail,
    X,
    PlusCircle,
    ChevronRight,
    Zap,
    ShieldCheck
} from "lucide-react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";

const navGroups = [
    {
        title: "Platform",
        items: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: LayoutDashboard,
                description: "Cash flow & overview"
            },
            {
                name: "Transactions",
                path: "/transactions",
                icon: ArrowLeftRight,
                description: "History & ledger"
            },
            {
                name: "Analytics",
                path: "/analytics",
                icon: TrendingUp,
                description: "Trends & visual stats"
            },
        ]
    },
    {
        title: "Intelligence",
        items: [
            {
                name: "AI Advisor",
                path: "/advisor",
                icon: Sparkles,
                badge: "AI 3.5",
                description: "Gemini financial guidance"
            },
        ]
    }
];

function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();

    const userName = localStorage.getItem("name") || "User";
    const userEmail = localStorage.getItem("email") || "user@example.com";
    const initial = userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("aiInsights");
        navigate("/login");
    };

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 flex h-screen w-[82vw] max-w-[280px] sm:max-w-xs flex-col
                    border-r border-zinc-800/80 bg-zinc-950/98 backdrop-blur-xl
                    transition-transform duration-300 ease-in-out
                    md:sticky md:top-0 md:translate-x-0 md:w-64 lg:w-72
                    ${isOpen ? "translate-x-0 shadow-2xl shadow-emerald-500/10" : "-translate-x-full md:translate-x-0"}
                `}
            >
                {/* 1. Brand Logo Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 sm:px-6 py-4 sm:py-5">
                    <Link
                        to="/dashboard"
                        onClick={closeSidebar}
                        className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
                    >
                        {/* Glow Logo Mark */}
                        <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 font-black text-zinc-950 shadow-lg shadow-emerald-500/25 shrink-0">
                            <span className="text-sm font-extrabold tracking-tight">FP</span>
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-zinc-950"></span>
                            </span>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-none">
                                    Fin<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Pilot</span>
                                </h1>
                                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">
                                    AI
                                </span>
                            </div>
                            <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-zinc-500 tracking-wide truncate">
                                Smart Wealth Copilot
                            </p>
                        </div>
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden cursor-pointer active:scale-95 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 2. Quick Action Button inside Sidebar */}
                <div className="px-5 pt-5 pb-2">
                    <Link
                        to="/dashboard#new"
                        onClick={closeSidebar}
                        className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent p-3 border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-sm hover:border-emerald-500/60 hover:from-emerald-500/25 transition-all duration-200"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                                <PlusCircle size={14} className="stroke-[2.5]" />
                            </div>
                            <span>New Transaction</span>
                        </div>
                        <ChevronRight size={14} className="text-emerald-400/60 group-hover:translate-x-0.5 group-hover:text-emerald-300 transition-transform" />
                    </Link>
                </div>

                {/* 3. Navigation Links (Grouped with Section Titles) */}
                <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
                    {navGroups.map((group) => (
                        <div key={group.title} className="space-y-1">
                            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                {group.title}
                            </p>

                            <div className="space-y-1 pt-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `group relative flex items-center justify-between rounded-xl px-3 py-2.5 min-h-[44px] text-xs font-semibold transition-all duration-200 ${
                                                    isActive
                                                        ? "bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950/50"
                                                        : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100"
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {/* Active Indicator Bar on Left */}
                                                    {isActive && (
                                                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                                    )}

                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                                                isActive
                                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                                    : "bg-zinc-900/70 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-white"
                                                            }`}
                                                        >
                                                            <Icon size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold leading-tight">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-[10px] font-normal text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {item.badge && (
                                                        <span className="rounded-md bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* AI Engine Status Card */}
                    <div className="mt-4 rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/40 to-zinc-950 p-3.5 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                <Zap size={12} className="text-amber-400" /> AI Engine
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                            </span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-zinc-400 leading-tight">
                            Powered by <span className="font-semibold text-zinc-200">Gemini 3.5 Flash</span> for sub-second financial diagnostics.
                        </p>
                    </div>

                    {/* WhatsApp Copilot 24/7 Card */}
                    <div
                        onClick={() => {
                            closeSidebar();
                            if (window.location.pathname === "/dashboard") {
                                window.dispatchEvent(new CustomEvent("open-whatsapp-bot"));
                            } else {
                                navigate("/dashboard#whatsapp");
                            }
                        }}
                        className="mt-2.5 cursor-pointer group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-900/60 to-zinc-950 p-3.5 hover:border-emerald-500/60 transition shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                <FaWhatsapp className="text-xs" /> WhatsApp Bot
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> 24/7
                            </span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-300 leading-tight">
                            Text expenses hands-free. Gemini auto-categorizes & logs to ledger.
                        </p>
                    </div>
                </nav>

                {/* 4. Bottom Footer: Active User Profile & Developer Attribution */}
                <div className="border-t border-zinc-800/80 p-3.5 space-y-3 bg-zinc-950/80">
                    {/* Active User Account Pill */}
                    <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2.5">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-black text-white shadow-md shadow-emerald-500/20">
                                {initial}
                            </div>
                            <div className="truncate">
                                <p className="truncate text-xs font-bold text-white leading-tight">
                                    {userName}
                                </p>
                                <p className="truncate text-[10px] text-zinc-400 leading-tight">
                                    {userEmail}
                                </p>
                            </div>
                        </div>

                        {/* Sign Out Button */}
                        <button
                            onClick={handleLogout}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Sign Out"
                            aria-label="Sign Out"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>

                    {/* Developer Credit Line */}
                    <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500">
                        <span className="truncate">
                            By <span className="font-semibold text-zinc-300">Onkar Shesh</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href="mailto:onkarshesh16@gmail.com"
                                className="text-zinc-400 hover:text-emerald-400 transition-colors"
                                title="Contact Developer"
                            >
                                <Mail size={12} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/onkar-shesh-508344247"
                                target="_blank"
                                rel="noreferrer"
                                className="text-zinc-400 hover:text-sky-400 transition-colors"
                                title="LinkedIn Profile"
                            >
                                <FaLinkedin size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
