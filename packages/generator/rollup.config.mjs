import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs-extra'

import { fileURLToPath } from 'url'
import * as path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// import consola from 'consola'
const packageJson = fs.readJSONSync(path.join(__dirname, 'package.json'))

const config = [
    {
        // path to your declaration files root
        input: path.join(__dirname, 'dist/generator.js'),
        output: [
            {
                file: path.join(__dirname, `dist/generator.bundle.js`),
                format: 'cjs',
                interop: 'auto'
            },
        ],
        external: [
            '@prisma/internals',
            ...Object.keys(packageJson.dependencies)
        ],
        plugins: [
            nodeResolve(),
            // commonjs(),
        ],
        watch: {
            chokidar: true,
            clearScreen: false,
        },
    },
    {
        // path to your declaration files root
        input: path.join(__dirname, 'dist/generator.d.ts'),
        output: [
            {
                file: path.join(__dirname, `dist/generator.bundle.d.ts`),
                format: 'es',
            },
        ],
        plugins: [
            dts(),
        ],
        watch: {
            chokidar: true,
            clearScreen: false,
        },
    },
]


export default config
