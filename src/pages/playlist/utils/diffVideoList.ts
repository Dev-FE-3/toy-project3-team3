import { Video } from "@/types/video";

/**
 * 기존 영상 목록과 현재 영상 목록을 비교하여
 * - 삭제된 영상 리스트 (v_id가 있고 current에 없는 애들)
 * - 새로 추가된 영상 리스트 (v_id가 없는 애들)
 */
function getKey(v: Video) {
  return `${v.video_id ?? ""}-${v.title}-${v.channel_name}`;
}

export function diffVideoList(
  original: Video[],
  current: Video[],
): { added: Video[]; deleted: Video[] } {
  const originalKeys = new Set(original.map(getKey));
  const currentKeys = new Set(current.map(getKey));

  const added = current.filter((v) => !originalKeys.has(getKey(v)));
  const deleted = original.filter((v) => !currentKeys.has(getKey(v)));

  return { added, deleted };
}
