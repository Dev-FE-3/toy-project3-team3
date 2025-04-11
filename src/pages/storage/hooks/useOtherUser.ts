import { useQuery } from "@tanstack/react-query";
import { getUserByRandomId } from "@/api/services/getUserByRandomId";
import { User } from "@/api/users";

const useOtherUser = (randomId: number) => {
  return useQuery<User | null>({
    queryKey: ["otherUser", randomId],
    queryFn: () => getUserByRandomId(randomId),
    enabled: !!randomId, // undefined일 경우 실행 안 되게
  });
};

export default useOtherUser;
