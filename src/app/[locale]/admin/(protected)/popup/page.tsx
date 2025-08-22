"use client";

import PopupManager from "@/components/admin/popup";
import withProtectedRoute from "@/components/route/withProtectedRoute";

const AdminPopup = () => {
    return <PopupManager />;
};

export default withProtectedRoute(AdminPopup);
