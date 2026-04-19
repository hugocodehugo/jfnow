// vite.config.ts
import { defineConfig } from "file:///C:/project/AI/AIChat/gemini/intimate_video_web/webapp/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/project/AI/AIChat/gemini/intimate_video_web/webapp/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import Inspector from "file:///C:/project/AI/AIChat/gemini/intimate_video_web/webapp/node_modules/unplugin-vue-dev-locator/dist/vite.mjs";
import traeBadgePlugin from "file:///C:/project/AI/AIChat/gemini/intimate_video_web/webapp/node_modules/vite-plugin-trae-solo-badge/dist/vite-plugin.esm.js";
var __vite_injected_original_dirname = "C:\\project\\AI\\AIChat\\gemini\\intimate_video_web\\webapp";
var vite_config_default = defineConfig({
  base: "/app/",
  plugins: [
    vue(),
    Inspector({
      toggleButtonVisibility: "never",
      toggleComboKey: "control-shift",
      showToggleButton: "never",
      appendTo: "body"
    }),
    traeBadgePlugin({
      name: "Trae AI",
      url: "https://trae.ai",
      position: "bottom-right",
      theme: "dark",
      size: "small",
      showOnlyInDev: true
    })
    // 暂时禁用预渲染插件
    // vitePrerenderPlugin({
    //   renderTarget: '#app',
    //   prerenderScript: resolve(__dirname, 'src/prerender.ts'),
    //   onError: 'skip'
    // })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    sourcemap: true
  },
  define: {
    global: "globalThis"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxwcm9qZWN0XFxcXEFJXFxcXEFJQ2hhdFxcXFxnZW1pbmlcXFxcaW50aW1hdGVfdmlkZW9fd2ViXFxcXHdlYmFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccHJvamVjdFxcXFxBSVxcXFxBSUNoYXRcXFxcZ2VtaW5pXFxcXGludGltYXRlX3ZpZGVvX3dlYlxcXFx3ZWJhcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Byb2plY3QvQUkvQUlDaGF0L2dlbWluaS9pbnRpbWF0ZV92aWRlb193ZWIvd2ViYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgSW5zcGVjdG9yIGZyb20gJ3VucGx1Z2luLXZ1ZS1kZXYtbG9jYXRvci92aXRlJ1xuaW1wb3J0IHRyYWVCYWRnZVBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi10cmFlLXNvbG8tYmFkZ2UnXG4vLyBpbXBvcnQgeyB2aXRlUHJlcmVuZGVyUGx1Z2luIH0gZnJvbSAndml0ZS1wcmVyZW5kZXItcGx1Z2luJ1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICcvYXBwLycsXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBJbnNwZWN0b3Ioe1xuICAgICAgdG9nZ2xlQnV0dG9uVmlzaWJpbGl0eTogJ25ldmVyJyxcbiAgICAgIHRvZ2dsZUNvbWJvS2V5OiAnY29udHJvbC1zaGlmdCcsXG4gICAgICBzaG93VG9nZ2xlQnV0dG9uOiAnbmV2ZXInLFxuICAgICAgYXBwZW5kVG86ICdib2R5JyxcbiAgICB9KSxcbiAgICB0cmFlQmFkZ2VQbHVnaW4oe1xuICAgICAgbmFtZTogJ1RyYWUgQUknLFxuICAgICAgdXJsOiAnaHR0cHM6Ly90cmFlLmFpJyxcbiAgICAgIHBvc2l0aW9uOiAnYm90dG9tLXJpZ2h0JyxcbiAgICAgIHRoZW1lOiAnZGFyaycsXG4gICAgICBzaXplOiAnc21hbGwnLFxuICAgICAgc2hvd09ubHlJbkRldjogdHJ1ZSxcbiAgICB9KSxcbiAgICAvLyBcdTY2ODJcdTY1RjZcdTc5ODFcdTc1MjhcdTk4ODRcdTZFMzJcdTY3RDNcdTYzRDJcdTRFRjZcbiAgICAvLyB2aXRlUHJlcmVuZGVyUGx1Z2luKHtcbiAgICAvLyAgIHJlbmRlclRhcmdldDogJyNhcHAnLFxuICAgIC8vICAgcHJlcmVuZGVyU2NyaXB0OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wcmVyZW5kZXIudHMnKSxcbiAgICAvLyAgIG9uRXJyb3I6ICdza2lwJ1xuICAgIC8vIH0pXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStWLFNBQVMsb0JBQW9CO0FBQzVYLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8scUJBQXFCO0FBSjVCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFVBQVU7QUFBQSxNQUNSLHdCQUF3QjtBQUFBLE1BQ3hCLGdCQUFnQjtBQUFBLE1BQ2hCLGtCQUFrQjtBQUFBLE1BQ2xCLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELGdCQUFnQjtBQUFBLE1BQ2QsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLE1BQ1YsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sZUFBZTtBQUFBLElBQ2pCLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9IO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQy9CO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
