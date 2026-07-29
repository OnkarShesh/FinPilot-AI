function Button({
                    children,
                    onClick,
                    type = "button",
                    loading = false,
                    className = "",
                }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`
                w-full
                rounded-2xl
                bg-emerald-600
                px-4
                py-3
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-emerald-500
                hover:shadow-lg
                hover:shadow-emerald-500/20
                hover:-translate-y-0.5
                active:scale-[0.98]
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                focus:ring-offset-2
                focus:ring-offset-zinc-950
                disabled:opacity-60
                disabled:cursor-not-allowed
                ${className}
            `}
        >
            {loading ? "Signing In..." : children}
        </button>
    );
}

export default Button;