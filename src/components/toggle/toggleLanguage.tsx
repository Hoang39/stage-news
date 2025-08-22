"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLocale } from "next-intl";

export default function ToggleLanguage() {
    const router = useRouter();

    const currentPathname = usePathname();

    const currentLocale = useLocale();

    const handleChange = (newLocale: string) => {
        const days = 30;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = date.toUTCString();
        document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

        router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));

        router.refresh();
    };

    return (
        <label className='switch' onClick={() => handleChange(currentLocale == "ko" ? "en" : "ko")}>
            <input type='checkbox' checked={currentLocale == "ko"} readOnly />
            <span className='slider round'>{currentLocale == "ko" ? "KOR" : "ENG"}</span>
        </label>
    );
}
