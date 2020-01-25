module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb-base/legacy",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        'no-underscore-dangle': 0,
        'func-names': 0,
        'no-use-before-define': 0,
        'consistent-return': 0,
        'no-console': 0,
        'no-unused-vars': 0,
        'no-undef': 0,
        'quote-props': 0,
        'quotes': 0
    }
};