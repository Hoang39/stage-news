"use client";

import UserManager from "@/components/admin/user";
import withProtectedRoute from "@/components/route/withProtectedRoute";

const AdminUser = () => {
    return <UserManager />;
};

export default withProtectedRoute(AdminUser);
