import { useQuery } from "@tanstack/react-query";
import { getUserByRandomId } from "@/db/users";
import { User } from "@/db/users";
import { QUERY_KEYS } from "@/constants/queryKey";

const useOtherUser = (randomId: number) => {
  return useQuery<User | null>({
    queryKey: [QUERY_KEYS.otherUser, randomId],
    queryFn: () => getUserByRandomId(randomId),
    enabled: !!randomId,
  });
};

export default useOtherUser;
