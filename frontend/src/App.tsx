import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
// import DataLoader from "./components/DataLoader";
import routesConfig from "./config/routes.json";
import SignIn from "./pages/SignIn";
const Layout = lazy(() => import("./context/Layout"));

const Component = (componentName: string) => {
  return lazy(() => import(`./pages/${componentName}`));
};

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route element={<Layout />}>
            {routesConfig.map((route) => {
              const LazyComponent = Component(route.component);
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<LazyComponent />}
                />
              );
            })}
          </Route>
        </Routes>
      </Suspense>
      {/* Developer tool - remove in production */}
      {/* <DataLoader /> */}
    </BrowserRouter>
  );
};

export default App;
