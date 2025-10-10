// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig } from "file:///E:/dhDevelep/kaiduhe/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/dhDevelep/kaiduhe/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/dhDevelep/kaiduhe/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///E:/dhDevelep/kaiduhe/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { createHtmlPlugin } from "file:///E:/dhDevelep/kaiduhe/node_modules/vite-plugin-html/dist/index.mjs";
import { viteStaticCopy } from "file:///E:/dhDevelep/kaiduhe/node_modules/vite-plugin-static-copy/dist/index.js";
import legacyPlugin from "file:///E:/dhDevelep/kaiduhe/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import postcssPxtoRem from "file:///E:/dhDevelep/kaiduhe/node_modules/postcss-pxtorem/index.js";
var __vite_injected_original_dirname = "E:\\dhDevelep\\kaiduhe";
var __vite_injected_original_import_meta_url = "file:///E:/dhDevelep/kaiduhe/vite.config.ts";
var vite_config_default = defineConfig(({ command, mode }) => {
  const envMode = mode === "production" ? "prod" : mode;
  const time = (/* @__PURE__ */ new Date()).getTime();
  return {
    base: "./",
    plugins: [
      vue(),
      vueJsx(),
      // vueDevTools(),
      createSvgIconsPlugin({
        /* 配置路径在你的src里的svg存放文件 */
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      }),
      /* 复制配置文件 */
      viteStaticCopy({
        targets: [{ src: `config/index-${envMode}.js`, dest: "config/" }]
      }),
      /* 注入静态文件 */
      createHtmlPlugin({
        inject: {
          data: {
            urlScript: `index-${envMode}.js?t=${time}`
          }
        }
      }),
      legacyPlugin({
        targets: ["defaults", "ie >= 11", "chrome >= 52"],
        // 需要兼容的目标列表，可以设置多个
        // additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // 面向IE11时需要此插件
        renderLegacyChunks: true,
        polyfills: [
          "es.symbol",
          "es.array.filter",
          "es.promise",
          "es.promise.finally",
          "es/map",
          "es/set",
          "es.array.for-each",
          "es.object.define-properties",
          "es.object.define-property",
          "es.object.get-own-property-descriptor",
          "es.object.get-own-property-descriptors",
          "es.object.keys",
          "es.object.to-string",
          "web.dom-collections.for-each",
          "esnext.global-this",
          "esnext.string.match-all"
        ]
      })
    ],
    css: {
      postcss: {
        plugins: [
          postcssPxtoRem({
            rootValue: 192,
            // 按照自己的设计稿修改 1920/10
            propList: ["*"],
            selectorBlackList: [],
            exclude: function(path2) {
              const ignoreList = ["views/pannel/", "check-make-up/", "-no-rem/"];
              return ignoreList.some((item) => path2.indexOf(item) > -1);
            },
            minPixelValue: 2
            // 最小px为2，如果设置1px则不转rem
          })
        ]
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      host: "0.0.0.0"
      // proxy: {
      //   '/ureport': {
      //     target: 'http://172.16.15.155:51018',
      //     changeOrigin: true
      //   }
      // }
    },
    esbuild: {
      drop: command === "build" ? ["console", "debugger"] : []
    },
    build: {
      // target: 'es2015',//配合 plugin-legacy 支持传统浏览器
      outDir: path.join(__vite_injected_original_dirname, "kdh"),
      cssCodeSplit: true,
      // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      rollupOptions: {
        output: {
          sourcemap: false,
          manualChunks: {
            "base-module": ["vue", "pinia", "vue-router", "axios", "lodash-es"],
            "element-plus": ["element-plus"],
            echarts: ["echarts"]
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: "[ext]/[name].[hash].[ext]"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxkaERldmVsZXBcXFxca2FpZHVoZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZGhEZXZlbGVwXFxcXGthaWR1aGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L2RoRGV2ZWxlcC9rYWlkdWhlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnXHJcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSAndml0ZS1wbHVnaW4tc3RhdGljLWNvcHknXHJcbmltcG9ydCBsZWdhY3lQbHVnaW4gZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5J1xyXG5pbXBvcnQgcG9zdGNzc1B4dG9SZW0gZnJvbSAncG9zdGNzcy1weHRvcmVtJ1xyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52TW9kZSA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICdwcm9kJyA6IG1vZGVcclxuICBjb25zdCB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogJy4vJyxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICAvLyB2dWVEZXZUb29scygpLFxyXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgICAgLyogXHU5MTREXHU3RjZFXHU4REVGXHU1Rjg0XHU1NzI4XHU0RjYwXHU3Njg0c3JjXHU5MUNDXHU3Njg0c3ZnXHU1QjU4XHU2NTNFXHU2NTg3XHU0RUY2ICovXHJcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9pY29ucy9zdmcnKV0sXHJcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXSdcclxuICAgICAgfSksXHJcbiAgICAgIC8qIFx1NTkwRFx1NTIzNlx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNiAqL1xyXG4gICAgICB2aXRlU3RhdGljQ29weSh7XHJcbiAgICAgICAgdGFyZ2V0czogW3sgc3JjOiBgY29uZmlnL2luZGV4LSR7ZW52TW9kZX0uanNgLCBkZXN0OiAnY29uZmlnLycgfV1cclxuICAgICAgfSksXHJcbiAgICAgIC8qIFx1NkNFOFx1NTE2NVx1OTc1OVx1NjAwMVx1NjU4N1x1NEVGNiAqL1xyXG4gICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcclxuICAgICAgICBpbmplY3Q6IHtcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgdXJsU2NyaXB0OiBgaW5kZXgtJHtlbnZNb2RlfS5qcz90PSR7dGltZX1gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSxcclxuICAgICAgbGVnYWN5UGx1Z2luKHtcclxuICAgICAgICB0YXJnZXRzOiBbJ2RlZmF1bHRzJywgJ2llID49IDExJywgJ2Nocm9tZSA+PSA1MiddLCAvLyBcdTk3MDBcdTg5ODFcdTUxN0NcdTVCQjlcdTc2ODRcdTc2RUVcdTY4MDdcdTUyMTdcdTg4NjhcdUZGMENcdTUzRUZcdTRFRTVcdThCQkVcdTdGNkVcdTU5MUFcdTRFMkFcclxuICAgICAgICAvLyBhZGRpdGlvbmFsTGVnYWN5UG9seWZpbGxzOiBbXCJyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWVcIl0sIC8vIFx1OTc2Mlx1NTQxMUlFMTFcdTY1RjZcdTk3MDBcdTg5ODFcdTZCNjRcdTYzRDJcdTRFRjZcclxuICAgICAgICByZW5kZXJMZWdhY3lDaHVua3M6IHRydWUsXHJcbiAgICAgICAgcG9seWZpbGxzOiBbXHJcbiAgICAgICAgICAnZXMuc3ltYm9sJyxcclxuICAgICAgICAgICdlcy5hcnJheS5maWx0ZXInLFxyXG4gICAgICAgICAgJ2VzLnByb21pc2UnLFxyXG4gICAgICAgICAgJ2VzLnByb21pc2UuZmluYWxseScsXHJcbiAgICAgICAgICAnZXMvbWFwJyxcclxuICAgICAgICAgICdlcy9zZXQnLFxyXG4gICAgICAgICAgJ2VzLmFycmF5LmZvci1lYWNoJyxcclxuICAgICAgICAgICdlcy5vYmplY3QuZGVmaW5lLXByb3BlcnRpZXMnLFxyXG4gICAgICAgICAgJ2VzLm9iamVjdC5kZWZpbmUtcHJvcGVydHknLFxyXG4gICAgICAgICAgJ2VzLm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InLFxyXG4gICAgICAgICAgJ2VzLm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyxcclxuICAgICAgICAgICdlcy5vYmplY3Qua2V5cycsXHJcbiAgICAgICAgICAnZXMub2JqZWN0LnRvLXN0cmluZycsXHJcbiAgICAgICAgICAnd2ViLmRvbS1jb2xsZWN0aW9ucy5mb3ItZWFjaCcsXHJcbiAgICAgICAgICAnZXNuZXh0Lmdsb2JhbC10aGlzJyxcclxuICAgICAgICAgICdlc25leHQuc3RyaW5nLm1hdGNoLWFsbCdcclxuICAgICAgICBdXHJcbiAgICAgIH0pXHJcbiAgICBdLFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHBvc3Rjc3M6IHtcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICBwb3N0Y3NzUHh0b1JlbSh7XHJcbiAgICAgICAgICAgIHJvb3RWYWx1ZTogMTkyLCAvLyBcdTYzMDlcdTcxNjdcdTgxRUFcdTVERjFcdTc2ODRcdThCQkVcdThCQTFcdTdBM0ZcdTRGRUVcdTY1MzkgMTkyMC8xMFxyXG4gICAgICAgICAgICBwcm9wTGlzdDogWycqJ10sXHJcbiAgICAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbXSxcclxuICAgICAgICAgICAgZXhjbHVkZTpmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGlnbm9yZUxpc3QgPSBbJ3ZpZXdzL3Bhbm5lbC8nLCdjaGVjay1tYWtlLXVwLycsJy1uby1yZW0vJ11cclxuICAgICAgICAgICAgICByZXR1cm4gaWdub3JlTGlzdC5zb21lKGl0ZW0gPT4gcGF0aC5pbmRleE9mKGl0ZW0pID4gLTEpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1pblBpeGVsVmFsdWU6IDIgLy8gXHU2NzAwXHU1QzBGcHhcdTRFM0EyXHVGRjBDXHU1OTgyXHU2NzlDXHU4QkJFXHU3RjZFMXB4XHU1MjE5XHU0RTBEXHU4RjZDcmVtXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJ1xyXG4gICAgICAvLyBwcm94eToge1xyXG4gICAgICAvLyAgICcvdXJlcG9ydCc6IHtcclxuICAgICAgLy8gICAgIHRhcmdldDogJ2h0dHA6Ly8xNzIuMTYuMTUuMTU1OjUxMDE4JyxcclxuICAgICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfVxyXG4gICAgfSxcclxuICAgIGVzYnVpbGQ6IHtcclxuICAgICAgZHJvcDogY29tbWFuZCA9PT0gJ2J1aWxkJyA/IFsnY29uc29sZScsICdkZWJ1Z2dlciddIDogW11cclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAvLyB0YXJnZXQ6ICdlczIwMTUnLC8vXHU5MTREXHU1NDA4IHBsdWdpbi1sZWdhY3kgXHU2NTJGXHU2MzAxXHU0RjIwXHU3RURGXHU2RDRGXHU4OUM4XHU1NjY4XHJcbiAgICAgIG91dERpcjogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2tkaCcpLFxyXG4gICAgICBjc3NDb2RlU3BsaXQ6IHRydWUsIC8vIFx1NTk4Mlx1Njc5Q1x1OEJCRVx1N0Y2RVx1NEUzQWZhbHNlXHVGRjBDXHU2NTc0XHU0RTJBXHU5ODc5XHU3NkVFXHU0RTJEXHU3Njg0XHU2MjQwXHU2NzA5IENTUyBcdTVDMDZcdTg4QUJcdTYzRDBcdTUzRDZcdTUyMzBcdTRFMDBcdTRFMkEgQ1NTIFx1NjU4N1x1NEVGNlx1NEUyRFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICdiYXNlLW1vZHVsZSc6IFsndnVlJywgJ3BpbmlhJywgJ3Z1ZS1yb3V0ZXInLCAnYXhpb3MnLCAnbG9kYXNoLWVzJ10sXHJcbiAgICAgICAgICAgICdlbGVtZW50LXBsdXMnOiBbJ2VsZW1lbnQtcGx1cyddLFxyXG4gICAgICAgICAgICBlY2hhcnRzOiBbJ2VjaGFydHMnXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIC8vIFx1NzUyOFx1NEU4RVx1NEVDRVx1NTE2NVx1NTNFM1x1NzBCOVx1NTIxQlx1NUVGQVx1NzY4NFx1NTc1N1x1NzY4NFx1NjI1M1x1NTMwNVx1OEY5M1x1NTFGQVx1NjgzQ1x1NUYwRltuYW1lXVx1ODg2OFx1NzkzQVx1NjU4N1x1NEVGNlx1NTQwRCxbaGFzaF1cdTg4NjhcdTc5M0FcdThCRTVcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjloYXNoXHU1MDNDXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS5baGFzaF0uanMnLFxyXG4gICAgICAgICAgLy8gXHU3NTI4XHU0RThFXHU1NDdEXHU1NDBEXHU0RUUzXHU3ODAxXHU2MkM2XHU1MjA2XHU2NUY2XHU1MjFCXHU1RUZBXHU3Njg0XHU1MTcxXHU0RUFCXHU1NzU3XHU3Njg0XHU4RjkzXHU1MUZBXHU1NDdEXHU1NDBEXHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS5baGFzaF0uanMnLFxyXG4gICAgICAgICAgLy8gXHU3NTI4XHU0RThFXHU4RjkzXHU1MUZBXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU3Njg0XHU1NDdEXHU1NDBEXHVGRjBDW2V4dF1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTYyNjlcdTVDNTVcdTU0MERcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnW2V4dF0vW25hbWVdLltoYXNoXS5bZXh0XSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1AsU0FBUyxlQUFlLFdBQVc7QUFDdlIsT0FBTyxVQUFVO0FBRWpCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFFbkIsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyxzQkFBc0I7QUFDL0IsT0FBTyxrQkFB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
