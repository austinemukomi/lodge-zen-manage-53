
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { getUserRoleFromToken } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const userRole = getUserRoleFromToken();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine the homepage link based on user role
  const getHomeLink = () => {
    if (!userRole) return "/";

    switch (userRole) {
      case "ADMIN":
        return "/admin";
      case "RECEPTIONIST":
        return "/receptionist";
      case "USER":
        return "/user";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Button asChild className="w-full">
          <Link to={getHomeLink()}>Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
