import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header /> {/* Header stays at the top */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}