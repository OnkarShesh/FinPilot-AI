import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout() {
    return (
        <div className="flex min-h-screen bg-zinc-950">

            <Sidebar />

            <div className="flex flex-1 flex-col">

                <Topbar />

                <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;