import BaseLayout from "@/components/layout/baseLayout";
import NotFoundPage from "@/components/not-found";
import { routing } from "@/libs/i18n/routing";

import "./globals.css";

export default function GlobalNotFound() {
    return (
        <html>
            <body>
                <BaseLayout locale={routing.defaultLocale}>
                    <NotFoundPage />
                </BaseLayout>
            </body>
        </html>
    );
}
