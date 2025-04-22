import { useQuery } from "@tanstack/react-query";
import { getMyPlaylists } from "@/db/playlistCardData";
import { QUERY_KEYS } from "@/constants/queryKey";

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
