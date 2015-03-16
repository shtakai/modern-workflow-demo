///<reference path="./references.d.ts" />

import View = require('./view');

var loadingView = new View("./source/hbs/layout/loading.hbs", "#loading", null);

export = loadingView;
