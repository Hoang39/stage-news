import { useEffect, useState } from "react";

import { useLocale } from "next-intl";

const locales = {
    en: "en-US",
    ko: "ko-KR"
};

const useDateTime = () => {
    const [currentDateTime, setCurrentDateTime] = useState<string>("");
    const locale = useLocale();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentDateTime(
                now.toLocaleString(locales[locale as "en" | "ko"], {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                })
            );
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, [locale]);

    return { currentDateTime };
};

export default useDateTime;
