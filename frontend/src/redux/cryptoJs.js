import { createTransform } from "redux-persist";
import CryptoJS from "crypto-js";

const secretKey = "Your-Secret-Key";

const encryptionTransformer = createTransform(
  // Transform state on its way to being serialized and stored.
  (inboundState, key) => {
    const encryptedState = CryptoJS.AES.encrypt(
      JSON.stringify(inboundState),
      secretKey
    ).toString();
    return encryptedState;
  },
  // Transform state being rehydrated
  (outboundState, key) => {
    const decryptedState = CryptoJS.AES.decrypt(
      outboundState,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedState);
  }
);

export default encryptionTransformer;
