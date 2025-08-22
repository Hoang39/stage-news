"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Spin } from "antd";
import { ClipboardPen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import useAuth from "@/hooks/useAuth";
import { useZodLocale } from "@/hooks/useZodLocale";
import { UserSignUpReq } from "@/interfaces/user";

import Input from "../input";

type Props = {
    id?: number;
    setIsVisible?: (value: boolean) => void;
};

type FormValues = UserSignUpReq & {
    confirmPassword: string;
};

const SignUpForm = (props: Props) => {
    const t = useTranslations("admin");

    const { signup, isPending } = useAuth();

    const { z, translateRequiredMessage, translateConfirmPassword, translateEmail } = useZodLocale({
        page: "admin"
    });

    const validateSchema = z
        .object({
            name: z.string().nonempty(translateRequiredMessage("name")),
            username: z.string().nonempty(translateRequiredMessage("username")),
            password: z.string().nonempty(translateRequiredMessage("password")),
            confirmPassword: z.string().nonempty(translateRequiredMessage("confirmPassword")),
            site: z.string().nonempty(translateRequiredMessage("site")),
            email: z.string().nonempty(translateEmail())
        })
        .refine((data) => data.password == data.confirmPassword, {
            message: translateConfirmPassword(),
            path: ["confirmPassword"]
        });

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(validateSchema)
    });

    const handleSignUp = async (data: UserSignUpReq) => {
        try {
            const res = await signup({
                data
            });

            if (res) props?.setIsVisible?.(false);
        } catch (error) {
            throw error;
        }
    };

    return (
        <>
            <form name='modifyForm' id='modifyForm' onSubmit={handleSubmit(handleSignUp)}>
                <fieldset>
                    <legend>{t("user")}</legend>
                    <div className='box-section' style={{ padding: "0 24px" }}>
                        <div className='write-area'>
                            <dl>
                                <dt>{t("username")}</dt>
                                <dd>
                                    <Input
                                        register={register("username")}
                                        type='text'
                                        title={t("username")}
                                        className='input-box w100p'
                                        placeholder={t("username")}
                                        error={errors.username}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("password")}</dt>
                                <dd>
                                    <Input
                                        register={register("password")}
                                        type='password'
                                        title={t("password")}
                                        showPasswordToggle={true}
                                        className='input-box w100p'
                                        placeholder={t("password")}
                                        error={errors.password}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("confirmPassword")}</dt>
                                <dd>
                                    <Input
                                        register={register("confirmPassword")}
                                        type='password'
                                        title={t("confirmPassword")}
                                        showPasswordToggle={true}
                                        className='input-box w100p'
                                        placeholder={t("confirmPassword")}
                                        error={errors.confirmPassword}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("name")}</dt>
                                <dd>
                                    <Input
                                        register={register("name")}
                                        type='text'
                                        title={t("name")}
                                        className='input-box w100p'
                                        placeholder={t("name")}
                                        error={errors.name}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("email")}</dt>
                                <dd>
                                    <Input
                                        register={register("email")}
                                        type='text'
                                        title={t("email")}
                                        className='input-box w100p'
                                        placeholder={t("email")}
                                        error={errors.email}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("site")}</dt>
                                <dd>
                                    <Input
                                        register={register("site")}
                                        type='text'
                                        title={t("site")}
                                        className='input-box w100p'
                                        placeholder={t("site")}
                                        error={errors.site}
                                    />
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className='btn-area' style={{ backgroundColor: "#f4f7fc", justifyContent: "center" }}>
                        <button className='btn-default bg-blue2 w150' type='submit' disabled={isPending}>
                            {isPending ? (
                                <Spin size='small' />
                            ) : (
                                <>
                                    <ClipboardPen size={18} strokeWidth={1.4} />
                                    <span>{t("update")}</span>
                                </>
                            )}
                        </button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export default SignUpForm;
