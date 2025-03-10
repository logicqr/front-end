import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/dashboard/Navbar";
import Nav from "./components/companyDashboard/Nav";
import Header from "./components/Landing-pages/Header"

const Layout = () => {
  const location = useLocation();

  const showNavbarRoutes = ["/dashboard", "/settings", "/help-centre","/transactions"];
  const showAdminNavRoutes = [
    "/staff/dashboard",
    "/account-setting",
    "/admin/dashboard",
    "/payout",
    "/employees-details",
    "/help-dashboard",
    "/employee",
    "/temp-orders"
  ];
  const publicRoutes = ["/","/docs","/features"]

  const showNavbar = showNavbarRoutes.some(path => location.pathname.startsWith(path));
  const showAdminNav = showAdminNavRoutes.some(path => location.pathname.startsWith(path));
  const publicNav = publicRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {showAdminNav && <Nav />}
      {publicNav && <Header/>}
      <Outlet />
    </>
  );
};

export default Layout;
