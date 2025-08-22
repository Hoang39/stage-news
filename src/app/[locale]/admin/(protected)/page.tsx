"use client";

import AdminContainer from "@/components/admin";
import withProtectedRoute from "@/components/route/withProtectedRoute";

const Admin = () => {
    return <AdminContainer />;
};

export default withProtectedRoute(Admin);
