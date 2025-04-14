import { useQuery } from "@tanstack/react-query";
import { getMyPlaylists } from "@/api/services/getMyPlaylists"; // ✅ 너가 만든 API 함수 import

const useMyPlaylists = (randomId?: number) => {
  return useQuery({
    queryKey: ["myPlaylists", randomId],
    queryFn: () => getMyPlaylists(randomId!),
    enabled: !!randomId,
  });
};

export default useMyPlaylists;
