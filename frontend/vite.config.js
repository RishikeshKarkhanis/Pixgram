import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    server: {
        host: "0.0.0.0",

        proxy: {
            "/users": {
                target: "http://localhost:3000",
            },

            "/posts": {
                target: "http://localhost:3000",
            },

            "/likes": {
                target: "http://localhost:3000",
            },

            "/comments": {
                target: "http://localhost:3000",
            },

            "/follows": {
                target: "http://localhost:3000",
            },

            "/notifications": {
                target: "http://localhost:3000",
            },

            "/messages": {
                target: "http://localhost:3000",
            },
        },
    },
});