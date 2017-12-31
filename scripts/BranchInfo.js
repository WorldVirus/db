"use strict";

import QueryMaker from "./QueryMaker.js";
import NumberController from "./NumberController";

export default class BranchInfo{
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

        if(operation === 'details'){
            console.log("Operation: details");

            if(NumberController.isNumber(data) === true){
                // data - branchID
                const branchID = parseInt(data);
                this.getBranchInfoByID(branchID);
            } else {
                // data - branchSLUG
                const branchSlug = data.toString();
                this.getBranchInfoBySLUG(branchSlug);
            }
        }
    }

    getBranchInfoByID(branchID){
        branchID = parseInt(branchID);

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
               this.getBranchInfoBySLUG(branchSlug);
           }
        });
    }

    getBranchInfoBySLUG(branchSlug){
        branchSlug = branchSlug.toString();

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

        new QueryMaker(pg).makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", objArrFirst, function(){
           if(objArrFirst.arr.length === 0){
               answer = {
                   message: "Branch was NOT found"
               };
               console.log("Result: Branch was NOT found");
               response.status(404);
               response.end(JSON.stringify(answer));
           } else {

               const obj = objArrFirst.arr[0];

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
           }
        });
    }
}

