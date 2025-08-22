"use client";

import { useEffect } from "react";

import { notFound, useRouter } from "next/navigation";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import useNews from "@/hooks/useNews";
import axiosInstance from "@/libs/axios";

const NewsDetail = ({ slug }: { slug: string }) => {
    const { newsDetail, isError } = useNews({ slug });
    const router = useRouter();
    const t = useTranslations("news");

    const id = newsDetail?.id;

    useEffect(() => {
        (async () => {
            try {
                if (id) {
                    await axiosInstance.patch("/news/updateView", { id });
                }
            } catch (error) {
                throw error;
            }
        })();
    }, [id]);

    if (isError) {
        notFound();
    }

    return (
        <div className='container'>
            <div className='visual-sub vs-bg02'>
                <div>
                    <h2>NEWS</h2>
                    <h3>{t("introduce")}</h3>
                    <div>
                        <i className='fa-light fa-house'></i> &nbsp; HOME &nbsp; &gt; &nbsp; <span>NEWS</span>
                    </div>
                </div>
            </div>

            <div className='title-area'>
                <h2 data-aos='fade-up'>NEWS</h2>
            </div>

            <div className='board-view'>
                <div className='bv-header' data-aos='fade-up'>
                    <h2>{newsDetail?.title}</h2>
                    <h3>
                        <i className='fa-light fa-user-tie-hair'></i>
                        {t("author")}: {newsDetail?.author}
                        <span>·</span>
                        <i className='fa-light fa-clock'></i>
                        {dayjs(newsDetail?.createdAt).format("DD/MM/YYYY h:mm:ss A")}
                        <span>·</span>
                        <i className='fa-regular fa-eye'></i>
                        {t("view")}: {newsDetail?.views}
                    </h3>
                </div>

                <div className='bv-content'>
                    <div dangerouslySetInnerHTML={{ __html: newsDetail?.content }} />
                </div>
                <dl className='bv-btn'>
                    <dt></dt>
                    <dd>
                        <span className='btn-default bg-dark' onClick={() => router.push("/news")}>
                            {t("back")}
                        </span>
                    </dd>
                </dl>
                <div className='bv-pn'>
                    <dl>
                        <dt>
                            <i className='fa-solid fa-caret-right'></i>
                            {t("previous")}
                        </dt>
                        <dd>
                            <span
                                onClick={() => {
                                    if (newsDetail?.previousNews)
                                        router.push(`/news/${newsDetail?.previousNews?.slug}`);
                                }}
                                className={newsDetail?.previousNews ? "link" : ""}
                            >
                                {newsDetail?.previousNews?.title ?? t("no-article")}
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>
                            <i className='fa-solid fa-caret-right'></i>
                            {t("next")}
                        </dt>
                        <dd>
                            <span
                                onClick={() => {
                                    if (newsDetail?.nextNews) router.push(`/news/${newsDetail?.nextNews?.slug}`);
                                }}
                                className={newsDetail?.nextNews ? "link" : ""}
                            >
                                {newsDetail?.nextNews?.title ?? t("no-article")}
                            </span>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
