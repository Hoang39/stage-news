import AdminBreadcrumbs from "../breadcrumbs/adminBreadcrumbs";
import FooterAdmin from "../footer/footerAdmin";
import HeaderAdmin from "../header/headerAdmin";
import AdminMenu from "../menu/adminMenu";

export default function AdminLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='wrap-admin'>
            <AdminMenu />
            <div className='container-admin'>
                <HeaderAdmin />
                <AdminBreadcrumbs />
                <div className='h124'></div>
                {children}
                <div className='h60'></div>
                <FooterAdmin />
            </div>
        </div>
    );
}
