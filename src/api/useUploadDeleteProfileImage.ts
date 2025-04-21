import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/db/users";
import useUser from "@/shared/hooks/useUser";

interface UploadDeleteArgs {
  file?: File;
}

const useUploadDeleteProfileImage = (refetchImage?: () => void) => {
  const { user } = useUser();

  const mutation = useMutation<string | void, Error, UploadDeleteArgs>({
    mutationFn: async ({ file }) => {
      if (!user) throw new Error("유저 정보를 찾을 수 없습니다");

      const { random_id, id: userId } = user;

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
          throw new Error(uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("profiles")
          .getPublicUrl(path);

        const publicUrl = urlData?.publicUrl;

        await updateUser(userId, { user_img: publicUrl });

        return path;
      } else {
        // 확장자 모르니까 delete 시도만 해보자
        const extensions = ["png", "jpg", "jpeg", "webp"];
        for (const ext of extensions) {
          const path = `${random_id}.${ext}`;
          await supabase.storage.from("profiles").remove([path]);
        }

        await updateUser(userId, { user_img: "" });

        return;
      }
    },
    onSuccess: () => {
      refetchImage?.();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  return mutation;
};

export default useUploadDeleteProfileImage;
