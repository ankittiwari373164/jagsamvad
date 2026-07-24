"use server";

import { revalidatePath } from "next/cache";
import { runSeoAutomation, type AutomationRunResult } from "@/lib/seo-automation";

export async function triggerSeoAutomation(): Promise<AutomationRunResult> {
  const result = await runSeoAutomation({ force: true });
  revalidatePath("/admin/seo");
  revalidatePath("/admin/articles");
  return result;
}