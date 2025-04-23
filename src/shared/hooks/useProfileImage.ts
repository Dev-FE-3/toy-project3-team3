import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import useUser from "@/shared/hooks/useUser";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

const fetchProfileImage = async (randomId: number): Promise<string> => {
  const { data: list } = await supabase.storage.from("profiles").list();
  const file = list?.find((f) => f.name.startsWith(`${randomId}`));
  if (!file) return DefaultProfile;

  const { data } = supabase.storage.from("profiles").getPublicUrl(file.name);
  return `${data?.publicUrl}?t=${Date.now()}` || DefaultProfile;
};

const useProfileImage = () => {
  const { user: currentUser } = useUser();
  const randomId = currentUser?.random_id;

  const {
    data: profileImage,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.profileImage, randomId],
    queryFn: () => fetchProfileImage(randomId!),
    enabled: !!randomId,
  });

  return { profileImage, isLoading, isError, refetch };
};

export default useProfileImage;
