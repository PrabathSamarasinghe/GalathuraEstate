import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="p-4 md:p-6 md:ml-64 pt-16 md:pt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
