
import { Button } from "@/components/ui/button";
import { Bell, Search, LogOut, User } from "lucide-react";
import { getUsername } from "@/utils/authUtils";

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const username = getUsername() || "User";

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6">
      <div className="w-full flex justify-between items-center">
        <div className="hidden lg:flex lg:w-[300px] lg:flex-col">
          <span className="text-lg font-semibold tracking-tight">LodgeMaster</span>
          <span className="text-xs text-gray-500">Hotel & Lodge Management</span>
        </div>
        
        <div className="relative max-w-md w-full hidden sm:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
          <input
            type="search"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              2
            </span>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{username}</span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
