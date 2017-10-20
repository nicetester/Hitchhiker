var gulp = require('gulp'),
    argv = require('yargs').argv,
    replace = require('gulp-replace'),
    exec = require('child_process').exec;

gulp.task('release', ['copy']);

gulp.task('copy', ['compilerClient'], function () {
    return gulp.src('./client/build/**/*.*')
        .pipe(gulp.dest('./build/public'));
});

gulp.task('compilerClient', ['compilerServer'], function (cb) {
    process.chdir('./client');
    exec('yarn build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        process.chdir('../');
        cb();
    });
});

gulp.task('compilerServer', ['config'], function (cb) {
    exec('tsc -p . -w false', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb();
    });
});

gulp.task('config', [], function () {
    return gulp.src('./client/src/utils/urls.ts')
        .pipe(replace('http://localhost:30000/', 'HITCHHIKER_APP_HOST'))
        .pipe(gulp.dest('./client/src/utils/'))
        .on('end', function () {
            gulp.src('./appconfig.json')
                .pipe(replace('localhost:30000', `localhost:11001`))
                .pipe(replace('localhost:10081', `localhost:11001`))
                .pipe(replace('"database": "hitchhiker"', '"database": "hitchhiker-prod"'))
                .pipe(replace('DEV', `PROD`))
                .pipe(gulp.dest('./'))
                .on('end', function () {
                    gulp.src('./client/package.json')
                        .pipe(replace('localhost:10081', `localhost:11001`))
                        .pipe(gulp.dest('./client/'))
                        .on('end', function () {
                            gulp.src('./api/index.ts')
                                .pipe(replace('10081', `11001`))
                                .pipe(gulp.dest('./api/'));
                        });
                });
        });
});