import { useQuery } from "@tanstack/react-query";
import { getAllPlaylistCardData } from "@/db/playlistCardData";
import { getMyLikedPlaylistIds } from "@/db/like";
import { useMemo } from "react";
import { QUERY_KEYS } from "@/constants/queryKey";

const useLikedPlaylists = (randomId?: number) => {
  const { data: allPlaylists = [], isLoading: isPlaylistsLoading } = useQuery({
    queryKey: [QUERY_KEYS.allPlaylists],
    queryFn: getAllPlaylistCardData,
  });

  const { data: likedIds = [], isLoading: isLikesLoading } = useQuery({
    queryKey: [QUERY_KEYS.myLikedIds, randomId],
    queryFn: () => getMyLikedPlaylistIds(randomId!),
    enabled: !!randomId,
  });

  const likedPlaylists = useMemo(() => {
    return allPlaylists.filter((playlist) => likedIds.includes(playlist.p_id));
  }, [allPlaylists, likedIds]);

  return {
    likedPlaylists,
    isLoading: isPlaylistsLoading || isLikesLoading,
  };
};

export default useLikedPlaylists;
