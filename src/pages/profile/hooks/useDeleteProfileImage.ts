import { supabase } from "@/lib/supabase";

const useDeleteProfileImage = (
  userId: string | undefined,
  onDelete?: () => void,
) => {
  const remove = async () => {
    if (!userId) return;

    const { data: list } = await supabase.storage.from("profiles").list();

    const file = list?.find((f) => f.name.startsWith(userId));
    if (!file) return;

    await supabase.storage.from("profiles").remove([file.name]);

    onDelete?.();
  };

  return { remove };
};

export default useDeleteProfileImage;
