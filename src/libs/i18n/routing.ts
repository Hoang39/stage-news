import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "ko"],
    defaultLocale: "ko",
    pathnames: {
        "/": "/",
        "/news": "/news",
        "/news/[slug]": "/news/[slug]"
    }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);
