"use client";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Spin } from "antd";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import useAuth from "@/hooks/useAuth";
import { useZodLocale } from "@/hooks/useZodLocale";
import type { UserLoginReq } from "@/interfaces/user";

import images from "../../../public/assets/image/images";
import Input from "../input";
import ToggleLanguage from "../toggle/toggleLanguage";

export default function LoginForm() {
    const t = useTranslations("login");

    const { login, isPending } = useAuth();

    const { z, translateRequiredMessage } = useZodLocale({
        page: "login"
    });

    const validateSchema = z.object({
        username: z.string().nonempty(translateRequiredMessage("username")),
        password: z.string().nonempty(translateRequiredMessage("password"))
    });

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<UserLoginReq>({
        resolver: zodResolver(validateSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const handleLogin = async (data: UserLoginReq) => {
        try {
            login({ data });
        } catch (error) {
            throw error;
        }
    };

    return (
        <div>
            <form name='loginForm' id='loginForm' onSubmit={handleSubmit(handleLogin)}>
                <fieldset>
                    <legend>{t("button")}</legend>
                    <h2>
                        <Image src={images.logo.logo2} height={120} alt='logo' />
                    </h2>
                    <h3>{t("description")}</h3>
                    <ul>
                        <li>
                            <Input
                                register={register("username")}
                                type='text'
                                title={t("username")}
                                placeholder={t("username")}
                                error={errors.username}
                                className='id-icn'
                                autoFocus
                            />
                        </li>
                        <li>
                            <Input
                                register={register("password")}
                                type='password'
                                showPasswordToggle={true}
                                title={t("password")}
                                placeholder={t("password")}
                                error={errors.password}
                                className='pw-icn'
                            />
                        </li>
                    </ul>
                    <ToggleLanguage />
                    <p style={{ marginTop: "8px" }}>
                        <button type='submit' disabled={isPending}>
                            {isPending ? <Spin size='small' /> : t("button")}
                        </button>
                    </p>
                </fieldset>
            </form>
        </div>
    );
}
