import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import json from "@rollup/plugin-json";
import {babel} from "@rollup/plugin-babel";
import pkg from "./package.json";

const devMode = process.env.BUILD === "development";

export default e => {
    return {
        input: "src/main.js",
        output: {
            name: "monitorTextZoom",
            file: pkg.main,
            format: "umd",
            sourcemap: devMode ? "inline" : false // Creates a seperate .map file; use 'inline' to embed at the end of the file
        },
        watch: {
            clearScreen: false
        },
        plugins: [
            resolve(),
            commonjs(),
            json(),
            !devMode &&
                babel({
                    babelHelpers: "bundled",
                    presets: ["@babel/preset-env"],
                    exclude: "node_modules/**"
                }),
            postcss({
                extract: true, // extract to file in the same folder & same name as the .js - dist/bundle.css; otherwise it's embedded in the <head>
                sourceMap: devMode ? "inline" : false, // Creates a seperate .map file; use 'inline' to embed at the end of the file
                plugins: [
                    cssnano() // To minify
                ]
            }),
            !devMode && terser(),
            devMode && e.configLiveReload && livereload({watch: "dist", delay: 300})
        ]
    };
};
