"use client";

import { useEffect } from "react";

import { redirect } from "next/navigation";

import useUser from "@/hooks/useUser";

const withProtectedRoute = <P extends object>(Component: React.ComponentType<P>) => {
    const WrappedComponent = (props: P) => {
        const { user } = useUser();

        useEffect(() => {
            if (!user && !localStorage.getItem("accessToken")) {
                redirect("/admin/login");
            }
        }, [user]);

        return user ? <Component {...props} /> : null;
    };

    WrappedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name || "Component"})`;

    return WrappedComponent;
};

export default withProtectedRoute;
