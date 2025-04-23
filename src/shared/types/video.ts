export interface Video {
  v_id: number;
  title: string;
  playlist_id: number;
  channel_name: string;
  thumbnail_url: string;
  created_at: string; // ISO timestamp
  video_id: string;
  thumbnailFile?: File;
}
