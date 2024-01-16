import crypto from "crypto";
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
});

export const bufferToBlob = (buffer: Buffer, contentType: string) => {
  return new Blob([buffer], { type: contentType });
};

export const createChecksum = (data: any) => {
  const hash = crypto.createHash("sha256");
  hash.update(data);

  return hash.digest("hex");
};
