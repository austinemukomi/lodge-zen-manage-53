import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bed, 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  BarChart3,
  Home,
  Boxes,
  FileText,
  PlusCircle,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserRoleFromToken } from "@/utils/authUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  // Start with collapsed sidebar by default
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const userRole = getUserRoleFromToken();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        path: "/",
        icon: <Home className="w-5 h-5" />,
      }
    ];

    if (userRole === "ADMIN") {
      baseItems.push(
        {
          name: "Rooms",
          path: "/rooms",
          icon: <Boxes className="w-5 h-5" />,
        },
        {
          name: "Bookings",
          path: "/bookings",
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          name: "Employees",
          path: "/employees",
          icon: <Users className="w-5 h-5" />,
        },
        {
          name: "Reports",
          path: "/reports",
          icon: <BarChart3 className="w-5 h-5" />,
        }
      );
    }

    if (userRole === "RECEPTIONIST") {
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

    if (userRole === "USER") {
      baseItems.push(
        {
          name: "My Bookings",
          path: "/user/bookings",
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          name: "Book Room",
          path: "/user/book",
          icon: <PlusCircle className="w-5 h-5" />,
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

  const SidebarContent = () => (
    <div className="flex-grow p-4 overflow-y-auto">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors",
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100",
              collapsed && !isMobile ? "justify-center" : "justify-start"
            )}
            title={collapsed && !isMobile ? item.name : ""}
            onClick={() => isMobile && setIsOpen(false)}
          >
            {item.icon}
            {(!collapsed || isMobile) && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
  
  const SidebarHeader = () => (
    <div className="p-4 flex items-center justify-between border-b border-gray-200">
      {(!collapsed || isMobile) && (
        <div className="flex items-center">
          <Bed className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold text-xl text-gray-900">LodgeMaster</span>
        </div>
      )}
      {collapsed && !isMobile && <Bed className="h-8 w-8 text-primary mx-auto" />}
      {!isMobile && (
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
      )}
      {isMobile && (
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
    </div>
  );

  // Mobile version using drawer
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 z-40 p-4">
          <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
        </div>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="h-[90%] max-h-[90%]">
            <div className="bg-white flex flex-col h-full">
              <SidebarHeader />
              <SidebarContent />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop version
  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen z-10",
        collapsed ? "w-20" : "w-64",
        className,
        isMobile ? "hidden" : "flex"
      )}
    >
      <SidebarHeader />
      <SidebarContent />
    </aside>
  );
}
