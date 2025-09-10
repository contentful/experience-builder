export function combineClasses(...classes: (string | undefined | null)[]) {
  return classes
    .filter((val) => val)
    .map((c) => c!.trim())
    .join(' ');
}
