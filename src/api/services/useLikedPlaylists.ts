import { useQuery } from "@tanstack/react-query";
import { getAllPlaylistCardData } from "@/api/playlistCardData";
import { getMyLikedPlaylistIds } from "@/api/like";
import { useMemo } from "react";

const useLikedPlaylists = (randomId?: number) => {
  const { data: allPlaylists = [], ...restPlaylists } = useQuery({
    queryKey: ["allPlaylists"],
    queryFn: getAllPlaylistCardData,
  });

  const { data: likedIds = [], ...restLikes } = useQuery({
    queryKey: ["myLikedIds", randomId],
    queryFn: () => getMyLikedPlaylistIds(randomId!),
    enabled: !!randomId,
  });

  const likedPlaylists = useMemo(() => {
    return allPlaylists.filter((playlist) => likedIds.includes(playlist.p_id));
  }, [allPlaylists, likedIds]);

  return {
    likedPlaylists,
    isLoading: restPlaylists.isLoading || restLikes.isLoading,
  };
};

export default useLikedPlaylists;
