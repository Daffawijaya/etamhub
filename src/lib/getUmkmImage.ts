export function getUmkmImage(gambar: string | string[] | undefined | null): string {
  const image = Array.isArray(gambar) ? gambar[0] : gambar;

  if (!image) return "/placeholder.jpg";

  // Cek apakah link berasal dari Google Drive
  if (image.includes("drive.google.com")) {
    const match = image.match(/id=([a-zA-Z0-9_-]+)/) || image.match(/\/d\/([a-zA-Z0-9_-]+)/);
    
    if (match && match[1]) {
      const id = match[1];
      // PENTING: Gunakan format /d/ID murni tanpa tambahan =w1000
      return `https://lh3.googleusercontent.com/d/${id}`;
    }
  }

  return image;
}