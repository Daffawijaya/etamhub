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
        
      />
    </>
  );
}