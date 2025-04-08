import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

const deleteProfileImage = async (userId: string): Promise<string | void> => {
  const { data: list, error: listError } = await supabase.storage
    .from("profiles")
    .list();

  if (listError) {
    throw new Error("파일 리스트 불러오기 실패: " + listError.message);
  }

  const file = list?.find((f) => f.name.startsWith(userId));
  if (!file) return;

  const { error: deleteError } = await supabase.storage
    .from("profiles")
    .remove([file.name]);

  if (deleteError) {
    throw new Error("프로필 이미지 삭제 실패: " + deleteError.message);
  }

  return file.name; // 삭제된 파일명 리턴
};

const useDeleteProfileImage = (onSuccess?: () => void) => {
  const mutation = useMutation<string | void, Error, string>({
    mutationFn: deleteProfileImage,
    onSuccess: () => {
      console.log("🗑️ 프로필 이미지 삭제 성공");
      onSuccess?.();
    },
    onError: (err) => {
      console.error("🚨 삭제 실패:", err.message);
    },
  });

  return mutation;
};

export default useDeleteProfileImage;
