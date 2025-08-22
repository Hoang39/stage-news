"use client";

import PartnerManager from "@/components/admin/partner";
import withProtectedRoute from "@/components/route/withProtectedRoute";

const AdminPopup = () => {
    return <PartnerManager />;
};

export default withProtectedRoute(AdminPopup);
