// generateSignature.js
import crypto from "crypto";

export const GenerateTimestamp = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return timestamp;
};

export const GenerateSignature = (body: {} = {}) => {
  const secret = process.env.NEXT_PUBLIC_SECRET_KEY_GENERATE;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const stringifiedBody = JSON.stringify(body);
  const hmac = crypto.createHmac("sha256", secret || "");
  hmac.update(stringifiedBody + timestamp);
  const signature = hmac.digest("hex");
  const response = { timestamp, signature };
  console.log("generate signature", body);
  return response;
};
