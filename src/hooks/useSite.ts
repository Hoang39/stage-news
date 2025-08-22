import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/libs/axios";

type SitePayload = {
    site?: string;
    pagination?: {
        current?: number;
        pageSize?: number;
    };
    searchTerm?: string;
};

const useSite = (payload?: SitePayload) => {
    const {
        data: popup,
        isFetching: isFetchingPopUp,
        refetch: refetchPopUp
    } = useQuery({
        queryKey: ["popupBySite"],
        queryFn: async () => {
            return await axiosInstance.get("/site/popup", {
                params: {
                    site: payload?.site
                }
            });
        },
        enabled: !!payload && !payload?.pagination,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const {
        data: partner,
        isFetching: isFetchingPartner,
        refetch: refetchPartner
    } = useQuery({
        queryKey: ["partnerBySite"],
        queryFn: async () => {
            return await axiosInstance.get("/site/partner", {
                params: {
                    site: payload?.site
                }
            });
        },
        enabled: !!payload && !payload?.pagination,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const {
        data: news,
        isFetching: isFetchingNews,
        refetch: refetchNews
    } = useQuery({
        queryKey: ["newsBySite"],
        queryFn: async () => {
            return await axiosInstance.get("/site/news", {
                params: {
                    page: payload?.pagination?.current,
                    limit: payload?.pagination?.pageSize,
                    searchTerm: payload?.searchTerm,
                    site: payload?.site
                }
            });
        },
        enabled: !!payload?.pagination,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    return {
        partner,
        popup,
        news,
        isFetching: isFetchingNews || isFetchingPopUp || isFetchingPartner,
        refetch: refetchNews || refetchPopUp || refetchPartner
    };
};

export default useSite;
