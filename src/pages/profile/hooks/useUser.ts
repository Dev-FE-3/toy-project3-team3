// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/lib/supabase";

// export interface UserProfile {
//   id: string;
//   email?: string;
//   nickname?: string;
//   sort_intro?: string;
//   artist_hash_tag?: string;
// }

// const fetchUser = async (): Promise<UserProfile> => {
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();

//   if (authError || !user) throw new Error("유저 정보를 불러오지 못했습니다");

//   const { data: profile, error: profileError } = await supabase
//     .from("users")
//     .select("nickname, sort_intro, artist_hash_tag")
//     .eq("id", user.id)
//     .single();

//   if (profileError || !profile)
//     throw new Error("프로필 정보를 불러오지 못했습니다");

//   return {
//     id: user.id,
//     email: user.email ?? undefined,
//     nickname: profile.nickname ?? "",
//     sort_intro: profile.sort_intro ?? "",
//     artist_hash_tag: profile.artist_hash_tag ?? "",
//   };
// };

// const useUser = () => {
//   const {
//     data: user,
//     isLoading,
//     isError,
//   } = useQuery<UserProfile>({
//     queryKey: ["user"],
//     queryFn: fetchUser,
//   });

//   return { user, isLoading, isError };
// };

// export default useUser;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email?: string;
  nickname?: string;
  sort_intro?: string;
  artist_hash_tag?: string;
}

const fetchUser = async (): Promise<UserProfile> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("유저 정보 불러오기 실패:", authError);
    throw new Error("유저 정보를 불러오지 못했습니다");
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_table")
    .select("nickname, sort_intro, artist_hash_tag")
    .eq("email", user.email)
    .single();

  if (profileError || !profile) {
    console.error("프로필 정보 불러오기 실패:", profileError);
    throw new Error("프로필 정보를 불러오지 못했습니다");
  }

  return {
    id: user.id,
    email: user.email ?? undefined,
    nickname: profile.nickname ?? "",
    sort_intro: profile.sort_intro ?? "",
    artist_hash_tag: profile.artist_hash_tag ?? "",
  };
};

const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserProfile>({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: 1, // 오류 발생 시 1번만 재시도하도록 설정
  });

  return { user, isLoading, isError, error };
};

export default useUser;
