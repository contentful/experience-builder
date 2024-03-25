export const uniqBy = <T, U>(arr: T[], uniqKeyFn: (T) => U): T[] => {
  const seen = new Set();
  const excludeDuplicates = (item) => {
    const k = uniqKeyFn(item);
    if (seen.has(k)) {
      return false;
    }
    seen.add(k);
    return true;
  };
  return arr.filter(excludeDuplicates);
};
