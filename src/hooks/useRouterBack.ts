import { useLocale } from "next-intl";

import { useRouter } from "@/libs/i18n/routing";

export function useCustomBack() {
    const router = useRouter();
    const currentLocale = useLocale();

    const handleChange = (currentPathname: string, currentLocale: string, newLocale: string) => {
        const days = 30;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = date.toUTCString();
        document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

        router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`) as never);

        router.refresh();
    };

    return () => {
        const previousUrl = document.referrer;

        if (previousUrl) {
            const updatedUrl = new URL(previousUrl);

            console.log(previousUrl, updatedUrl);
            handleChange(updatedUrl.toString(), updatedUrl.pathname.split("/")[1], currentLocale);
        } else {
            router.push("/admin" as never);
        }
    };
}
