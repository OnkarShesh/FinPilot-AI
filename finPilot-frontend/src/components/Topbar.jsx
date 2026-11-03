import { FiMenu } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Sparkles, PlusCircle, User, ShieldCheck } from "lucide-react";

function Topbar({ setIsSidebarOpen }) {
    const location = useLocation();
    const navigate = useNavigate();

    const pageTitles = {
        "/dashboard": "Dashboard",
        "/transactions": "Transactions",
        "/analytics": "Analytics",
        "/advisor": "AI Advisor",
    };

    const currentTitle = pageTitles[location.pathname] || "Overview";

    const name = localStorage.getItem("name") || "User";
    const initial = name.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Mobile trigger & Breadcrumb */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:hidden cursor-pointer"
                        aria-label="Open navigation menu"
                    >
                        <FiMenu size={22} />
                    </button>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500 hidden sm:inline">FinPilot</span>
                        <span className="text-zinc-700 hidden sm:inline">/</span>
                        <span className="font-bold text-white tracking-wide">{currentTitle}</span>
                    </div>
                </div>

                {/* Right: AI Status Pill & Quick Action & User Profile */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* WhatsApp Copilot Action Pill */}
                    <button
                        onClick={() => {
                            if (window.location.pathname === "/dashboard") {
                                window.dispatchEvent(new CustomEvent("open-whatsapp-bot"));
                            } else {
                                navigate("/dashboard#whatsapp");
                            }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm cursor-pointer"
                        title="Open WhatsApp Copilot 24/7 Simulator & Setup"
                    >
                        <FaWhatsapp className="text-sm text-emerald-400" />
                        <span className="hidden sm:inline">WhatsApp Copilot</span>
                    </button>

                    {/* Live AI Status Pill */}
                    <Link
                        to="/advisor"
                        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400 hover:bg-teal-500/15 transition-all shadow-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span>Gemini 3.5 AI</span>
                    </Link>

                    {/* Quick Add Button */}
                    <Link
                        to="/dashboard#new"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition cursor-pointer"
                    >
                        <PlusCircle size={15} />
                        <span className="hidden xs:inline">Quick Add</span>
                    </Link>

                    {/* Divider */}
                    <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

                    {/* User Profile */}
                    <div className="flex items-center gap-2.5">
                        <div className="hidden text-right md:block">
                            <p className="text-xs font-bold text-white leading-tight">
                                {name}
                            </p>
                            <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                                Pro Member
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20">
                            {initial}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;
