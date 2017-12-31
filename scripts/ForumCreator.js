"use strict";

import QueryMaker from "./QueryMaker.js";
import NumberController from "./NumberController";

export default class ForumCreator {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        if(url === "/forum/create"){
            console.log("Operation: create new forum");
            this.createNewForum();
        } else {
            let arr = url.split("/");
            if(arr[3] === "create"){
                console.log("Operation: create new branch");
                const forumSlug = arr[2];
                this.createBranch(forumSlug);
            }
        }
    }

    createBranch(forumSlug){
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

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            const author = dataObject.author;
            let created = dataObject.created;
            const message = dataObject.message;
            const title = dataObject.title;
            let slug = dataObject.slug;

            let forumslug = forumSlug;


            const q1 = new QueryMaker(pg);
            q1.makeQuery("SELECT * FROM forums WHERE LOWER(slug) = LOWER('" + forumSlug + "');", objArrFirst, function(){
                if(objArrFirst.arr.length === 0){
                    answer = {
                        message: "Forum was NOT found"
                    };
                    console.log("Result: Forum was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {
                    const forumid = objArrFirst.arr[0].forumid;
                    forumSlug = objArrFirst.arr[0].slug;
                    forumslug = forumSlug;

                    const q2 = new QueryMaker(pg);
                    q2.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + author + "');", objArrSecond, function(){
                        if(objArrSecond.arr.length === 0) {
                            answer = {
                                message: "User was NOT found"
                            };
                            console.log("Result: User was NOT found");
                            response.status(404);
                            response.end(JSON.stringify(answer));
                        } else {
                            const authorbranchid = objArrSecond.arr[0].userid;
                            const authorbranchnickname = author;
                            const votes = 0;

                            let objLast = {
                                arr: []
                            };

                            const q4 = new QueryMaker(pg);
                            q4.makeQuery("SELECT COUNT(*) from branches;" , objLast, function(){
                                const idNumber = parseInt(objLast.arr[0].count) + 1;

                                if(slug === undefined) {
                                    slug = idNumber.toString();
                                }

                                const q3 = new QueryMaker(pg);
                                q3.makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + slug + "');", objArrThird, function(){

                                    if(objArrThird.arr.length > 0){
                                        let obj = objArrThird.arr[0];
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
                                        console.log("Result: Branch is already exists");
                                        response.status(409);
                                        response.end(JSON.stringify(answer));
                                    } else {

                                            if(created === undefined) {
                                                created = new Date().toISOString();
                                            }

                                            const q5 = new QueryMaker(pg);
                                            q5.makeQuery(" UPDATE forums SET threads = threads + 1 WHERE forumid = " + forumid + ";    INSERT INTO branches (branchid, authorbranchid, authorbranchnickname, created, forumid, forumslug, message, slug, title, votes) VALUES (" + idNumber + ", " + authorbranchid + ", '" + authorbranchnickname + "', '" + created + "', " + forumid + ", '" + forumslug + "', '" + message + "', '" + slug + "', '" + title + "', " + votes + ");", {} , function(){

                                                if(NumberController.isNumber(slug) === false) {
                                                    answer = {
                                                        author: authorbranchnickname,
                                                        created: created,
                                                        forum: forumslug,
                                                        id: idNumber,
                                                        message: message,
                                                        slug: slug,
                                                        title: title,
                                                        votes: votes
                                                    };
                                                } else {
                                                    answer = {
                                                        author: authorbranchnickname,
                                                        created: created,
                                                        forum: forumslug,
                                                        id: idNumber,
                                                        message: message,
                                                        title: title,
                                                        votes: votes
                                                    };
                                                }
                                                console.log("Result: Branch was added OK");
                                                response.status(201);
                                                response.end(JSON.stringify(answer));
                                            });
                                        }
                                });
                            });
                        }
                    });
                }
            })

        });
    }

    createNewForum(){
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

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            const slug = dataObject.slug;
            let nickname = dataObject.user;

            const q1 = new QueryMaker(pg);
            q1.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');" , objArrFirst, function(){
                if(objArrFirst.arr.length > 0) {
                    const userNumber = objArrFirst.arr[0].userid;
                    nickname = objArrFirst.arr[0].nickname;

                    const q2 = new QueryMaker(pg);
                    q2.makeQuery("SELECT * FROM forums WHERE LOWER(slug) = LOWER('" + slug + "');", objArrSecond, function(){
                        if(objArrSecond.arr.length > 0){
                            const obj = objArrSecond.arr[0];
                            answer = {
                                posts: obj.posts,
                                slug: obj.slug,
                                thread: obj.thread,
                                title: obj.title,
                                user: nickname
                            };
                            console.log("Result: Forum is already exists in database");
                            response.status(409);
                            response.end(JSON.stringify(answer));
                        } else {
                            const posts = 0;
                            const threads = 0;
                            const title = dataObject.title;
                            const userid = userNumber;
                            const usernickname = dataObject.user;

                            const q3 = new QueryMaker(pg);
                            q3.makeQuery("INSERT INTO forums (posts, slug, threads, title, userid, usernickname) VALUES (" + posts + ", '" + slug + "', " + threads + ", '" + title + "', " + userid + ", '" + nickname + "');", { }, function(){
                                answer = {
                                    posts: posts,
                                    slug: slug,
                                    threads: threads,
                                    title: title,
                                    user: nickname
                                };
                                console.log("Result: Forum was added OK");
                                response.status(201);
                                response.end(JSON.stringify(answer));
                            });
                        }
                    });


                } else {
                    answer = {
                        message: "User was NOT found"
                    };
                    console.log("Result: User was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                }
            });
        });
    }
}
