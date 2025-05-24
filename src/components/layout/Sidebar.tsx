
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bed, 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3,
  Home,
  Boxes,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserRoleFromToken } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const userRole = getUserRoleFromToken();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        path: "/",
        icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
      }
    ];

    if (userRole === "ADMIN") {
      baseItems.push(
        {
          name: "Rooms",
          path: "/rooms",
          icon: <Boxes className="w-4 h-4 sm:w-5 sm:h-5" />,
        },
        {
          name: "Bookings",
          path: "/bookings",
          icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
        },
        {
          name: "Employees",
          path: "/employees",
          icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
        },
        {
          name: "Reports",
          path: "/reports",
          icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
        }
      );
    }

    if (userRole === "RECEPTIONIST") {
      baseItems.push(
        {
          name: "Bookings",
          path: "/bookings",
          icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
        },
        {
          name: "Guests",
          path: "/guests",
          icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
        }
      );
    }

    if (userRole === "USER") {
      baseItems.push(
        {
          name: "My Bookings",
          path: "/user/bookings",
          icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
        },
        {
          name: "Book Room",
          path: "/user/book",
          icon: <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
        }
      );
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Mobile menu trigger
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-white/80 backdrop-blur-sm shadow-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 md:hidden shadow-xl",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              <Bed className="h-6 w-6 text-primary" />
              <span className="ml-2 font-bold text-xl text-gray-900">LodgeMaster</span>
            </div>
          </div>

          <div className="flex-grow p-4 overflow-y-auto">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "bg-white/95 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 flex flex-col h-screen z-10 hidden md:flex shadow-lg",
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
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
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
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100",
                collapsed ? "justify-center" : "justify-start"
              )}
              title={collapsed ? item.name : ""}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
