import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// import MainNavigation from "../../components/Navigation/MainNavigation";
import Dashboard from "../../components/dashboard/components/Dashboard";
// import Navbar from "../../components/Navigation/Navbar";
const RootLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {isAuthenticated && (
        <Dashboard>
          <Outlet />
        </Dashboard>
      )}
      {!isAuthenticated && (
        <main>
          <Outlet />
        </main>
      )}
    </>
  );
};

export default RootLayout;
