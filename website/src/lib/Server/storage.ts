import { message } from "antd";

export const uploadImage = async (_file: File, _bucket: string = "lost-items") => {
  if (typeof window !== "undefined") {
    message.info("デモ環境のため画像アップロードは無効化されています");
  }
  return { path: "", publicUrl: "" };
};

export const getPublicUrl = (_path: string, _bucket: string = "lost-items") => {
  return "";
};

export const deleteImage = async (_path: string, _bucket: string = "lost-items") => {
  return {};
};
