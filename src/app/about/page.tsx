import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fieldFacilitators = Array.from({ length: 13 }, (_, i) => ({
  id: i + 1,
  name: `Pendamping Lapangan ${i + 1}`,
  role: "Pendamping UMKM",
  area: `Kecamatan ${i + 1}`,
}));

const digitalTeam = [
  {
    name: "Dafa Yan Wijaya",
    role: "Pengembang Aplikasi & Pendamping TI Digitalisasi",
    highlight: true,
  },
  {
    name: "Pendamping TI 2",
    role: "Pendamping TI & Digitalisasi",
  },
  {
    name: "Pendamping TI 3",
    role: "Pendamping TI & Digitalisasi",
  },
  {
    name: "Pendamping TI 4",
    role: "Pendamping TI & Digitalisasi",
  },
  {
    name: "Pendamping TI 5",
    role: "Pendamping TI & Digitalisasi",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-white">
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute right-0 top-[300px] h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-pink-400/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* HERO */}
          <section className="mx-auto max-w-7xl px-6 py-24">
            <div className="mx-auto max-w-4xl text-center">
              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
                Tentang KAWAKU
              </span>

              <h1 className="mt-6 text-4xl font-bold text-gray-900 md:text-6xl">
                Karya Wirausaha dan Ekonomi Kreatif
                <span className="block text-violet-600">
                  Kutai Kartanegara
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                KAWAKU merupakan platform digital yang mendukung promosi,
                pendataan, dan digitalisasi UMKM Kabupaten Kutai Kartanegara.
                Platform ini menjadi sarana informasi, kolaborasi, dan
                pengembangan UMKM yang didukung oleh tenaga ahli serta
                pendamping di berbagai bidang.
              </p>
            </div>
          </section>

          {/* PIMPINAN */}
          <section className="mx-auto max-w-7xl px-6 pb-20">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Pimpinan
              </h2>
              <p className="mt-3 text-gray-600">
                Dinas Koperasi dan UKM Kabupaten Kutai Kartanegara
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700">
                  MR
                </div>

                <h3 className="text-center text-xl font-bold">
                  Muhammad Reza, S.T.
                </h3>

                <p className="mt-2 text-center text-gray-600">
                  Plt. Kepala Dinas Koperasi dan UKM Kabupaten Kutai
                  Kartanegara
                </p>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700">
                  SE
                </div>

                <h3 className="text-center text-xl font-bold">
                  Santi Effensi, S.E.
                </h3>

                <p className="mt-2 text-center text-gray-600">
                  Kepala Bidang Pemberdayaan Usaha Mikro
                </p>
              </div>
            </div>
          </section>

          {/* STATISTIK */}
          <section className="mx-auto max-w-7xl px-6 pb-20">
            <div className="grid gap-6 md:grid-cols-4">
              <StatCard value="13" label="Pendamping Lapangan" />
              <StatCard value="5" label="TI & Digitalisasi" />
              <StatCard value="1" label="Kewirausahaan" />
              <StatCard value="1" label="Database" />
            </div>
          </section>

          {/* DEVELOPER */}
          <section className="mx-auto max-w-7xl px-6 pb-24">
            <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-600 to-blue-600 p-10 text-white">
              <div className="max-w-4xl">
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                  Pengembang Utama
                </span>

                <h2 className="mt-5 text-4xl font-bold">
                  Dafa Yan Wijaya
                </h2>

                <p className="mt-3 text-lg text-white/90">
                  Tenaga Ahli TI & Digitalisasi
                </p>

                <p className="mt-6 leading-relaxed text-white/90">
                  Pengembang dan perancang utama aplikasi KAWAKU. Bertanggung
                  jawab dalam pengembangan sistem, desain antarmuka,
                  digitalisasi layanan UMKM, pengelolaan data, serta
                  pengembangan fitur yang mendukung promosi dan pemberdayaan
                  UMKM Kabupaten Kutai Kartanegara.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                    Full Stack Developer
                  </span>

                  <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                    UI/UX Designer
                  </span>

                  <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                    Digitalisasi UMKM
                  </span>

                  <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                    System Developer
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* TI DIGITALISASI */}
          <section className="mx-auto max-w-7xl px-6 pb-24">
            <h2 className="mb-10 text-center text-3xl font-bold">
              Tim TI & Digitalisasi
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {digitalTeam.map((member) => (
                <div
                  key={member.name}
                  className={`rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    member.highlight
                      ? "border-violet-300 bg-violet-50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-700">
                    {member.name
                      .split(" ")
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <h3 className="text-xl font-bold">{member.name}</h3>

                  <p className="mt-2 text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PENDAMPING LAPANGAN */}
          <section className="mx-auto max-w-7xl px-6 pb-24">
            <h2 className="mb-10 text-center text-3xl font-bold">
              Pendamping Lapangan UMKM
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {fieldFacilitators.map((member) => (
                <div
                  key={member.id}
                  className="rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">
                    {member.id}
                  </div>

                  <h3 className="font-bold text-gray-900">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {member.role}
                  </p>

                  <span className="mt-4 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                    {member.area}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* BIDANG LAIN */}
          <section className="mx-auto max-w-7xl px-6 pb-24">
            <h2 className="mb-10 text-center text-3xl font-bold">
              Bidang Pendukung
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold">
                  Pendamping Kewirausahaan
                </h3>

                <p className="mt-3 text-gray-600">
                  Mendukung pengembangan kapasitas usaha, peningkatan
                  kompetensi pelaku UMKM, serta mendorong lahirnya
                  wirausaha baru.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold">
                  Pendamping Database
                </h3>

                <p className="mt-3 text-gray-600">
                  Bertanggung jawab terhadap pengelolaan data UMKM,
                  validasi data, pelaporan, dan pengembangan sistem
                  informasi pendukung program pemberdayaan UMKM.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <div className="text-4xl font-bold text-violet-600">{value}</div>
      <p className="mt-2 text-gray-600">{label}</p>
    </div>
  );
}