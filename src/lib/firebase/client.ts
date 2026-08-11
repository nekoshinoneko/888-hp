"use client";

/**
 * ブラウザ側の Firebase。modular（v9+）記法のみ。
 * firebase.auth() のような旧v8記法を混ぜない（指示書「絶対に守ること > 実装」）。
 *
 * ブラウザから触るのはログインと画像アップロードだけ。
 * Firestore の読み書きはサーバー側（admin.ts）に寄せている。
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from "firebase/storage";

import {
  EMULATOR_PORTS,
  firebaseClientConfig,
  useEmulator,
} from "@/lib/firebase/config";

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedStorage: FirebaseStorage | null = null;

function app(): FirebaseApp {
  if (cachedApp) return cachedApp;
  // HMR で二重初期化しないように既存のものを使い回す
  cachedApp = getApps().length ? getApp() : initializeApp(firebaseClientConfig);
  return cachedApp;
}

export function clientAuth(): Auth {
  if (cachedAuth) return cachedAuth;
  const auth = getAuth(app());
  if (useEmulator) {
    connectAuthEmulator(auth, `http://127.0.0.1:${EMULATOR_PORTS.auth}`, {
      disableWarnings: true,
    });
  }
  cachedAuth = auth;
  return auth;
}

export function clientStorage(): FirebaseStorage {
  if (cachedStorage) return cachedStorage;
  const storage = getStorage(app());
  if (useEmulator) {
    connectStorageEmulator(storage, "127.0.0.1", EMULATOR_PORTS.storage);
  }
  cachedStorage = storage;
  return storage;
}
