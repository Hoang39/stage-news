"use client";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import useUser from "@/hooks/useUser";

import Datetime from "../datetime";
import ToggleLanguage from "../toggle/toggleLanguage";

export default function HeaderAdmin() {
    const { user } = useUser();
    const t = useTranslations("admin");
    const router = useRouter();

    return (
        <dl className='header-admin'>
            <Datetime />

            <dd>
                <ToggleLanguage />
                <div id='topProfile' onClick={() => router.push("/admin/profile")}>
                    <p>{user?.name?.[0] ?? ""}</p>
                    <h2>{t("title", { name: user?.name })}</h2>
                </div>
            </dd>
        </dl>
    );
}
