import CryptoJS, { MD5 } from "crypto-js";

const GIBERISH_KEY =
  process.env.NEXT_PUBLIC_GIBERISH_KEY || "default_secret_key";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY_GENERATE || "default_key";

interface Data {
  login: string;
  password: string;
  storeID: string;
  transactionNo: string;
}

interface ResponseData {
  responseStatus: string;
  responseCode: string;
  responseDescription: string;
  messageDetail: string;
  data: {
    transactionNo: string;
    transactionStatus: string;
    inTime: string;
    duration: number;
    tariff: number;
    vehicleType: string;
    outTime: string;
    gracePeriod: number;
    location: string;
    paymentStatus: string;
  };
}

export const decryptData = (encryptedData: string): ResponseData | null => {
  try {
    const today = new Date();
    const utcDate = today.toISOString().slice(0, 10).replace(/-/g, "");

    const fullSecretKey = utcDate + GIBERISH_KEY;
    // console.log("secreet key", fullSecretKey);
    const bytes = CryptoJS.AES.decrypt(encryptedData, fullSecretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Return data if it matches the expected structure, otherwise return null
    if (
      decryptedData.responseStatus &&
      decryptedData.responseCode &&
      decryptedData.data
    ) {
      return decryptedData as ResponseData;
    }

    return null;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export const encryptData = (data: Data): string => {
  const today = new Date();
  const utcDate = today.toISOString().slice(0, 10).replace(/-/g, "");

  const concatenated = `${data.login}${data.password}${data.storeID}${data.transactionNo}${SECRET_KEY}`;

  const signature = CryptoJS.MD5(concatenated).toString();

  const fullSecretKey = utcDate + GIBERISH_KEY;

  const payload = {
    login: data.login,
    password: data.password,
    storeID: data.storeID,
    transactionNo: data.transactionNo,
    signature: signature,
  };

  return CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    fullSecretKey
  ).toString();
};
