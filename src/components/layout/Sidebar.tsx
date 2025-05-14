
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bed, 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  BarChart3,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserRoleFromToken } from "@/utils/authUtils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const userRole = getUserRoleFromToken();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        path: "/",
        icon: <Bed className="w-5 h-5" />,
      }
    ];

    if (userRole === "ADMIN" || userRole === "RECEPTIONIST") {
      baseItems.push(
        {
          name: "Bookings",
          path: "/bookings",
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          name: "Guests",
          path: "/guests",
          icon: <Users className="w-5 h-5" />,
        }
      );
    }

    if (userRole === "ADMIN") {
      baseItems.push(
        {
          name: "Reports",
          path: "/reports",
          icon: <BarChart3 className="w-5 h-5" />,
        }
      );
    }

    baseItems.push({
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <Bed className="h-6 w-6 text-primary" />
            <span className="ml-2 font-bold text-xl text-gray-900">LodgeMaster</span>
          </div>
        )}
        {collapsed && <Bed className="h-8 w-8 text-primary mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                isActive(item.path)
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div
          className={cn(
            "flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </div>
      </div>
    </aside>
  );
}
