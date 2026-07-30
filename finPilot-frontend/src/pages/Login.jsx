import axios from "axios";
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
                "http://localhost:8080/api/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("email", response.data.email);

            toast.success(`Welcome Back!,${response.data.name}!`);

            navigate("/dashboard");
        } catch (error) {
            toast.error("Invalid Email or Password");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-900">

            {/* Background Glow */}

            <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />

            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />

            <div className="relative z-10 flex min-h-screen">

                {/* LEFT */}

                <div className="hidden lg:flex w-1/2 flex-col justify-center px-20">

                    <div className="max-w-lg">

                        <h1 className="text-6xl font-extrabold text-white leading-tight">
                            Fin<span className="text-emerald-400">Pilot</span>
                        </h1>

                        <p className="mt-6 text-xl text-zinc-400 leading-8">
                            Manage your finances with AI powered insights,
                            smart analytics and beautiful dashboards.
                        </p>

                        <div className="mt-14 space-y-8">

                            <Feature
                                icon={<FiTrendingUp />}
                                title="AI Expense Insights"
                                desc="Analyze spending patterns automatically."
                            />

                            <Feature
                                icon={<FiPieChart />}
                                title="Powerful Analytics"
                                desc="Visualize income, expenses and savings."
                            />

                            <Feature
                                icon={<FiShield />}
                                title="Secure Authentication"
                                desc="JWT secured finance management."
                            />

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">

                    <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-zinc-900/70">

                        <h2 className="text-3xl font-bold text-white">
                            Welcome Back 👋
                        </h2>

                        <p className="mt-2 text-zinc-400">
                            Sign in to continue to FinPilot
                        </p>

                        <div className="mt-8 space-y-5">

                            <Input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                rightIcon={
                                    showPassword
                                        ? <FiEyeOff size={20} />
                                        : <FiEye size={20} />
                                }
                                onRightIconClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            />

                            <Button
                                loading={loading}
                                onClick={handleLogin}
                            >
                                Sign In
                            </Button>

                        </div>

                        <div className="mt-8 text-center text-zinc-400">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                                Create Account
                            </Link>
                            <div className="mt-10 border-t border-zinc-800 pt-6 text-center">

                                <p className="text-xs text-zinc-500">
                                    © 2026 FinPilot AI
                                </p>

                                <p className="mt-2 text-sm text-zinc-300">
                                    Designed & Developed by{" "}
                                    <span className="font-semibold text-emerald-400">
            Onkar Shesh
        </span>
                                </p>

                                <div className="mt-4 flex flex-col items-center gap-3">

                                    <a
                                        href="mailto:onkarshesh16@gmail.com"
                                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                                    >
                                        <FiMail size={16} />
                                        <span>onkarshesh16@gmail.com</span>
                                    </a>

                                    <a
                                        href="https://www.linkedin.com/in/onkar-shesh-508344247"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                                    >
                                        <FaLinkedin size={16} />
                                        <span>Onkar Shesh</span>
                                    </a>

                                </div>
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

            <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-400 text-xl">
                {icon}
            </div>

            <div>

                <h3 className="text-lg font-semibold text-white">
                    {title}
                </h3>

                <p className="mt-1 text-zinc-400">
                    {desc}
                </p>

            </div>

        </div>
    );
}

export default Login;