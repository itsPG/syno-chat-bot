module.exports = {
  'extends': 'airbnb-typescript/base',
  'parserOptions': {
      'project': './tsconfig.json',
  },
  'rules': {
      'no-console': 'off',
      'func-names': ['error', 'as-needed'],
  },
};
