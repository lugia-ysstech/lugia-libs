const tsc = require('typescript');
const shell = require('shelljs');

const chalk = require('chalk');
const rimraf = require('rimraf');
const { readdirSync, existsSync } = require('fs');
const { join, basename } = require('path');
const chokidar = require('chokidar');
const slash = require('slash');
const { packagesDirName, igronPkgs } = require('./config.json');
process.env.NODE_ENV = 'production';
const cwd = process.cwd();

// const BROWSER_FILES = ['packages/mega-utils/src/stripLastSlash.js'];
const BROWSER_FILES = [];

function isBrowserTransform(path) {
  return BROWSER_FILES.includes(path.replace(`${slash(cwd)}/`, ''));
}

function transform(opts = {}) {
  const { content, path } = opts;
  const winPath = slash(path);
  const isBrowser = isBrowserTransform(winPath);
  console.log(
    chalk[isBrowser ? 'yellow' : 'green'](
      `[TRANSFORM] ${winPath.replace(`${cwd}/`, '')}`,
    ),
  );
  let compilerOptions = {
    module: 'commonjs',
    declaration: true,
    sourceMap: true,
    target: 'es5',
    outDir: 'lib',
    importHelpers: true,
    moduleResolution: 'node',
    allowSyntheticDefaultImports: true,
    lib: ['esnext', 'dom'],
    types: ['jest'],
  };
  return tsc.transpile(String(content), compilerOptions);
}

function buildPkg(pkg, minify = false) {
  const pkgPath = join(cwd, packagesDirName, pkg);
  if (!existsSync(pkgPath)) {
    chalk.yellow(`[${pkg}] was not found`);
    return;
  }
  if (~igronPkgs.indexOf(pkg)) {
    chalk.green(`[${pkg}] is igrone.`);
    return;
  }
  rimraf.sync(join(pkgPath, 'lib'));
  try {
    const work = require('child_process')
      .spawn(process.platform === 'win32' ? 'tsc.cmd' : 'tsc', [
        '-p',
        join(cwd, packagesDirName, pkg, 'tsconfig.json'),
      ])
      .on('error', e => {
        console.log(chalk.red('Compiled failed.'));
        console.log(chalk['red'](`[BuildError] ${pkg}`));
      })
      .on('close', () => {
        console.log(chalk['green'](`[ReBuild] ${pkg}`));
      });
  } catch (e) {
    console.log(chalk.red('Compiled failed.'));
  }
}

function watch(pkg) {
  const watcher = chokidar.watch(join(cwd, packagesDirName, pkg, 'src'), {
    ignoreInitial: true,
  });
  watcher.on('all', (event, fullPath) => {
    fullPath = slash(fullPath);
    if (!existsSync(fullPath)) return;
    const relPath = fullPath.replace(
      slash(`${cwd}/${packagesDirName}/${pkg}/src/`),
      '',
    );
    try {
      require('child_process')
        .spawn(process.platform === 'win32' ? 'tsc.cmd' : 'tsc', [
          '-p',
          join(cwd, packagesDirName, pkg, 'tsconfig.json'),
        ])
        .on('close', () => {
          console.log(chalk['green'](`[ReBuild] ${pkg}`));
        });
    } catch (e) {
      console.log(chalk.red('Compiled failed.'));
      console.log(chalk.red(e.message));
    }
  });
}

function build() {
  const dirs = readdirSync(join(cwd, packagesDirName));
  const { argv } = process;
  const isWatch = argv.includes('-w') || argv.includes('--watch');
  const minify = argv.includes('-m') || argv.includes('--minify');
  dirs
    .filter(pkg => {
      return igronPkgs.indexOf(pkg) === -1;
    })
    .forEach(pkg => {
      if (pkg.charAt(0) === '.') return;
      buildPkg(pkg, minify);
      if (isWatch) watch(pkg);
    });
}

function tsLint() {
  const dirs = readdirSync(join(cwd, packagesDirName));
  const { argv } = process;
  const fix = argv.includes('--fix');
  dirs
    .filter(pkg => {
      return igronPkgs.indexOf(pkg) === -1;
    })
    .forEach(pkg => {
      if (pkg.charAt(0) === '.') return;
      console.info(pkg);
      shell.exec(
        `tslint ${fix ? '--fix' : ''} -p ${cwd}/${packagesDirName}/${pkg}`,
      );
    });
}

module.exports = { buildPkg, build, watch, tsLint };
