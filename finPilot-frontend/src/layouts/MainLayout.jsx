import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "null" || token === "undefined") {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex flex-1 flex-col min-w-0 h-screen w-full overflow-hidden">
                <Topbar
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <main className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
