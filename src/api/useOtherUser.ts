import { useQuery } from "@tanstack/react-query";
import { getUserByRandomId } from "@/db/users";
import { User } from "@/db/users";

const useOtherUser = (randomId: number) => {
  return useQuery<User | null>({
    queryKey: ["otherUser", randomId],
    queryFn: () => getUserByRandomId(randomId),
    enabled: !!randomId,
  });
};

export default useOtherUser;
