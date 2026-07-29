import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Card from "../components/ui/Card.jsx";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

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
                    password
                }
            );

            localStorage.setItem("token", response.data);

            toast.success("Welcome Back!");

            navigate("/dashboard");

        } catch (error) {

            toast.error("Invalid Email or Password");

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <Card>

                <h1 className="text-4xl font-bold text-center text-white">
                    FinPilot
                </h1>

                <p className="text-center text-gray-400 mt-2 mb-8">
                    AI Powered Personal Finance Platform
                </p>

                <div className="space-y-5">

                    <Input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightIcon={
                            showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />
                        }
                        onRightIconClick={() => setShowPassword(!showPassword)}
                    />
                    <Button
                        onClick={handleLogin}
                        loading={loading}
                    >
                        Login
                    </Button>
                </div>

            </Card>
        </div>
    );}

export default Login;