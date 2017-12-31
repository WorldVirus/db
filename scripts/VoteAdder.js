"use strict";

import QueryMaker from "./QueryMaker.js";
import NumberController from "./NumberController.js";

export default class VoteAdder {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        let value = arr[2].toString();
        let operation = arr[3].toString();

        let dataObject = null;

        request.on('data', (dataValue) => {
            try {
                dataObject = JSON.parse(dataValue);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            if(operation === 'vote'){
                console.log("Operation: vote");
                if(NumberController.isNumber(value) === false){
                    // use slug
                    this.addVoteUsingSlug(value, dataObject);
                } else {
                    // use id
                    this.addVoteUsingID(value, dataObject);
                }
            }
        });
    }

    addVoteUsingID(branchID, dataObject){
        branchID = parseInt(branchID);

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let answer = null;

        let objArrFirst = {
            arr: []
        };

        new QueryMaker(pg).makeQuery("SELECT * FROM branches WHERE branchid = " + branchID + ";", objArrFirst, () => {
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Branch was NOT found"
                };
                console.log("Result: Branch was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                const slug = objArrFirst.arr[0].slug.toString();
                this.addVoteUsingSlug(slug, dataObject);
            }
        });
    }

    addVoteUsingSlug(branchSlug, dataObject){
        branchSlug = branchSlug.toString();

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

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

        const q1 = new QueryMaker(pg);
        q1.makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", objArrFirst, function(){
           if(objArrFirst.arr.length === 0){
               answer = {
                   message: "Branch was NOT found"
               };
               console.log("Result: Branch was NOT found");
               response.status(404);
               response.end(JSON.stringify(answer));
           } else {

               const nickname = dataObject.nickname.toString();
               branchSlug = objArrFirst.arr[0].slug.toString();
               const branchID = objArrFirst.arr[0].branchid;
               const voice = parseInt(dataObject.voice);

               let ppp = {
                   arr: []
               };

               new QueryMaker(pg).makeQuery("select nickname from users where LOWER(nickname) = LOWER('" + nickname + "');",ppp, () => {
                    if(ppp.arr.length > 0) {
                        // user exists

                        // noinspection JSAnnotator
                        function updateBranch() {
                            let objArrBBB = {
                                arr: []
                            };

                            let objArrCCC = {
                                arr: []
                            };

                            new QueryMaker(pg).makeQuery("SELECT SUM(voice) FROM votes WHERE branchid = " + branchID + ";", objArrBBB, function(){
                                let summa =  objArrBBB.arr[0].sum.toString();

                                if(summa === null || summa === undefined || summa === 'null' || summa === 'undefined' || summa === '') {
                                    summa = 0;
                                }
                                summa = parseInt(summa);

                                new QueryMaker(pg).makeQuery("UPDATE branches SET votes = " + summa + " WHERE branchid = " + branchID + ";", {}, function(){

                                    new QueryMaker(pg).makeQuery("SELECT * FROM branches WHERE branchid = " + branchID + ";", objArrCCC, function(){
                                        const obj = objArrCCC.arr[0];

                                        answer = {
                                            author: obj.authorbranchnickname,
                                            created: obj.created,
                                            forum: obj.forumslug,
                                            id: obj.branchid,
                                            message: obj.message,
                                            slug: obj.slug,
                                            title: obj.title,
                                            votes: obj.votes
                                        };

                                        console.log("Result: Get branch info OK");
                                        response.status(200);
                                        response.end(JSON.stringify(answer));
                                    });
                                });
                            });
                        }

                        const q2 = new QueryMaker(pg);
                        q2.makeQuery("SELECT * FROM votes WHERE LOWER(branchslug) = LOWER('" + branchSlug + "') AND LOWER(nickname) = LOWER('" + nickname + "');", objArrSecond, function(){
                            if(objArrSecond.arr.length === 0){  // if not voted before
                                new QueryMaker(pg).makeQuery("INSERT INTO votes (nickname, branchid, branchslug, voice) VALUES ('" + nickname + "', " + branchID + ", '" + branchSlug + "', " + voice + ");", {}, function(){
                                    updateBranch();
                                });
                            } else { // if man voted before
                                new QueryMaker(pg).makeQuery("UPDATE votes SET voice = " + voice + " WHERE LOWER(branchslug) = LOWER('" + branchSlug + "') AND LOWER(nickname) = LOWER('" + nickname + "');", {}, function() {
                                    updateBranch();
                                });
                            }
                        });


                    } else {
                        // user NO exists
                        answer = {
                            message: "User no exists"
                        };
                        console.log("Result: User no exists");
                        response.status(404);
                        response.end(JSON.stringify(answer));
                    }
               });
           }
        });
    }
}
