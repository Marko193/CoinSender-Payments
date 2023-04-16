const EXTENSION = ["xlsx", "xls", "csv"];

export const getExtention = (file: any) => {
  const parts = file.name.split(".");
  const extension = parts[parts.length - 1];
  return EXTENSION.includes(extension);
};

export const convertToJson = (data: any) => {
  return data.map((item: string[] | number[]) => {
    return {
      name: item[0] ?? '',
      wallet: item[1] ?? '',
      amount: item[2] ?? ''
    }
  })
};
