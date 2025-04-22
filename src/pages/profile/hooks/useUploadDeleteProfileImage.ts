import { supabase } from "@/shared/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/shared/api/users";
import useUser from "@/shared/hooks/useUser";

interface UploadDeleteArgs {
  file?: File;
}

const useUploadDeleteProfileImage = (refetchImage?: () => void) => {
  const { user } = useUser();

  const { mutate, isPending, isError } = useMutation<
    string | void,
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
  });

  return { mutate, isPending, isError };
};

export default useUploadDeleteProfileImage;
