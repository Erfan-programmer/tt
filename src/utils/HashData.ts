// utils/hashData.ts
export function encodeData(data: any) {
  const jsonString = JSON.stringify(data);
  const base64 = Buffer.from(jsonString).toString("base64");
  return encodeURIComponent(base64);
}

export function decodeData(encoded: string) {
  const jsonString = Buffer.from(decodeURIComponent(encoded), "base64").toString("utf-8");
  return JSON.parse(jsonString);
}
