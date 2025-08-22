import { getTranslations } from "next-intl/server";

import AdminLayout from "@/components/layout/adminLayout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
    const params = await props.params;

    const { locale } = params;

    const t = await getTranslations({ locale, namespace: "meta-data" });

    return {
        title: t("manager-title"),
        description: t("manager-description")
    };
}

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <AdminLayout>{children}</AdminLayout>;
}
