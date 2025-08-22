import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Popup } from "@/interfaces/popup";
import axiosInstance from "@/libs/axios";
import { useNotificationContext } from "@/providers/notificationProvider";

import useFile from "./useFile";

type PopupPayload = {
    page?: number;
    limit?: number;
    searchTerm?: string;
    onlyMethod?: boolean;
};

const usePopup = (payload: PopupPayload) => {
    const t = useTranslations("popup");
    const { upload } = useFile();
    const queryClient = useQueryClient();
    const { openNotification } = useNotificationContext();

    const {
        data: popup,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ["popup", payload?.page, payload?.limit],
        queryFn: async () => {
            return await axiosInstance.get("/popup", {
                params: {
                    page: payload.page,
                    limit: payload.limit,
                    searchTerm: payload.searchTerm
                }
            });
        },
        enabled:
            !payload.onlyMethod &&
            ((!!payload?.page && !!payload?.limit) || (!payload?.page && !payload?.limit && !payload.searchTerm)),
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const { mutateAsync: addPopup, isPending: isPendingAddPopup } = useMutation({
        mutationFn: async (payload: { data: Partial<Popup>; file: string | Blob }) => {
            const formData = new FormData();
            formData.set("file", payload.file as string | Blob);
            const data = await upload({ formData: formData });

            const response = await axiosInstance.post("/popup", { ...payload.data, image: data?.path });
            return response?.data?.data;
        },
        onSuccess: () => {
            openNotification("success", t("create-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            refetch();
            queryClient.invalidateQueries({ queryKey: ["popup", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("create-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: updatePopup, isPending: isPendingUpdatePopup } = useMutation({
        mutationFn: async (payload: { id: number; data: Partial<Popup>; file?: string | Blob }) => {
            const formData = new FormData();
            formData.set("file", payload.file as string | Blob);
            const data = payload?.file ? await upload({ formData: formData }) : undefined;

            const response = await axiosInstance.patch(`/popup/${payload.id}`, {
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
            queryClient.invalidateQueries({ queryKey: ["popup", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("update-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: deletePopup } = useMutation({
        mutationFn: async (payload: { ids: number[] }) => {
            await axiosInstance.delete("/popup", {
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
            queryClient.invalidateQueries({ queryKey: ["popup", 1, 10] });
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
        popup: popup?.data?.data,
        isFetching,
        isPending: isPendingAddPopup || isPendingUpdatePopup,
        paginationPopup: popup?.data?.pagination,
        refetch,
        addPopup,
        updatePopup,
        deletePopup
    };
};

export default usePopup;
