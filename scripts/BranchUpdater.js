"use strict";

import QueryMaker from "./QueryMaker.js";
import NumberController from "./NumberController.js";

export default class BranchUpdater{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const data = arr[2].toString();
        const operation = arr[3].toString();

        let dataObject = null;

        request.on('data', (dataValue) => {
            try {
                dataObject = JSON.parse(dataValue);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            if (operation === 'details') {
                console.log("Operation: details");
                if (NumberController.isNumber(data) === true) {
                    // data - branchID
                    const branchID = parseInt(data);
                    this.updateBranchByID(branchID, dataObject);
                } else {
                    // data - branchSLUG
                    const branchSlug = data.toString();
                    this.updateBranchBySLUG(branchSlug, dataObject);
                }
            }
        });
    }

    updateBranchByID(branchID, dataObject){
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
                this.updateBranchBySLUG(branchSlug, dataObject);
            }
        });
    }

    updateBranchBySLUG(branchSlug, dataObject){
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

                branchSlug = objArrFirst.arr[0].slug.toString();

                // noinspection JSAnnotator
               function isNormal(x) {
                    if(x === undefined) return false;
                    if(x === null) return false;
                    return true;
                }

                let message = undefined;
                let title = undefined;

                if(isNormal(dataObject.message) === true) message = dataObject.message.toString();
                if(isNormal(dataObject.title) === true) title = dataObject.title.toString();

                let bigQuery = "  ";

                if(message !== undefined) {
                    bigQuery = bigQuery + "  UPDATE branches SET message = '" + message + "'  WHERE LOWER(slug) = LOWER('" + branchSlug + "');  ";
                }

                if(title !== undefined) {
                    bigQuery = bigQuery + "  UPDATE branches SET title = '" + title + "'  WHERE LOWER(slug) = LOWER('" + branchSlug + "');  ";
                }

                new QueryMaker(pg).makeQuery(bigQuery, { }, function(){
                    let obj = null;

                    let zzz = {
                      arr: []
                    };

                    new QueryMaker(pg).makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", zzz, () => {
                        obj = zzz.arr[0];

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

                        console.log("Result: Branch title and message update OK");
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    });
                });
           }
        });
    }
}

