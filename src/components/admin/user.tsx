"use client";

import { useContext, useEffect, useState } from "react";

import type { TableColumnsType } from "antd";
import { Table } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import useUser from "@/hooks/useUser";
import { News } from "@/interfaces/news";
import { AdminContext } from "@/providers/adminContextProvider";

import UserForm from "../form/userForm";
import ModalWrapped from "../modal";
import ModalConfirm from "../modal/ModalConfirm";
import TableLayout from "../table/tableLayout";

interface DataType {
    key: React.Key;
    no: string;
    name: string;
    username: string;
    role: string;
    createdAt: string;
}

const UserManager = () => {
    const t = useTranslations("user");
    const [id, setId] = useState<number>();

    const [confirmLoading, setConfirmLoading] = useState(false);

    const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);
    const [isVisibleModalDelete, setIsVisibleModalDelete] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const { user, users, isFetching, paginationUsers, deleteUser, refetch } = useUser({
        page: pagination.current,
        limit: pagination.pageSize,
        searchTerm: searchTerm
    });

    const context = useContext(AdminContext);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            total: paginationUsers?.total
        }));
    }, [paginationUsers?.total]);

    const usersList = users
        ?.filter((item: any) => item.id != user?.id)
        ?.map((item: News, index: number) => ({
            ...item,
            no: index + 1
        }));

    const columns: TableColumnsType<DataType> = [
        {
            title: t("number"),
            dataIndex: "no",
            key: "no",
            fixed: "left"
        },
        {
            title: t("name"),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t("username"),
            dataIndex: "username",
            key: "username"
        },
        {
            title: t("date"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            title: t("site"),
            dataIndex: "site",
            key: "site"
        },
        {
            title: t("management"),
            dataIndex: "management",
            key: "management",
            fixed: "right",
            render: (_: any, record: any) => (
                <span>
                    <a
                        onClick={() => {
                            if (record.id != user?.id) {
                                setId(record.id);
                                setIsVisibleModalUpdate(true);
                            }
                        }}
                        className={`btn-default-s border-green2 color-green2 ${record.id == user?.id && "disable"}`}
                    >
                        {t("update-button")}
                    </a>
                    <a
                        onClick={() => {
                            if (record.id != user?.id) {
                                setId(record.id);
                                setIsVisibleModalDelete(true);
                            }
                        }}
                        className={`btn-default-s bg-indigo1 ${record.id == user?.id && "disable"}`}
                    >
                        {t("delete-button")}
                    </a>
                </span>
            )
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
                pagination={paginationUsers}
                handleReload={handleReload}
                handleSearch={handleSearch}
            >
                <Table
                    rowSelection={context?.usersSelection}
                    columns={columns}
                    dataSource={usersList}
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
                <UserForm id={id} setIsVisible={setIsVisibleModalUpdate} />
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
                    await deleteUser({ ids: [id as number] });
                    setTimeout(() => {
                        setConfirmLoading(false);
                        setIsVisibleModalDelete(false);
                    }, 1000);
                }}
            />
        </>
    );
};

export default UserManager;
