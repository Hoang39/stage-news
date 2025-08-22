import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { UserLoginReq, UserSignUpReq } from "@/interfaces/user";
import axiosInstance from "@/libs/axios";
import { useNotificationContext } from "@/providers/notificationProvider";

import useUser from "./useUser";

const useAuth = () => {
    const router = useRouter();
    const t = useTranslations("login");
    const { openNotification } = useNotificationContext();
    const queryClient = useQueryClient();
    const { setUserInfo } = useUser();

    const { mutate: login, isPending: isPendingLogin } = useMutation({
        mutationFn: async (payload: { data: UserLoginReq }) => {
            const response = await axiosInstance.post("/auth/login", payload.data);
            return response?.data;
        },
        onSuccess: (data) => {
            openNotification("success", t("success"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });

            setUserInfo(data?.data);
            localStorage.setItem("accessToken", data?.data?.accessToken);

            setTimeout(() => {
                router.push("/admin");
            }, 1500);
        },
        onError: (error) => {
            openNotification("error", t("error"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const { mutateAsync: signup, isPending: isPendingSignUp } = useMutation({
        mutationFn: async (payload: { data: UserSignUpReq }) => {
            const response = await axiosInstance.post("/auth/signup", payload.data);
            return response?.data;
        },
        onSuccess: (data) => {
            openNotification("success", t("sign-success"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            queryClient.invalidateQueries({ queryKey: ["users", 1, 10] });
            return data;
        },
        onError: (error) => {
            openNotification("error", t("sign-error"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            throw error;
        }
    });

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");

            localStorage.removeItem("accessToken");
            setUserInfo(null);
            queryClient.removeQueries({ queryKey: ["news", 1, 10] });
            queryClient.removeQueries({ queryKey: ["popup", 1, 10] });
            queryClient.removeQueries({ queryKey: ["users", 1, 10] });

            openNotification("success", t("logout-successful"), undefined, {
                showProgress: true,
                pauseOnHover: true
            });
            router.push("/admin/login");
        } catch {
            openNotification("error", "Failed to logout. Please try again.", undefined, {
                showProgress: true,
                pauseOnHover: true
            });
        }
    };

    return {
        isPending: isPendingLogin || isPendingSignUp,
        login,
        signup,
        logout
    };
};

export default useAuth;
