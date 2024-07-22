module.exports = {
  root: true,
<<<<<<< HEAD
  env: { browser: true, es2020: true, node: true },
=======
  env: { browser: true, es2020: true },
>>>>>>> 65cbcc91385d9ae75c9026845addffa7214b5760
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': 'error',
<<<<<<< HEAD
    'no-unused-vars': 'warn',
=======
>>>>>>> 65cbcc91385d9ae75c9026845addffa7214b5760
  },
}
