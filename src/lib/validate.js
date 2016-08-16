export const setDefault = (map, key, defaultValue) => {
  if (!map.has(key)) {
    map.set(key, defaultValue);
    return defaultValue;
  }

  return map.get(key);
};
