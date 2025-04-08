import { useMutation } from "@tanstack/react-query";
import updateUserInfo from "@/shared/api/updateUserInfo";

interface UserProfile {
  nickname?: string;
  sort_intro?: string;
  artist_hash_tag?: string;
  email?: string;
}

interface UpdateUserInfoProps {
  email: string;
  updatedFields: {
    nickname?: string;
    sort_intro?: string;
    artist_hash_tag?: string;
  };
}

const useUpdateUserInfo = (
  onSuccessCallback?: (updatedData: UserProfile) => void,
) => {
  return useMutation({
    mutationFn: ({ email, updatedFields }: UpdateUserInfoProps) =>
      updateUserInfo(email, updatedFields),

    onSuccess: (updatedUser) => {
      onSuccessCallback?.(updatedUser); // ✅ 성공 시 콜백 실행
    },

    onError: (error) => {
      console.error("업데이트 실패", error.message);
      alert("업데이트 실패! 다시 시도해주세요.");
    },
  });
};

export default useUpdateUserInfo;
