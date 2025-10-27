"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

export type Quadrant = "A" | "B" | "C" | "D";

const quadrantMap: Record<Quadrant, { urgent: boolean; important: boolean }> = {
  A: { urgent: true, important: true },
  B: { urgent: false, important: true },
  C: { urgent: true, important: false },
  D: { urgent: false, important: false },
};

function parseBoolean(value: FormDataEntryValue | null, defaultValue = false): boolean {
  if (value === null) return defaultValue;
  const normalized = String(value).toLowerCase();
  return normalized === "true" || normalized === "on" || normalized === "1";
}

function requireString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function createTask(formData: FormData) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();

    if (!userResult?.user) {
      throw new Error("ログインが必要です");
    }

    const title = requireString(formData.get("title")).trim();
    const urgent = parseBoolean(formData.get("urgent"));
    const important = parseBoolean(formData.get("important"));

    if (!title) {
      throw new Error("タスク名を入力してください");
    }

    const { error } = await supabase.from("tasks").insert({
      title,
      urgent,
      important,
      user_id: userResult.user.id,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[createTask] failed", error);
  } finally {
    revalidatePath("/tasks");
  }
}

export async function updateTask(formData: FormData) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();

    if (!userResult?.user) {
      throw new Error("ログインが必要です");
    }

    const id = requireString(formData.get("id"));
    if (!id) {
      throw new Error("タスクIDが見つかりません");
    }

    const updatePayload: Record<string, unknown> = {};

    if (formData.has("title")) {
      updatePayload.title = requireString(formData.get("title")).trim();
    }

    if (formData.has("urgent")) {
      updatePayload.urgent = parseBoolean(formData.get("urgent"));
    }

    if (formData.has("important")) {
      updatePayload.important = parseBoolean(formData.get("important"));
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new Error("更新内容がありません");
    }

    const { error } = await supabase
      .from("tasks")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", userResult.user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[updateTask] failed", error);
  } finally {
    revalidatePath("/tasks");
  }
}

export async function deleteTask(formData: FormData) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();

    if (!userResult?.user) {
      throw new Error("ログインが必要です");
    }

    const id = requireString(formData.get("id"));
    if (!id) {
      throw new Error("タスクIDが見つかりません");
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userResult.user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[deleteTask] failed", error);
  } finally {
    revalidatePath("/tasks");
  }
}

export async function setTaskQuadrant(taskId: string, quadrant: Quadrant) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();

    if (!userResult?.user) {
      throw new Error("ログインが必要です");
    }

    const mapping = quadrantMap[quadrant];

    const { error } = await supabase
      .from("tasks")
      .update({ urgent: mapping.urgent, important: mapping.important })
      .eq("id", taskId)
      .eq("user_id", userResult.user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[setTaskQuadrant] failed", error);
  } finally {
    revalidatePath("/tasks");
    revalidatePath("/dashboard");
  }
}
