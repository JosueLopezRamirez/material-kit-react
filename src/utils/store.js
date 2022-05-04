export const getFromStorage = (key) => {
  if (typeof window !== "undefined") {
    return window?.localstorage?.getItem(key);
  }
};
