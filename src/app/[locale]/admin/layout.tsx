import { ReactNode } from "react";

import { AdminProvider } from "@/providers/adminContextProvider";
import { AuthProvider } from "@/providers/authContextProvider";

type LayoutProps = {
    children: ReactNode;
};

export default async function AddLayout({ children }: LayoutProps) {
    return (
        <AuthProvider>
            <AdminProvider>{children}</AdminProvider>
        </AuthProvider>
    );
}
