export const base64ToBuffer = (base64: string): Buffer => {
  const base64WithoutPrefix = base64.replace(/^data:[^;]+;base64,/, "");
  const binary = Buffer.from(base64WithoutPrefix, "base64");
  return binary;
};
