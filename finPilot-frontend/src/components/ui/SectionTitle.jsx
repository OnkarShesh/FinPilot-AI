function SectionTitle({ title, subtitle }) {
    return (
        <div className="mb-6">

            <h2 className="text-3xl font-bold text-white">
                {title}
            </h2>

            <p className="text-zinc-400 mt-1">
                {subtitle}
            </p>

        </div>
    );
}

export default SectionTitle;