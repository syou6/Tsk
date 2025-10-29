"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) return;

      try {
        // URLパラメータからエラーを確認
        const error = searchParams.get('error');

        if (error) {
          console.error("OAuth error:", error);
          toast.error("認証に失敗しました。再度お試しください。");
          router.push("/auth/login");
          return;
        }

        // 認証状態の監視を設定（重複を防ぐため一度だけ）
        let hasRedirected = false;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state change:", event, session ? "logged in" : "logged out");
          
          if (event === 'SIGNED_IN' && session && !hasRedirected) {
            hasRedirected = true;
            toast.success("ログインしました！", { id: "login-success" });
            router.push("/dashboard");
          } else if (event === 'SIGNED_OUT') {
            toast.error("ログアウトしました。");
            router.push("/auth/login");
          }
        });

        // 既存のセッションを確認
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error("認証に失敗しました。");
          router.push("/auth/login");
          return;
        }

        if (data.session && !hasRedirected) {
          hasRedirected = true;
          toast.success("ログインしました！", { id: "login-success" });
          router.push("/dashboard");
        } else if (!data.session) {
          // セッションがない場合は少し待ってから再試行
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase.auth.getSession();
            
            if (retryError) {
              console.error("Retry session error:", retryError);
              toast.error("認証に失敗しました。");
              router.push("/auth/login");
              return;
            }

            if (retryData.session && !hasRedirected) {
              hasRedirected = true;
              toast.success("ログインしました！", { id: "login-success" });
              router.push("/dashboard");
            } else if (!retryData.session) {
              // タイムアウト後にログインページにリダイレクト
              setTimeout(() => {
                toast.error("認証がタイムアウトしました。");
                router.push("/auth/login");
              }, 3000);
            }
          }, 1000);
        }

        // クリーンアップ
        return () => {
          subscription.unsubscribe();
        };
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-slate-600">読み込み中...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
