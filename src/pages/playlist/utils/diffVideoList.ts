export type Video = {
  v_id?: number;
  video_id: string;
  title: string;
  channel_name: string;
  thumbnail_url: string;
};

/**
 * 기존 영상 목록과 현재 영상 목록을 비교하여
 * - 삭제된 영상 리스트 (v_id가 있고 current에 없는 애들)
 * - 새로 추가된 영상 리스트 (v_id가 없는 애들)
 */
export function diffVideoList(
  original: Video[],
  current: Video[],
): { deleted: Video[]; added: Video[] } {
  const deleted = original.filter(
    (orig) => !current.some((curr) => curr.v_id === orig.v_id),
  );

  const added = current.filter((curr) => !curr.v_id);

  return { deleted, added };
}
