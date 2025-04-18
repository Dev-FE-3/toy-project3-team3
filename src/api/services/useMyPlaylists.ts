import { useQuery } from "@tanstack/react-query";
import { getMyPlaylists } from "@/api/services/getMyPlaylists";

const useMyPlaylists = (randomId?: number) => {
  return useQuery({
    queryKey: ["myPlaylists", randomId],
    queryFn: () => getMyPlaylists(randomId!),
    enabled: !!randomId,
  });
};

export default useMyPlaylists;
