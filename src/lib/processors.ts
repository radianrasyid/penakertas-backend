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

export const validateFromArrToString = ({
  env,
  stringToValidate,
}: {
  env: string;
  stringToValidate: string;
}) => {
  let envData: string[] = [];
  if (env.includes(",")) {
    envData = env.split(",");
  } else {
    envData = [env];
  }

  return envData.some((e) => e === stringToValidate);
};
