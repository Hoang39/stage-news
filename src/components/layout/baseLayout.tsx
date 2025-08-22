import { ReactNode } from "react";

import { getMessages, getTimeZone } from "next-intl/server";

import { IntErrorProvider } from "@/providers/IntErrorProvider";
import LocaleProvider from "@/providers/LocaleProvider";
import NextAuthProvider from "@/providers/nextAuthProvider";
import { NotificationProvider } from "@/providers/notificationProvider";

import { ReactQueryClientProvider } from "../../providers/reactQueryClientProvider";

type LayoutProps = {
    children: ReactNode;
    locale: string;
};

export default async function BaseLayout({ children, locale }: Readonly<LayoutProps>) {
    const messages = await getMessages();
    const timeZone = await getTimeZone();

    return (
        <IntErrorProvider timeZone={timeZone} locale={locale} messages={messages}>
            <LocaleProvider>
                <ReactQueryClientProvider>
                    <NextAuthProvider>
                        <NotificationProvider>{children}</NotificationProvider>
                    </NextAuthProvider>
                </ReactQueryClientProvider>
            </LocaleProvider>
        </IntErrorProvider>
    );
}
