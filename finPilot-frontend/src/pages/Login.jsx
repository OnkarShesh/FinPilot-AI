import axios from "axios";
import { BASE_URL } from "../services/ExpenseService";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiTrendingUp, FiShield, FiPieChart } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/auth/login`,
                {
                    email: email.trim(),
                    password,
                }
            );
            if (!response.data || !response.data.token) {
                toast.error("Please register first or check your password");
                return;
            }
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("email", response.data.email);
            if (response.data.phone) {
                localStorage.setItem("phone", response.data.phone);
            }

            toast.success(`Welcome Back, ${response.data.name}!`);

            navigate("/dashboard");
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("Account not found. Please register first.");
            } else if (error.response?.status === 401) {
                toast.error("Invalid Email or Password");
            } else {
                const msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : null);
                toast.error(msg || "Something went wrong. Please check your credentials.");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoFill = () => {
        setEmail("onkarshesh16@gmail.com");
        setPassword("password123");
        toast.success("Loaded account: onkarshesh16@gmail.com");
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
            {/* Background Glow */}
            <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />
            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

            <div className="relative z-10 flex min-h-screen">
                {/* LEFT HERO */}
                <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 xl:px-20">
                    <div className="max-w-lg">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                            Personal AI Financial Assistant
                        </div>

                        <h1 className="mt-4 text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
                            Fin<span className="text-emerald-400">Pilot</span>
                        </h1>

                        <p className="mt-5 text-lg text-zinc-400 leading-relaxed">
                            Autonomous personal finance intelligence. Track cash flows, receive Gemini AI financial health assessments, and make confident wealth decisions.
                        </p>

                        <div className="mt-12 space-y-6">
                            <Feature
                                icon={<FiTrendingUp />}
                                title="Autonomous AI Advisory"
                                desc="Gemini 3.5 flash analyzes your category drains and savings velocity."
                            />
                            <Feature
                                icon={<FiPieChart />}
                                title="Interactive Analytics"
                                desc="Visualize cash flow trends, burn rate, and category distributions."
                            />
                            <Feature
                                icon={<FiShield />}
                                title="Enterprise Security"
                                desc="Stateless JWT authentication with ACID compliant PostgreSQL storage."
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT LOGIN CARD */}
                <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
                    <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            Welcome Back 👋
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
                            Sign in to continue to your FinPilot workspace.
                        </p>

                        {/* Demo Auto-Fill Button */}
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleDemoFill}
                                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/10 py-2.5 px-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500 transition cursor-pointer"
                            >
                                ⚡ Log In with WhatsApp Account (onkarshesh16@gmail.com)
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="e.g. user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                    Password
                                </label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                    rightIcon={
                                        showPassword
                                            ? <FiEyeOff size={18} />
                                            : <FiEye size={18} />
                                    }
                                    onRightIconClick={() => setShowPassword(!showPassword)}
                                />
                            </div>

                            <Button
                                loading={loading}
                                onClick={handleLogin}
                            >
                                Sign In to FinPilot
                            </Button>
                        </div>

                        <div className="mt-6 text-center text-xs text-zinc-400">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-bold text-emerald-400 hover:text-emerald-300 transition"
                            >
                                Create Free Account &rarr;
                            </Link>
                        </div>

                        {/* Developer attribution */}
                        <div className="mt-8 border-t border-zinc-800/80 pt-5 text-center">
                            <p className="text-[11px] text-zinc-400">
                                Crafted with precision by{" "}
                                <span className="font-bold text-emerald-400">
                                    Onkar Shesh
                                </span>
                            </p>

                            <div className="mt-3 flex items-center justify-center gap-4">
                                <a
                                    href="mailto:onkarshesh16@gmail.com"
                                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition"
                                >
                                    <FiMail size={14} />
                                    <span>onkarshesh16@gmail.com</span>
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/onkar-shesh-508344247"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-400 transition"
                                >
                                    <FaLinkedin size={14} />
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4">
            <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400 text-lg border border-emerald-500/20">
                {icon}
            </div>
            <div>
                <h3 className="text-base font-bold text-white">
                    {title}
                </h3>
                <p className="mt-0.5 text-sm text-zinc-400 leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    );
}

export default Login;
