"use strict";

import QueryMaker from "./QueryMaker.js";

export default class UserInfo {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;


        let url = request.url;
        let urlArr = url.split("/");
        let nickname = urlArr[2];
        let operation = urlArr[3];

        if(operation === "profile"){
            console.log("Operation: profile");
            this.getInfo(nickname);
        }
    }

    getInfo(nickname) {
        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let dataObject = {
            arr: []
        };

        let answer = null;

        const q = new QueryMaker(t.pg);
        q.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');", dataObject, function () {
            if (dataObject.arr.length === 0){
                answer = {
                    message: "User was NOT found"
                };
                console.log("Result: User was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                let obj = dataObject.arr[0];
                answer = {
                    about: obj.about,
                    email: obj.email,
                    fullname: obj.fullname,
                    nickname: obj.nickname
                };
                console.log("Result: User was found");
                response.status(200);
                response.end(JSON.stringify(answer));
            }
        });

    }
}
