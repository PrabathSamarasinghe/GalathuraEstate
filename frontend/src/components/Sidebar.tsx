import routeConfig from "../config/routes.json";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-green-100 border-r border-green-200 shadow-lg p-6 fixed flex flex-col">
      <div className="mb-8 text-center py-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-md">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">
          🌿 Galatura Estate
        </h1>
        <p className="text-green-100 text-xs mt-1 font-medium">
          Management System
        </p>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto">
        {routeConfig.map((route) => (
          <Link
            key={route.path}
            className="block px-4 py-2 text-green-700 hover:bg-green-200 rounded-lg transition"
            to={route.path}
          >
            {route.tabName}
          </Link>
        ))}
      </nav>

      <div className="mt-4">
        <button
          onClick={() => console.log("Logout clicked")}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
