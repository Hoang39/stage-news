import { ReactNode } from "react";

import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ko";
import { useLocale } from "next-intl";

type LocaleProviderProps = {
    children: ReactNode;
};

export default function LocaleProvider({ children }: LocaleProviderProps) {
    const locale = useLocale();

    dayjs.locale(locale);

    return <ConfigProvider locale={locale === "en" ? enUS : koKR}>{children}</ConfigProvider>;
}
