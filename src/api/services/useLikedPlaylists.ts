// import { useQuery } from "@tanstack/react-query";
// import { getPlaylistCardData } from "@/api/playlistCardData";
// import { getMyLikedPlaylistIds } from "@/api/like";
// //import { useUserStore } from "@/stores/userStore";
// import { useMemo } from "react";

// const useLikedPlaylists = (randomId?: number) => {
//   const { data: allPlaylists = [], ...restPlaylists } = useQuery({
//     queryKey: ["allPlaylists"],
//     queryFn: getPlaylistCardData,
//   });

//   const { data: likedIds = [], ...restLikes } = useQuery({
//     queryKey: ["myLikedIds", randomId],
//     queryFn: () => getMyLikedPlaylistIds(randomId!),
//     enabled: !!randomId,
//   });

//   const likedPlaylists = useMemo(() => {
//     return allPlaylists.filter((playlist) => likedIds.includes(playlist.p_id));
//   }, [allPlaylists, likedIds]);

//   return {
//     likedPlaylists,
//     isLoading: restPlaylists.isLoading || restLikes.isLoading,
//   };
// };

// export default useLikedPlaylists;

import { useQuery } from "@tanstack/react-query";
import { getPlaylistCardData, PlaylistCardData } from "@/api/playlistCardData";
import { getMyLikedPlaylistIds } from "@/api/like";
import { useMemo } from "react";

const useLikedPlaylists = (randomId?: number) => {
  const { data: allPlaylistResponse, ...restPlaylists } = useQuery({
    queryKey: ["allPlaylists"],
    queryFn: getPlaylistCardData,
  });

  const { data: likedIds = [], ...restLikes } = useQuery<number[]>({
    queryKey: ["myLikedIds", randomId],
    queryFn: () => getMyLikedPlaylistIds(randomId!),
    enabled: !!randomId,
  });

  const likedPlaylists = useMemo(() => {
    const allPlaylists: PlaylistCardData[] = allPlaylistResponse?.data ?? [];
    return allPlaylists.filter((playlist) => likedIds.includes(playlist.p_id));
  }, [allPlaylistResponse?.data, likedIds]); // ✅ 의존성도 바꿔줌

  return {
    likedPlaylists,
    isLoading: restPlaylists.isLoading || restLikes.isLoading,
  };
};

export default useLikedPlaylists;
