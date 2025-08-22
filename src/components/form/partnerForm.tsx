"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import usePartner from "@/hooks/usePartner";
import { useZodLocale } from "@/hooks/useZodLocale";
import { Partner } from "@/interfaces/partner";

import images from "../../../public/assets/image/images";
import Input from "../input";

interface PartnerFormProps {
    type: string;
    id?: number;
    setIsVisible?: (isVisible: boolean) => void;
}

export default function PartnerForm(props: PartnerFormProps) {
    const t = useTranslations("partner");

    const { partner, addPartner, updatePartner, isPending } = usePartner({});

    const [partnerDetail, setPartnerDetail] = useState<Partner | null>();
    const [file, setFile] = useState<Blob | MediaSource>();

    useEffect(() => {
        setPartnerDetail(partner?.filter((item: Partner) => item.id == props.id)?.[0]);
    }, [partner, props.id]);

    const { z, translateRequiredMessage } = useZodLocale({
        page: "partner"
    });

    const validateSchema = z.object({
        date: z.coerce.string(),
        title: z.string().nonempty(translateRequiredMessage("title")),
        image: z.string().nonempty(translateRequiredMessage("image"))
    });

    const {
        handleSubmit,
        register,
        reset,
        trigger,
        setValue,
        control,
        formState: { errors }
    } = useForm<Partial<Partner>>({
        resolver: zodResolver(validateSchema),
        defaultValues: {
            date: dayjs(partnerDetail?.date).format("YYYY-MM-DDTHH:mm"),
            title: partnerDetail?.title ?? "",
            image: partnerDetail?.image ?? ""
        }
    });

    useEffect(() => {
        if (partnerDetail) {
            reset({
                date: dayjs(partnerDetail?.date).format("YYYY-MM-DDTHH:mm"),
                title: partnerDetail.title,
                image: partnerDetail?.image
            });
        }
    }, [partnerDetail, props, reset]);

    const handleForm = useCallback(
        async (data: Partial<Partner>) => {
            try {
                const payload = {
                    file: file as string | Blob,
                    data: {
                        ...data,
                        link: "",
                        date: dayjs(data?.date)
                    }
                };

                if (props.type === "update") {
                    await updatePartner({ ...payload, id: props?.id as number });
                } else {
                    await addPartner(payload);
                }

                reset({
                    date: dayjs().format("YYYY-MM-DDTHH:mm"),
                    title: "",
                    image: ""
                });
                setFile(undefined);
                setTimeout(() => props?.setIsVisible?.(false), 500);
            } catch (error) {
                throw error;
            }
        },
        [addPartner, file, props, reset, updatePartner]
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

            <form name='partnerForm' id='partnerForm' onSubmit={handleSubmit(handleForm)}>
                <fieldset>
                    <legend>{t(props.type)}</legend>
                    <div className='box-section' style={{ padding: "0 24px" }}>
                        <div className='write-area'>
                            <dl>
                                <dt>{t("date")}</dt>
                                <dd>
                                    <Controller
                                        name='date'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                showTime
                                                format='YYYY-MM-DD HH:mm'
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(date: Dayjs | null) => field.onChange(date || dayjs())}
                                                placeholder='t("date")'
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
                                        defaultValue={partnerDetail?.title}
                                        error={errors.title}
                                    />
                                </dd>
                            </dl>
                            {/* <dl className='no-required'>
                                <dt>{t("link")}</dt>
                                <dd>
                                    <Input
                                        type='text'
                                        title={t("link")}
                                        placeholder={t("link")}
                                        className='input-box w100p'
                                        register={register("link")}
                                        defaultValue={partnerDetail?.link}
                                        error={errors.link}
                                    />
                                </dd>
                            </dl> */}
                            <dl className='file-input'>
                                <dt>{t("image")}</dt>
                                <dd>
                                    <label
                                        htmlFor='file1'
                                        className='btn-default middle color-blue2 border-blue2 w80 bg-white'
                                    >
                                        {t("upload")}
                                    </label>
                                    <Input
                                        type='text'
                                        title={t("image")}
                                        placeholder={t("image")}
                                        register={register("image")}
                                        className='input-box w100p'
                                        error={errors.image}
                                        disabled={true}
                                    />
                                    <input
                                        type='file'
                                        id='file1'
                                        accept='image/*'
                                        className='input-box'
                                        onChange={(e) => {
                                            setValue("image", e.target.value.split("\\").pop());
                                            trigger("image");
                                            const fileInput = e.target.files?.[0];
                                            if (fileInput) {
                                                setFile(fileInput);
                                            }
                                        }}
                                    />
                                    {(file || partnerDetail?.image) && (
                                        <div
                                            style={{
                                                minWidth: 40,
                                                maxWidth: 60,
                                                height: 40,
                                                backgroundImage: `url(${file ? URL.createObjectURL(file as Blob | MediaSource) : partnerDetail?.image})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                border: "#888 solid 1px",
                                                borderRadius: "4px"
                                            }}
                                        />
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
