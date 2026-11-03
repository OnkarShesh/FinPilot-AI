function SectionTitle({ title, subtitle, className = "" }) {
    return (
        <div className={`mb-5 ${className}`}>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export default SectionTitle;
