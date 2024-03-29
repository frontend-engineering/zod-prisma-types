import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'fs-extra'
import consola from 'consola'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import * as path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = fs.readJSONSync(path.join(__dirname, 'package.json'))

const postbuild = () => {
    return {
        async generateBundle() {
            consola.start(`yalc publish`)
            execSync(`yalc publish --push --changed`, {
                cwd: __dirname,
                stdio: 'inherit'
            })
        },
    }
}

const config = [
    {
        input: path.join(__dirname, 'dist/generator.js'),
        output: [
            {
                file: path.join(__dirname, `dist/bundle/generator.js`),
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
        ],
        watch: {
            chokidar: true,
            clearScreen: false,
        },
    },
    {
        input: path.join(__dirname, 'dist/generator.d.ts'),
        output: [
            {
                file: path.join(__dirname, `dist/bundle/generator.d.ts`),
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
    {
        input: path.join(__dirname, 'dist/bin.js'),
        output: [
            {
                file: path.join(__dirname, `dist/bundle/bin.js`),
                format: 'cjs',
                interop: 'auto'
            },
        ],
        external: [
            '@prisma/generator-helper',
            'zod',
            './generator'
        ],
        plugins: [
            nodeResolve(),
            postbuild()
        ]
    },
]


export default config
