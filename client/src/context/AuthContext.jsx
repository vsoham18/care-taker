import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import { api } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const { data } = await api.get("/users/me");

            setUser(data.data.user);
        } catch (error) {
            console.error("Failed to fetch current user:", error);

            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);
 
    const login = async ({ email, password }) => {
        const { data } = await api.post("/users/login", {
            email,
            password,
        });

        setUser(data.data.user);

        return data.data.user;
    };

    const register = async ({
        name,
        email,
        phone,
        password,
        confirmPassword,
    }) => {
        const { data } = await api.post("/users/register", {
            name,
            email,
            phone,
            password,
            confirmPassword,
        });

        setUser(data.data.user);

        return data.data.user;
    };

    const logout = async () => {
        try {
            await api.post("/users/logout");
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};