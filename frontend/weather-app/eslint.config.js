import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': hooks,
      'react-refresh': refresh,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tseslint.parser,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Configuração do Prettier
    rules: prettierConfig.rules,
  },
  {
    // Ignora arquivos de configuração
    ignores: [
      'dist',
      'eslint.config.js',
      'vite.config.ts',
      'postcss.config.js',
      'tailwind.config.js',
      'components.json',
    ],
  },
];
