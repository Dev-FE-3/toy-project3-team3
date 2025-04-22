import { useQuery } from "@tanstack/react-query";
import { getMyPlaylists } from "@/api/getMyPlaylists";
import { QUERY_KEYS } from "@/constants/queryKey";

const useMyPlaylists = (randomId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.myPlaylists, randomId],
    queryFn: () => getMyPlaylists(randomId!),
    enabled: !!randomId,
  });
};

export default useMyPlaylists;
