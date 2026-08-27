export function isValidFacebookUrl(value?: string) {
  if (!value) return true;

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);

    const host = url.hostname.replace(/^www\.|^web\./, "");

    return (
      host === "facebook.com" && url.pathname !== "/" && url.pathname.length > 1
    );
  } catch {
    return false;
  }
}

export function normalizeInstagramUsername(value?: string) {
  if (!value) return "";

  return value.trim().replace(/^@/, "");
}

export function isValidInstagramUsername(value?: string) {
  if (!value) return true;

  const username = normalizeInstagramUsername(value);

  return /^[A-Za-z0-9._]{1,30}$/.test(username);
}

export function normalizeTiktokUsername(value?: string) {
  if (!value) return "";

  return value.trim().replace(/^@/, "");
}

export function isValidTiktokUsername(value?: string) {
  if (!value) return true;

  const username = normalizeTiktokUsername(value);

  return /^[A-Za-z0-9._]{2,24}$/.test(username);
}

export function normalizeWhatsapp(phone?: string) {
  if (!phone) return "";

  let value = phone.replace(/\D/g, "");

  if (value.startsWith("62")) {
    value = "0" + value.slice(2);
  } else if (value.startsWith("8")) {
    value = "0" + value;
  }

  return value;
}

export function isValidWhatsapp(phone?: string) {
  if (!phone) return true; // optional

  const value = phone.replace(/\D/g, "");

  return /^(08|628)\d{8,11}$/.test(value);
}

export function isValidEmail(email?: string) {
  if (!email) return true; // optional

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeNullable(value?: string | null) {
  const result = value?.trim();

  return result ? result : null;
}

export function isValidNib(value?: string | null) {
  if (!value) return true;

  return /^\d{13}$/.test(value);
}

// =========================
// UMKM Shared Validation
// =========================

export type UmkmValidationError = { message: string } | null;

export function normalizeUmkmBody(body: Record<string, any>) {
  body.kbli = Array.isArray(body.kbli)
    ? body.kbli.map((item: string) => item.trim()).filter(Boolean)
    : body.kbli
      ? [body.kbli.trim()]
      : [];

  [
    "nib",
    "pirt",
    "halal",
    "haki",
    "email",
    "facebook",
    "instagram",
    "tiktok",
  ].forEach((field) => {
    body[field] = normalizeNullable(body[field]);
  });

  body.whatsapp = normalizeWhatsapp(body.whatsapp);
  body.instagram = normalizeInstagramUsername(body.instagram);
  body.tiktok = normalizeTiktokUsername(body.tiktok);

  return body;
}

export function validateUmkmBody(body: Record<string, any>): UmkmValidationError {
  if (!isValidWhatsapp(body.whatsapp)) {
    return { message: "Nomor WhatsApp tidak valid." };
  }

  if (!isValidEmail(body.email)) {
    return { message: "Email tidak valid." };
  }

  if (!isValidFacebookUrl(body.facebook)) {
    return { message: "URL Facebook tidak valid." };
  }

  if (!isValidInstagramUsername(body.instagram)) {
    return { message: "Username Instagram tidak valid." };
  }

  if (!isValidTiktokUsername(body.tiktok)) {
    return { message: "Username TikTok tidak valid." };
  }

  return null;
}