import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';
import compiler from '@ampproject/rollup-plugin-closure-compiler';




const build_default = {
  input: 'src/js/JaSMIn.js',
  external: ['three'],
	plugins: [
    // CSS generation
    scss({
        output: 'dist/css/JaSMIn.css',
        watch: 'src/scss'
    })
	],
	output: [
		{
			// format: 'iife',
      format: 'umd',
			name: 'JaSMIn',
			file: 'dist/js/JaSMIn.js',
			indent: '\t',
      globals: {
          three: 'THREE'
      }
		}
	]
};



const build_module = {
  input: 'src/js/JaSMIn.js',
  external: ['three'],
	plugins: [
    scss({ output: false })
	],
	output: [
		{
      format: 'esm',
			name: 'JaSMIn',
			file: 'dist/js/JaSMIn.module.js',
			indent: '\t',
      globals: {
          three: 'THREE'
      }
		}
	]
};



const build_minified = {
  input: 'src/js/JaSMIn.js',
  external: ['three'],
	plugins: [
    copy({
        targets: [
          { src: 'src/html/*', dest: 'dist' },
          { src: 'src/php/*', dest: 'dist' },
          { src: 'src/svg/*', dest: 'dist/images' },
          { src: 'resources/*', dest: 'dist' },
          { src: 'misc/gamelogs/*', dest: 'dist/archive' },
          { src: 'node_modules/three/build/three.min.js', dest: 'dist/js' }
        ]
    }),
    // Minified CSS generation
    scss({
        output: 'dist/css/JaSMIn.min.css',
        outputStyle: 'compressed',
        sourceMap: true,
        watch: 'src/scss'
    }),
    // Compile code
    compiler({
      compilation_level: 'SIMPLE',
      warning_level: 'VERBOSE',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'STABLE',
      externs: ['misc/build/externs.js', 'misc/build/threejs-externs.js'],
      jscomp_warning: '*',
      jscomp_off: 'strictMissingProperties'
    }, {
      platform: ['native', 'java', 'javascript']
    })
	],
	output: [
		{
			// format: 'iife',
      format: 'umd',
			name: 'JaSMIn',
			file: 'dist/js/JaSMIn.min.js',
			indent: '\t',
      // sourcemap: true,
      globals: {
          three: 'THREE'
      }
		}
	]
};

export default [ build_default, build_module, build_minified ];
