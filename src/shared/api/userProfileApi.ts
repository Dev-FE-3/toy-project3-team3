import { supabase } from "@/lib/supabase";

// 이 파일 안에 타입 정의
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export async function fetchUserProfile(userId: number): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_table")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function updateUserProfile(
  userId: number,
  newData: Partial<UserProfile>,
): Promise<void> {
  const { error } = await supabase
    .from("user_table")
    .update(newData)
    .eq("id", userId);

  if (error) throw error;
}
