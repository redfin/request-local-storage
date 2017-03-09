const babel = require('gulp-babel');
const del = require('del');
const gulp = require('gulp');
const nsp = require('gulp-nsp');
const path = require('path');
const eslint = require('gulp-eslint');
const replace = require("gulp-replace");
const uglify = require("gulp-uglify");
const packageJson = require("./package.json");

gulp.task('nsp', (cb) => nsp({package: path.resolve('package.json')}, cb));

// Don't actually want to compress, but _do_ want dead code elimination.
const compress = [
	'sequences', 'properties', 'drop_debugger', 'unsafe', 'conditionals',
	'comparisons', 'evaluate', 'booleans', 'loops', 'unused',
	'hoist_funs', 'hoist_vars', 'if_return', 'join_vars', 'cascade',
	'side_effects', 'warnings',
].reduce((m, v) => (m[v] = false, m), {dead_code: true});

const compile = server => gulp.src(["src/**/*.js"])
	.pipe(babel())
	.pipe(replace("SERVER_SIDE", server ? "true" : "false"))
	.pipe(replace("REQUEST_LOCAL_STORAGE_VERSION", JSON.stringify(packageJson.version)))
	.pipe(uglify({compress, mangle: false, output: {beautify: true}}))
	.pipe(gulp.dest("./lib/"+(server?"server/":"browser/")));

gulp.task("compileBrowser", () => compile(false));
gulp.task("compileServer",  () => compile(true ));
gulp.task('compile', ['compileServer', 'compileBrowser']);

gulp.task('clean', () => {
	del(["lib/**/*.js", "lib"]).then(paths => {
		console.log('Deleted files and folders:\n\t'+paths.join('\n\t'))
	})
});

gulp.task('eslint', [], () =>  gulp.src("src/**/*.js")
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
);

gulp.task('prepublish', ['nsp', 'compile']);
gulp.task('test', ['eslint']);
