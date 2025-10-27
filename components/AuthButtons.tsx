"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseBrowserClient, type Session } from "@/lib/supabaseClient";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthButtons() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    router.refresh();
  };

  if (!supabase) {
    return null;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{session.user.email}</span>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          ダッシュボード
        </Link>
        <Button size="sm" onClick={handleSignOut}>
          ログアウト
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
        ログイン
      </Link>
      <Button size="sm" asChild>
        <Link href="/auth/signup">無料トライアル</Link>
      </Button>
    </div>
  );
}
