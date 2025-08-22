"use client";

import { useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Spin } from "antd";
import dayjs from "dayjs";
import { ClipboardPen, FileLock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import useUser from "@/hooks/useUser";
import { useZodLocale } from "@/hooks/useZodLocale";
import { User } from "@/interfaces/user";

import Input from "../input";
import ModalWrapped from "../modal";
import { ChangePasswordForm } from "./changePasswordForm";

type FormValues = Partial<{
    name: string;
    site: string;
}>;

type Props = {
    id?: number;
    setIsVisible?: (value: boolean) => void;
};

const UserForm = (props: Props) => {
    const t = useTranslations("admin");

    const { user, userByOwner, isPending, updateUser } = useUser(
        props.id
            ? {
                  id: props.id
              }
            : undefined
    );

    const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

    const [userViewed, setUserViewed] = useState<User>();

    useEffect(() => {
        setUserViewed(props.id ? userByOwner : user);
    }, [props.id, user, userByOwner]);

    const { z, translateRequiredMessage } = useZodLocale({
        page: "admin"
    });

    const validateSchema = z.object({
        name: z.string().nonempty(translateRequiredMessage("name")),
        ...(props.id && user?.role
            ? {
                  site: z.string().nonempty(translateRequiredMessage("site"))
              }
            : {})
    });

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(validateSchema),
        defaultValues: {
            name: userViewed?.name,
            ...(props.id && user?.role
                ? {
                      site: userViewed?.site
                  }
                : {})
        }
    });

    useEffect(() => {
        if (userViewed) {
            reset();
        }
    }, [userViewed, reset]);

    const handleUpdate = useCallback(
        async (data: Partial<User>) => {
            try {
                await updateUser({
                    id: props?.id,
                    data
                });
                props?.setIsVisible?.(false);
            } catch (error) {
                throw error;
            }
        },
        [props, updateUser]
    );

    return (
        <>
            <form name='modifyForm' id='modifyForm' onSubmit={handleSubmit(handleUpdate)}>
                <fieldset>
                    <legend>{t("user")}</legend>
                    <div className='box-section' style={{ padding: "0 24px" }}>
                        <div className='write-area'>
                            <dl>
                                <dt>{t("login-information")}</dt>
                                <dd>
                                    <Input
                                        type='text'
                                        title={t("login-information")}
                                        defaultValue={t("login-information-text", {
                                            count: userViewed?.count,
                                            lastLog: dayjs(userViewed?.lastLog).format("YYYY-MM-DD HH:mm:ss")
                                        })}
                                        className='input-box w100p'
                                        disabled
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("username")}</dt>
                                <dd>
                                    <Input
                                        type='text'
                                        title={t("username")}
                                        defaultValue={userViewed?.username}
                                        className='input-box w100p'
                                        disabled
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
                                        defaultValue={userViewed?.name}
                                    />
                                </dd>
                            </dl>
                            {props.id && user?.role == "owner" && (
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
                                            defaultValue={userViewed?.site}
                                        />
                                    </dd>
                                </dl>
                            )}
                            <dl>
                                <dt>{t("email")}</dt>
                                <dd>
                                    <Input
                                        type='text'
                                        title={t("email")}
                                        className='input-box w100p'
                                        placeholder={t("email")}
                                        defaultValue={userViewed?.email}
                                        disabled
                                    />
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className='btn-area' style={{ backgroundColor: "#f4f7fc", justifyContent: "center" }}>
                        <button
                            className='btn-default bg-white color-blue2 border-blue2 w150'
                            type='button'
                            onClick={() => setIsOpenChangePassword(true)}
                        >
                            <>
                                <FileLock color='blue' size={18} strokeWidth={1.4} />
                                <span>{t("change-password")}</span>
                            </>
                        </button>
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
            <ModalWrapped
                isVisible={isOpenChangePassword}
                setIsVisible={setIsOpenChangePassword}
                title={t("change-password")}
            >
                <ChangePasswordForm setIsVisible={setIsOpenChangePassword} id={props.id} />
            </ModalWrapped>
        </>
    );
};

export default UserForm;
