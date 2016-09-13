var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');

var paths = {
    srcLibs: [
        'static/bower/angular/angular.min.js',
        'static/bower/angular-aria/angular-aria.min.js',
        'static/bower/angular-animate/angular-animate.min.js',
        'static/bower/angular-material/angular-material.min.js',
        'static/bower/angular-messages/angular-messages.min.js',
        'static/bower/angular-material-data-table/dist/md-data-table.min.js',
        'static/bower/angular-translate/angular-translate.min.js',
        'static/bower/angular-translate-loader-url/angular-translate-loader-url.min.js',
        'static/bower/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'static/bower/angular-translate-storage-local/angular-translate-storage-local.min.js',
        'static/bower/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
        'static/bower/angular-translate-handler-log/angular-translate-handler-log.min.js',
        'static/bower/ngstorage/ngStorage.min.js',
        'static/bower/angular-cookies/angular-cookies.min.js',
        'static/bower/angular-ui-router/release/angular-ui-router.min.js',
        'static/bower/angular-breadcrumb/dist/angular-breadcrumb.min.js',
        'static/bower/ng-token-auth/dist/ng-token-auth.min.js',
        'static/bower/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'static/bower/angular-loading-bar/build/loading-bar.min.js',
        'static/bower/angular-relative-date/dist/angular-relative-date.min.js',
        'static/bower/angular-dynamic-locale/dist/tmhDynamicLocale.min.js',
        'static/bower/angular-xeditable/dist/js/xeditable.min.js',
        'static/bower/angularfire/dist/angularfire.min.js'
    ],
    srcAngular: [
    'static/app/app.js',
    'static/app/auth/AuthFactory.js',
    'static/app/ApiFactory.js',
    'static/app/auth/AuthController.js',
    'static/app/MainController.js',
    'static/app/association/AssociationController.js',
    'static/app/association/AssociationDetailController.js'
    ],
    srcCss: [
        'static/bower/angular-material/angular-material.css',
        'static/bower/angular-material-data-table/dist/md-data-table.css',
        'static/bower/angular-loading-bar/build/loading-bar.css',
        'static/bower/angular-xeditable/dist/css/xeditable.css'
    ]
};

gulp.task('libs', function() {
    return  gulp.src(paths.srcLibs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('static/build/'))
});

gulp.task('angular', function() {
    return gulp.src(paths.srcAngular)
        .pipe(concat('yt.js'))
        .pipe(gulp.dest('static/build/'))
});

gulp.task('css', function() {
    return gulp.src(paths.srcCss)
        .pipe(concatCss('lib.css'))
        .pipe(gulp.dest('static/build'))
});

gulp.task('watch', function() {
    gulp.watch(paths.srcLibs, ['libs']);
    gulp.watch(paths.srcAngular, ['angular']);
    gulp.watch(paths.srcCss, ['css']);
});

gulp.task('default', ['watch']);