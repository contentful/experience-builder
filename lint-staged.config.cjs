module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix"
  ],
  "*.{ts,tsx}": [
    () => "tsc" // https://github.com/okonet/lint-staged/issues/825#issuecomment-620018284
  ],
  "*.md": [
    "prettier --write"
  ]
};
