export async function convertImageToFile(
  url: string,
  title: string,
): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const extension = blob.type.split("/")[1];
  const fileName = `${title}.${extension}`;
  return new File([blob], fileName, { type: blob.type });
}
