import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        //d:aplicaion/dist/
        index: resolve(__dirname, "index.html"),
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        storeCart: resolve(__dirname, "src/pages/cart/cart.html"),
        productTypes: resolve(__dirname, "src/types/product.ts"),
        productCategories: resolve(__dirname, "src/types/categoria.ts"),
        productData: resolve(__dirname, "src/data/data.ts"),
        utils: resolve(__dirname, "src/utils/utils.ts"),
      },
    },
  },
  base: "./",
});
