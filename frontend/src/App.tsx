import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import routesConfig from "./config/routes.json";

const Layout = lazy(() => import("./context/Layout"));

const Component = (componentName: string) => {
  return lazy(() => import(`./pages/${componentName}`));
};

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<Loading />}>
        <Routes>
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
    </BrowserRouter>
  );
};

export default App;
