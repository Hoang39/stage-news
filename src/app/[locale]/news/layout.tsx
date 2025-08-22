import NewLayout from "@/components/layout/newLayout";

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <NewLayout>{children}</NewLayout>;
}
