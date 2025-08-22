"use client";

import { useTranslations } from "next-intl";

import UserForm from "../form/userForm";

const ProfileManager = () => {
    const t = useTranslations("admin");

    return (
        <>
            <dl className='info-guide'>
                <dt>
                    <i className='far fa-message-exclamation'></i>
                    {t("notification")}
                </dt>
                <dd>
                    <span>*</span> {t("required")}
                </dd>
            </dl>

            <UserForm />
        </>
    );
};

export default ProfileManager;
