"use client";
import CryptoJS from "crypto-js";

const isBrowser = typeof window !== "undefined";

// -------------------- Admin Data --------------------
export const saveEncryptedData = (
  data: any,
  expireSeconds: number,
  keep: boolean
) => {
  if (!isBrowser) return;

  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_ENCRYPT_KEY || "secret-key"
  ).toString();

  const expiresAt = Date.now() + expireSeconds * 1000;

  localStorage.setItem(
    "adminFormData",
    JSON.stringify({ encryptedData: encrypted, expiresAt, keep })
  );
};

export const loadEncryptedData = () => {
  if (!isBrowser) return null;

  const raw = localStorage.getItem("adminFormData");
  if (!raw) return null;

  const { encryptedData, expiresAt } = JSON.parse(raw);

  if (Date.now() > expiresAt) {
    localStorage.removeItem("adminFormData");
    return null;
  }

  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    process.env.NEXT_PUBLIC_ENCRYPT_KEY || "secret-key"
  );

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const removeEncryptedData = () => {
  if (!isBrowser) return;
  localStorage.removeItem("adminFormData");
};

// -------------------- User Data --------------------
export const saveUserData = (userData: any, expireSeconds: number) => {
  if (!isBrowser) return;

  try {
    const dataToSave = { ...userData };
    const plainAccessToken = dataToSave?.access_token || null;

    if (dataToSave?.user?.email) {
      dataToSave.user.email = CryptoJS.SHA256(dataToSave.user.email).toString();
    }

    const encryptedUser = CryptoJS.AES.encrypt(
      JSON.stringify(dataToSave.user),
      process.env.NEXT_PUBLIC_ENCRYPT_KEY || "secret-key"
    ).toString();

    const expiresAt = Date.now() + expireSeconds * 1000;

    localStorage.setItem(
      "userFormData",
      JSON.stringify({ encryptedData: encryptedUser, expiresAt })
    );

    if (plainAccessToken) {
      localStorage.setItem("access_token", plainAccessToken);
    }
  } catch (err) {
    console.error("Error saving user data:", err);
  }
};

export const loadUserData = () => {
  if (!isBrowser) return null;

  try {
    const raw = localStorage.getItem("userFormData");
    if (!raw) return null;

    const { encryptedData, expiresAt } = JSON.parse(raw);
   console.log("now =>" , Date.now() , "expired At =>" , expiresAt)
    if (Date.now() > expiresAt) {
      removeUserData();
      return null;
    }

    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.NEXT_PUBLIC_ENCRYPT_KEY || "secret-key"
    );
    const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const accessToken = localStorage.getItem("access_token") || null;

    return { user: decryptedUser, access_token: accessToken };
  } catch (err) {
    console.error("Error loading user data:", err);
    removeUserData();
    return null;
  }
};

export const removeUserData = () => {
  if (!isBrowser) return;
  localStorage.removeItem("userFormData");
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
};
