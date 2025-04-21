import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/db/users";
import { useUserStore } from "@/stores/userStore";

interface UpdateUserInfoParams {
  id: number; // user_table의 id (PK)
  updatedFields: {
    nickname?: string;
    sort_intro?: string;
    artist_hash_tag?: string;
  };
}

// 유저 정보 수정 + 전역 상태 업데이트
const useUpdateUserInfo = (onSuccessCallback?: () => void) => {
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedFields }: UpdateUserInfoParams) =>
      updateUser(id, updatedFields),
    onSuccess: (updatedUser) => {
      setUser(updatedUser); // 최신 정보로 상태 갱신
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      onSuccessCallback?.();
    },
    onError: (error) => {
      console.error("유저 정보 업데이트 실패:", error.message);
    },
  });
};

export default useUpdateUserInfo;
