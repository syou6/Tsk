"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          toast.error("認証に失敗しました。再度お試しください。");
          router.push("/auth/login");
          return;
        }

        if (data.session) {
          toast.success("ログインしました！");
          router.push("/dashboard");
        } else {
          toast.error("セッションが見つかりません。");
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("認証処理中にエラーが発生しました。");
        router.push("/auth/login");
      }
    };

    handleAuthCallback();
  }, [supabase, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-slate-600">認証を処理中...</p>
      </div>
    </div>
  );
}
