export const getJsonFromLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.log(e);
  }
  return defaultValue;
};

export const setJsonToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
