// useUploadProfileImage.ts
import { supabase } from "@/lib/supabase";

const useUploadProfileImage = (
  userId: string | undefined,
  onUpload?: () => void,
) => {
  const upload = async (file: File) => {
    if (!userId || !file) return;

    const ext = file.name.split(".").pop();
    const path = `${userId}.${ext}`;

    const { error } = await supabase.storage
      .from("profiles")
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("프로필 이미지 업로드 실패:", error.message);
      return;
    }

    console.log("프로필 이미지 업로드 성공");
    onUpload?.();
  };

  return { upload };
};

export default useUploadProfileImage;
