import "server-only";

/**
 * サーバー側の Firebase（Admin SDK）。
 * Firestore の読み書きとセッションの検証はすべてここを通す。
 * ページから直接 Firestore を叩かない（指示書「絶対に守ること > 実装」）。
 *
 * 認証情報の渡し方：
 * - App Hosting（Cloud Run）では Application Default Credentials が自動で効くので何も要らない
 * - ローカルのエミュレータでは FIRESTORE_EMULATOR_HOST 等を Admin SDK が自動で拾う
 * サービスアカウントの鍵ファイルは置かない。
 */

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { firebaseClientConfig, useEmulator } from "@/lib/firebase/config";

let cachedApp: App | null = null;

function adminApp(): App {
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length) {
    cachedApp = existing[0]!;
    return cachedApp;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? firebaseClientConfig.projectId;
  const storageBucket = firebaseClientConfig.storageBucket;

  // エミュレータでは資格情報を要求されない。projectId さえ合っていれば繋がる。
  if (useEmulator) {
    cachedApp = initializeApp({ projectId, storageBucket });
    return cachedApp;
  }

  // ローカルから本番/検証プロジェクトに繋ぎたいときだけ使う逃げ道。
  // App Hosting 上ではこの環境変数を設定せず、ADC に任せる。
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const parsed = JSON.parse(raw) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
    cachedApp = initializeApp({
      credential: cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        // .env に入れると改行がエスケープされるので戻す
        privateKey: parsed.private_key.replace(/\\n/g, "\n"),
      }),
      projectId: parsed.project_id,
      storageBucket,
    });
    return cachedApp;
  }

  cachedApp = initializeApp({ projectId, storageBucket });
  return cachedApp;
}

export function adminDb(): Firestore {
  return getFirestore(adminApp());
}

export function adminAuth(): Auth {
  return getAuth(adminApp());
}

export function adminBucket() {
  return getStorage(adminApp()).bucket();
}
