import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Inspector from 'unplugin-vue-dev-locator/vite'
// https://vite.dev/config/
const DEFAULT_DEV_API_PROXY_TARGET = 'https://l05mmy1reg.execute-api.ap-northeast-1.amazonaws.com'

const normalizeProxyTarget = (value?: string) => {
  if (!value) {
    return DEFAULT_DEV_API_PROXY_TARGET
  }

  return value
    .trim()
    .replace(/\/api\/?$/, '')
    .replace(/\/+$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const apiProxyTarget = normalizeProxyTarget(env.VITE_DEV_API_PROXY_TARGET)

  return {
    base: '/',
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      vue(),
      Inspector({
        toggleButtonVisibility: 'never',
        toggleComboKey: 'control-shift',
        showToggleButton: 'never',
        appendTo: 'body',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'es2018',
      sourcemap: true,
    },
    define: {
      global: 'globalThis',
    },
  }
})
