"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import { User } from "@/interfaces/user";

type AuthContextType = {
    user: User | null;
    setUserInfo: (userInfo: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const setUserInfo = (user: User | null) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return <AuthContext.Provider value={{ user, setUserInfo }}>{children}</AuthContext.Provider>;
};
