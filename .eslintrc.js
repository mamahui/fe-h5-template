module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    REACT_APP_ENV: true,
    REACT_APP_API_URL: true,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 1, // react-hooks 依赖检查
    'no-empty': 'off', // catch{} 允许为空
    '@typescript-eslint/no-shadow': ['off'], // 当前作用域变量名不能与父级作用域变量同名
    '@typescript-eslint/no-unused-expressions': 'off',
  },
};
