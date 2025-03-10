import React, { useState } from "react";
import { NavLink,useNavigate  } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { BiHelpCircle } from "react-icons/bi";
import Hamburger from "hamburger-react";
import { LuLogOut } from "react-icons/lu";
import { FaRupeeSign } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Logout confirmation state
  const userId = sessionStorage.getItem("id");
  const userName = sessionStorage.getItem("name");
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: `/dashboard/${userId}`,
      icon: <LuLayoutDashboard className="text-lg" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <LiaRupeeSignSolid className="text-lg" />,
    },
    {
      name: "Account Settings",
      path: "/settings",
      icon: <CgProfile className="text-lg" />,
    },
    {
      name: "Help Centre",
      path: "/help-centre",
      icon: <BiHelpCircle className="text-lg" />,
    },
  ];

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    sessionStorage.clear();
    navigate("/login"); // Redirect to login page after logout
};

  return (
    <div className="fixed w-full z-50 bg-white border-b-2 top-0">
      <div className="container mx-auto">

        <div>
          <div className="relative z-40 bg-white flex justify-between lg:justify-around items-center py-5 px-5 md:px-0 lg:py-3 text-lg ">
            {/* Logo Section */}
            <div className="text-2xl font-bold">
              <h1>Logic QR</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex justify-between items-center rounded-full border border-[#E5EFFF] py-3 px-4 bg-[#F7FAFF] shadow-md space-x-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-5 py-2 rounded-full transition-all duration-300
                        ${
                          isActive
                            ? "bg-[#032068] text-white shadow-lg font-medium"
                            : "hover:bg-[#032068] hover:text-white"
                        }`
                  }
                >
                  {item.icon}
                  <h1 className="text-base">
                    {item.name}
                  </h1>
                </NavLink>
              ))}
            </div>

            {/* Logout Button for Desktop */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-5 py-3 rounded-xl text-red-600 font-medium 
  hover:bg-red-100 transition-all duration-300"
            >
              <img
                src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/7ec47348-583e-4a7a-9655-493c6c3b7b95-removebg-preview.png?updatedAt=1741522515589"
                alt="profile"
                className="w-10 h-10 rounded-full bg-white object-cover border border-gray-300"
              />
             <span className="text-base">{userName?.trim() ? userName : 'Logout'}</span>
              <LuLogOut className="text-xl" />
            </button>

            {/* Mobile Menu Button */}
            <div className="lg:hidden block">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
              >
                <Hamburger toggled={isOpen} toggle={setIsOpen} size={25} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-0 left-0 h-full bg-[#032068] lg:hidden text-white z-10 transition-transform duration-300 
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 pt-28 flex flex-col justify-between bg-[#032068] h-screen w-64">
            <div className="space-y-4 text-lg">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-white text-[#032068] shadow-md"
                        : "text-white hover:bg-white hover:text-[#032068] border border-white hover:border-white"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <h1 className="font-medium">{item.name}</h1>
                </NavLink>
              ))}
            </div>

            {/* Logout Button mobile */}
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg  text-red-600 font-medium shadow-md bg-white cursor-pointer transition-all duration-300 hover:bg-white hover:text-red-500 hover:border-red-500"
            >
              <img
                src="https://ik.imagekit.io/pds5n5l6d3/LogicQR/Dashboard%20section/7ec47348-583e-4a7a-9655-493c6c3b7b95-removebg-preview.png?updatedAt=1741522515589"
                alt="profile"
                className="w-10 h-10 rounded-full bg-red-500 object-cover"
              />
              <span className="line-clamp-1">{userName?.trim() ? userName : 'Logout'}</span>
              <LuLogOut className="text-2xl transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutPopup && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="px-5 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200 border border-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-5 py-2 rounded-lg bg-[#032068] text-white hover:bg-[#031a5a] transition-colors duration-200"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Navbar;
