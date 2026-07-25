import { Upload, X } from "lucide-react";

import FormSection from "../ui/FormSection";
import { ImageItem } from "../types";

import { getUmkmImage } from "@/lib/getUmkmImage";

interface Props {
  images: ImageItem[];

  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
}

export default function ImageSection({
  images,

  setImages,
}: Props) {
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    const newImages = files.map((file) => ({
      type: "new" as const,

      url: URL.createObjectURL(file),

      file,
    }));

    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";
  }

  return (
    <FormSection title="Gambar UMKM">
      <label
        className="
flex
items-center
justify-center
gap-2
border
border-dashed
border-slate-300
dark:border-slate-700
rounded-xl
p-6
cursor-pointer
hover:bg-[#e8ddf0]
dark:hover:bg-[#24152e]
transition
duration-300
"
      >
        <Upload size={18} />

        <span>Upload gambar</span>

        <input
          hidden
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
        />
      </label>

      {images.length > 0 && (
        <div
          className="
grid
grid-cols-2
md:grid-cols-4
gap-4
mt-4
"
        >
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="
relative
rounded-xl
overflow-hidden
border
border-slate-200
dark:border-slate-800
"
            >
              <img
                src={image.type === "old" ? getUmkmImage(image.url) : image.url}
                alt="gambar UMKM"
                className="
h-28
w-full
object-cover
"
              />

              <button
                type="button"
                onClick={() => {
                  setImages((prev) => prev.filter((_, i) => i !== index));
                }}
                className="
absolute
top-2
right-2
bg-white
dark:bg-dark
rounded-full
p-1
"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
