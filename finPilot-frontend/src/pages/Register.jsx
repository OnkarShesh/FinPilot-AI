import axios from "axios";
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
    FiPieChart
} from "react-icons/fi";

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

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {
            toast.error("Please fill all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("Enter a valid email address");
            return;
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            toast.error("Enter a valid 10-digit phone number");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }


        setLoading(true);

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name,
                    email,
                    phone,
                    password
                }
            );

            toast.success(response.data);

            navigate("/login");

        } catch (error) {

            if (error.response?.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Registration Failed");
            }

        } finally {

            setLoading(false);

        }

    };
    return (

        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-900">

            <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]" />

            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />

            <div className="relative z-10 flex min-h-screen">
                {/* LEFT SIDE */}

                <div className="hidden lg:flex w-1/2 flex-col justify-center px-20">

                    <div className="max-w-lg">

                        <h1 className="text-6xl font-extrabold text-white leading-tight">
                            Fin<span className="text-emerald-400">Pilot</span>
                        </h1>

                        <p className="mt-6 text-xl text-zinc-400 leading-8">
                            Start your AI-powered finance journey with smart expense tracking,
                            insightful analytics and secure account management.
                        </p>

                        <div className="mt-14 space-y-8">

                            <Feature
                                icon={<FiTrendingUp />}
                                title="Track Every Expense"
                                desc="Stay on top of your spending with real-time tracking."
                            />

                            <Feature
                                icon={<FiPieChart />}
                                title="AI Financial Insights"
                                desc="Receive intelligent recommendations to improve savings."
                            />

                            <Feature
                                icon={<FiShield />}
                                title="Safe & Secure"
                                desc="Your financial data is protected using JWT authentication."
                            />

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10">

                    <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-zinc-900/70">

                        <h2 className="text-3xl font-bold text-white">
                            Create Account 🚀
                        </h2>

                        <p className="mt-2 text-zinc-400">
                            Join FinPilot and start managing your finances smarter.
                        </p>

                        <div className="mt-8 space-y-5">

                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                            }
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

                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                rightIcon={
                                    showConfirmPassword
                                        ? <FiEyeOff size={20} />
                                        : <FiEye size={20} />
                                }
                                onRightIconClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            />

                            <Button
                                loading={loading}
                                onClick={handleRegister}
                            >
                                Create Account
                            </Button>

                        </div>

                        <div className="mt-8 text-center text-zinc-400">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                                Sign In
                            </Link>

                        </div>
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
                                    📧
                                    <span>onkarshesh16@gmail.com</span>
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/onkar-shesh-508344247"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                                >
                                    💼
                                    <span>Onkar Shesh</span>
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

export default Register;