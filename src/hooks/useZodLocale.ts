import { useTranslations } from "next-intl";
import * as z from "zod";

interface ZodLocaleProps {
    page?: string;
}

export const useZodLocale = (props?: ZodLocaleProps) => {
    const t = useTranslations("validation");

    const page = props?.page ? props.page : "";
    const tPage = useTranslations(page);

    const translateRequiredMessage = (path: string) => t("required", { path: tPage(path) });

    const translateInvalidMessage = (path: string) => t("invalid", { path: tPage(path) });

    const translateMinMessage = (path: string, min: number) => t("min", { path: tPage(path), min });

    const translateDifferentMessage = (path: string, path2: string, type: string) =>
        t("different", { path: tPage(path), path2: tPage(path2), type: tPage(type) });

    const translateLimitMessage = (path: string, min: number, max: number) =>
        t("limit", { path: tPage(path), min, max });

    const translateRegexMessage = (path: string) => t("regex", { path: tPage(path) });

    const translateEmail = () => t("email");

    const translateConfirmPassword = () => t("confirmPassword");

    return {
        z,
        translateRequiredMessage,
        translateDifferentMessage,
        translateInvalidMessage,
        translateLimitMessage,
        translateMinMessage,
        translateRegexMessage,
        translateEmail,
        translateConfirmPassword
    };
};
