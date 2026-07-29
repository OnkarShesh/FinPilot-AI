import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-zinc-900 text-white px-6 py-4 flex gap-6 items-center">

            <h1 className="text-xl font-bold text-emerald-400">
                💰 FinPilot AI
            </h1>

            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/analytics">Analytics</NavLink>
            <NavLink to="/advisor">AI Advisor</NavLink>

        </nav>
    );
}

export default Navbar;