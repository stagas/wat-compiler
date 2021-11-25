module.exports = {
    "root": true,
    "env": {
        "node": true,
        "browser": true,
        "es2021": true,
        "jest": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "rules": {
        "no-sparse-arrays": "off",
        "no-fallthrough": "off",
        "no-constant-condition": "off",
        "no-cond-assign": "off"
    }
};
