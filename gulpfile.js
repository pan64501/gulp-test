'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var ect = require('gulp-ect');
var uglify = require("gulp-uglify");
var frontnote = require("gulp-frontnote");
var imagemin = require("gulp-imagemin");

var gutil = require('gulp-util');
var changed = require('gulp-changed');
var cache    = require('gulp-cached'); //<-変更
//
//
//のみ(別名のファイルになっても可)

var watch = require('gulp-watch');

gulp.task('ect', function () {
    gulp.src(['./src/templates/**/*.ect', '!./src/templates/_**/*.ect'], {base: './src/templates/'})
            .pipe(cache( 'ect' )) //<-変更済みのみ
            .pipe(ect({
                options: {
                    //root: 'app/views',
                },
                data: function (file, cb) {
                    console.log(file);
                    cb({
                        file: file
                    });
                }
            }))
            .pipe(gulp.dest('./public'));
});

gulp.task("js", function () {
    gulp.src(["./src/js/**/*.js"])
            .pipe(uglify())
            .pipe(gulp.dest("./public/js"));
});


gulp.task("imagemin", function () { // 「imageMinTask」という名前のタスクを登録
    gulp.src("./src/img/**/*.+(jpg|jpeg|png|gif|svg)")    // imagesフォルダー以下のpng画像を取得
            //.pipe(changed())
            .pipe(imagemin({
                //progressive: true
            }))   // 画像の圧縮処理を実行
            .pipe(gulp.dest("./public/img/"));
});


gulp.task('copy', function () {
    return gulp.src(
            ['src/**/*', '!src/templates/**/*', '!src/img/**/*', '!src/js/**/*'],
            {base: 'src'}
    )
            .pipe(gulp.dest('./public'));
});




gulp.task("watch", function () {
    watch(['src/templates/**/*.ect', '!./src/templates/_**/*.ect'], function(file){
        gutil.log('Event : ' + gutil.colors.green(file.event));
        gutil.log('File : ' + gutil.colors.green(file.path));
        if(file.event === 'unlink') {
            var delFile = file.path.replace(/src\\templates/, 'public').replace(/ect$/,'html');
            del( delFile );
            gutil.log('Delete : ' + delFile );
            return;
        }       
        gulp.start("ect");
    });
});


//gulp.task("watch", function () {
//    gulp.watch(["src/js/**/*.js"], ["js"]);
//    //gulp.watch(['src/templates/**/*.ect', '!./src/templates/_**/*.ect'], ["ect"]);
//    gulp.watch(['src/templates/**/*.ect', '!./src/templates/_**/*.ect'], function(e){
//        gutil.log('Event : ' + gutil.colors.green(e.type));
//        console.log("変更されたよ")
//        return ["ect"];
//    });
//    gulp.watch(['src/img/**/*.+(jpg|jpeg|png|gif|svg)'], ["imagemin"]);
//    gulp.watch(['src/**/*', '!src/templates/**/*', '!src/img/**/*.+(jpg|jpeg|png|gif|svg)', '!src/js/**/*.js'], ["copy"]);
//
//
////    watcher.on('change', function (event) {
////        gutil.log('Event :' +event);
////        if (event.type === 'deleted') {
////            // Simulating the {base: 'src'} used with gulp.src in the scripts task
////            var filePathFromSrc = path.relative(path.resolve('src'), event.path);
////
////            // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
////            var destFilePath = path.resolve('build', filePathFromSrc);
////
////            del.sync(destFilePath);
////        }
////    });
//
//
//});


//gulp.task("frontnote", function () {
//    gulp.src("public/css/*.css")
//            .pipe(frontnote({
//                out: './doc'
//            }));
//});


gulp.task('default', ['ect', 'js', 'imagemin',  'watch']);//'copy',