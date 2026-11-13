import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/dashboard/Navbar';
import Nav from './components/companyDashboard/Nav';
import { useAuth } from './lib/auth';

/**
 * Shell for the signed-in product: picks the customer navbar or the staff
 * sidebar.
 *
 * Which one shows is now decided by who is signed in, from the server's
 * answer. The old version matched the URL against two hardcoded path lists,
 * which meant a new route silently got no navigation at all and a customer
 * visiting a staff URL briefly saw the staff sidebar.
 */
export default function DashboardLayout() {
  const { isCustomer, isEmployee, isLoading } = useAuth();
  const location = useLocation();

  // While `/me` is in flight, render the page without chrome rather than
  // flashing the wrong navigation.
  const showCustomerNav = !isLoading && isCustomer;
  const showStaffNav = !isLoading && isEmployee;

  return (
    <>
      {showCustomerNav ? <Navbar /> : null}
      {showStaffNav ? <Nav key={location.pathname.split('/')[1]} /> : null}
      <Outlet />
    </>
  );
}
