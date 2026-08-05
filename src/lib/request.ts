export type RequestAction = "update" | "delete";

export type RequestStatus = "pending" | "approved" | "rejected";

const IGNORED_FIELDS = [
  "id",
  "owner_id",
  "created_at",
  "updated_at",
  "approval_status",
  "approved_at",
  "approved_by",
  "published",
];

export function formatAction(action: RequestAction) {
  const labels: Record<RequestAction, string> = {
    update: "Update",
    delete: "Hapus",
  };

  return labels[action] ?? action;
}

export function formatStatus(status: RequestStatus) {
  const labels: Record<RequestStatus, string> = {
    pending: "Pending",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  return labels[status] ?? status;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getStatusStyle(status: RequestStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";

    case "approved":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";

    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300";
  }
}

export function getActionStyle(action: RequestAction) {
  switch (action) {
    case "update":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";

    case "delete":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function formatFieldName(field: string) {
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "-";
  }

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function getChangedFields(payload: Record<string, any>) {
  const before = payload?.before;
  const after = payload?.after;

  if (!before || !after) {
    return [];
  }

  return Object.keys(after).filter(
    (key) =>
      !IGNORED_FIELDS.includes(key) &&
      JSON.stringify(before[key]) !== JSON.stringify(after[key]),
  );
}
