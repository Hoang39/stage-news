import { Select } from "antd";
import { useTranslations } from "next-intl";

const { Option } = Select;

type Props = {
    onSearch?: () => void;
    onReload?: () => void;
    onFilter?: (value: string) => void;
    selectItem?: string;
    searchPlaceHolder?: string;
    searchTerm?: string;
    selectOption?: { value: string; label: string }[];
    isList?: boolean;
    setSearchTerm?: (value: string) => void;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

const TableHeader = ({
    onSearch,
    onReload,
    onFilter,
    searchPlaceHolder,
    selectItem,
    searchTerm,
    selectOption,
    isList,
    setSearchTerm,
    pagination
}: Props) => {
    const t = useTranslations("news");

    return (
        <div className='board-sort-search'>
            <dt>
                <i className='fa-light fa-memo'></i> {t("total", { total: pagination?.total })}
                {isList ? null : (
                    <>
                        / {t("current-page")} [{pagination?.page}/{pagination?.totalPages}]{" "}
                    </>
                )}
            </dt>
            <dd>
                <div>
                    {onFilter && (
                        <Select
                            value={selectItem}
                            className='w100 h40'
                            onChange={onFilter}
                            style={{
                                fontWeight: "400",
                                fontSize: "20px"
                            }}
                        >
                            {selectOption?.map((item: { value: string; label: string }, index: number) => (
                                <Option key={index} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    )}
                    {onSearch && (
                        <>
                            <input
                                type='text'
                                name='Sstring'
                                title='검색어'
                                value={searchTerm ?? ""}
                                placeholder={searchPlaceHolder}
                                className='input-box w350'
                                onChange={(event) => setSearchTerm?.(event.target.value)}
                            />
                            <button className='btn-default middle bg-dark' onClick={onSearch}>
                                <i className='fa-light fa-magnifying-glass' style={{ padding: "0 2px" }}></i>
                                <em>{t("search")}</em>
                            </button>
                        </>
                    )}
                    {onReload && (
                        <button onClick={onReload} className='btn-default middle bg-dark'>
                            <i className='fa-light fa-refresh'></i>
                        </button>
                    )}
                </div>
            </dd>
        </div>
    );
};

export default TableHeader;
