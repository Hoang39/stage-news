import TableHeader from "./tableHeader";

type Props = {
    searchPlaceHolder?: string;
    children: React.ReactNode;
    searchTerm: string;
    selectItem?: string;
    selectOption?: { value: string; label: string }[];
    isList?: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    handleReload: () => void;
    setSearchTerm?: (value: string) => void;
    handleSearch: () => void;
    handleFilter?: (value: string) => void;
};

const TableLayout = ({
    children,
    searchPlaceHolder,
    searchTerm,
    isList,
    selectItem,
    selectOption,
    setSearchTerm,
    pagination,
    handleReload,
    handleSearch,
    handleFilter
}: Props) => {
    return (
        <div>
            <TableHeader
                pagination={pagination}
                searchTerm={searchTerm}
                isList={isList}
                selectItem={selectItem}
                selectOption={selectOption}
                onReload={handleReload}
                onSearch={handleSearch}
                onFilter={handleFilter}
                searchPlaceHolder={searchPlaceHolder}
                setSearchTerm={setSearchTerm}
            />
            {children}
        </div>
    );
};

export default TableLayout;
