"use strict";

import MyWriter from "./MyWriter.js";

import Help from "./Help";
import DBiniter from "./DBiniter";

export default class ServiceWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    clearAll(request, response) {
        new DBiniter(this.app, this.pg, this.fs, this.queryManager, () => {
            response.status(200);
            response.end("CLEAR_ALL_DB_OK");
            MyWriter.log("CLEAR_ALL_DB_OK");
        });
    }

    getInfoAboutAllTables(request, response) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();
        let ccc = Help.objArr();
        let kkk = Help.objArr();

        this.queryManager.createQuery("SELECT count(*) AS rrr FROM u;", aaa, () => {
            this.queryManager.createQuery("SELECT count(*) AS rrr FROM f;", bbb, () => {
                this.queryManager.createQuery("SELECT count(*) AS rrr FROM p;", ccc, () => {
                    this.queryManager.createQuery("SELECT count(*) AS rrr FROM t;", kkk, () => {
                        let users = aaa.arr[0].rrr;
                        let forums = bbb.arr[0].rrr;
                        let posts = ccc.arr[0].rrr;
                        let threads = kkk.arr[0].rrr;

                        if(Help.exists(users) === false) users = 0;
                        if(Help.exists(forums) === false) forums = 0;
                        if(Help.exists(posts) === false) posts = 0;
                        if(Help.exists(threads) === false) threads = 0;

                        const answer = {
                            forum: parseInt(forums),
                            post: parseInt(posts),
                            thread: parseInt(threads),
                            user: parseInt(users)
                        };

                        MyWriter.log("GET DB INFO OK");
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    }, () => {});
                }, () => {});
            }, () => {});
        }, () =>{});
    }
}
