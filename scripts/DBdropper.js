"use strict";

import QueryMaker from "./QueryMaker.js";
import TablesCreator from "./TablesCreator.js";

export default class DBdropper {
    constructor(app, pg, request, response, fs){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;
        this.fs = fs;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const operation = arr[2].toString();
        if(operation === 'clear'){
            console.log("Operation: clear");
            this.dropDataBaseAndClearTables();
        }
    }

    dropDataBaseAndClearTables(){
        const t = this;
        const pg = this.pg;
        const response = this.response;
        const fs = this.fs;

        const c1 = "  DROP TABLE branches  ;    ";
        const c2 = "  DROP TABLE forums    ;    ";
        const c3 = "  DROP TABLE posts     ;    ";
        const c4 = "  DROP TABLE users     ;    ";
        const c5 = "  DROP TABLE votes     ;    ";

        const queryString = c1 + c2 + c3 + c4 + c5;

        new QueryMaker(pg).makeQuery(queryString, {}, function(){

            new TablesCreator(fs, pg, () => {
                const answer = {
                    resultMessage: "All DB was rewrite"
                };
                console.log("Result: All DB was rewrite");
                response.end(JSON.stringify(answer));
            });
        });
    }
}

