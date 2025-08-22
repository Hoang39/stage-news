"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Spin } from "antd";
import { CircleX, ClipboardPen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import useUser from "@/hooks/useUser";
import { useZodLocale } from "@/hooks/useZodLocale";
import { User } from "@/interfaces/user";

import Input from "../input";

type FormValues = {
    password: string;
    confirmPassword: string;
};

type Props = {
    id?: number;
    setIsVisible: (value: boolean) => void;
};

export function ChangePasswordForm(props: Props) {
    const t = useTranslations("admin");

    const { isPending, updateUser } = useUser();

    const { z, translateRequiredMessage, translateConfirmPassword } = useZodLocale({
        page: "admin"
    });

    const validateSchema = z
        .object({
            password: z.string().nonempty(translateRequiredMessage("password")),
            confirmPassword: z.string().nonempty(translateRequiredMessage("confirmPassword"))
        })
        .refine((data) => data.password == data.confirmPassword, {
            message: translateConfirmPassword(),
            path: ["confirmPassword"]
        });

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(validateSchema)
    });

    const handleUpdate = async (data: Partial<User>) => {
        try {
            reset();
            await updateUser({
                id: props.id,
                data
            });
            props.setIsVisible(false);
        } catch (error) {
            throw error;
        }
    };

    return (
        <form name='changePasswordForm' id='changePasswordForm' onSubmit={handleSubmit(handleUpdate)}>
            <fieldset>
                <legend>{t("change-password")}</legend>
                <div className='box-section' style={{ padding: "0 24px" }}>
                    <div className='write-area'>
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
                    </div>
                </div>
                <div className='btn-area'>
                    <button
                        className='btn-default middle color-gray border-gray w120 bg-white'
                        type='button'
                        disabled={isPending}
                        onClick={() => props.setIsVisible?.(false)}
                    >
                        <>
                            <CircleX size={20} color='#888' strokeWidth={1.2} />
                            <span>{t("cancel")}</span>
                        </>
                    </button>
                    <button className='btn-default middle bg-blue2 w120' type='submit' disabled={isPending}>
                        {isPending ? (
                            <Spin size='small' />
                        ) : (
                            <>
                                <ClipboardPen size={20} strokeWidth={1.2} />
                                <span>{t("update")}</span>
                            </>
                        )}
                    </button>
                </div>
            </fieldset>
        </form>
    );
}
