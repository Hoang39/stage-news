"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import useSite from "@/hooks/useSite";

import List from "../list";
import TableLayout from "../table/tableLayout";

const NewsList = () => {
    const t = useTranslations("news");
    const [reload, setReload] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const { news, isFetching, refetch } = useSite({ site: process.env.NEXT_PUBLIC_SITE, pagination });

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            total: news?.data?.pagination?.total
        }));
    }, [news?.data?.pagination?.total]);

    const handleFetchMore = () => {
        setPagination((prev) => ({
            ...prev,
            current: (pagination?.current ?? 0) + 1
        }));
    };

    const handleReload = () => {
        setReload(true);
        setSearchTerm("");
        setPagination({ ...pagination, current: 1, pageSize: 10 });
        setTimeout(() => {
            refetch();
            setReload(false);
        }, 1000);
    };

    const handleSearch = () => {
        setReload(true);
        setPagination({ ...pagination, current: 1, pageSize: 10 });
        setTimeout(() => {
            refetch();
            setReload(false);
        }, 1000);
    };

    return (
        <div className='container'>
            <div className='visual-sub vs-bg01'>
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

            <TableLayout
                searchPlaceHolder={t("placeholder")}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                pagination={news?.data?.pagination}
                handleReload={handleReload}
                handleSearch={handleSearch}
                isList={true}
            >
                <List
                    data={news?.data?.data}
                    loading={isFetching}
                    reload={reload}
                    pagination={pagination}
                    onChange={handleFetchMore}
                    className='board-list'
                />
            </TableLayout>
        </div>
    );
};

export default NewsList;
