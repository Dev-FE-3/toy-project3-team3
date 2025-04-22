import { useQuery } from "@tanstack/react-query";
import { getUserByRandomId } from "@/db/users";
import { User } from "@/db/users";
import { QUERY_KEYS } from "@/constants/queryKey";

const useOtherUser = (randomId: number) => {
  const { data, isLoading, isError } = useQuery<User | null>({
    queryKey: [QUERY_KEYS.otherUser, randomId],
    queryFn: () => getUserByRandomId(randomId),
    enabled: !!randomId,
  });

  return {
    otherUser: data,
    isLoading,
    isError,
  };
};

export default useOtherUser;
