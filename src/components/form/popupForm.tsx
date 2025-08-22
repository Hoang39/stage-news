"use client";

import { useCallback, useContext, useEffect, useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, InputNumber, Select, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { CircleArrowDown, CircleArrowLeft, CircleArrowRight, CircleArrowUp, CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import usePopup from "@/hooks/usePopup";
import { useZodLocale } from "@/hooks/useZodLocale";
import { Popup } from "@/interfaces/popup";
import { AuthContext } from "@/providers/authContextProvider";

import images from "../../../public/assets/image/images";
import Input from "../input";

const { Option } = Select;

interface PopupFormProps {
    type: string;
    id?: number;
    setIsVisible?: (isVisible: boolean) => void;
}

export default function PopupForm(props: PopupFormProps) {
    const t = useTranslations("popup");

    const context = useContext(AuthContext);

    const role = context?.user?.role;

    const { popup, addPopup, updatePopup, isPending } = usePopup({});

    const [popupDetail, setPopupDetail] = useState<Popup | null>();
    const [file, setFile] = useState<Blob | MediaSource>();

    useEffect(() => {
        setPopupDetail(popup?.filter((item: Popup) => item.id == props.id)?.[0]);
    }, [popup, props.id]);

    const { z, translateRequiredMessage, translateMinMessage, translateDifferentMessage } = useZodLocale({
        page: "popup"
    });

    const validateSchema = z
        .object({
            startDate: z.coerce.string(),
            endDate: z.coerce.string(),
            title: z.string().nonempty(translateRequiredMessage("title")),
            placement: z.string().nonempty(translateRequiredMessage("placement")),
            link: z.string(),
            image: z.string().nonempty(translateRequiredMessage("image")),
            width: z.number().positive(translateMinMessage("width", 0)),
            height: z.number().positive(translateMinMessage("height", 0)),
            margin: z.string(),
            site: z.string().nonempty(translateRequiredMessage("site"))
        })
        .refine((data) => dayjs(data.endDate).isAfter(dayjs(data.startDate)), {
            message: translateDifferentMessage("endDate", "startDate", "greater"),
            path: ["endDate"]
        });

    const selectPlacement = [
        { value: "top-center", label: "top-center" },
        { value: "top-left", label: "top-left" },
        { value: "top-right", label: "top-right" },
        { value: "middle-center", label: "middle-center" },
        { value: "middle-left", label: "middle-left" },
        { value: "middle-right", label: "middle-right" },
        { value: "bottom-center", label: "bottom-center" },
        { value: "bottom-left", label: "bottom-left" },
        { value: "bottom-right", label: "bottom-right" }
    ];

    const {
        handleSubmit,
        register,
        reset,
        trigger,
        setValue,
        control,
        formState: { errors }
    } = useForm<Partial<Popup>>({
        resolver: zodResolver(validateSchema),
        defaultValues: {
            startDate: dayjs(popupDetail?.startDate).format("YYYY-MM-DDTHH:mm"),
            endDate: dayjs(popupDetail?.endDate).format("YYYY-MM-DDTHH:mm"),
            title: popupDetail?.title,
            link: popupDetail?.link,
            image: popupDetail?.image,
            width: popupDetail?.width,
            height: popupDetail?.height,
            placement: props.type == "update" ? popupDetail?.placement : "middle-center",
            margin: popupDetail?.margin,
            site: popupDetail?.site
        }
    });

    useEffect(() => {
        if (popupDetail) {
            reset({
                startDate: dayjs(popupDetail?.startDate).format("YYYY-MM-DDTHH:mm"),
                endDate: dayjs(popupDetail?.endDate).format("YYYY-MM-DDTHH:mm"),
                title: popupDetail.title,
                link: popupDetail?.link,
                image: popupDetail?.image,
                width: popupDetail?.width,
                height: popupDetail?.height,
                placement: props.type == "update" ? popupDetail?.placement : "middle-center",
                margin: popupDetail?.margin,
                site: popupDetail?.site
            });
        }
    }, [popupDetail, props.type, reset]);

    const handleForm = useCallback(
        async (data: Partial<Popup>) => {
            try {
                const payload = {
                    file: file as string | Blob,
                    data: {
                        ...data,
                        startDate: dayjs(data?.startDate),
                        endDate: dayjs(data?.endDate)
                    }
                };

                if (props.type === "update") {
                    await updatePopup({ ...payload, id: props?.id as number });
                } else {
                    await addPopup(payload);
                }

                setTimeout(() => props?.setIsVisible?.(false), 500);
            } catch (error) {
                throw error;
            }
        },
        [addPopup, file, props, updatePopup]
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

            <form name='popupForm' id='popupForm' onSubmit={handleSubmit(handleForm)}>
                <fieldset>
                    <legend>{t(props.type)}</legend>
                    <div className='box-section' style={{ padding: "0 24px" }}>
                        <div className='write-area'>
                            <dl>
                                <dt>{t("startDate")}</dt>
                                <dd>
                                    <Controller
                                        name='startDate'
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                showTime
                                                format='YYYY-MM-DD HH:mm'
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(date: Dayjs | null) => field.onChange(date || dayjs())}
                                                placeholder='t("startDate")'
                                                className='input-box w100p'
                                            />
                                        )}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("endDate")}</dt>
                                <dd>
                                    <Controller
                                        name='endDate'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                showTime
                                                format='YYYY-MM-DD HH:mm'
                                                value={value ? dayjs(value) : null}
                                                onChange={(date: Dayjs | null) => onChange(date || dayjs())}
                                                placeholder='t("endDate")'
                                                className='input-box w100p'
                                            />
                                        )}
                                    />
                                    {errors?.endDate && (
                                        <span>
                                            <i className='far fa-circle-exclamation'></i> {errors?.endDate.message}
                                        </span>
                                    )}
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
                                        defaultValue={popupDetail?.title}
                                        error={errors.title}
                                    />
                                </dd>
                            </dl>
                            <dl className='no-required'>
                                <dt>{t("link")}</dt>
                                <dd>
                                    <Input
                                        type='text'
                                        title={t("link")}
                                        placeholder={t("link")}
                                        className='input-box w100p'
                                        register={register("link")}
                                        defaultValue={popupDetail?.link}
                                        error={errors.link}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("width")}</dt>
                                <dd>
                                    <Input
                                        type='number'
                                        title={t("width")}
                                        placeholder={t("width")}
                                        className='input-box w100p'
                                        register={register("width", { valueAsNumber: true })}
                                        defaultValue={popupDetail?.width}
                                        error={errors.width}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("height")}</dt>
                                <dd>
                                    <Input
                                        type='number'
                                        title={t("height")}
                                        placeholder={t("height")}
                                        className='input-box w100p'
                                        register={register("height", { valueAsNumber: true })}
                                        defaultValue={popupDetail?.height}
                                        error={errors.height}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("margin")}</dt>
                                <dd>
                                    <Controller
                                        name='margin'
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            const [top, bottom, left, right] = value
                                                ? value.split("-").map(Number)
                                                : [0, 0, 0, 0];

                                            const handleChange = (index: number, newValue: number) => {
                                                const updatedValues = [top, bottom, left, right];
                                                updatedValues[index] = newValue;

                                                onChange(updatedValues.join("-"));
                                            };

                                            return (
                                                <>
                                                    <span className='input-item-wrap'>
                                                        <InputNumber
                                                            title={t("top")}
                                                            value={top}
                                                            keyboard
                                                            min={0}
                                                            max={1000}
                                                            onChange={(value) => handleChange(0, value ?? 0)}
                                                            className='input-box w100p'
                                                            addonBefore={<CircleArrowUp size={16} color='#aaa' />}
                                                        />

                                                        <InputNumber
                                                            title={t("bottom")}
                                                            value={bottom}
                                                            keyboard
                                                            min={0}
                                                            max={1000}
                                                            onChange={(value) => handleChange(1, value ?? 0)}
                                                            className='input-box w100p'
                                                            addonBefore={<CircleArrowDown size={16} color='#aaa' />}
                                                        />
                                                    </span>
                                                    <span className='input-item-wrap'>
                                                        <InputNumber
                                                            title={t("left")}
                                                            value={left}
                                                            keyboard
                                                            min={0}
                                                            max={1000}
                                                            onChange={(value) => handleChange(2, value ?? 0)}
                                                            className='input-box w100p'
                                                            addonBefore={<CircleArrowLeft size={16} color='#aaa' />}
                                                        />

                                                        <InputNumber
                                                            title={t("right")}
                                                            value={right}
                                                            keyboard
                                                            min={0}
                                                            max={1000}
                                                            onChange={(value) => handleChange(3, value ?? 0)}
                                                            className='input-box w100p'
                                                            addonBefore={<CircleArrowRight size={16} color='#aaa' />}
                                                        />
                                                    </span>
                                                </>
                                            );
                                        }}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>{t("placement")}</dt>
                                <dd>
                                    <Controller
                                        name='placement'
                                        control={control}
                                        defaultValue={popupDetail?.placement}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                onChange={onChange}
                                                value={value || "middle-center"}
                                                style={{
                                                    width: "100%",
                                                    height: "40px"
                                                }}
                                            >
                                                {selectPlacement.map((item: any) => (
                                                    <Option
                                                        value={item.value}
                                                        key={item.value}
                                                        style={{ fontSize: "12px" }}
                                                    >
                                                        {t(item.label)}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
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
                                            defaultValue={popupDetail?.site}
                                            error={errors.site}
                                        />
                                    </dd>
                                </dl>
                            )}
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
                                    {(file || popupDetail?.image) && (
                                        <div
                                            style={{
                                                minWidth: 40,
                                                maxWidth: 60,
                                                height: 40,
                                                backgroundImage: `url(${file ? URL.createObjectURL(file as Blob | MediaSource) : popupDetail?.image})`,
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
