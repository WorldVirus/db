"use strict";

import QueryMaker from "./QueryMaker.js";

export default class UserWorker {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;


        let url = request.url;
        let urlArr = url.split("/");
        let nickname = urlArr[2];
        let operation = urlArr[3];

        if(operation === "create"){
            console.log("Operation: create");
            this.addUser(nickname);
        }

        if(operation === "profile"){
            console.log("Operation: profile");
            this.changeProperties(nickname);
        }
    }

    changeProperties(nickname){
        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let dataObject = null;
        let email = null;

        let answer = null;

        let arrObj = {
            arr: []
        };

        let massObj = {
            arr: []
        };

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            const q1 = new QueryMaker(pg);
            q1.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');", arrObj, function(){
                if(arrObj.arr.length === 0) {
                    answer = {
                        message: "User was NOT found in database"
                    };
                    console.log("Result: User was NOT found in database");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {
                    const email = dataObject.email;
                    const q2 = new QueryMaker(pg);
                    q2.makeQuery("SELECT * FROM users WHERE LOWER(email) = LOWER('" + email + "')  AND LOWER(nickname) <> LOWER('" + nickname + "');", massObj, function(){
                        if(massObj.arr.length > 0){
                            answer = {
                                message: "User has conflict with other users"
                            };
                            console.log("Result: User has conflict with other users");
                            response.status(409);
                            response.end(JSON.stringify(answer));
                        } else {

                            let massObjLast = {
                                arr: []
                            };

                            const q8 = new QueryMaker(t.pg);
                            q8.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');", massObjLast, () => {

                                let old = massObjLast.arr[0];

                                let oldAbout = old.about;
                                let oldEmail = old.email;
                                let oldFullname = old.fullname;

                                function isNormal(s) {
                                    return s !== undefined;
                                }

                                let about = dataObject.about;
                                let email = dataObject.email;
                                let fullname = dataObject.fullname;

                                if(isNormal(about) === false) about = oldAbout;
                                if(isNormal(email) === false) email = oldEmail;
                                if(isNormal(fullname) === false) fullname = oldFullname;

                                const q3 = new QueryMaker(pg);
                                q3.makeQuery("UPDATE users SET about = '" + about + "', email = '" + email + "', fullname = '" + fullname + "' WHERE LOWER(nickname) = LOWER('" + nickname + "');", { }, function(){
                                    answer = {
                                        about: about + "",
                                        email: email + "",
                                        fullname: fullname + "",
                                        nickname: nickname
                                    };
                                    console.log("Result: Change user info OK");
                                    response.status(200);
                                    response.end(JSON.stringify(answer));
                                });
                            });
                        }
                    });

                }
            });
        });
    }

    addUser(nickname){
        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let dataObject = null;
        let email = null;

        let answer = null;

        let arrObj = {
            arr: []
        };

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }
            email = dataObject.email;

            const q1 = new QueryMaker(t.pg);
            q1.makeQuery("SELECT * FROM users WHERE LOWER(email) = LOWER('" + email + "')  OR LOWER(nickname) = LOWER('" + nickname + "');", arrObj, function(){
                if(arrObj.arr.length > 0){
                    answer = arrObj.arr;
                    console.log("Result: User was NOT added to database");
                    response.status(409);
                    response.end(JSON.stringify(answer));
                } else {

                    const q2 = new QueryMaker(t.pg);
                    const fullname = dataObject.fullname;
                    const about = dataObject.about;

                    q2.makeQuery("INSERT INTO users (about, email, fullname, nickname) VALUES ('" + about + "', '" + email + "', '" + fullname + "', '" + nickname + "');", {}, function(){
                        answer = {
                            about: about,
                            email: email,
                            fullname: fullname,
                            nickname: nickname
                        };
                        console.log("Result: User was added to database");
                        response.status(201);
                        response.end(JSON.stringify(answer));
                    });
                }
            });

        });
    }

}
