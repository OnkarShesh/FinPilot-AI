function Input({
                   type = "text",
                   placeholder,
                   value,
                   onChange,
                   rightIcon,
                   onRightIconClick,
                   className = "",
                   ...props
               }) {
    return (
        <div className="relative w-full">

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
                className={`
                    w-full
                    rounded-xl
                    border
                    border-zinc-700
                    bg-zinc-900
                    px-4
                    py-3
                    pr-12
                    text-white
                    placeholder:text-zinc-500
                    transition-all
                    duration-300
                    hover:border-zinc-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                    focus:border-emerald-500
                    disabled:bg-zinc-800
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    ${className}
                `}
            />

            {rightIcon && (
                <button
                    type="button"
                    onClick={onRightIconClick}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                    {rightIcon}
                </button>
            )}

        </div>
    );
}
export default Input;