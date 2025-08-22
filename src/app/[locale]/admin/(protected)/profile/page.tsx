"use client";

import ProfileManager from "@/components/admin/profile";
import withProtectedRoute from "@/components/route/withProtectedRoute";

const AdminProfile = () => {
    return <ProfileManager />;
};

export default withProtectedRoute(AdminProfile);
