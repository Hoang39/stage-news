import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { News } from "@/interfaces/news";
import axiosInstance from "@/libs/axios";
import { useNotificationContext } from "@/providers/notificationProvider";

type NewsPayload = {
    slug?: string;
    page?: number;
    limit?: number;
    searchTerm?: string;
    onlyMethod?: boolean;
};

const useNews = (payload: NewsPayload) => {
    const t = useTranslations("news");
    const queryClient = useQueryClient();
    const { openNotification } = useNotificationContext();

    const {
        data: news,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ["news", payload?.page, payload?.limit],
        queryFn: async () => {
            return await axiosInstance.get("/news", {
                params: {
                    page: payload.page,
                    limit: payload.limit,
                    searchTerm: payload.searchTerm
                }
            });
        },
        enabled:
            !payload.onlyMethod &&
            !payload.slug &&
            ((!!payload?.page && !!payload?.limit) || (!payload?.page && !payload?.limit && !payload.searchTerm)),
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const { data: newsDetail, isError } = useQuery({
        queryKey: ["newsDetail", payload?.slug],
        queryFn: async () => await axiosInstance.get(`/news/${payload?.slug}`),
        enabled: !payload.onlyMethod && !!payload.slug,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const { mutateAsync: addNews, isPending: isPendingAddNews } = useMutation({
        mutationFn: async (payload: { data: Partial<News> }) => {
            const response = await axiosInstance.post("/news", payload.data);
            return response?.data?.data;
        },
        onSuccess: () => {
            openNotification("success", t("create-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            refetch();
            queryClient.invalidateQueries({ queryKey: ["news", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("create-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: updateNews, isPending: isPendingUpdateNews } = useMutation({
        mutationFn: async (payload: { id: number; data: Partial<News> }) => {
            const response = await axiosInstance.patch(`/news/${payload.id}`, payload.data);
            return response?.data?.data;
        },
        onSuccess: () => {
            openNotification("success", t("update-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            refetch();
            queryClient.invalidateQueries({ queryKey: ["news", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("update-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: deleteNews } = useMutation({
        mutationFn: async (payload: { ids: number[] }) => {
            await axiosInstance.delete("/news", {
                data: {
                    ids: payload.ids
                }
            });
        },
        onSuccess: () => {
            openNotification("success", t("delete-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            queryClient.invalidateQueries({ queryKey: ["news", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("delete-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    return {
        news: news?.data?.data,
        isFetching,
        isError,
        isPending: isPendingAddNews || isPendingUpdateNews,
        paginationNews: news?.data?.pagination,
        newsDetail: newsDetail?.data?.data,
        refetch,
        addNews,
        updateNews,
        deleteNews
    };
};

export default useNews;
