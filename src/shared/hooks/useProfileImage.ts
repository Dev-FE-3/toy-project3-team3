// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/lib/supabase";
// import DefaultProfile from "@/assets/images/defaultProfile.svg";
// import useUser from "@/shared/hooks/useUser";

// const fetchProfileImage = async (randomId: number): Promise<string> => {
//   const { data: list, error } = await supabase.storage.from("profiles").list();
//   if (error || !list) return DefaultProfile;

//   const file = list.find((f) => f.name.startsWith(String(randomId)));
//   if (!file) return DefaultProfile;

//   const { data } = supabase.storage.from("profiles").getPublicUrl(file.name);
//   return data?.publicUrl || DefaultProfile;
// };

// const useProfileImage = () => {
//   const { user: currentUser } = useUser();
//   const randomId = currentUser?.random_id;

//   const {
//     data: profileImage,
//     isLoading,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["profileImage", randomId],
//     queryFn: () => fetchProfileImage(randomId!),
//     enabled: !!randomId,
//   });

//   return { profileImage, isLoading, isError, refetch };
// };

// export default useProfileImage;

// src/shared/hooks/useProfileImage.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import useUser from "@/shared/hooks/useUser";

const fetchProfileImage = async (randomId: number): Promise<string> => {
  const { data: list } = await supabase.storage.from("profiles").list();

  const file = list?.find((f) => f.name.startsWith(`${randomId}`));
  if (!file) return DefaultProfile;

  const { data } = supabase.storage.from("profiles").getPublicUrl(file.name);
  return data?.publicUrl || DefaultProfile;
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
    queryKey: ["profileImage", randomId],
    queryFn: () => fetchProfileImage(randomId!),
    enabled: !!randomId,
  });

  return { profileImage, isLoading, isError, refetch };
};

export default useProfileImage;
