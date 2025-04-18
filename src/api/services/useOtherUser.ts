import { useQuery } from "@tanstack/react-query";
import { getUserByRandomId } from "@/api/users";
import { User } from "@/api/users";

const useOtherUser = (randomId: number) => {
  return useQuery<User | null>({
    queryKey: ["otherUser", randomId],
    queryFn: () => getUserByRandomId(randomId),
    enabled: !!randomId,
  });
};

export default useOtherUser;
