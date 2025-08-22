"use client";

import { useCallback, useContext, useEffect, useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import useNews from "@/hooks/useNews";
import { useZodLocale } from "@/hooks/useZodLocale";
import { News } from "@/interfaces/news";
import { AuthContext } from "@/providers/authContextProvider";

import images from "../../../public/assets/image/images";
import Input from "../input";
import TextEditor from "../textEditor";

interface NewsFormProps {
    type: string;
    id?: number;
    setIsVisible?: (isVisible: boolean) => void;
}

export default function NewsForm(props: NewsFormProps) {
    const t = useTranslations("news");

    const context = useContext(AuthContext);

    const role = context?.user?.role;

    const { news, addNews, updateNews, isPending } = useNews({});

    const [newsDetail, setNewsDetail] = useState<News | null>();

    useEffect(() => {
        setNewsDetail(news?.filter((item: News) => item.id == props.id)?.[0]);
    }, [news, props.id]);

    const { z, translateRequiredMessage } = useZodLocale({
        page: "news"
    });

    const validateSchema = z.object({
        createdAt: z.coerce.string(),
        title: z.string().nonempty(translateRequiredMessage("title")),
        author: z.string().nonempty(translateRequiredMessage("author")),
        content: z
            .string()
            .refine(
                (value) => value.replace(/<\/?[^>]+(>|$)/g, "").trim().length > 0,
                translateRequiredMessage("content")
            ),
        site: z.string().nonempty(translateRequiredMessage("site"))
    });

    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors }
    } = useForm<Partial<News>>({
        resolver: zodResolver(validateSchema),
        defaultValues: {
            createdAt: dayjs(newsDetail?.createdAt).format("YYYY-MM-DDTHH:mm"),
            title: newsDetail?.title,
            author: newsDetail?.author,
            content: newsDetail?.content,
            site: newsDetail?.site
        }
    });

    useEffect(() => {
        if (newsDetail) {
            reset({
                createdAt: dayjs(newsDetail.createdAt).format("YYYY-MM-DDTHH:mm"),
                title: newsDetail.title,
                author: newsDetail.author,
                content: newsDetail.content,
                site: newsDetail?.site
            });
        }
    }, [newsDetail, reset]);

    const handleForm = useCallback(
        async (data: Partial<News>) => {
            try {
                const payload = {
                    data: { ...data, createdAt: dayjs(data?.createdAt) }
                };

                if (props.type === "update") {
                    await updateNews({ ...payload, id: props?.id as number });
                } else {
                    await addNews(payload);
                }

                setTimeout(() => props?.setIsVisible?.(false), 500);
            } catch (error) {
                throw error;
            }
        },
        [addNews, props, updateNews]
    );

    return (
        <>
            <dl className='info-guide' style={{ padding: "12px 24px", color: "#888" }}>
                <dt>
                    <i className='far fa-message-exclamation'></i>
                    {t("notification")}
                </dt>
                <dd>
                    <span>*</span> {t("required")}
                </dd>
            </dl>

            <form name='newsForm' id='newsForm' onSubmit={handleSubmit(handleForm)}>
                <fieldset>
                    <legend>{t(props.type)}</legend>
                    <div className='box-section' style={{ padding: "0 24px" }}>
                        <div className='write-area'>
                            <dl>
                                <dt>{t("createdAt")}</dt>
                                <dd>
                                    <Controller
                                        name='createdAt'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                showTime
                                                format='YYYY-MM-DD HH:mm'
                                                value={value ? dayjs(value) : null}
                                                onChange={(date: Dayjs | null) => onChange(date || dayjs())}
                                                placeholder='t("createdAt")'
                                                className='input-box w100p'
                                            />
                                        )}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("title")}</dt>
                                <dd>
                                    <Input
                                        type='text'
                                        title={t("title")}
                                        placeholder={t("title")}
                                        className='input-box w100p'
                                        register={register("title")}
                                        defaultValue={newsDetail?.title}
                                        error={errors.title}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("author")}</dt>
                                <dd>
                                    <Input
                                        type='text'
                                        title={t("author")}
                                        placeholder={t("author")}
                                        className='input-box w100p'
                                        register={register("author")}
                                        defaultValue={newsDetail?.author}
                                        error={errors.author}
                                    />
                                </dd>
                            </dl>
                            {role == "owner" && (
                                <dl>
                                    <dt>{t("site")}</dt>
                                    <dd>
                                        <Input
                                            type='text'
                                            title={t("site")}
                                            placeholder={t("site")}
                                            className='input-box w100p'
                                            register={register("site")}
                                            defaultValue={newsDetail?.site}
                                            error={errors.site}
                                        />
                                    </dd>
                                </dl>
                            )}
                            <dl>
                                <dt>{t("content")}</dt>
                                <dd>
                                    <Controller
                                        name='content'
                                        control={control}
                                        defaultValue={newsDetail?.content}
                                        render={({ field: { onChange, value } }) => (
                                            <TextEditor onChange={onChange} defaultValue={value} />
                                        )}
                                    />
                                    {errors?.content && (
                                        <span>
                                            <i className='far fa-circle-exclamation'></i> {errors?.content.message}
                                        </span>
                                    )}
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className='btn-area'>
                        <button
                            className='btn-default middle color-gray border-gray w120 bg-white'
                            type='button'
                            disabled={isPending}
                            onClick={() => props?.setIsVisible?.(false)}
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
                                    <Image src={images.icn.icn_floppy_disk} alt='' width={20} height={20} />
                                    <span>{t(props.type)}</span>
                                </>
                            )}
                        </button>
                    </div>
                </fieldset>
            </form>
        </>
    );
}
