// init
require('./lib/init');

// imports
const log = require('./lib/log').tag('APP');
const util = require('util');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const body = require('./lib/body');
const routes = require('./routes');
const onError = require('./lib/onError');
const gridFs = require('./lib/gridFs');


// startup logic
(async () => {
    // init app
    const app = express();
    const listen = util.promisify(app.listen.bind(app));

    // setup db
    const con = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

    // initliaze the gridFs
    gridFs.init(con.connection.db);


    // CORS
    app.use(cors({
        exposedHeaders: ['Etag', 'Date', 'Last-Modified', 'Authorization', 'Cache-Control', 'Content-Type']
    }));

    // setup app
    body(app);
    routes(app);
    onError(app);


    await app.listen(process.env.PORT || 8080);

    // all good
    log.info('App online !');
})();