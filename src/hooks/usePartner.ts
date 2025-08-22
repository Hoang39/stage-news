import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Partner } from "@/interfaces/partner";
import axiosInstance from "@/libs/axios";
import { useNotificationContext } from "@/providers/notificationProvider";

import useFile from "./useFile";

type PartnerPayload = {
    page?: number;
    limit?: number;
    searchTerm?: string;
};

const usePartner = (payload: PartnerPayload) => {
    const t = useTranslations("partner");
    const { upload } = useFile();
    const queryClient = useQueryClient();
    const { openNotification } = useNotificationContext();

    const {
        data: partner,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ["partner", payload?.page, payload?.limit],
        queryFn: async () => {
            return await axiosInstance.get("/partner", {
                params: {
                    page: payload.page,
                    limit: payload.limit,
                    searchTerm: payload.searchTerm
                }
            });
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const { mutateAsync: addPartner, isPending: isPendingAddPartner } = useMutation({
        mutationFn: async (payload: { data: Partial<Partner>; file: string | Blob }) => {
            const formData = new FormData();
            formData.set("file", payload.file as string | Blob);
            const data = await upload({ formData: formData });

            const response = await axiosInstance.post("/partner", { ...payload.data, image: data?.path });
            return response?.data?.data;
        },
        onSuccess: () => {
            openNotification("success", t("create-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            refetch();
            queryClient.invalidateQueries({ queryKey: ["partner", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("create-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: updatePartner, isPending: isPendingUpdatePartner } = useMutation({
        mutationFn: async (payload: { id: number; data: Partial<Partner>; file?: string | Blob }) => {
            const formData = new FormData();
            formData.set("file", payload.file as string | Blob);
            const data = payload?.file ? await upload({ formData: formData }) : undefined;

            const response = await axiosInstance.patch(`/partner/${payload.id}`, {
                ...payload.data,
                ...(data ? { image: data?.path } : {})
            });
            return response?.data?.data;
        },
        onSuccess: () => {
            openNotification("success", t("update-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            refetch();
            queryClient.invalidateQueries({ queryKey: ["partner", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("update-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: deletePartner } = useMutation({
        mutationFn: async (payload: { ids: number[] }) => {
            await axiosInstance.delete("/partner", {
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
            queryClient.invalidateQueries({ queryKey: ["partner", 1, 10] });
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
        partner: partner?.data?.data,
        isFetching,
        isPending: isPendingAddPartner || isPendingUpdatePartner,
        paginationPartner: partner?.data?.pagination,
        refetch,
        addPartner,
        updatePartner,
        deletePartner
    };
};

export default usePartner;
