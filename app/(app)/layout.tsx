"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Session } from "@/lib/supabaseClient";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Layout auth state change:", event, session ? "logged in" : "logged out");
      setSession(session);
      
      // ログアウト時はホームページにリダイレクト
      if (event === 'SIGNED_OUT') {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase || isSigningOut) return;
    
    setIsSigningOut(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("ログアウトに失敗しました。");
        setIsSigningOut(false);
        return;
      }
      
      // セッションをクリア
      setSession(null);
      
      // 成功メッセージを表示
      toast.success("ログアウトしました。");
      
      // ホームページにリダイレクト
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("ログアウト中にエラーが発生しました。");
      setIsSigningOut(false);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "📊 ダッシュボード", icon: "📊" },
    { href: "/tasks", label: "📝 タスク", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* アプリ専用ヘッダー */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* ロゴ・アプリ名 */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  E
                </div>
                <span className="text-xl font-bold text-slate-900">EisenFlow</span>
              </Link>
            </div>

            {/* ナビゲーション */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* ユーザーメニュー */}
            <div className="flex items-center gap-3">
              {session && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {session.user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    {isSigningOut ? "ログアウト中..." : "ログアウト"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
