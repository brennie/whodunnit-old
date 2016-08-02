module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parser": "babel",
  "plugins": [
    "react",
  ],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single", {
      "allowTemplateLiterals": true,
      "avoidEscape": true,
    }],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "semi": ["error", "always"],
    "no-console": ["warn"],
  }
};
