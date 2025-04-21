import { getUser } from "@/db/users";
import { User } from "@/db/users";
import { supabase } from "@/lib/supabase";

/**
 * Supabase Auth로 로그인한 유저의 email 기반으로
 * user_table에서 해당 유저 정보만 가져오는 서비스
 * + authUserId도 함께 리턴!
 */
const getCurrentUser = async (): Promise<User> => {
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser || !authUser.email) {
    throw new Error("로그인된 유저 정보를 가져올 수 없습니다");
  }

  const allUsers = await getUser();
  const currentUser = allUsers.find((u) => u.email === authUser.email);

  if (!currentUser) {
    throw new Error("user_table에서 해당 유저를 찾을 수 없습니다");
  }

  // authUserId를 포함해서 리턴
  return currentUser;
};

export default getCurrentUser;
