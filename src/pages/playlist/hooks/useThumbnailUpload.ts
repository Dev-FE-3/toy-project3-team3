import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const useThumbnail = () => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); //thumbnailFile : 사용자가 선택한 이미지 파일
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // 미리보기용 브라우저 url
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); //storage에 업로드 후 받은 url

  //화면에 이미지 업로드
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file); //스토리지에 업로드용
    setThumbnailPreview(URL.createObjectURL(file)); //미리보기용
  };

  //DB에 이미지 업로드 로직 (storage에 업로드 및 public url을 반환)
  const uploadToStorage = async (
    file: File, //thumbnailFile
    type: "playlist" | "video",
  ): Promise<string> => {
    const extension = file.name.split(".").pop() || "jpg";
    const safeFileName = `${Date.now()}.${extension}`;
    const pathPrefix =
      type === "playlist" ? "playlist_cover_img" : "video_cover_img";
    const filePath = `${pathPrefix}/${safeFileName}`;

    const { error } = await supabase.storage
      .from("thumbnail")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw new Error("썸네일 업로드 실패");

    const { data } = supabase.storage.from("thumbnail").getPublicUrl(filePath);
    return data.publicUrl;
  };

  //플레이리스트용 (public url 반환)
  const uploadPlaylistThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) throw new Error("썸네일 파일이 없습니다.");
    const url = await uploadToStorage(thumbnailFile, "playlist");
    setThumbnailUrl(url);
    return url;
  };

  //영상용 (public url 반환)
  const uploadVideoThumbnail = async (file: File): Promise<string> => {
    return await uploadToStorage(file, "video");
  };

  return {
    thumbnailFile,
    thumbnailPreview,
    thumbnailUrl,
    handleThumbnailChange,
    uploadPlaylistThumbnail,
    uploadVideoThumbnail,
  };
};
