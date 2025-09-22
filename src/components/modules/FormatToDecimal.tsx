export function formatToTwoDecimals(num: string | number): string | number {
  const n = Number(num);
  if (Number.isInteger(n)) {
    return n;
  }
  return n.toFixed(2);
}
