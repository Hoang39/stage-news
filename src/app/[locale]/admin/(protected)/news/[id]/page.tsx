"use client";

import { use } from "react";

import NewsDetailManager from "@/components/admin/newsDetail";
import withProtectedRoute from "@/components/route/withProtectedRoute";

type Props = {
    params: Promise<{ id: string }>;
};

const AdminNewsDetail = (props: Props) => {
    const { id } = use(props.params);

    return <NewsDetailManager id={id} />;
};

export default withProtectedRoute(AdminNewsDetail);
