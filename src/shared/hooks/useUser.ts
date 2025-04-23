import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/shared/lib/supabase";
import { getUser } from "@/shared/api/users";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

const useUser = () => {
  const setUser = useUserStore((state) => state.setUser);

  const query = useQuery({
    queryKey: [QUERY_KEYS.currentUser],
    queryFn: async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser || !authUser.email) {
        throw new Error("로그인된 유저 정보를 가져올 수 없습니다");
      }

      const allUsers = await getUser();
      const currentUser = allUsers.find((u) => u.email === authUser.email);

      if (!currentUser) {
        throw new Error("user_table에서 해당 유저를 찾을 수 없습니다");
      }

      setUser(currentUser);

      // auth User가 필요하면 여기서 가져와서 쓰세요!
      return {
        user: currentUser,
        authUserId: authUser.id,
      };
    },
    retry: 1,
  });

  return {
    ...query,
    user: query.data?.user,
    authUserId: query.data?.authUserId,
  };
};

export default useUser;
