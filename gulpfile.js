var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
    srcLibs: [
        'static/bower/angular/angular.js',
        'static/bower/angular-aria/angular-aria.js',
        'static/bower/angular-animate/angular-animate.js',
        'static/bower/angular-material/angular-material.js',
        'static/bower/angular-material-data-table/dist/md-data-table.js',
        'static/bower/angular-translate/angular-translate.js',
        'static/bower/angular-translate-loader-url/angular-translate-loader-url.js',
        'static/bower/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'static/bower/angular-translate-storage-local/angular-translate-storage-local.js',
        'static/bower/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
        'static/bower/angular-translate-handler-log/angular-translate-handler-log.js',
        'static/bower/ngstorage/ngStorage.js',
        'static/bower/angular-cookies/angular-cookies.js',
        'static/bower/angular-ui-router/release/angular-ui-router.js',
        'static/bower/angular-breadcrumb/dist/angular-breadcrumb.js',
        'static/bower/ng-token-auth/dist/ng-token-auth.js',
        'static/bower/angular-bootstrap/ui-bootstrap-tpls.js',
        'static/bower/angular-loading-bar/build/loading-bar.js',
        'static/bower/angular-relative-date/dist/angular-relative-date.js',
        'static/bower/angular-dynamic-locale/dist/tmhDynamicLocale.js',
        'static/bower/angular-xeditable/dist/js/xeditable.js',
        'static/bower/angularfire/dist/angularfire.js'
    ],
    srcAngular: [
    'static/app/app.js',
    'static/app/auth/AuthFactory.js',
    'static/app/ApiFactory.js',
    'static/app/auth/AuthController.js',
    'static/app/MainController.js',
    'static/app/association/AssociationController.js',
    'static/app/association/AssociationDetailController.js'
    ]
};

gulp.task('libsbundle', function() {
    return  gulp.src(paths.srcLibs)
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .pipe(gulp.dest('static/app/'))
});

gulp.task('concatAngular', function() {
    return gulp.src(paths.srcAngular)
        .pipe(concat('yt.js'))
        .pipe(gulp.dest('static/app/'))
});

gulp.task('default', ['libsbundle', 'concatAngular']);