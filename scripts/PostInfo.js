"use strict";

import QueryMaker from "./QueryMaker.js";

export default class PostInfo {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        let postId = parseInt(arr[2]);
        let operation = arr[3].toString();

        let q = [];
        q = operation.split("?");
        operation = q[0].toString();

        let params = "";

        if(q.length > 1) {
            params = q[1].toString();
        }

        if(operation === 'details'){
            console.log("Operation: details");
            this.getPostInfo(postId, params);
        }
    }

    getPostInfo(postId, params){
        postId = parseInt(postId);
        params = params.toString();

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

        const q1 = new QueryMaker(pg);
        q1.makeQuery("SELECT * FROM posts WHERE idpost = " + postId + ";", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Post was NOT found"
                };
                console.log("Result: Post was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {

                const post = objArrFirst.arr[0];

                const forumid = post.forumid;
                const threadid = post.threadid;
                const authorName = post.author;

                const q2 = new QueryMaker(pg);
                q2.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + authorName + "');", objArrSecond, function(){
                    const user = objArrSecond.arr[0];

                    const q3 = new QueryMaker(pg);
                    q3.makeQuery("SELECT * FROM forums WHERE forumid = " + forumid + ";", objArrThird, function(){
                        const forum = objArrThird.arr[0];

                        const q4 = new QueryMaker(pg);
                        q4.makeQuery("SELECT * FROM branches WHERE branchid = " + threadid + ";", objArrFour, function(){
                           const thread = objArrFour.arr[0];

                            (function () {

                                if(params === "") {
                                    answer = {
                                        post: {
                                            author: post.author,
                                            created: post.created,
                                            forum: post.forum,
                                            id: post.idpost,
                                            isEdited: post.isedited,
                                            message: post.message,
                                            parent: post.parent,
                                            thread: post.threadid
                                        }
                                    };
                                } else {

                                    let q = [];
                                    q = params.split("=");
                                    let arrString = decodeURIComponent(q[1].toString()) + "";

                                    let mass = [];
                                    mass = arrString.split(",");

                                    answer = {
                                        post: {
                                            author: post.author,
                                            created: post.created,
                                            forum: post.forum,
                                            id: post.idpost,
                                            isEdited: post.isedited,
                                            message: post.message,
                                            parent: post.parent,
                                            thread: post.threadid
                                        }
                                    };

                                    for(let i = 0; i < mass.length; i++) {
                                        let element = mass[i].toString();

                                        if(element === "user") {
                                            const author123 = {
                                                about: user.about,
                                                email: user.email,
                                                fullname: user.fullname,
                                                nickname: user.nickname
                                            };
                                            answer.author = author123;
                                        }

                                        if(element === "thread") {
                                            const thread123 = {
                                                author: thread.authorbranchnickname,
                                                created: thread.created,
                                                forum: thread.forumslug,
                                                id: thread.branchid,
                                                message: thread.message,
                                                slug: thread.slug,
                                                title: thread.title,
                                                votes: thread.votes
                                            };
                                            answer.thread = thread123;
                                        }

                                        if(element === "forum") {
                                            const forum123 = {
                                                posts: forum.posts,
                                                slug: forum.slug,
                                                threads: forum.threads,
                                                title: forum.title,
                                                user: forum.usernickname
                                            };
                                            answer.forum = forum123;
                                        }
                                    }

                                    /*
                                    answer = {
                                         author: {
                                             about: user.about,
                                             email: user.email,
                                             fullname: user.fullname,
                                             nickname: user.nickname
                                         },
                                         forum: {
                                             posts: forum.posts,
                                             slug: forum.slug,
                                             threads: forum.threads,
                                             title: forum.title,
                                             user: forum.usernickname
                                         },
                                        post: {
                                            author: post.author,
                                            created: post.created,
                                            forum: post.forum,
                                            id: post.idpost,
                                            isEdited: post.isedited,
                                            message: post.message,
                                            parent: post.parent,
                                            thread: post.threadid
                                        }/*,
                                    thread: {
                                        author: thread.authorbranchnickname,
                                        created: thread.created,
                                        forum: thread.forumslug,
                                        id: thread.branchid,
                                        message: thread.message,
                                        slug: thread.slug,
                                        title: thread.title,
                                        votes: thread.votes
                                    }
                                };
                                */


                                }

                                console.log("Result: Get post info OK");
                                response.status(200);
                                response.end(JSON.stringify(answer));

                            }());
                        });
                    });
                });
            }
        });
    }
}
