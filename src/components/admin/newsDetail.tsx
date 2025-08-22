"use client";

import { notFound } from "next/navigation";

import dayjs from "dayjs";

import useNews from "@/hooks/useNews";
import { News } from "@/interfaces/news";

const NewsDetailManager = ({ id }: { id: string }) => {
    const { news } = useNews({});
    const newsDetail = news?.filter((item: News) => item.id.toString() == id)?.[0];

    if (news && !newsDetail) {
        notFound();
    }

    return (
        <div className='container' style={{ overflowY: "auto" }}>
            <div className='board-view' style={{ width: "90%" }}>
                <div className='bv-header'>
                    <h2>{newsDetail?.title}</h2>
                    <h3>
                        <i className='fa-light fa-user-tie-hair'></i>작성자: {newsDetail?.author}
                        <span>·</span>
                        <i className='fa-light fa-clock'></i>
                        {dayjs(newsDetail?.createdAt).format("DD/MM/YYYY h:mm:ss A")}
                        <span>·</span>
                        <i className='fa-regular fa-eye'></i>
                        조회수: {newsDetail?.views}
                    </h3>
                </div>

                <div className='bv-content'>
                    <div dangerouslySetInnerHTML={{ __html: newsDetail?.content }} />
                </div>
            </div>
        </div>
    );
};

export default NewsDetailManager;
