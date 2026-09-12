import { NextRequest } from "next/server";

const DRIVE_ID = /^[A-Za-z0-9_-]{10,}$/;

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!DRIVE_ID.test(id)) return new Response("Invalid media id", { status: 400 });

  const range = request.headers.get("range");
  const upstream = await fetch(`https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`, {
    redirect: "follow",
    headers: range ? { Range: range } : undefined,
    next: { revalidate: 86400 },
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Media unavailable", { status: upstream.status || 502 });
  }

  const headers = new Headers();
  const type = upstream.headers.get("content-type");
  const length = upstream.headers.get("content-length");
  const contentRange = upstream.headers.get("content-range");
  const acceptRanges = upstream.headers.get("accept-ranges");
  if (type) headers.set("Content-Type", type);
  if (length) headers.set("Content-Length", length);
  if (contentRange) headers.set("Content-Range", contentRange);
  if (acceptRanges) headers.set("Accept-Ranges", acceptRanges);
  headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(upstream.body, { status: upstream.status, headers });
}
