import { NextRequest, NextResponse } from "next/server";
import { runSeoAutomation } from "@/lib/seo-automation";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Vercel Cron sends this header automatically. As a second layer, also
  // accept a manually-configured secret so the endpoint can't be triggered
  // by anyone who happens to guess the URL.
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") !== null;
  const hasValidSecret =
    process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !hasValidSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSeoAutomation();
    return NextResponse.json(result);
  } catch (error) {
    console.error("SEO automation run failed:", error);
    return NextResponse.json(
      { ran: false, reason: "Internal error — check server logs." },
      { status: 500 }
    );
  }
}