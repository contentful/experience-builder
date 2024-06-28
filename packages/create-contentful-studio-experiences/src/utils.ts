/**
 * Converts a string to a valid Content Type ID format, i.e. only alphanumeric characters
 * @param {string} input - The input string to be converted.
 * @returns {string} The converted string.
 */
export const generateContentTypeId = (input: string): string => {
  // Remove non-alphanumeric characters and split by them
  const words = input.split(/[\W_]+/);

  // Convert the first word to lowercase, and the rest to lowercase with the first letter capitalized
  return words
    .map((word: string, index: number) => {
      if (index === 0) {
        return word.toLowerCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join('');
};

export const isValidPackageName = (projectName: string) => {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
};
