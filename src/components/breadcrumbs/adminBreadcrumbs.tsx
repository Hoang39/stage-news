"use client";

import { useContext, useEffect, useState } from "react";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import useNews from "@/hooks/useNews";
import usePartner from "@/hooks/usePartner";
import usePopup from "@/hooks/usePopup";
import useUser from "@/hooks/useUser";
import { menuList } from "@/libs/adminRoute";
import { AdminContext } from "@/providers/adminContextProvider";

import images from "../../../public/assets/image/images";
import NewsForm from "../form/newsForm";
import PartnerForm from "../form/partnerForm";
import PopupForm from "../form/popupForm";
import SignUpForm from "../form/signUpForm";
import ModalWrapped from "../modal";
import ModalConfirm from "../modal/ModalConfirm";

export default function AdminBreadcrumbs() {
    const router = useRouter();
    const pathname = usePathname().split("/")[3] ?? "admin";
    const id = usePathname().split("/")[4] ?? null;
    const t = useTranslations("admin");

    const context = useContext(AdminContext);

    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleModalDelete, setIsVisibleModalDelete] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const editBtn = menuList?.filter((item) => item.name == pathname)[0]?.editBtn;

    const data =
        pathname == "news"
            ? context?.news
            : pathname == "popup"
              ? context?.popup
              : pathname == "partner"
                ? context?.partner
                : pathname == "user"
                  ? context?.users
                  : [];

    useEffect(() => {
        if (
            (context?.news?.length && pathname != "news") ||
            (context?.users?.length && pathname != "user") ||
            (context?.popup?.length && pathname != "popup") ||
            (context?.partner?.length && pathname != "partner")
        ) {
            context?.resetExp(pathname);
        }
    }, [context, pathname]);

    const { deleteNews } = useNews({ onlyMethod: true });
    const { deleteUser } = useUser({ onlyMethod: true });
    const { deletePopup } = usePopup({ onlyMethod: true });
    const { deletePartner } = usePartner({});

    return (
        <dl className='title-section'>
            <dt>
                {/* <h2>{t(pathname)}</h2> */}
                <div>
                    <Image src={images.icn.icn_house} alt='' width={16} />
                    <span>{">"}</span> {t("manager")}
                    {pathname != "admin" && (
                        <>
                            <span>{">"}</span>
                            {t(pathname)}
                        </>
                    )}
                </div>
            </dt>
            <dd>
                {editBtn && (
                    <>
                        <span className='btn-default middle bg-green1' onClick={() => setIsVisible(true)}>
                            <Image src={images.icn.icn_check} alt='' width={12} />
                            {t("create")}
                        </span>
                        <span
                            className={`btn-default middle ${data?.length || id ? "bg-indigo1" : "bg-gray disable"}`}
                            onClick={() => {
                                if (data?.length || id) setIsVisibleModalDelete(true);
                            }}
                        >
                            <Image src={images.icn.icn_comment} alt='' width={12} />
                            {t("delete")}
                        </span>
                    </>
                )}
                <span className='btn-default middle bg-blue2' onClick={() => router.back()}>
                    <Image src={images.icn.icn_arr_left3} alt='' width={12} />
                    {t("back")}
                </span>
            </dd>

            <ModalWrapped isVisible={isVisible} setIsVisible={setIsVisible} title={t("create")}>
                {pathname == "news" ? (
                    <NewsForm type='create' setIsVisible={setIsVisible} />
                ) : pathname == "user" ? (
                    <SignUpForm setIsVisible={setIsVisible} />
                ) : pathname == "popup" ? (
                    <PopupForm type='create' setIsVisible={setIsVisible} />
                ) : pathname == "partner" ? (
                    <PartnerForm type='create' setIsVisible={setIsVisible} />
                ) : (
                    <></>
                )}
            </ModalWrapped>

            <ModalConfirm
                isVisible={isVisibleModalDelete}
                confirmLoading={confirmLoading}
                setConfirmLoading={setConfirmLoading}
                title={t("delete")}
                description={t("delete-notification", { path: t(pathname) })}
                handleCancel={() => setIsVisibleModalDelete(false)}
                handleOk={async () => {
                    setConfirmLoading(true);
                    const payload = {
                        ids: id ? [parseInt(id, 10)] : (data?.map((item) => item.id) as number[])
                    };
                    if (pathname == "news") {
                        await deleteNews(payload);
                    } else if (pathname == "user") {
                        await deleteUser(payload);
                    } else if (pathname == "popup") {
                        await deletePopup(payload);
                    } else if (pathname == "partner") {
                        await deletePartner(payload);
                    }
                    setTimeout(() => {
                        context?.reset();
                        if (id) {
                            router.push("/admin/news");
                        }
                        setConfirmLoading(false);
                        setIsVisibleModalDelete(false);
                    }, 1000);
                }}
            />
        </dl>
    );
}
