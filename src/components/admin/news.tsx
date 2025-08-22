"use client";

import { useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Table } from "antd";
import { Select } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import useNews from "@/hooks/useNews";
import useUser from "@/hooks/useUser";
import { News } from "@/interfaces/news";
import { AdminContext } from "@/providers/adminContextProvider";

import NewsForm from "../form/newsForm";
import ModalWrapped from "../modal";
import ModalConfirm from "../modal/ModalConfirm";
import TableLayout from "../table/tableLayout";

const { Option } = Select;

const NewsManager = () => {
    const router = useRouter();
    const t = useTranslations("news");

    const { user, users } = useUser();

    const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);
    const [isVisibleModalDelete, setIsVisibleModalDelete] = useState(false);
    const [isVisibleModalDisabled, setIsVisibleModalDisabled] = useState(false);

    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [id, setId] = useState<number>();

    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const { news, isFetching, paginationNews, deleteNews, updateNews, refetch } = useNews({
        page: pagination.current,
        limit: pagination.pageSize,
        searchTerm: searchTerm
    });

    const context = useContext(AdminContext);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            total: paginationNews?.total
        }));
    }, [paginationNews?.total]);

    const newsList = news?.map((item: News, index: number) => ({
        ...item,
        no: index + 1
    }));

    interface DataType {
        key: React.Key;
        no: string;
        title: string;
        author: string;
        createdAt: string;
        views: number;
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: t("number"),
            dataIndex: "no",
            key: "no",
            fixed: "left"
        },
        {
            title: t("title"),
            dataIndex: "title",
            key: "title",
            render: (text: string, record: any) => (
                <span onClick={() => router.push(`./news/${record.id}`)}>{text}</span>
            )
        },
        {
            title: t("author"),
            dataIndex: "author",
            key: "author"
        },
        {
            title: t("date"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            title: t("view"),
            dataIndex: "views",
            key: "views"
        },
        ...(user?.role == "owner"
            ? [
                  {
                      title: t("site"),
                      dataIndex: "site",
                      key: "site"
                  },
                  {
                      title: t("admin"),
                      dataIndex: "userId",
                      key: "userId",
                      render: (value: number) => (
                          <span>{users?.filter((item: any) => item.id == value)?.[0].name ?? ""}</span>
                      )
                  }
              ]
            : []),
        {
            title: t("disabled"),
            dataIndex: "disabled",
            key: "disabled",
            render: (value: boolean, record: any) => {
                return (
                    <Select
                        size='small'
                        value={value ? "unuse" : "use"}
                        className='select-wrapped'
                        onChange={(value) => {
                            setId(record.id);
                            setConfirmDisabled(value == "use" ? false : true);
                            setIsVisibleModalDisabled(true);
                        }}
                        loading={record.id == id && isVisibleModalDisabled}
                    >
                        <Option value='use' style={{ fontSize: "12px" }}>
                            {t("use")}
                        </Option>
                        <Option value='unuse' style={{ fontSize: "12px" }}>
                            {t("unuse")}
                        </Option>
                    </Select>
                );
            }
        },
        {
            title: t("management"),
            dataIndex: "management",
            key: "management",
            render: (_: any, record: any) => (
                <span>
                    <a
                        onClick={() => {
                            setId(record.id);
                            setIsVisibleModalUpdate(true);
                        }}
                        className='btn-default-s border-green2 color-green2'
                    >
                        {t("update-button")}
                    </a>
                    <a
                        onClick={() => {
                            setId(record.id);
                            setIsVisibleModalDelete(true);
                        }}
                        className='btn-default-s bg-indigo1'
                    >
                        {t("delete-button")}
                    </a>
                </span>
            ),
            fixed: "right"
        }
    ];

    const handlePageChange = (page: number, pageSize?: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            current: page,
            pageSize: pageSize || prevPagination.pageSize
        }));
    };

    const handleTableChange = (pagination: { current?: number; pageSize?: number; total?: number }) => {
        setPagination((prev) => ({
            ...prev,
            current: pagination?.current ?? prev.current,
            pageSize: pagination?.pageSize ?? prev.pageSize
        }));
    };

    const handleReload = () => {
        setSearchTerm("");
        setPagination({ ...pagination, current: 1 });
        setTimeout(() => {
            refetch();
        }, 0);
    };

    const handleSearch = () => {
        setPagination({ ...pagination, current: 1 });
        refetch();
    };

    return (
        <>
            <TableLayout
                searchPlaceHolder={t("placeholder")}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                pagination={paginationNews}
                handleReload={handleReload}
                handleSearch={handleSearch}
            >
                <Table
                    rowSelection={context?.newsSelection}
                    columns={columns}
                    dataSource={newsList}
                    loading={isFetching}
                    rowKey='id'
                    pagination={
                        pagination.total > pagination.pageSize
                            ? {
                                  current: pagination.current,
                                  pageSize: pagination.pageSize,
                                  total: pagination.total,
                                  onChange: handlePageChange
                              }
                            : false
                    }
                    onChange={handleTableChange}
                    scroll={{ x: "max-content" }}
                    className='board-list'
                />
            </TableLayout>
            <ModalWrapped isVisible={isVisibleModalUpdate} setIsVisible={setIsVisibleModalUpdate} title={t("update")}>
                <NewsForm type='update' id={id} setIsVisible={setIsVisibleModalUpdate} />
            </ModalWrapped>
            <ModalConfirm
                isVisible={isVisibleModalDelete}
                confirmLoading={confirmLoading}
                setConfirmLoading={setConfirmLoading}
                title={t("delete")}
                description={t("delete-notification")}
                handleCancel={() => {
                    setIsVisibleModalDelete(false);
                }}
                handleOk={async () => {
                    setConfirmLoading(true);
                    await deleteNews({ ids: [id as number] });
                    setTimeout(() => {
                        setConfirmLoading(false);
                        setIsVisibleModalDelete(false);
                    }, 1000);
                }}
            />
            <ModalConfirm
                isVisible={isVisibleModalDisabled}
                confirmLoading={confirmLoading}
                setConfirmLoading={setConfirmLoading}
                title={t("update")}
                description={t("update-notification")}
                handleCancel={() => {
                    setIsVisibleModalDisabled(false);
                }}
                handleOk={() => {
                    setConfirmLoading(true);
                    updateNews({
                        id: id as number,
                        data: { disabled: confirmDisabled }
                    });
                    setTimeout(() => {
                        setConfirmLoading(false);
                        setIsVisibleModalDisabled(false);
                    }, 1000);
                }}
            />
        </>
    );
};

export default NewsManager;
