"use client";

import { useContext, useEffect, useState } from "react";

import type { TableColumnsType } from "antd";
import { Select, Table } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import usePopup from "@/hooks/usePopup";
import useUser from "@/hooks/useUser";
import { Popup } from "@/interfaces/popup";
import { AdminContext } from "@/providers/adminContextProvider";

import PopupForm from "../form/popupForm";
import ModalWrapped from "../modal";
import ModalConfirm from "../modal/ModalConfirm";
import TableLayout from "../table/tableLayout";

const { Option } = Select;

const PopupManager = () => {
    const t = useTranslations("popup");

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
    const { popup, isFetching, paginationPopup, deletePopup, updatePopup, refetch } = usePopup({
        page: pagination.current,
        limit: pagination.pageSize,
        searchTerm: searchTerm
    });

    const context = useContext(AdminContext);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            total: paginationPopup?.total
        }));
    }, [paginationPopup?.total]);

    const popupList = popup?.map((item: Popup, index: number) => ({
        ...item,
        no: index + 1
    }));

    const columns: TableColumnsType = [
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
            render: (_, record: any) => (
                <span
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                    }}
                >
                    <em style={{ fontWeight: "500", fontSize: "12px" }}>{record.title}</em>
                    <em style={{ fontSize: "10px", color: "#aaa" }}>Placement: {record.placement}</em>
                    <em
                        style={{ fontSize: "10px", color: "#aaa" }}
                    >{`Width: ${record.width}, Height: ${record.height}`}</em>
                </span>
            )
        },
        {
            title: t("image"),
            dataIndex: "image",
            key: "image",
            render: (src: string) => (
                <div
                    style={{
                        minWidth: 40,
                        minHeight: 40,
                        maxWidth: 60,
                        maxHeight: 60,
                        backgroundImage: `url(${src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        margin: "auto"
                    }}
                />
            )
        },
        {
            title: t("startDate"),
            dataIndex: "startDate",
            key: "startDate",
            render: (value: string) => dayjs(value).format("YYYY-MM-DD hh:mm")
        },
        {
            title: t("endDate"),
            dataIndex: "endDate",
            key: "endDate",
            render: (value: string) => dayjs(value).format("YYYY-MM-DD hh:mm")
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
                          <span>{users?.filter((item: any) => item.id == value)?.[0]?.name ?? ""}</span>
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
                pagination={paginationPopup}
                handleReload={handleReload}
                handleSearch={handleSearch}
            >
                <Table
                    rowSelection={context?.popupSelection}
                    columns={columns}
                    dataSource={popupList}
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
                <PopupForm type='update' id={id} setIsVisible={setIsVisibleModalUpdate} />
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
                    await deletePopup({ ids: [id as number] });
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
                    updatePopup({
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

export default PopupManager;
