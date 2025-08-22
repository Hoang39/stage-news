import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/libs/axios";

const useFile = () => {
    const { mutateAsync: upload, isPending } = useMutation({
        mutationFn: async (payload: { formData: any }) => {
            const response = await axiosInstance.post("/file", payload.formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response?.data?.data;
        }
    });

    return {
        isPending,
        upload
    };
};

export default useFile;
