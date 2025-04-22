import { useQuery } from "@tanstack/react-query";
import { getAllPlaylistCardData } from "@/shared/api/playlistCardData";
import { getMyLikedPlaylistIds } from "@/shared/api/like";
import { useMemo } from "react";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

const useLikedPlaylists = (randomId?: number) => {
  const {
    data: allPlaylists = [],
    isLoading: isPlaylistsLoading,
    isError: isPlaylistsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.allPlaylists],
    queryFn: getAllPlaylistCardData,
  });

  const {
    data: likedIds = [],
    isLoading: isLikesLoading,
    isError: isLikesError,
  } = useQuery({
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
    isError: isPlaylistsError || isLikesError,
    isPlaylistsError,
    isLikesError,
  };
};

export default useLikedPlaylists;
