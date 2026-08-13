"use client";

/**
 * 画像アップロード（アイキャッチと本文中の画像）。
 * ブラウザから Cloud Storage に直接上げ、公開URLを返す。
 * 受け入れ側の制限は storage.rules にも書いてある（クライアント側だけの検査は当てにしない）。
 */

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { clientStorage } from "@/lib/firebase/client";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export type UploadedImage = {
  url: string;
  path: string;
  width: number;
  height: number;
};

export async function uploadImage(
  file: File,
  folder: "eyecatch" | "body",
): Promise<UploadedImage> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("JPEG / PNG / WebP / GIF のみアップロードできます");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("画像は5MBまでです");
  }

  const size = await readImageSize(file);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${stamp()}-${safeName}`;

  const storageRef = ref(clientStorage(), path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(storageRef);

  return { url, path, width: size.width, height: size.height };
}

/**
 * 画像の実寸を読む。
 * アイキャッチの推奨は1200×630（要件6.3）。判定に使えるよう保存時に持っておく。
 */
function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("画像を読み込めませんでした"));
    };
    img.src = url;
  });
}

function stamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours(),
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
