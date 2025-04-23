import { useQuery } from "@tanstack/react-query";
import { getMyPlaylists } from "@/shared/api/playlistCardData";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

const useMyPlaylists = (randomId?: number) => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.myPlaylists, randomId],
    queryFn: () => getMyPlaylists(randomId!),
    enabled: !!randomId,
  });

  return {
    myPlaylists: data,
    isLoading,
    isError,
  };
};

export default useMyPlaylists;
