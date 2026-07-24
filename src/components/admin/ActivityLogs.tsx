import { getBaseUrl } from "@/lib/api";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  type: "create" | "update" | "delete" | "import";
  title: string;
  created_at: string;
}

const icons = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  import: Download,
};

function getRelativeTime(dateString?: string) {
  if (!dateString) return "Belum ada waktu";

  const diff = Date.now() - new Date(dateString).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Baru saja";

  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} jam lalu`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} hari lalu`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} bulan lalu`;
  }

  return `${Math.floor(months / 12)} tahun lalu`;
}

export default async function ActivityLogs() {
  const res = await fetch(`${getBaseUrl()}/api/notifications`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil aktivitas");
  }

  const notifications: Notification[] = await res.json();

  const activities = notifications
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <div
      className="
        rounded-2xl
        bg-white
        dark:bg-dark-card
        p-6
        transition-colors
        duration-300
      "
    >
      <h2
        className="
          mb-5
          text-lg
          font-semibold
          text-gray-900
          dark:text-white
        "
      >
        Aktivitas Terbaru
      </h2>

      {activities.length === 0 ? (
        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Belum ada aktivitas
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((item) => {
            const Icon = icons[item.type];

            return (
              <div
                key={item.id}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-gray-100
                    text-gray-600
                    dark:bg-neutral-800
                    dark:text-gray-300
                  "
                >
                  <Icon size={16} />
                </div>

                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <p
                    className="
                      min-w-0
                      flex-1
                      truncate
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-white
                    "
                    title={item.title}
                  >
                    {item.title}
                  </p>

                  <span
                    className="
                      shrink-0
                      whitespace-nowrap
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {getRelativeTime(item.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
