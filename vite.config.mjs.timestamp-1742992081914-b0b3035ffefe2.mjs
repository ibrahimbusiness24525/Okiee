// vite.config.mjs
import { defineConfig, loadEnv } from "file:///C:/Users/Laptop%20Mart/OneDrive/Desktop/Okiee%20Frontend%20Live/Okiee%20fronend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Laptop%20Mart/OneDrive/Desktop/Okiee%20Frontend%20Live/Okiee%20fronend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///C:/Users/Laptop%20Mart/OneDrive/Desktop/Okiee%20Frontend%20Live/Okiee%20fronend/node_modules/vite-jsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = `${"3000"}`;
  return {
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: PORT
    },
    define: {
      global: "window"
    },
    resolve: {
      alias: [
        // { find: '', replacement: path.resolve(__dirname, 'src') },
        // {
        //   find: /^~(.+)/,
        //   replacement: path.join(process.cwd(), 'node_modules/$1')
        // },
        // {
        //   find: /^src(.+)/,
        //   replacement: path.join(process.cwd(), 'src/$1')
        // }
        // {
        //   find: 'assets',
        //   replacement: path.join(process.cwd(), 'src/assets')
        // },
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        },
        less: {
          charset: false
        }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTGFwdG9wIE1hcnRcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxPa2llZSBGcm9udGVuZCBMaXZlXFxcXE9raWVlIGZyb25lbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXExhcHRvcCBNYXJ0XFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcT2tpZWUgRnJvbnRlbmQgTGl2ZVxcXFxPa2llZSBmcm9uZW5kXFxcXHZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTGFwdG9wJTIwTWFydC9PbmVEcml2ZS9EZXNrdG9wL09raWVlJTIwRnJvbnRlbmQlMjBMaXZlL09raWVlJTIwZnJvbmVuZC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IGpzY29uZmlnUGF0aHMgZnJvbSAndml0ZS1qc2NvbmZpZy1wYXRocyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XHJcbiAgY29uc3QgQVBJX1VSTCA9IGAke2Vudi5WSVRFX0FQUF9CQVNFX05BTUV9YDtcclxuICBjb25zdCBQT1JUID0gYCR7JzMwMDAnfWA7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgLy8gdGhpcyBlbnN1cmVzIHRoYXQgdGhlIGJyb3dzZXIgb3BlbnMgdXBvbiBzZXJ2ZXIgc3RhcnRcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgLy8gdGhpcyBzZXRzIGEgZGVmYXVsdCBwb3J0IHRvIDMwMDBcclxuICAgICAgcG9ydDogUE9SVFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICBnbG9iYWw6ICd3aW5kb3cnXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczogW1xyXG4gICAgICAgIC8vIHsgZmluZDogJycsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJykgfSxcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICBmaW5kOiAvXn4oLispLyxcclxuICAgICAgICAvLyAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICBmaW5kOiAvXnNyYyguKykvLFxyXG4gICAgICAgIC8vICAgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc3JjLyQxJylcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgZmluZDogJ2Fzc2V0cycsXHJcbiAgICAgICAgLy8gICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzJylcclxuICAgICAgICAvLyB9LFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBjaGFyc2V0OiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGVzczoge1xyXG4gICAgICAgICAgY2hhcnNldDogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNoYXJzZXQ6IGZhbHNlLFxyXG4gICAgICBwb3N0Y3NzOiB7XHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBwb3N0Y3NzUGx1Z2luOiAnaW50ZXJuYWw6Y2hhcnNldC1yZW1vdmFsJyxcclxuICAgICAgICAgICAgQXRSdWxlOiB7XHJcbiAgICAgICAgICAgICAgY2hhcnNldDogKGF0UnVsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0UnVsZS5uYW1lID09PSAnY2hhcnNldCcpIHtcclxuICAgICAgICAgICAgICAgICAgYXRSdWxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJhc2U6IEFQSV9VUkwsXHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwganNjb25maWdQYXRocygpXVxyXG4gIH07XHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1osU0FBUyxjQUFjLGVBQWU7QUFDcmMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxRQUFNLFVBQVUsR0FBRyxJQUFJLGtCQUFrQjtBQUN6QyxRQUFNLE9BQU8sR0FBRyxNQUFNO0FBRXRCLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBO0FBQUEsTUFFTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BY1A7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixTQUFTO0FBQUEsUUFDWDtBQUFBLFFBQ0EsTUFBTTtBQUFBLFVBQ0osU0FBUztBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUEsUUFDUCxTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0UsZUFBZTtBQUFBLFlBQ2YsUUFBUTtBQUFBLGNBQ04sU0FBUyxDQUFDLFdBQVc7QUFDbkIsb0JBQUksT0FBTyxTQUFTLFdBQVc7QUFDN0IseUJBQU8sT0FBTztBQUFBLGdCQUNoQjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQSxFQUNwQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
