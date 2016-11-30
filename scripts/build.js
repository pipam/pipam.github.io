#!/usr/bin/env node
'use strict';

const { transpileModule } = require('typescript');
const {
  join: joinPath,
  normalize,
  dirname,
  relative,
  basename,
  extname
} = require('path');
const {
  rmrf,
  mkdirp,
  readdir,
  asyncFor,
  callWithPromiseOrCallback,
  writeFile,
  readFile,
  cpr
} = require('then-utils');
const tsconfig = require('../tsconfig.json');
const logger = require('./lib/logger');
const less = require('less');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const deepAssign = require('deep-assign');
const webpack = require('webpack');
const babel = require('babel-core');

const appdir = normalize(joinPath(__dirname, '..', 'out/'));
const srcdir = normalize(joinPath(__dirname, '..', 'src/'));

logger.info(`using appdir "${relative(process.cwd(), appdir)}"`);
logger.info(`using srcdir "${relative(process.cwd(), srcdir)}"`);

const extradirs = [];

logger.info(`extra directories are ${JSON.stringify(extradirs, null, 2)}`);

logger.section = 'structure';

logger.subsection = 'removing app dir';

let spin = null;

rmrf(appdir).then(() => {
  logger.subsection = 'recreating app dir';
  return mkdirp(appdir);
}).then(() => {
  logger.progress = 0.1;
  logger.section = 'prep';
  return asyncFor(extradirs, (i, extradir) => {
    logger.debug(`extra directory copy loop iteration #${i}`);
    logger.subsection = `copying extra dir "${relative(process.cwd(), joinPath(__dirname, '..', extradir))}"`;
    return cpr(joinPath(__dirname, '..', extradir), joinPath(appdir, extradir));
  });
}).then(() => {
  logger.debug('finished extra directory copy loop');
  logger.progress = 0.3;
  logger.section = 'build';
  logger.subsection = 'reading build list';
  return readdir(srcdir, {
    recursive: true
  });
}).then(files => {
  const increment = 0.7 / files.length;
  logger.debug(`going to increment progress bar after every file by ${increment}`);
  logger.info(`amount of files: ${files.length}`);
  const postbuild = [];
  return asyncFor(files, (i, file) => {
    logger.debug(`file build loop iteration #${i}`);
    file = joinPath(srcdir, file);

    const filename = normalize(file);
    const relativeToSrcFilename = filename.slice(srcdir.length);
    const relativeToSrcDirname = dirname(relativeToSrcFilename);
    const extension = (file.indexOf('.') !== -1) ? file.substring(file.indexOf('.')) : ''; // not using extname because we want to include multiple possible extensions

    let outextension = extension;

    logger.info(`processing file "${filename}"`);

    logger.subsection = `mkdirp "${relative(process.cwd(), joinPath(appdir, relativeToSrcDirname))}"`;
    let prom = mkdirp(joinPath(appdir, relativeToSrcDirname));

    if (extension === '.ts' || extension === '.pack.ts') {
      return prom.then(() => {
        logger.section = 'build:ts';
        logger.subsection = `transpiling file "${relative(process.cwd(), filename)}"`;
        return readFile(filename, 'utf8');
      }).then(src => {
        const opts = {
          fileName: filename,
          compilerOptions: {
            sourceRoot: dirname(relative(joinPath(appdir, relativeToSrcDirname), filename))
          }
        };
        deepAssign(opts, tsconfig);
        return Promise.resolve(transpileModule(src, opts));
      }).then(({ outputText, sourceMapText }) => {
        const outfilename = joinPath(appdir, joinPath(relativeToSrcDirname, `${basename(relativeToSrcFilename, '.ts')}.js.map`));
        return writeFile(outfilename, sourceMapText).then(() => {
          const outfilename2 = joinPath(appdir, joinPath(relativeToSrcDirname, `${basename(relativeToSrcFilename, '.ts')}.js`));
          return writeFile(outfilename2, outputText);
        });
      }).then(() => {
        const outfilename = joinPath(appdir, joinPath(relativeToSrcDirname, `${basename(relativeToSrcFilename, '.ts')}.js`));
        if (filename.endsWith('.pack.ts')) {
          const actualBase = basename(filename, '.pack.ts'); // remove .pack.ts
          const outfilename2 = joinPath(appdir, relativeToSrcDirname, `${actualBase}.js`);
          postbuild.push(() => {
            logger.subsection = `packing file "${relative(process.cwd(), outfilename)}"`
            return callWithPromiseOrCallback(webpack, {
              entry: outfilename,
              output: {
                filename: `${actualBase}.js`,
                sourceMapFilename: `${actualBase}.js.map`,
                path: joinPath(appdir, relativeToSrcDirname)
              },
              devtool: 'source-map'
            }).then(() => {
              return callWithPromiseOrCallback(babel.transformFile.bind(babel), outfilename2, {
                presets: ['latest'],
                compact: false
              });
            }).then(({ code }) => {
              return writeFile(outfilename2, `window.global=window;\n${code}`);
            });
          });
        }
      });
    } else if (extension === '.less') {
      outextension = '.css';
      prom = prom.then(() => {
        logger.section = 'build:less';
        logger.subsection = `rendering file "${relative(process.cwd(), filename)}"`;
        return readFile(filename, 'utf8').then(src => {
          return callWithPromiseOrCallback(less.render.bind(less), src, {
            filename
          });
        }).then(({ css }) => {
          return postcss([ autoprefixer ]).process(css);
        }).then(({ css }) => {
          return css;
        });
      });
    } else if (extension === '') {
      return Promise.resolve();
    } else {
      prom = prom.then(() => {
        logger.section = 'build:other';
        logger.subsection = `reading file "${relative(process.cwd(), filename)}"`;
        return readFile(filename);
      });
    }

    return prom.then(cont => {
      const outfilename = joinPath(appdir, joinPath(relativeToSrcDirname, `${basename(relativeToSrcFilename, extension)}${outextension}`));
      logger.section = 'build';
      logger.subsection = `writing file "${relative(process.cwd(), outfilename)}"`;
      logger.progress += increment;
      return writeFile(outfilename, cont);
    });
  }).then(() => {
    logger.section = 'postbuild';
    logger.substring = 'running postbuild actions';
    
    spin = setInterval(() => {
      logger.spin();
    }, 100);

    return asyncFor(postbuild, (i, action) => {
      return Promise.resolve(action());
    });
  });
}).then(() => {
  if (spin) clearInterval(spin);
  logger.debug('finished file build loop');
  logger.section = 'wrapup';
  logger.subsection = 'done with everything';
  return logger.hideProgress();
}).then(() => {
  return logger.success('finished building successfully! you\'re good to go!');
}).catch(err => {
  logger.error(err.message);
  logger.debug(err.stack);
});
