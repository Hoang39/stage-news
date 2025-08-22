import { useCallback } from "react";

import { usePathname, useRouter } from "next/navigation";

import { routing } from "@/libs/i18n/routing";

export const useScrollLink = () => {
    const router = useRouter();
    const pathname = usePathname();

    const locales = routing.locales;

    const isHomePath = useCallback(() => {
        return locales.some((locale) => pathname === `/${locale}` || pathname === `/${locale}/`);
    }, [pathname, locales]);

    const scrollLink = (obj: number, offset: number) => {
        if (!isHomePath()) {
            router.push(`/?${new URLSearchParams({ sec: `${obj}` }).toString()}`);
        } else {
            const position = document.getElementById(`${obj}`)?.offsetTop as number;
            window.scrollTo({ top: position - offset, behavior: "smooth" });
        }
    };

    return scrollLink;
};
