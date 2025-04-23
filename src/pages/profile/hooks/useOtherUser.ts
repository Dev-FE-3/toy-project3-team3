import { useQuery } from "@tanstack/react-query";
import { getUserByRandomId } from "@/shared/api/users";
import { User } from "@/shared/api/users";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

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
