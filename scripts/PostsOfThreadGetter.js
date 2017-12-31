"use strict";

import QueryMaker from "./QueryMaker.js";
import NumberController from "./NumberController.js";
import URLsplitter from "./URLsplitter";
import ThreeBuilder from "./ThreeBuilder";

export default class PostsOfThreadGetter {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const data = arr[2].toString();
        let operation = arr[3].toString();

        if(operation === 'posts') {
            console.log("Operation: posts");

            if (NumberController.isNumber(data) === true) {
                // data is ID
                const branchID = parseInt(data);
                this.getMessagesByBranchID(branchID, []);
            } else {
                // data is SLUG
                const branchSlug = data.toString();
                this.getMessagesByBranchSlug(branchSlug, []);
            }
        } else {

            let mass = [];
            mass = operation.split("?");
            operation = mass[0].toString();
            let variablesString = mass[1].toString();

            mass = URLsplitter.explodeString(variablesString);

            if (NumberController.isNumber(data) === true) {
                // data is ID
                const branchID = parseInt(data);
                this.getMessagesByBranchID(branchID, mass);
            } else {
                // data is SLUG
                const branchSlug = data.toString();
                this.getMessagesByBranchSlug(branchSlug, mass);
            }
        }
    }

    getMessagesByBranchID(branchID, mmm){
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
                const branchSlug = objArrFirst.arr[0].slug.toString();
                this.getMessagesByBranchSlug(branchSlug, mmm);
            }
        });
    }

    getMessagesByBranchSlug(branchSlug, mmm){
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

        new QueryMaker(pg).makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Branch was NOT found"
                };
                console.log("Result: Branch was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {

                let objArrBBB = {
                   arr: []
                };

                let sortType = "flat";

                let queryString = "SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + branchSlug + "')   ";

                if(mmm.length === 0) {
                    queryString = "SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + branchSlug + "') ORDER BY idpost;";
                } else {

                    let s1 = "  ";
                    let s2 = "  ";
                    let s3 = "  ";
                    let s4 = "  ";

                    sortType = "flat";

                    let sortingVector = "+";

                    for(let i = 0; i < mmm.length; i++){
                        const obj = mmm[i];

                        if(obj.key === "limit") {
                            s1 = " LIMIT " + obj.value + "  ";
                        }

                        if(obj.key === "desc") {
                            if(obj.value === "true") {
                                s2 = " ORDER BY idpost DESC ";
                                sortingVector = "-"
                            } else {
                                s2 = " ORDER BY idpost ASC ";
                                sortingVector = "+";
                            }
                        }

                        if(obj.key === "since") {
                            if(sortingVector === "+") s3 = " AND idpost > " + obj.value + " ";
                            if(sortingVector === "-") s3 = " AND idpost < " + obj.value + " ";
                        }

                        if(obj.key === "sort") {
                            sortType = obj.value;
                        }
                    }

                    if(s2 === "  ") {
                        s2 =  " ORDER BY idpost ASC ";
                    }


                    queryString = queryString + s3 + s2 + s1;
                    queryString += " ; ";
                }

                if(sortType === "flat") {
                    console.log(queryString.toString());
                    new QueryMaker(pg).makeQuery(queryString.toString(), objArrBBB, function () {
                        const mass = objArrBBB.arr;

                        answer = [];

                        for (let i = 0; i < mass.length; i++) {
                            const obj = mass[i];
                            answer.push({
                                author: obj.author,
                                created: obj.created,
                                forum: obj.forum,
                                id: obj.idpost,
                                isEdited: obj.isedited,
                                message: obj.message,
                                parent: obj.parent,
                                thread: obj.threadid
                            });
                        }

                        console.log("Result: Get posts of branch OK");
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    });
                } else {

                    // if sortType <> flat

                    let bbb = {
                        arr: []
                    };

                    new QueryMaker(pg).makeQuery("SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + branchSlug + "') ORDER BY idpost;", bbb, () => {
                        let desc = false;
                        let limit = 9999999999999;
                        let since = -1;

                        for(let i = 0; i < mmm.length; i++) {
                            if(mmm[i].key === "desc") {
                                if(mmm[i].value === "true") {
                                    desc = true;
                                }
                            }

                            if(mmm[i].key === "limit") {
                                limit = parseInt(mmm[i].value);
                            }

                            if(mmm[i].key === "since") {
                                since = parseInt(mmm[i].value);
                            }
                        }

                        if(sortType === "tree") {
                            const three = new ThreeBuilder(bbb.arr, response);
                            three.getResult(sortType, desc, limit, since);
                        }

                        if(sortType === "parent_tree") {
                            const three = new ThreeBuilder(bbb.arr, response);
                            three.getResultParentThree(sortType, desc, limit, since);
                        }
                    });
                }
            }
        });
    }
}

