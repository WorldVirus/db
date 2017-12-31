"use strict";

import QueryMaker from "./QueryMaker.js";

export default class DBinfoGetter{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const operation = arr[2].toString();

        if(operation === 'status'){
            console.log("Operation: status");
            this.getDBinfo();
        }
    }

    getDBinfo(){
        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let dataObject = null;
        let answer = null;

        let objArrFirst = {
            arr: []
        };

        let objArrSecond = {
            arr: []
        };

        let objArrThird = {
            arr: []
        };

        let objArrFour = {
            arr: []
        };

        new QueryMaker(pg).makeQuery("SELECT title FROM forums;", objArrFirst, function(){
            const forumsNumber =  objArrFirst.arr.length;

            new QueryMaker(pg).makeQuery("SELECT author FROM posts;", objArrSecond, function () {
                const postsNumber = objArrSecond.arr.length;

                new QueryMaker(pg).makeQuery("SELECT slug FROM branches;", objArrThird, function(){
                    const branchesNumber = objArrThird.arr.length;

                    new QueryMaker(pg).makeQuery("SELECT nickname FROM users;", objArrFour, function(){
                        const usersNumber = objArrFour.arr.length;

                        answer = {
                            forum: forumsNumber,
                            post: postsNumber,
                            thread: branchesNumber,
                            user: usersNumber
                        };

                        console.log("Result: Get DB info OK");
                        response.end(JSON.stringify(answer));
                    });
                });
            });
        });
    }
}

