export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      res(String(reader.result));
    };

    reader.onerror = (err) => {
      rej(err);
    };
  });
};
