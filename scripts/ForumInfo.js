"use strict";

import QueryMaker from "./QueryMaker.js";
import URLsplitter from "./URLsplitter";
import NumberController from "./NumberController";

export default class ForumInfo{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = url.split("/");
        let forumSlug = arr[2];
        let operation = arr[3];

        if(operation === "details"){
            console.log("Operation: details");
            this.getInfoAboutForum(forumSlug);
        }

        let mass = operation.split("?");

        if(mass.length === 1) {
            if (operation === "threads") {
                console.log("Operation: threads");
                this.getForumThreads(forumSlug, []);
            }
            if (operation === "users") {
                console.log("Operation: users");
                this.getUsersOfForum(forumSlug, []);
            }
        } else {
             operation = operation.split("?")[0].toString();
             mass = URLsplitter.explodeString(mass[1].toString());
             console.log("Operation: " + operation);
             console.log("url params: ");
             for(let i = 0; i < mass.length; i++) {
                 console.log("Key: " + mass[i].key + "  Value: " + mass[i].value);
             }
             if(operation === "threads") {
                 this.getForumThreads(forumSlug, mass);
             }
             if(operation === "users") {
                 this.getUsersOfForum(forumSlug, mass);
             }
        }
    }

    getUsersOfForum(forumSlug, mmm){
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

                const q2 = new QueryMaker(pg);
                q2.makeQuery("SELECT * FROM users INNER JOIN posts ON LOWER(author) = LOWER(nickname) WHERE LOWER(forum) = LOWER('" + forumSlug + "');", objArrSecond, function(){
                    // objArrSecond.arr - arr of users

                    const q3 = new QueryMaker(pg);
                    q3.makeQuery("SELECT * FROM users INNER JOIN branches ON LOWER(authorbranchnickname) = LOWER(nickname) WHERE LOWER(forumslug) = LOWER('" + forumSlug + "');", objArrThird, function(){
                        // objArrThird.arr - arr of users

                        (function() {
                            // objArrSecond.arr - arr of users
                            // objArrThird.arr - arr of users

                            answer = [];

                            function isInAnswer(obj){
                                for(let i = 0; i < answer.length; i++){
                                    if(answer[i].nickname.toLowerCase() === obj.nickname.toLowerCase()){
                                        return true;
                                    }
                                }
                                return false;
                            }

                            for(let i = 0; i < objArrSecond.arr.length; i++){
                                const obj = objArrSecond.arr[i];
                                if(isInAnswer(obj) === false){
                                    answer.push(obj);
                                }
                            }

                            for(let i = 0; i < objArrThird.arr.length; i++){
                                const obj = objArrThird.arr[i];
                                if(isInAnswer(obj) === false){
                                    answer.push(obj);
                                }
                            }

                            let bufferAnswer = [];

                            for(let i = 0; i < answer.length; i++){
                                const obj = answer[i];

                                bufferAnswer.push({
                                    about: obj.about,
                                    email: obj.email,
                                    fullname: obj.fullname,
                                    nickname: obj.nickname,
                                    userid: obj.userid
                                });
                            }

                            answer = bufferAnswer;

                            for(let i = 0; i < answer.length; i++){
                                for(let j = 0; j < answer.length; j++){
                                    if(answer[i].nickname.toLowerCase() < answer[j].nickname.toLowerCase()){
                                        const x = answer[i];
                                        answer[i] = answer[j];
                                        answer[j] = x;
                                    }
                                }
                            }

                            if(mmm.length === 0) {
                                console.log("Result: Get users of forum OK");
                                response.status(200);
                                response.end(JSON.stringify(answer));
                            } else {

                                let sinceName = "";
                                for(let i = 0; i < mmm.length; i++) {
                                    const obj = mmm[i];
                                    if(obj.key === "since") {
                                        sinceName = obj.value.toString();
                                    }
                                }

                                if(sinceName === "") {

                                    let limit = 9999999;
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "limit") {
                                            limit = parseInt(obj.value);
                                        }
                                    }

                                    let vector = "+";
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "desc") {
                                            if(obj.value.toString() === "true") vector = "-";
                                            if(obj.value.toString() === "false") vector = "+";
                                        }
                                    }

                                    let newAnswer = [];

                                    if(vector === "+") {
                                        for(let i = 0; i < answer.length; i++) {
                                            if(newAnswer.length < limit) {
                                                newAnswer.push(answer[i]);
                                            }
                                        }
                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(newAnswer));
                                    }

                                    if(vector === "-") {
                                        for(let i = 0; i < answer.length; i++) {
                                            newAnswer.push(answer[i]);
                                        }

                                        while(newAnswer.length > limit) {
                                            newAnswer.splice(0,1);
                                        }

                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(newAnswer.reverse()));
                                    }

                                } else {

                                    sinceName = sinceName.toString().toLowerCase();
                                    console.log("sinceName: " + sinceName);

                                    let limit = 9999999;
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "limit") {
                                            limit = parseInt(obj.value);
                                        }
                                    }

                                    let vector = "+";
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "desc") {
                                            if(obj.value.toString() === "true") vector = "-";
                                            if(obj.value.toString() === "false") vector = "+";
                                        }
                                    }

                                    let newAnswer = [];

                                    if(vector === "+") {
                                        for(let i = 0; i < answer.length; i++) {
                                            if(newAnswer.length < limit) {
                                                if(answer[i].nickname.toString().toLowerCase() > sinceName.toString().toLowerCase()) newAnswer.push(answer[i]);
                                            }
                                        }
                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(newAnswer));
                                    }

                                    if(vector === "-") {
                                        console.log("Answer length: " + answer.length);
                                        for(let i = 0; i < answer.length; i++) {
                                            if(answer[i].nickname.toString().toLowerCase() < sinceName.toString().toLowerCase()) newAnswer.push(answer[i]);
                                        }

                                        newAnswer.reverse();


                                        answer = [];

                                        for(let i = 0; i < newAnswer.length; i++) {
                                            if(i < limit) {
                                                answer.push(newAnswer[i]);
                                            }
                                        }

                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(answer));
                                    }

                                }
                            }
                        }());
                    });
                });
            }
        });
    }

    getForumThreads(forumSlug, mmm){
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

        const q1 = new QueryMaker(t.pg);
        q1.makeQuery("SELECT * FROM forums where LOWER(slug) = LOWER('" + forumSlug + "');", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Forum was NOT found"
                };
                console.log("Result: Forum was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {

                let forumId = objArrFirst.arr[0].forumid;

                let queryString = "SELECT * FROM branches WHERE forumid = " + forumId + "  ";

                if(mmm.length === 0) {
                    queryString = "SELECT * FROM branches WHERE forumid = " + forumId + " ORDER BY created;";
                } else {

                    let f = false;
                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if (obj.key === "desc") {
                            if(obj.value === "true") {
                                f = true;
                            }
                        }
                    }

                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if(obj.key === "since") {
                            if(f === false) {
                                queryString += " AND cast(created as TIMESTAMPTZ) >= cast('" + obj.value + "' as TIMESTAMPTZ)  ";
                            }
                            if(f === true) {
                                queryString += " AND cast(created as TIMESTAMPTZ) <= cast('" + obj.value + "' as TIMESTAMPTZ)  ";
                            }
                        }
                    }

                    let flag = false;
                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if(obj.key === "desc") {
                            flag = true;
                            if(obj.value === "true") {
                                queryString += " ORDER BY created DESC";
                            } else {
                                queryString += " ORDER BY created ASC";
                            }
                        }
                    }
                    if(flag === false) {
                        queryString += " ORDER BY created ASC";
                    }

                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if (obj.key === "limit") {
                            queryString += " LIMIT " + obj.value + "  ";
                        }
                    }
                    queryString += " ; ";
                }

                console.log("Query:  " + queryString);

                const q2 = new QueryMaker(t.pg);
                q2.makeQuery(queryString, objArrSecond, function(){
                    let mass = objArrSecond.arr;
                    answer = [];

                    for(let i = 0; i < mass.length; i++){
                        const obj = mass[i];
                        answer.push({
                            author: obj.authorbranchnickname,
                            created: obj.created,
                            forum: obj.forumslug,
                            id: obj.branchid,
                            message: obj.message,
                            slug: obj.slug,
                            title: obj.title,
                            votes: obj.votes
                        });
                    }

                    console.log("Result: Branches of forum info OK");
                    response.status(200);
                    response.end(JSON.stringify(answer));
                });
            }
        });
    }

    getInfoAboutForum(forumSlug){
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

        const q = new QueryMaker(t.pg);
        q.makeQuery("SELECT * FROM forums where LOWER(slug) = LOWER('" + forumSlug + "');", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Forum was NOT found"
                };
                console.log("Result: Forum was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                let obj = objArrFirst.arr[0];
                answer = {
                    posts: obj.posts,
                    slug: obj.slug,
                    threads: obj.threads,
                    title: obj.title,
                    user: obj.usernickname
                };
                console.log("Result: Forum get info OK");
                response.status(200);
                response.end(JSON.stringify(answer));
            }
        });
    }
}
