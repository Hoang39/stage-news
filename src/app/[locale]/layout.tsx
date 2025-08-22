import { ReactNode } from "react";

import { notFound } from "next/navigation";

import { setRequestLocale } from "next-intl/server";

import BaseLayout from "@/components/layout/baseLayout";
import { routing } from "@/libs/i18n/routing";

import "../globals.css";

type LayoutProps = {
    children: ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: LayoutProps) {
    const { locale } = await props.params;
    const { children } = props;

    if (!routing.locales.includes(locale as "en" | "ko")) {
        notFound();
    }

    setRequestLocale(locale);

    return (
        <html lang={locale}>
            <head>
                <meta
                    name='keywords'
                    content='STAGE ,스테이지, 라이브스테이지, livestage, 케이팝, KPOP, 팬덤, 콘텐츠, 라이브, 굿즈, 굿즈 중고거래'
                />
            </head>
            <body>
                <BaseLayout locale={locale}>{children}</BaseLayout>
            </body>
        </html>
    );
}
