"use strict";

import Router from "./Router.js";
import TablesCreator from "./TablesCreator.js";
import DBdropper from "./DBdropper";

let express = null;
let app = null;
let pg = null;
let fs = null;

eval("       express = require('express');       ");
eval("       app = express();                    ");
eval("       pg = require('pg');                 ");
eval("       fs = require('fs');                 ");

class Application {
    constructor(){
        Application.createTables();
        Application.allowOrigins();
        Application.routeQuery();
        Application.startServer();
    }

    static createTables(){
        new TablesCreator(fs, pg, function() { });
    }

    static allowOrigins(){
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    static routeQuery(){
        new Router(app, pg, fs);
    }

    static startServer(){
        let port = process.env.PORT || 5000;
        app.listen(port);
        console.log("Server works on port " + port + "\n");
    }
}

new Application();
