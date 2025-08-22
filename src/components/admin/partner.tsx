"use client";

import { useContext, useEffect, useState } from "react";

import Image from "next/image";

import type { TableColumnsType } from "antd";
import { Select, Table } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import usePartner from "@/hooks/usePartner";
import { Partner } from "@/interfaces/partner";
import { AdminContext } from "@/providers/adminContextProvider";

import PartnerForm from "../form/partnerForm";
import ModalWrapped from "../modal";
import ModalConfirm from "../modal/ModalConfirm";
import TableLayout from "../table/tableLayout";

const { Option } = Select;

const PartnerManager = () => {
    const t = useTranslations("partner");

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
    const { partner, isFetching, paginationPartner, deletePartner, updatePartner, refetch } = usePartner({
        page: pagination.current,
        limit: pagination.pageSize,
        searchTerm: searchTerm
    });

    const context = useContext(AdminContext);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            total: paginationPartner?.total
        }));
    }, [paginationPartner?.total]);

    const partnerList = partner?.map((item: Partner, index: number) => ({
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
                </span>
            )
        },
        {
            title: t("image"),
            dataIndex: "image",
            key: "image",
            render: (src: string) => (
                <Image
                    src={src}
                    alt='image'
                    width={40}
                    height={40}
                    style={{
                        borderRadius: 4,
                        border: "1px solid #ddd",
                        margin: "auto",
                        objectFit: "cover"
                    }}
                />
                // <div
                //     style={{
                //         minWidth: 40,
                //         minHeight: 40,
                //         maxWidth: 60,
                //         maxHeight: 60,
                //         backgroundImage: `url(${src})`,
                //         backgroundSize: "cover",
                //         backgroundPosition: "center",
                //         borderRadius: "4px",
                //         border: "1px solid #ddd",
                //         margin: "auto"
                //     }}
                // />
            )
        },
        {
            title: t("date"),
            dataIndex: "date",
            key: "date",
            render: (value: string) => dayjs(value).format("YYYY-MM-DD hh:mm")
        },
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
                pagination={paginationPartner}
                handleReload={handleReload}
                handleSearch={handleSearch}
            >
                <Table
                    rowSelection={context?.partnerSelection}
                    columns={columns}
                    dataSource={partnerList}
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
                <PartnerForm type='update' id={id} setIsVisible={setIsVisibleModalUpdate} />
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
                    await deletePartner({ ids: [id as number] });
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
                    updatePartner({
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

export default PartnerManager;
