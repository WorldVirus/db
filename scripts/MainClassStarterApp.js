"use strict";

import Router from "./Router";
import express from "express";
import pg from "pg";
import fs from 'fs';
import compression from 'compression';

    class MainClassStarterApp {

    constructor() {

        this.app = express();
        this.pg = pg;
        this.fs = fs;

        this.router = new Router(this.app, this.pg, this.fs);
        this.app.use(compression());
     //   this.allowAllOrigins();
        this.addListenersToServerQueries();
        this.startServer();
    }

    startServer() {
        let port = process.env.PORT || 5000;
        this.app.listen(port);
        console.log("\nServer works on port " + port);
        console.log("_____________________________________\n\n")
    }


    addListenersToServerQueries() {
        const app = this.app;
        const pg = this.pg;
        const fs = this.fs;

        this.freeProcess = true;
        this.mass = [];

        let inter = setInterval(() => {
            if(this.mass.length > 0) {
                if(this.mass[0].res.finished === true) {
                    this.mass.splice(0,1);
                    this.freeProcess = true;

                    if(this.freeProcess === true) {
                        if(this.mass.length > 0) {
                            this.freeProcess = false;
                            const type = "POST";
                            this.router.addQuery(type, this.mass[0].req, this.mass[0].res);
                        }
                    }
                }
            }
        }, 1);

        app.get('/*', (request, response) => {
            const type = "GET";
            this.router.addQuery(type, request, response);
        });

        app.post('/*', (request, response) => {
            this.mass.push({
                req: request,
                res: response
            });

            if(this.freeProcess === true) {
                if(this.mass.length > 0) {
                    this.freeProcess = false;
                    const type = "POST";
                    this.router.addQuery(type, this.mass[0].req, this.mass[0].res);
                }
            }
        });
    }
}

const mainObj = new MainClassStarterApp();
