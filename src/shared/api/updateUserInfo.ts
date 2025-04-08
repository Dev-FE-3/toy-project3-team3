import { supabase } from "@/lib/supabase";

const updateUserInfo = async (
  email: string,
  updatedFields: {
    nickname?: string;
    sort_intro?: string;
    artist_hash_tag?: string;
  },
) => {
  const { data, error } = await supabase
    .from("user_table")
    .update(updatedFields)
    .eq("email", email) // ✅ email 기준으로 수정!
    .select(); // 수정된 결과 반환

  if (error) throw error;
  return data?.[0];
};

export default updateUserInfo;
