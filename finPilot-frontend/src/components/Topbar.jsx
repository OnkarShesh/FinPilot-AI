import { FiBell, FiSearch } from "react-icons/fi";

function Topbar() {
    return (
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">

            <div className="flex h-16 items-center justify-between px-6 lg:px-8">

                {/* Left */}

                <div>

                    <h1 className="text-2xl font-bold text-white">
                        Dashboard
                    </h1>

                    <p className="text-sm text-zinc-400">
                        Welcome back. Manage your finances.
                    </p>

                </div>

                {/* Right */}

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
                    >
                        <FiSearch size={18} />
                    </button>

                    <button
                        type="button"
                        className="relative rounded-xl border border-zinc-700 bg-zinc-800 p-2 text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
                    >
                        <FiBell size={18} />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400"></span>
                    </button>

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-semibold text-white shadow-lg">
                            O
                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;