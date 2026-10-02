import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    server: {
        proxy: {
            "/users": "http://localhost:3000",
            "/posts": "http://localhost:3000",
            "/likes": "http://localhost:3000",
            "/comments": "http://localhost:3000",
            "/follows": "http://localhost:3000",
            "/notifications": "http://localhost:3000",
        },
    },
});