/**
 * Firebase の設定値。すべて環境変数から読む。
 * 値をコードに直接書かない（指示書「絶対に守ること > 実装」）。
 *
 * [要確認] 未確定#9：Firebaseプロジェクトの作成とBlazeプランの請求先（CTO）
 * [要確認] 未確定#10：HPとプロダクトでプロジェクトを分けるか（CTO）
 * 実プロジェクトが用意できるまでは、エミュレータ（npm run emulators）で動かす。
 */

export const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

/** エミュレータに繋ぐか。ローカル開発でのみ 1 にする */
export const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "1";

export const EMULATOR_PORTS = {
  auth: 9099,
  firestore: 8080,
  storage: 9199,
} as const;

/**
 * ログインを許可するドメインの判定は src/lib/auth/domain.ts にある。
 * このファイルはクライアント側（client.ts）からも読み込まれるので、
 * NEXT_PUBLIC_ が付かない環境変数はここに置かない。
 */
