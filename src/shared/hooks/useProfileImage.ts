import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import DefaultProfile from "@/assets/images/defaultProfile.svg";

const fetchProfileImage = async (userId: string): Promise<string> => {
  const { data: list, error } = await supabase.storage.from("profiles").list();
  if (error || !list) return DefaultProfile;

  const file = list.find((f) => f.name.startsWith(userId));
  if (!file) return DefaultProfile;

  const { data } = supabase.storage.from("profiles").getPublicUrl(file.name);
  return data?.publicUrl || DefaultProfile;
};

const useProfileImage = (userId?: string) => {
  const {
    data: profileImage,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profileImage", userId],
    queryFn: () => fetchProfileImage(userId!),
    enabled: !!userId,
  });

  return { profileImage, isLoading, isError, refetch };
};

export default useProfileImage;
