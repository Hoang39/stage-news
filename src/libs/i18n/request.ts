import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that the incoming `locale` is valid
    if (!locale || !routing.locales.includes(locale as "en" | "ko")) {
        locale = routing.defaultLocale;
    }

    return {
        timeZone: "UTC",
        locale,
        messages: (
            await (locale === "en"
                ? // When using Turbopack, this will enable HMR for `en`
                  import("../../../public/locales/en/en.json")
                : import(`../../../public/locales/${locale}/${locale}.json`))
        ).default
    };
});
