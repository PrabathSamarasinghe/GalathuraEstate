import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
// import DataLoader from "./components/DataLoader";
import routesConfig from "./config/routes.json";
import SignIn from "./pages/SignIn";

// Lazy load all pages
const Layout = lazy(() => import("./context/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Employees = lazy(() => import("./pages/Employees"));
const ExpensesAndIncome = lazy(() => import("./pages/ExpensesAndIncome"));
const ProfitAndLoss = lazy(() => import("./pages/ProfitAndLoss"));

// Component map for dynamic routing
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  Dashboard,
  Inventory,
  Attendance,
  Employees,
  ExpensesAndIncome,
  ProfitAndLoss,
};

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {routesConfig.map((route) => {
              const Component = componentMap[route.component];
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Component />}
                />
              );
            })}
          </Route>
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
        }}
      />
      {/* Developer tool - remove in production */}
      {/* <DataLoader /> */}
    </BrowserRouter>
  );
};

export default App;
