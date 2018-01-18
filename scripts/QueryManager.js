"use strict";


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
        });

        this.pool = pool;
    }

    createQuery(queryString, resultObject, callbackNormal, callbackError) {
        const pool = this.pool;

        pool.query(queryString, [], (err, res) => {
            if(err !== null) {
                callbackError(err);
            } else {
                resultObject.arr = res.rows;
                callbackNormal();
            }
        });
    }
}
