"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) return;

      try {
        // URLパラメータから認証コードを取得
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error("OAuth error:", error);
          toast.error("認証に失敗しました。再度お試しください。");
          router.push("/auth/login");
          return;
        }

        if (code) {
          // 認証コードをセッションに変換
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
            toast.error("認証コードの処理に失敗しました。");
            router.push("/auth/login");
            return;
          }

          if (data.session) {
            toast.success("ログインしました！");
            router.push("/dashboard");
          } else {
            toast.error("セッションの作成に失敗しました。");
            router.push("/auth/login");
          }
        } else {
          // コードがない場合は既存のセッションを確認
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Session error:", sessionError);
            toast.error("認証に失敗しました。");
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
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("認証処理中にエラーが発生しました。");
        router.push("/auth/login");
      }
    };

    handleAuthCallback();
  }, [supabase, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm text-slate-600">認証を処理中...</p>
      </div>
    </div>
  );
}
