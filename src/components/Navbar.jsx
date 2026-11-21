
import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogout = async () => {
        try {
            setLoading(true);
            setError("");
            await logout();
            navigate("/login", { replace: true });
        } catch {
            setError("Unable to logout. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                <span className="text-base font-semibold tracking-tight text-gray-900">
                    Lead<span className="text-blue-600">Manager</span>
                </span>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-1.5 sm:flex">
                        <User size={15} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                            {user?.name}
                        </span>
                    </div>

                    <div className="hidden h-4 w-px bg-gray-200 sm:block" />

                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        <LogOut size={14} />
                        {loading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>

            {error && (
                <p className="px-6 pb-2 text-right text-sm text-red-600">
                    {error}
                </p>
            )}
        </header>
    );
};

export default Navbar;
