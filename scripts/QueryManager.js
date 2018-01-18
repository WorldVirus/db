"use strict";

import MyWriter from "./MyWriter.js";

export default class QueryManager {
    constructor(app, pg, fs) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;

        const pool = new pg.Pool({
            user: 'docker',
            database: 'docker',
            password: 'docker',
            host: 'localhost',
            port: 5432
        });

        pool.on('error', (err, client) => {
            MyWriter.log("_____POOL_____ERROR_____");
        });

        this.pool = pool;
    }

    createQuery(queryString, resultObject, callbackNormal, callbackError) {
        const pool = this.pool;

        pool.query(queryString, [], (err, res) => {
            if(err !== null) {
                MyWriter.log("callbackError");
                callbackError(err);
            } else {
                MyWriter.log("callbackNormal");
                resultObject.arr = res.rows;
                callbackNormal();
            }
        });
    }
}
