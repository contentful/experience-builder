export function intersection<T>(a: T[], b: T[]): T[] {
  const isInB = (value) => b.includes(value);
  return a.filter(isInB);
}
