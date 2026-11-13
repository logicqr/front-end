import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout } from "react-icons/md";
import { LuLayoutDashboard, LuTag } from "react-icons/lu";
import { TbReceiptRupee } from "react-icons/tb";
import { FaClipboardList } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BiSupport } from "react-icons/bi";
import { useAuth } from "../../lib/auth";
import { Mark } from "../marketing/ui";
import { GrStorage } from "react-icons/gr";
import { TbChartDots } from "react-icons/tb";



function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const navigate = useNavigate();

    /**
     * Identity comes from the auth provider, which gets it from `GET /me` —
     * i.e. from the server. The previous version ran `jwtDecode` on the refresh
     * token in sessionStorage, which does not verify the signature, and used
     * the result to build this menu. Editing that stored value was enough to be
     * shown the admin interface.
     */
    const { role, id, displayName, signOut } = useAuth();
    const employeeData = displayName;



    const handleLogout = async () => {
        // Tells the server to revoke the refresh token as well, rather than
        // only clearing it here and leaving it valid for its full seven days.
        await signOut();
        navigate('/admin-login', { replace: true });
    };
    

    const menuItems = {
        ADMIN: [
            { name: "Dashboard", path: `/admin/dashboard/${id}`, icon: <LuLayoutDashboard className="text-2xl" /> },
            { name: "Account Setting", path: "/account-setting", icon: <CgProfile className="text-2xl" /> },
            { name: "Payout", path: "/payout", icon: <TbReceiptRupee className="text-2xl" /> },
            { name: "Employees Details", path: "/employees-details", icon: <FaClipboardList className="text-2xl" /> },
            { name: "Help Dashboard", path: "/help-dashboard", icon: <BiSupport className="text-2xl" /> },
            { name: "Pending Signups", path: "/temp-orders", icon: <GrStorage className="text-2xl" /> },
            // Traffic attribution and click tracking: ADMIN only.
            { name: "Analytics", path: "/analytics", icon: <TbChartDots className="text-2xl" /> },
        ],
        STAFF: [
            { name: "Dashboard", path: `/staff/dashboard/${id}`, icon: <LuLayoutDashboard className="text-2xl" /> },
            { name: "Account Settings", path: "/account-setting", icon: <CgProfile className="text-2xl" /> },
            // Leading slash: this used to be relative, so it resolved against
            // whatever route you were already on.
            { name: "Payout", path: `/payout/${id}`, icon: <TbReceiptRupee className="text-2xl" /> },
            { name: "Pending Signups", path: "/temp-orders", icon: <GrStorage className="text-2xl" /> },
        ],
    };

    const itemsToDisplay = menuItems[role] || [];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
    const initials = (employeeData || "?")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="fixed z-40">
            {/* `dark` switches the logo mark and wordmark to their on-ink colours. */}
            <aside
                className={`dark absolute flex h-screen flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}
                aria-label="Team navigation"
            >
                {/* Header */}
                <div className={`flex items-center border-b border-white/10 py-4 ${isOpen ? "justify-between px-5" : "justify-center px-2"}`}>
                    {isOpen ? (
                        <Link to="/" className="logo" aria-label="LogicQR home">
                            <Mark />
                            <span className="wm">
                                Logic<span>QR</span>
                            </span>
                        </Link>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? "Collapse menu" : "Expand menu"}
                        className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        {isOpen ? <IoMdClose className="text-2xl" /> : <CgMenuGridR className="text-2xl" />}
                    </button>
                </div>

                {/* Role, so it is obvious which hat you are wearing */}
                {isOpen ? (
                    <p className="px-5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">
                        {role === "ADMIN" ? "Admin" : "Staff"}
                    </p>
                ) : null}

                {/* Menu */}
                <nav className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-1">
                    {itemsToDisplay.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                title={isOpen ? undefined : item.name}
                                aria-label={item.name}
                                aria-current={active ? "page" : undefined}
                                className={`group flex items-center gap-3 rounded-xl py-2.5 text-[15px] font-medium transition ${
                                    isOpen ? "px-3" : "justify-center px-0"
                                } ${
                                    active
                                        ? "bg-white text-ink"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <span className="shrink-0 [&>svg]:text-[22px]">{item.icon}</span>
                                {isOpen ? <span className="truncate">{item.name}</span> : null}
                            </Link>
                        );
                    })}
                </nav>

                {/* Account */}
                <div className="border-t border-white/10 p-2 pb-6">
                    <div className={`flex items-center gap-3 rounded-xl py-2 ${isOpen ? "px-3" : "justify-center px-0"}`}>
                        <span
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white"
                            aria-hidden="true"
                        >
                            {initials}
                        </span>
                        {isOpen ? (
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-medium text-white">{employeeData}</span>
                                <span className="block text-xs text-white/50">{role === "ADMIN" ? "Administrator" : "Team member"}</span>
                            </span>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowLogoutPopup(true)}
                        title={isOpen ? undefined : "Sign out"}
                        aria-label="Sign out"
                        className={`mt-1 flex w-full items-center gap-3 rounded-xl py-2.5 text-[15px] font-medium text-white/70 transition hover:bg-signal-warn/20 hover:text-white ${
                            isOpen ? "px-3" : "justify-center px-0"
                        }`}
                    >
                        <MdOutlineLogout className="shrink-0 text-[22px]" />
                        {isOpen ? <span>Sign out</span> : null}
                    </button>
                </div>
            </aside>

            {/* Sign-out confirmation */}
            {showLogoutPopup ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="signout-title"
                >
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-card">
                        <h3 id="signout-title" className="text-lg font-semibold tracking-tight text-ink">
                            Sign out?
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                            You will need to sign in again to get back to the team dashboard.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowLogoutPopup(false)}
                                className="rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/15 transition hover:bg-paper"
                            >
                                Stay signed in
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Nav;
