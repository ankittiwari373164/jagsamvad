"use server";

import { revalidatePath } from "next/cache";
import { runSeoAutomation, type AutomationRunResult } from "@/lib/seo-automation";

export async function triggerSeoAutomation(): Promise<AutomationRunResult> {
  try {
    const result = await runSeoAutomation({ force: true });
    revalidatePath("/admin/seo");
    revalidatePath("/admin/articles");
    return result;
  } catch (error) {
    console.error("SEO automation manual run failed:", error);
    return {
      ran: false,
      reason:
        error instanceof Error
          ? `Failed: ${error.message}`
          : "Failed — check server logs for details.",
    };
  }
}