"use client";

import NewsManager from "@/components/admin/news";
import withProtectedRoute from "@/components/route/withProtectedRoute";

const AdminNews = () => {
    return <NewsManager />;
};

export default withProtectedRoute(AdminNews);
