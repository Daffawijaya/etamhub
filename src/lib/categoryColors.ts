export const CATEGORY_COLORS: Record<
  string,
  { color: string; darkColor: string }
> = {
  Jasa: {
    color: "#8B5CF6",
    darkColor: "#C4B5FD",
  },
  Industri: {
    color: "#F59E0B",
    darkColor: "#FCD34D",
  },
};

export const DEFAULT_CATEGORY_COLOR = {
  color: "#10B981",
  darkColor: "#6EE7B7",
};

export function getCategoryColor(kategori: string) {
  return CATEGORY_COLORS[kategori] || DEFAULT_CATEGORY_COLOR;
}