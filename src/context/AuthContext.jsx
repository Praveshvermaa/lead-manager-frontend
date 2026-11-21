
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check whether the user is already authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/auth/me");
                setUser(response.data.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login
    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        setUser(response.data.data.user);

        return response.data;
    };

    // Signup
    const signup = async (name, email, password) => {
        const response = await api.post("/auth/signup", {
            name,
            email,
            password,
        });

        setUser(response.data.data.user);

        return response.data;
    };

    // Logout
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};
