"use strict";

import gulp from "gulp";
import browserify from "browserify";
import source from "vinyl-source-stream";

gulp.task("default", () => {
    return browserify("src/main.js")
        .transform("babelify")
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("public/js"));
});
