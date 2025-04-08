// hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import DefaultProfile from "@/assets/images/defaultProfile.svg";

// 🔹 유저 정보 가져오기
const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("유저 정보를 불러오지 못했습니다");
  return {
    id: data.user.id,
    email: data.user.email ?? undefined,
  };
};

// 🔹 프로필 이미지 가져오기
const fetchProfileImage = async (userId: string): Promise<string> => {
  const { data: list, error } = await supabase.storage.from("profiles").list();
  if (error || !list) return DefaultProfile;

  const file = list.find((f) => f.name.startsWith(userId));
  if (!file) return DefaultProfile;

  const { data } = supabase.storage.from("profiles").getPublicUrl(file.name);
  return data?.publicUrl || DefaultProfile;
};

const useUserProfile = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const {
    data: profileImage,
    isLoading: isImageLoading,
    isError: isImageError,
    refetch,
  } = useQuery({
    queryKey: ["profileImage", user?.id],
    queryFn: () => fetchProfileImage(user!.id),
    enabled: !!user?.id, // user.id가 있을 때만 실행
  });

  return {
    user,
    profileImage,
    isLoading: isUserLoading || isImageLoading,
    isError: isUserError || isImageError,
    refetchImage: refetch,
  };
};

export default useUserProfile;
