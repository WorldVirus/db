"use strict";
import DataBase from './database/Database'
const promise = require('bluebird');
export default class QueryManager {
    constructor(app, pg, fs) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;

        const pool = new DataBase({
            promiseLib: promise
        }, {
            user: 'postgres',
            host: 'localhost',
            database: 'bbb_12345',
            password: '12345',
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
