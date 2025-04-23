import { supabase } from "@/shared/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/shared/api/users";
import useUser from "@/shared/hooks/useUser";
import { useUserStore } from "@/stores/userStore";

interface UploadDeleteArgs {
  file?: File;
}

const useUploadDeleteProfileImage = (refetchImage?: () => void) => {
  const { user } = useUser();
  const setUser = useUserStore((state) => state.setUser); // ✅ Zustand 상태 접근

  const { mutate, isPending, isError } = useMutation<
    void,
    Error,
    UploadDeleteArgs
  >({
    mutationFn: async ({ file }) => {
      if (!user) throw new Error("유저 정보를 찾을 수 없습니다");

      const { random_id, id: userId } = user;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${random_id}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(path, file, {
            cacheControl: "0", // 캐싱 무력화
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("profiles")
          .getPublicUrl(path);

        const publicUrl = `${urlData?.publicUrl}?t=${Date.now()}`;

        await updateUser(userId, { user_img: publicUrl });

        // 상태 갱신: 전역 Zustand user store에 반영
        setUser({
          ...user,
          user_img: publicUrl,
        });

        refetchImage?.();
      } else {
        const extensions = ["png", "jpg", "jpeg", "webp"];
        for (const ext of extensions) {
          await supabase.storage
            .from("profiles")
            .remove([`${random_id}.${ext}`]);
        }

        await updateUser(userId, { user_img: "" });

        // 상태 갱신: 전역 user_img 초기화
        setUser({
          ...user,
          user_img: "",
        });

        refetchImage?.();
      }
    },
  });

  return { mutate, isPending, isError };
};

export default useUploadDeleteProfileImage;
