import nextConfig from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  {
    ignores: ['dist', '.next', 'node_modules', 'out'],
  },
  ...nextConfig,
]

export default eslintConfig
