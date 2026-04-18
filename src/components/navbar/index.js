"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../icon";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { menuItems } from "@/mock/data";

const Sidebar = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const userAuth = useSelector((state) => state.auth.isAuthenticated);

    const [mounted, setMounted] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => { setMounted(true); }, []);

    const isActive = (href) => pathname === href;
    const isParentActive = (item) =>
        item.children?.some((c) => pathname === c.href);

    const NavItem = ({ item }) => {
        if (item.children) {
            const parentActive = isParentActive(item);
            const open = openDropdown === item.label;
            return (
                <div>
                    <button
                        onClick={() => setOpenDropdown(open ? null : item.label)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                            ${parentActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                    >
                        <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-left">{item.label}</span>
                                <Icon
                                    icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
                                    className="w-4 h-4 shrink-0 text-gray-400"
                                />
                            </>
                        )}
                    </button>

                    {!collapsed && open && (
                        <div className="ml-8 mt-1 flex flex-col gap-0.5">
                            {item.children.map((sub) => (
                                <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200
                                        ${isActive(sub.href)
                                            ? "bg-indigo-600 text-white font-medium"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        }`}
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.href)
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
            >
                <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
            </Link>
        );
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Icon icon="mdi:shield-crown-outline" className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 tracking-wide">
                            Admin Panel
                        </span>
                    </Link>
                )}
                {collapsed && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto">
                        <Icon icon="mdi:shield-crown-outline" className="w-4 h-4 text-white" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden xl:flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                    <Icon
                        icon={collapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
                        className="w-4 h-4"
                    />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {!collapsed && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
                        Navigation
                    </p>
                )}
                {menuItems.map((item) => (
                    <NavItem key={item.label} item={item} />
                ))}
            </nav>

            {/* Footer / Auth */}
            {mounted && (
                <div className="px-3 py-4 border-t border-gray-100">
                    {userAuth ? (
                        <button
                            onClick={() => dispatch(logout())}
                            title={collapsed ? "Logout" : undefined}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200`}
                        >
                            <Icon icon="mdi:logout" className="w-5 h-5 shrink-0" />
                            {!collapsed && <span>Logout</span>}
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            title={collapsed ? "Login" : undefined}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
                        >
                            <Icon icon="mdi:login" className="w-5 h-5 shrink-0" />
                            {!collapsed && <span>Login</span>}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="xl:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14 shadow-sm">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Icon icon="mdi:shield-crown-outline" className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Admin Panel</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <Icon icon={mobileOpen ? "mdi:close" : "mdi:menu"} className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="xl:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`xl:hidden fixed top-0 left-0 h-full z-40 bg-white shadow-xl transition-transform duration-300 w-64
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <SidebarContent />
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`hidden xl:flex flex-col fixed top-0 left-0 h-full bg-white border-r border-gray-100 shadow-sm z-30 transition-all duration-300
                    ${collapsed ? "w-[68px]" : "w-60"}`}
            >
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
