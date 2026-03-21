import toast from "react-hot-toast";
import { baseUrl } from "../constant/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
    const queryClient = useQueryClient();
    const {mutate : follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            const res = await fetch(`${baseUrl}/api/users/follow/${userId}`, {
                method: "POST",
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to follow user");
            }
            return data;
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] })
            ]);
            toast.success("User followed successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to follow user");
        }
    });
    return { follow, isPending };
};
export default useFollow;