import { useContext } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { User } from "@/interfaces/user";
import axiosInstance from "@/libs/axios";
import { AuthContext } from "@/providers/authContextProvider";
import { useNotificationContext } from "@/providers/notificationProvider";

type UserPayload = {
    id?: number;
    page?: number;
    limit?: number;
    searchTerm?: string;
    onlyMethod?: boolean;
};

const useUser = (payload?: UserPayload) => {
    const t = useTranslations("admin");
    const queryClient = useQueryClient();

    const { openNotification } = useNotificationContext();

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const {
        data: users,
        isFetching: isFetchingUsers,
        refetch
    } = useQuery({
        queryKey: ["users", payload?.page, payload?.limit],
        queryFn: async () =>
            await axiosInstance.get("/user", {
                params: {
                    page: payload?.page,
                    limit: payload?.limit,
                    searchTerm: payload?.searchTerm
                }
            }),
        enabled: !!payload && !payload.onlyMethod && !payload.id,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const { data: userByOwner, isFetching: isFetchingUser } = useQuery({
        queryKey: ["user", payload?.id],
        queryFn: async () => await axiosInstance.get(`/user/${payload?.id}`),
        enabled: !!payload && !payload.onlyMethod && !!payload.id,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const { mutateAsync: updateUser, isPending } = useMutation({
        mutationFn: async (payload: { id?: number; data: Partial<User> }) => {
            const response = await axiosInstance.patch(payload.id ? `/user/${payload.id}` : "/user", payload.data);
            return response?.data?.data;
        },
        onSuccess: (data) => {
            openNotification("success", t("update-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            if (context.user?.id == data?.id) {
                context.setUserInfo(data);
            }
            queryClient.invalidateQueries({ queryKey: ["users", 1, 10] });
        },
        onError: (error) => {
            openNotification("error", t("update-failed"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: deleteUser } = useMutation({
        mutationFn: async (payload: { ids: number[] }) => {
            await axiosInstance.delete("/user", {
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
            queryClient.invalidateQueries({ queryKey: ["users", 1, 10] });
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
        ...context,
        isFetching: isFetchingUsers || isFetchingUser,
        userByOwner: userByOwner?.data?.data,
        users: users?.data?.data,
        paginationUsers: users?.data?.pagination,
        isPending,
        refetch,
        updateUser,
        deleteUser
    };
};

export default useUser;
