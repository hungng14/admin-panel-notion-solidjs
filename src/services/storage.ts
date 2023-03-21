export const setValue = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getValue = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) as any);
  } catch (error) {
    return null;
  }
};
