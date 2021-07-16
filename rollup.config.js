import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from "svelte-preprocess";
import css from 'rollup-plugin-css-only';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const fs = require('fs');

const production = !process.env.ROLLUP_WATCH;
process.env.NODE_ENV= production ? 'production' : 'development';

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		commonjs({
			sourceMap: false,
		}),
		globals(),
		builtins(),
		svelte({
			compilerOptions: {
				dev: !production,
			},
			preprocess: sveltePreprocess({
				sourceMap: !production,
				postcss: {
					plugins: [
						require('tailwindcss'),
						require('autoprefixer'),
						require('postcss-nesting'),
					]
				},
			}),
		}),
		css({
			output: function (styles, styleNodes) {
				const outputDir = 'public/build';
				if (!fs.existsSync(outputDir)){
					fs.mkdirSync(outputDir);
				}
				fs.writeFileSync('public/build/bundle.css', styles);
			}
		}),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		!production && serve(),

		!production && livereload('public'),

		production && terser()
	],
	watch: {
		clearScreen: false
	}
};