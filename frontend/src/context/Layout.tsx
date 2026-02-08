import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <div className="coll-span-5 p-6 md:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
