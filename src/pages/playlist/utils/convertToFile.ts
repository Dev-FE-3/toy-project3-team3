export async function convertImageToFile(
  url: string,
  title: string,
): Promise<File> {
  const response = await fetch(url); //유튜브 썸네일 이미지를 브라우저에서 가져옴
  const blob = await response.blob(); //blob 형태로 변환
  const extension = blob.type.split("/")[1]; //확장자 추출
  const fileName = `${title}.${extension}`;
  return new File([blob], fileName, { type: blob.type }); //supabase에서 인식이 가능한 형태로 변경
}
