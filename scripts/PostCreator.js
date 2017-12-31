"use strict";

import QueryMaker from "./QueryMaker.js";
import NumberController from "./NumberController";

export default class PostCreator{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");
        let operation = arr[3];

        let dataObject = [];

        let bigString = "";

        request.on('data', (aaa) => {
            bigString += aaa.toString();
        }).on('end', () => {
            let dataValue = bigString.toString();

            try {
                dataObject = JSON.parse(dataValue.toString());
            } catch (err) {
                console.log("JSON PARSING ERROR:  " + err);
                response.end("BAD FORMAT ERROR");
            }

            let data = arr[2].toString();
            if (NumberController.isNumber(data) === true) {
                // id param
                console.log("Operation: Add posts using branch ID");
                this.addPostsByBranchId(parseInt(data), dataObject);
            } else {
                // slug param
                console.log("Operation: Add posts using branch slug");
                this.addPostsByBranchSlug(data, dataObject);
            }
        });
    }

    addPostsByBranchId(branchId, dataObject){
            branchId = parseInt(branchId);

            const t = this;

            const app = t.app;
            const pg = t.pg;
            const request = t.request;
            const response = t.response;

            let answer = null;

            let objArrZero = {
                arr: []
            };

            const q1 = new QueryMaker(pg);
            q1.makeQuery("SELECT * FROM branches WHERE branchid = " + branchId + ";", objArrZero, function () {
                if (objArrZero.arr.length === 0) {
                    answer = {
                        message: "Branch was NOT found"
                    };
                    console.log("Result: Branch was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {
                    const slug = objArrZero.arr[0].slug;
                    t.addPostsByBranchSlug(slug, dataObject);
                }
            });
    }

    addPostsByBranchSlug(slug, dataObjectParam){
            let dataObject = dataObjectParam;

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

            let objArrFour = {
                arr: []
            };


            let objArrLast = {
                arr: []
            };


            const q1 = new QueryMaker(pg);
            q1.makeQuery("SELECT * FROM branches where LOWER(slug) = LOWER('" + slug + "');", objArrFirst, function(){
                if(objArrFirst.arr.length === 0){
                    answer = {
                        message: "Branch was NOT found"
                    };
                    console.log("Result: Branch was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {

                    const threadid = objArrFirst.arr[0].branchid;

                    // noinspection JSAnnotator
                    function getInt(x) {
                        x = parseInt(x);
                        if(x === undefined) return 0;
                        if(x === null) return 0;
                        if(isNaN(x) === true) return 0;
                        return x;
                    }

                    let ppp = {
                        arr: []
                    };

                    new QueryMaker(pg).makeQuery("select nickname from users;",ppp, () => {

                        let allUsersHere = true;

                        for(let i = 0; i < dataObject.length; i++) {
                            let find = false;
                            const thisUserNickname = dataObject[i].author.toString().toLowerCase();

                            for(let j = 0; j < ppp.arr.length; j++) {
                                const userName = ppp.arr[j].nickname.toString().toLowerCase();
                                if(thisUserNickname === userName) {
                                    find = true;
                                }
                            }

                            if(find === false) {
                                allUsersHere = false;
                            }
                        }

                        if(allUsersHere === false) {
                            answer = {
                                message: "User was not found"
                            };
                            console.log("Result: User was not found");
                            response.status(404);
                            response.end(JSON.stringify(answer));
                        } else {

                            const q2 = new QueryMaker(pg);
                            q2.makeQuery("SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + slug + "');", objArrSecond, function () {

                                let ok = true;

                                for (let i = 0; i < dataObject.length; i++) {
                                    let parentId = getInt(parseInt(dataObject[i].parent));
                                    let find = false;

                                    for (let j = 0; j < objArrSecond.arr.length; j++) {
                                        let elementId = getInt(parseInt(objArrSecond.arr[j].idpost));
                                        if (parentId === elementId) {
                                            find = true;
                                        }
                                    }

                                    if (parentId === 0) {
                                        find = true;
                                    }

                                    if (find === false) {
                                        ok = false;
                                    }
                                }

                                if (ok === false) {
                                    answer = {
                                        message: "Parent of post was NOT found"
                                    };
                                    console.log("Result: Parent of post was NOT found");
                                    response.status(409);
                                    response.end(JSON.stringify(answer));
                                } else {
                                    const q3 = new QueryMaker(pg);
                                    q3.makeQuery("SELECT NOW();", objArrThird, function () {
                                        let created = new Date().toISOString();

                                        const q4 = new QueryMaker(pg);
                                        q4.makeQuery("SELECT forums.forumid, forums.slug FROM forums INNER JOIN branches ON branches.forumid = forums.forumid WHERE LOWER(branches.slug) = LOWER('" + slug + "');", objArrFour, function () {
                                            let forumid = objArrFour.arr[0].forumid;
                                            let forum = objArrFour.arr[0].slug;

                                            const q5 = new QueryMaker(pg);
                                            q5.makeQuery("SELECT COUNT(*) FROM posts;", objArrLast, function () {
                                                let startNumber = getInt(parseInt(objArrLast.arr[0].count));

                                                let queriesString = "";

                                                answer = [];

                                                let incrementVariable = 0;

                                                for (let i = 0; i < dataObject.length; i++) {

                                                    incrementVariable += 1;

                                                    let obj = dataObject[i];

                                                    let author = obj.author;
                                                    let message = obj.message;
                                                    let parent = obj.parent;

                                                    const threadslug = slug;
                                                    const isedited = false;

                                                    const idid = startNumber + i + 1;

                                                    parent = getInt(parent);

                                                    answer.push({
                                                        author: author,
                                                        created: created,
                                                        forum: forum,
                                                        id: idid,
                                                        isEdited: isedited,
                                                        message: message,
                                                        parent: parent,
                                                        thread: threadid
                                                    });

                                                    if (author === undefined) console.log("---------UNDEFINED author--------------");
                                                    if (created === undefined) console.log("---------UNDEFINED created--------------");
                                                    if (forum === undefined) console.log("---------UNDEFINED forum--------------");
                                                    if (idid === undefined) console.log("---------UNDEFINED idid--------------");
                                                    if (isedited === undefined) console.log("---------UNDEFINED isedited--------------");
                                                    if (message === undefined) console.log("---------UNDEFINED message--------------");
                                                    if (parent === undefined) console.log("---------UNDEFINED parent--------------");
                                                    if (threadid === undefined) console.log("---------UNDEFINED threadid--------------");

                                                    const query = "INSERT INTO posts (idpost, author, created, forum, forumid, isedited, message, parent, threadid, threadslug) VALUES (" + idid + ",'" + author + "', '" + created + "', '" + forum + "', " + forumid + ", " + isedited + ", '" + message + "', " + parent + ", " + threadid + ", '" + threadslug + "');";
                                                    queriesString = queriesString + "  " + query + "  ";
                                                }

                                                const q6 = new QueryMaker(pg);
                                                q6.makeVeryHardQuery(queriesString, {}, function () {
                                                    const q7 = new QueryMaker(pg);
                                                    q7.makeQuery("UPDATE forums SET posts = posts + " + incrementVariable + " WHERE forumid = " + forumid + ";", {}, function () {
                                                        console.log("Result: Adding posts OK");
                                                        response.status(201);
                                                        response.end(JSON.stringify(answer));
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                            });
                        }

                    });
                }
            });
    }
}
