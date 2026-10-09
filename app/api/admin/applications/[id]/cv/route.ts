import { getApplication } from "@/lib/server/applications";
import { authorizeRequest } from "@/lib/server/auth";
import { readCv } from "@/lib/server/cv-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Streams an applicant's CV to signed-in recruiters only. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeRequest("view");
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const app = await getApplication(id);
  if (!app?.cv) return new Response("Not found", { status: 404 });

  const pdf = await readCv(app.cv.fileId);
  const filename = `${app.reference} - ${app.cv.originalName}`.replace(/["\\\r\n]/g, "");
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": `inline; filename="${filename.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
