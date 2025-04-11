import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/users";
import useUser from "@/shared/hooks/useUser";

interface UploadDeleteArgs {
  file?: File; // 업로드할 파일
}

const useUploadDeleteProfileImage = (refetchImage?: () => void) => {
  const { user } = useUser();

  const mutation = useMutation<string | void, Error, UploadDeleteArgs>({
    mutationFn: async ({ file }) => {
      if (!user) throw new Error("유저 정보를 찾을 수 없습니다");

      const { random_id, id: userId } = user;

      const { data: list, error: listError } = await supabase.storage
        .from("profiles")
        .list();

      if (listError) {
        throw new Error("파일 리스트 불러오기 실패: " + listError.message);
      }

      const existingFile = list?.find((f) => f.name.startsWith(`${random_id}`));

      // 이미지 업로드 로직
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${random_id}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          throw new Error("프로필 이미지 업로드 실패: " + uploadError.message);
        }

        // public URL 가져오기
        const { data: urlData } = supabase.storage
          .from("profiles")
          .getPublicUrl(path);
        const publicUrl = urlData?.publicUrl;

        // DB에 public URL 업데이트
        await updateUser(userId, { user_img: publicUrl });

        return path;
      }

      // 이미지 삭제 로직
      else if (existingFile) {
        const { error: deleteError } = await supabase.storage
          .from("profiles")
          .remove([existingFile.name]);

        if (deleteError) {
          throw new Error("프로필 이미지 삭제 실패: " + deleteError.message);
        }

        // DB의 user_img 초기화
        await updateUser(userId, { user_img: "" });

        return existingFile.name;
      }

      return;
    },

    onSuccess: (result) => {
      console.log("프로필 이미지 처리 성공:", result);
      refetchImage?.(); // 리렌더링
    },
    onError: (err) => {
      console.error("프로필 이미지 처리 실패:", err.message);
    },
  });

  return mutation;
};

export default useUploadDeleteProfileImage;
