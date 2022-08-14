/* eslint-env node */
module.exports = {
  root: true,

  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'eslint:recommended'
  ],

  plugins: ['prettier'],

  rules: {
    'prettier/prettier': 'error'
  }
}
