import axios from "axios";
import { BASE_URL } from "../services/ExpenseService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import {
    FiEye,
    FiEyeOff,
    FiShield,
    FiTrendingUp,
    FiPieChart,
    FiMail
} from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
            toast.error("Please fill all required fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/auth/register`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    password
                }
            );

            toast.success("Account created! WhatsApp Copilot linked with your phone.", { duration: 5000 });
            navigate("/login");
        } catch (error) {
            const msg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : null);
            toast.error(msg || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
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
                            Create Your Account
                        </div>

                        <h1 className="mt-4 text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
                            Fin<span className="text-emerald-400">Pilot</span>
                        </h1>

                        <p className="mt-5 text-lg text-zinc-400 leading-relaxed">
                            Take complete control over your finances with automated insights, Gemini AI recommendations, and intelligent wealth tracking.
                        </p>

                        <div className="mt-12 space-y-6">
                            <Feature
                                icon={<FiTrendingUp />}
                                title="Autonomous Financial Copilot"
                                desc="Get instant AI-driven health evaluations tailored to your spending."
                            />
                            <Feature
                                icon={<FiPieChart />}
                                title="Comprehensive Analytics"
                                desc="Explore cash flow trends, burn velocity, and category allocations."
                            />
                            <Feature
                                icon={<FiShield />}
                                title="ACID Compliant & Encrypted"
                                desc="High-security database protection and stateless JWT tokens."
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT REGISTER CARD */}
                <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
                    <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 shadow-2xl my-auto">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            Create Account 🚀
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
                            Join FinPilot to elevate your financial intelligence.
                        </p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g. Onkar Shesh"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                        Mobile (10 digits)
                                    </label>
                                    <Input
                                        type="tel"
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                    Password
                                </label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    rightIcon={
                                        showPassword
                                            ? <FiEyeOff size={18} />
                                            : <FiEye size={18} />
                                    }
                                    onRightIconClick={() => setShowPassword(!showPassword)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                                    Confirm Password
                                </label>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    rightIcon={
                                        showConfirmPassword
                                            ? <FiEyeOff size={18} />
                                            : <FiEye size={18} />
                                    }
                                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>

                            <Button
                                loading={loading}
                                onClick={handleRegister}
                            >
                                Register Now
                            </Button>
                        </div>

                        <div className="mt-6 text-center text-xs text-zinc-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-emerald-400 hover:text-emerald-300 transition"
                            >
                                Sign In &rarr;
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

export default Register;
