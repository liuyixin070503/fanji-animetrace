import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**', '.npm-cache/**', 'docs/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // 页面组件就是一词命名（LoginView 这种已经够清晰），关掉这条噪音
      'vue/multi-word-component-names': 'off',
      // 静态稿里大量 <i> 之类的装饰标签，不强制自闭合
      'vue/html-self-closing': 'off',
      // 未使用变量只提醒不阻断，交付前统一清
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'vue/no-v-html': 'off',
    },
  },
]
