module.exports = {
  parser: "@babel/eslint-parser", // Assurez-vous que le package @babel/eslint-parser est installé
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react"],

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  rules: {
    indent: ["error", 2],
  },
};
