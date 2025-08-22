"use client";

import { redirect } from "next/navigation";

import { useSession } from "next-auth/react";

import Loading from "../loading/Loading";

const withNextAuthRoute = <P extends object>(Component: React.ComponentType<P>) => {
    const WrappedComponent = (props: P) => {
        const { status } = useSession({
            required: true,
            onUnauthenticated() {
                // The user is not authenticated, handle it here.
                redirect("/auth/signin");
            }
        });

        if (status === "loading") {
            return <Loading type='verifying' />;
        }

        return <Component {...props} />;
    };

    WrappedComponent.displayName = `withNextAuthRoute(${Component.displayName || Component.name || "Component"})`;

    return WrappedComponent;
};

export default withNextAuthRoute;
