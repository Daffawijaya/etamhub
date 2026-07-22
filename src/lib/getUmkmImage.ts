export function getUmkmImage(gambar: string | string[]) {
  const image = Array.isArray(gambar) ? gambar[0] : gambar;

  if (!image) return "/placeholder.jpg";

  // Google Drive: open?id=
  if (image.includes("drive.google.com/open?id=")) {
    const id = image.split("id=")[1];
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }

  // Google Drive: file/d/
  if (image.includes("drive.google.com/file/d/")) {
    const id = image.split("/file/d/")[1]?.split("/")[0];
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }

  return image;
}
