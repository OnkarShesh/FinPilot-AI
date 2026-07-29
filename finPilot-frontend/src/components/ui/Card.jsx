function Card({ children, className = "" }) {
    return (
        <div
            className={`bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-zinc-700 transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}

export default Card;