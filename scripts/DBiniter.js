"use strict";


export default class DBiniter {
    constructor(app, pg, fs, queryManager, callback) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;

        this.fs.readFile('./DATABASE.sql', 'utf8',  (err, data) => {
            this.queryManager.createQuery(data, {}, () => {
                console.log("INIT_DATABASE_OK");
                callback();
            }, (e) => {
                console.log("ERROR_OF_INITING_DATABASE");

                console.log("================================================================================");
                console.log("STOP");
            });
        });
    }
}
