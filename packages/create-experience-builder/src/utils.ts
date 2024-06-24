/**
 * Converts a given string to a valid Content Type format, i.e. only alphanumeric characters
 * @param {string} experienceName - The input string to be converted.
 * @returns {string} valid parsed
 */
export const generateExperienceNameId = (input: string): string => {
  // Remove non-alphanumeric characters and split by them
  const words = input.split(/[\W_]+/);

  // Convert each word to lowercase, except the first word
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
