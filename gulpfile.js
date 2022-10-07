// var async = require('async');
// npm install --save-dev gulp-imagemin@7.1.0 安裝舊版
const fs = require("fs");
const {
  src,
  dest,
  watch,
  series
} = require('gulp')
  // const async = require('async');
const gulp = require('gulp');
// const gulpLoadPlugins = require('gulp-load-plugins');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const atImport = require("postcss-import")
const postcss_html = require('gulp-html-postcss');
const nested = require('postcss-nested');
const reporter = require('gulp-reporter');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const url = require("postcss-url")
// const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');
// 合併檔案
const concat = require('gulp-concat');
const minify = require("gulp-babel-minify");
sass.compiler = require('dart-sass');
const Observable = require("rx").Observable;
// const postCssSvgo = require('postcss-svgo');
const purgecss = require('gulp-purgecss');
// iCon font build Task 
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const lodash = require('lodash');

// const browserslist = require('browserslist')

// var opts = {
//     plugins: [{
//         removeDoctype: false
//     }, {
//         removeComments: false
//     }, {
//         cleanupNumericValues: {
//             floatPrecision: 2
//         }
//     }, {
//         convertColors: {
//             names2hex: false,
//             rgb2hex: false
//         }
//     }]
// };
// function imgs() {
//   return src('src/assets/*')
//     .pipe(webp())
//     .pipe(imagemin())
//     .dest('./dist/')
// }

// gulp.task("img", function() {
//   return Observable.return(
//     imgs()
//   );
// });
// const purgecss = require('gulp-purgecss');

// SASS 非同步 
gulp.task("sass", function() {
  return Observable.return(
    scssTask()
  );
});

function scssTask() {
  var plugins = [nested];
  return src('./src/assets/scss/*.scss')
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sass()) // expanded nested compact compressed
    .pipe(
      postcss([
        // postCssSvgo(),
        // cssnano(),
        // autoprefixer(),

        postcssPresetEnv({
          stage: 3,
          features: {
            'nesting-rules': true
          },
          browsers: 'last 2 versions',
        })
      ]))
    .pipe(sass().on('error', sass.logError))
    // .pipe(sourcemaps.write('./')) // 生成 sourcemaps 文件 (.map)
    .pipe(sourcemaps.write('.', {
      sourceRoot: '../scss/'
        // 寫入 Sourcemaps 到當前資料夾(以下下列 dest('assets/css')為基準點，
        // SourceRoot：以匯出的資料夾為基準點找他原本的 scss 資料夾位置。
    }))
    .pipe(dest('./src/assets/css/'));
}



gulp.task("purgeSass", function() {
  return Observable.return(
    purgeSass()
  );
});

function purgeSass() {
  return src('./src/assets/css/*.css')
    .pipe(purgecss({
      content: [
        './src/Job/**/*.html',
        './src/Recruit/**/*.html',
        './src/*.html'
      ],
    }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(dest('./src/assets/css/'));
};



// BABELES5 非同步 
gulp.task("babelEs5", function() {
  return Observable.return(
    babelEs5()
  );
});


// 編譯 ES6 轉 5 
function babelEs5() {
  return src([
      // "javascript/TurboFrame_Global.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Prototype.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Ready.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Core.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Fragments.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Resize.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Browser.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Util.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Functions.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Elements.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_String.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Events.js",
      "src/javascript/turboframes_likeJQuery/TurboFrame_Ajax.js",
      // "src/javascript/TurboFrame_Ajax.js",
    ], {
      "allowEmpty": true
    })
    .pipe(concat("turboframe_bundle.min.js"))

  .pipe(babel({
    presets: ['@babel/env'],
    minified: true,
  }))

  .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(dest('./dist/js'))
    // 編譯完成輸出路徑
}

// BABELES5 非同步 
gulp.task("babelEs5Polyfills", function() {
  return Observable.return(
    babelEs5Polyfills()
  );
});

// src('./src/pages/scss/*.scss')
// 編譯 babelEs5Polyfills ES6 轉 5 
function babelEs5Polyfills() {
  return src([
      "src/javascript/polyfills/*.js",
    ], {
      "allowEmpty": true
    })
    .pipe(concat("turboframe_polyfills_bundle.min.js"))

  .pipe(babel({
    presets: ['@babel/env'],
    minified: true,
  }))

  .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(dest('./dist/js'))
    // 編譯完成輸出路徑
}
// BROWSERSYNC TASKS
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload);
  watch(['./src/scss/*.scss', './javascript/*.js'], series(
    scssTask,
    babelEs5,
    purgeSass,
    // imgs
    // readToolMethod
    // browsersyncReload
  ));
}

exports.default = series(
  scssTask,
  babelEs5,
  purgeSass,
  // imgs
  // readToolMethod
);