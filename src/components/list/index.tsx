import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Empty, Spin } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocale, useTranslations } from "next-intl";

import { News } from "@/interfaces/news";

dayjs.extend(relativeTime);

interface ListProps {
    data: (News & {
        no: number;
    })[];
    loading: boolean;
    reload: boolean;
    pagination: { current: number; pageSize: number; total: number };
    onChange?: () => void;
    className?: string;
}

const List: React.FC<ListProps> = ({ data, loading, reload, pagination, onChange, className }) => {
    const [currentData, setCurrentData] = useState<News[]>();
    const locale = useLocale();
    dayjs.locale(locale);

    const current = pagination.current;

    useEffect(() => {
        if (data) {
            setCurrentData((prev) => {
                return prev && current > 1 ? [...prev, ...data] : data;
            });
        }
    }, [data, current]);

    const router = useRouter();

    const t = useTranslations("news");

    return (
        <div className={className}>
            <ul className={`list ${reload && "reload"}`}>
                {reload && (
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            justifyContent: "center",
                            padding: "20px",
                            zIndex: 99
                        }}
                    >
                        <Spin />
                    </div>
                )}
                {!currentData?.length && <Empty />}
                {currentData?.map((item, index) => (
                    <li key={index} className='list-item'>
                        <div>
                            <dd>
                                <div>
                                    <h3 onClick={() => router.push(`/news/${item.slug}`)}>{item.title}</h3>
                                    <h4>
                                        <i className='fa-light fa-user-tie-hair'></i>
                                        {item.author} <em>.</em> <i className='fa-regular fa-eye'></i>
                                        {item.views}
                                    </h4>
                                </div>
                            </dd>
                            <dt>
                                <span>{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</span>
                                <em>{dayjs(item.createdAt).fromNow()}</em>
                            </dt>
                        </div>
                    </li>
                ))}
            </ul>

            {(currentData?.length ?? 0) < pagination.total ? (
                !loading && !reload ? (
                    <div className='load-more'>
                        <button className='btn-default middle bg-blue2' onClick={onChange} disabled={loading}>
                            {t("see-more")}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                        <Spin />
                    </div>
                )
            ) : null}
        </div>
    );
};

export default List;
