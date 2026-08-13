"use client";

/**
 * Google ログイン（要件 NEW-02 / 6.6）。
 *
 * ここで取れるのは ID トークンだけ。誰を通すかの判定はサーバー側（session.ts）で行う。
 * 下の hd 指定はログイン画面でアカウントを絞り込むだけの飾りで、
 * これを信用して制限をかけているわけではない。
 */

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { clientAuth } from "@/lib/firebase/client";

export function LoginForm({ hostedDomain }: { hostedDomain?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onClick = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      if (hostedDomain) provider.setCustomParameters({ hd: hostedDomain });

      const credential = await signInWithPopup(clientAuth(), provider);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "ログインできませんでした");
        // 弾かれたアカウントのセッションをブラウザ側に残さない
        await clientAuth().signOut();
        return;
      }
      startTransition(() => router.replace("/admin"));
    } catch (e) {
      if (e instanceof Error && e.message.includes("popup-closed-by-user")) {
        return;
      }
      setError(
        e instanceof Error ? e.message : "ログインでエラーが発生しました",
      );
    }
  };

  return (
    <div className="login__box">
      <button
        type="button"
        className="btn"
        onClick={onClick}
        disabled={pending}
      >
        {pending ? "確認中…" : "Googleでログイン"}
      </button>
      {error ? (
        <p className="login__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
