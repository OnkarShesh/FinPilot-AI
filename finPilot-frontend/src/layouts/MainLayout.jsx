import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (

        <div className="flex min-h-screen bg-zinc-950">

            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex flex-1 flex-col overflow-hidden">

                <Topbar
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default MainLayout;