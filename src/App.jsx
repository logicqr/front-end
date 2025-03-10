import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./components/companyDashboard/Login";
import StaffDashboard from "./components/companyDashboard/staffDashboard/StaffDashboard";
import AdminDashbord from "./components/companyDashboard/adminDashboard/AdminDashbord";
import AccountSettings from "./components/companyDashboard/staffDashboard/AccountSettings";
import Payout from "./components/companyDashboard/adminDashboard/Payout";
import EmployeesDetails from "./components/companyDashboard/adminDashboard/EmployeesDetails";
import StaffRegister from "./components/companyDashboard/adminDashboard/StaffRegister";
import EmployeeDetailsPage from "./components/companyDashboard/adminDashboard/EmployeeDetailsPage";
import AdminDetailsPage from "./components/companyDashboard/adminDashboard/AdminDetailsPage";
import HelpDashboard from "./components/companyDashboard/adminDashboard/HelpCenter/HelpDashboard";
import HelpStatusUpdate from "./components/companyDashboard/adminDashboard/HelpCenter/HelpStatusUpdate";
import UserProtectedRoutes from "./components/dashboard/UserProtectedRoutes";
import EmployeesProtectedRoutes from "./components/companyDashboard/EmployeesProtectedRoutes";
import TempOrderList from "./components/companyDashboard/adminDashboard/TempOrderList";

import UserAccountSettings from "./components/dashboard/AccountSettings";
import UserLogin from "./components/dashboard/Userlogin";
import UserRegister from "./components/dashboard/UserRegister";
import UserDashboard from "./components/dashboard/Dashboard";
import UserHelp from "./components/dashboard/Help";
import ReviewForm from "./components/dashboard/ReviewForm";
import PayoutDetails from "./components/companyDashboard/adminDashboard/PayoutDetails";
import Transactions from "./components/dashboard/Transactions";

import LandingPage from "./components/Landing-pages/LandingPage";
import Docx from "./components/Landing-pages/Docx";
import Terms from "./components/Landing-pages/Terms";
import Features from "./components/Landing-pages/Features";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/admin-login" element={<Login />} />
        {/* Routes that will conditionally display Navbar inside Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard/:id" element={<UserProtectedRoutes><UserDashboard /></UserProtectedRoutes>} />
          <Route path="/settings" element={<UserProtectedRoutes><UserAccountSettings /></UserProtectedRoutes>} />
          <Route path="/help-centre" element={<UserProtectedRoutes><UserHelp /></UserProtectedRoutes>} />
          <Route path="/transactions" element={<UserProtectedRoutes><Transactions/></UserProtectedRoutes>} />
        

        {/* Admin & Staff Routes */}
        {/* <Route path="/admin-login" element={<Login />} /> */}
        <Route path="/staff/dashboard/:id" element={<EmployeesProtectedRoutes><StaffDashboard /></EmployeesProtectedRoutes>} />
        <Route path="/account-setting" element={<EmployeesProtectedRoutes><AccountSettings /></EmployeesProtectedRoutes>} />
        <Route path="/admin/dashboard/:id" element={<EmployeesProtectedRoutes><AdminDashbord /></EmployeesProtectedRoutes>} />
        <Route path="/payout" element={<EmployeesProtectedRoutes><Payout /></EmployeesProtectedRoutes>} />
        <Route path="/employees-details" element={<EmployeesProtectedRoutes><EmployeesDetails /></EmployeesProtectedRoutes>} />
        <Route path="/employees-details/staff-registration" element={<EmployeesProtectedRoutes><StaffRegister /></EmployeesProtectedRoutes>} />
        <Route path="/employees-details/:employeeId" element={<EmployeesProtectedRoutes><EmployeeDetailsPage /></EmployeesProtectedRoutes>} />
        <Route path="/employees-details/admin/:employeeId" element={<EmployeesProtectedRoutes><AdminDetailsPage /></EmployeesProtectedRoutes>} />
        <Route path="/help-dashboard" element={<EmployeesProtectedRoutes><HelpDashboard /></EmployeesProtectedRoutes>} />
        <Route path="/help-dashboard/:id" element={<EmployeesProtectedRoutes><HelpStatusUpdate /></EmployeesProtectedRoutes>} />
        <Route path="/payout/:employeeId" element={<EmployeesProtectedRoutes><PayoutDetails/></EmployeesProtectedRoutes>} />
        <Route path="/temp-orders" element={<EmployeesProtectedRoutes><TempOrderList/></EmployeesProtectedRoutes>} />

        {/* Public Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/review/:id" element={<ReviewForm />} />

        {/* Public Routes */}
        <Route path="/" element={<LandingPage/>} />
        <Route path="/docs" element={<Docx/>} />
        <Route path="/terms-condition" element={<Terms/>} />
        <Route path="/features" element={<Features/>} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
