import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

interface UploadArgs {
  userId: string;
  file: File;
}

const uploadProfileImage = async ({
  userId,
  file,
}: UploadArgs): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `${userId}.${ext}`;

  const { error } = await supabase.storage.from("profiles").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error("프로필 이미지 업로드 실패: " + error.message);
  }

  return path; // 파일 경로 리턴
};

const useUploadProfileImage = (onSuccess?: () => void) => {
  const mutation = useMutation<string, Error, UploadArgs>({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      console.log("✅ 프로필 이미지 업로드 성공");
      onSuccess?.();
    },
    onError: (err) => {
      console.error("🚨 업로드 실패:", err.message);
    },
  });

  return mutation;
};

export default useUploadProfileImage;
