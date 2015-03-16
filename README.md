# modern-workflow-demo

[![Build Status](https://secure.travis-ci.org/remojansen/modern-workflow-demo.png?branch=master)](https://travis-ci.org/remojansen/modern-workflow-demo) [![Dependencies](https://david-dm.org/remojansen/modern-workflow-demo.png)](https://david-dm.org/remojansen/modern-workflow-demo#info=dependencies)

A TypeScript + Sass + Browserify + Gulp + Karma + BroserSync demo repository

# Tasks

Reload ``npm``, ``bower`` and ``tsd`` dependencies with one command:

    gulp install

Build your app's TypeScript and Sass code:

    gulp build

Bundle and uglify (sorcemaps included) your app's ``.js`` (powered by Browserify) and ``.css`` files:

    gulp optimize

Test runner powered by Karma, Mocha, Chai y Sinon:

    gulp test

Static server and browser reload on file changes (``.html``, ``.css`` and ``.js``) powered by browser-sync:

    gulp sync

Default Task:

    gulp.task('default', ['build', 'optimize', 'test', 'sync', 'clean']);

## License

MIT
