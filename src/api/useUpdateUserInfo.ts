import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/db/users";
import { useUserStore } from "@/stores/userStore";
import { QUERY_KEYS } from "@/constants/queryKey";

interface UpdateUserInfoParams {
  id: number;
  updatedFields: {
    nickname?: string;
    sort_intro?: string;
    artist_hash_tag?: string;
  };
}

const useUpdateUserInfo = (onSuccessCallback?: () => void) => {
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, updatedFields }: UpdateUserInfoParams) =>
      updateUser(id, updatedFields),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentUser] });
      onSuccessCallback?.();
    },
  });

  return { mutate, isPending, isError };
};

export default useUpdateUserInfo;
