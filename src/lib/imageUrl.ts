export function imageUrl(url: string) {
  if (!url) return "";

  // gambar lokal dari public
  if (url.startsWith("/")) {
    return url;
  }

  // Google Drive
  const match =
    url.match(/id=([^&]+)/) ||
    url.match(/\/d\/([^/]+)/);

  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return url;
}