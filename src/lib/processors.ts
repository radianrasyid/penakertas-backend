import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
});

export const bufferToBlob = (buffer: Buffer, contentType: string) => {
  return new Blob([buffer], { type: contentType });
};
