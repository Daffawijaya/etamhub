import UmkmMapCardMobile from "./UmkmMapCardMobile";
import UmkmMapCardDesktop from "./UmkmMapCardDekstop";

type UmkmMapCardProps = {
  nama: string;
  kategori: string;
  subkategori: string;
  gambar: string | string[];
  lat: number;
  lng: number;
  id: number;
  onClose?: () => void;
};

export default function UmkmMapCard({
  nama,
  kategori,
  subkategori,
  gambar,
  lat,
  lng,
  id,
  onClose,
}: UmkmMapCardProps) {
  const getCategoryColor = (kat: string) => {
    const key = kat.toLowerCase();

    if (key.includes("perdagangan"))
      return {
        dot: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
      };

    if (key.includes("jasa"))
      return {
        dot: "bg-[#8B5CF6]",
        text: "text-[#8B5CF6]",
      };

    if (key.includes("industri"))
      return {
        dot: "bg-[#F59E0B]",
        text: "text-[#F59E0B]",
      };

    return {
      dot: "bg-[#10B981]",
      text: "text-[#10B981]",
    };
  };

  const categoryColor = getCategoryColor(kategori);

  return (
    <>
      {/* Tampilan Mobile (< md) */}
      <UmkmMapCardMobile
        nama={nama}
        kategori={kategori}
        subkategori={subkategori}
        gambar={gambar}
        lat={lat}
        lng={lng}
        id={id}
        categoryColor={categoryColor}
        onClose={onClose}
      />

      {/* Tampilan Desktop & Tablet (>= md) - 100% Tidak Dirubah */}
      <UmkmMapCardDesktop
        nama={nama}
        kategori={kategori}
        subkategori={subkategori}
        gambar={gambar}
        lat={lat}
        lng={lng}
        id={id}
        categoryColor={categoryColor}
      />
    </>
  );
}