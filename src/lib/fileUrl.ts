export function resolveFileUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const base = apiBase.replace(/\/api\/?$/, "");
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}
