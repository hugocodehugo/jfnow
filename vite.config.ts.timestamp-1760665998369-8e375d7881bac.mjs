// vite.config.ts
import { defineConfig } from "file:///C:/project/AI/AIChat/gemini/intimate_video_web/webapp/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/project/AI/AIChat/gemini/intimate_video_web/webapp/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import Inspector from "file:///C:/project/AI/AIChat/gemini/intimate_video_web/webapp/node_modules/unplugin-vue-dev-locator/dist/vite.mjs";
var __vite_injected_original_dirname = "C:\\project\\AI\\AIChat\\gemini\\intimate_video_web\\webapp";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    vue(),
    Inspector({
      toggleButtonVisibility: "never",
      toggleComboKey: "control-shift",
      showToggleButton: "never",
      appendTo: "body"
    })
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxwcm9qZWN0XFxcXEFJXFxcXEFJQ2hhdFxcXFxnZW1pbmlcXFxcaW50aW1hdGVfdmlkZW9fd2ViXFxcXHdlYmFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccHJvamVjdFxcXFxBSVxcXFxBSUNoYXRcXFxcZ2VtaW5pXFxcXGludGltYXRlX3ZpZGVvX3dlYlxcXFx3ZWJhcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Byb2plY3QvQUkvQUlDaGF0L2dlbWluaS9pbnRpbWF0ZV92aWRlb193ZWIvd2ViYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgSW5zcGVjdG9yIGZyb20gJ3VucGx1Z2luLXZ1ZS1kZXYtbG9jYXRvci92aXRlJ1xuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLycsXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBJbnNwZWN0b3Ioe1xuICAgICAgdG9nZ2xlQnV0dG9uVmlzaWJpbGl0eTogJ25ldmVyJyxcbiAgICAgIHRvZ2dsZUNvbWJvS2V5OiAnY29udHJvbC1zaGlmdCcsXG4gICAgICBzaG93VG9nZ2xlQnV0dG9uOiAnbmV2ZXInLFxuICAgICAgYXBwZW5kVG86ICdib2R5JyxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gIH0sXG4gIGRlZmluZToge1xuICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1YsU0FBUyxvQkFBb0I7QUFDNVgsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGVBQWU7QUFIdEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osVUFBVTtBQUFBLE1BQ1Isd0JBQXdCO0FBQUEsTUFDeEIsZ0JBQWdCO0FBQUEsTUFDaEIsa0JBQWtCO0FBQUEsTUFDbEIsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
