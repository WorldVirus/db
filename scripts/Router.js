"use strict";

import UserWorker from "./UserWorker.js";
import UserInfo from "./UserInfo.js";
import ForumCreator from "./ForumCreator.js";
import ForumInfo from "./ForumInfo.js";
import PostCreator from "./PostCreator.js";
import PostInfo from "./PostInfo.js";
import PostMessageChanger from "./PostMessageChanger.js";
import VoteAdder from "./VoteAdder.js";
import PostsOfThreadGetter from "./PostsOfThreadGetter.js";
import BranchUpdater from "./BranchUpdater.js";
import BranchInfo from "./BranchInfo";
import DBinfoGetter from "./DBinfoGetter";
import DBdropper from "./DBdropper";

export default class Router {
    constructor(app, pg, fs) {
        const t = this;

        app.post('/*', function(request, response) {
            let url = request.url;

            let mmm = [];
            mmm = url.split("/");
            mmm.splice(1,1);
            let newURL = mmm.join("/");
            console.log(newURL);
            request.url = "/" + newURL;
            url = "/" + newURL;
            if(url.length >= 2) {
                if(url.charAt(0) === "/" && url.charAt(1) === "/") {
                    let vvv = url.split("");
                    vvv[0] = "";
                    url = vvv.join("");
                    request.url = url;
                }
            }
            console.log(request.url);

            console.log("___________________________________");
            console.log("POST");
            console.log("URL: " + url);
            const type = Router.getQueryType(url);
            console.log("Type: " + type);

            let mass = [];
            mass = url.split("/");

            if(type === 'user'){
                new UserWorker(app, pg, request, response);
            } else if(type === 'forum'){
                new ForumCreator(app, pg, request, response);
            } else if(type === 'thread'){
                if(mass[3] === 'vote'){
                    new VoteAdder(app, pg, request, response);
                } else {
                    if(mass[3] === 'details'){
                        new BranchUpdater(app, pg, request, response);
                    } else {
                        new PostCreator(app, pg, request, response);
                    }
                }
            } else if(type === 'post'){
                new PostMessageChanger(app, pg, request, response);
            } else if(type === 'service'){
                new DBdropper(app, pg, request, response, fs);
            } else {
                console.log("HELLO");
                response.end("HELLO");
            }

        });

        app.get('/*', function(request, response) {
            let url = request.url;

            let mmm = [];
            mmm = url.split("/");
            mmm.splice(1,1);
            let newURL = mmm.join("/");
            console.log(newURL);
            request.url = "/" + newURL;
            url = "/" + newURL;
            if(url.length >= 2) {
                if(url.charAt(0) === "/" && url.charAt(1) === "/") {
                    let vvv = url.split("");
                    vvv[0] = "";
                    url = vvv.join("");
                    request.url = url;
                }
            }
            console.log(request.url);

            console.log("___________________________________");
            console.log("GET");
            console.log("URL: " + url);
            const type = Router.getQueryType(url);
            console.log("Type: " + type);

            let mass = [];
            mass = url.split("/");

            if(type === 'user'){
                new UserInfo(app, pg, request, response);
            } else if(type === 'forum'){
                new ForumInfo(app, pg, request, response);
            } else if(type === 'post'){
                new PostInfo(app, pg, request, response);
            } else if(type === 'thread'){
                if(mass[3] === 'details'){
                    new BranchInfo(app, pg, request, response);
                } else {
                    new PostsOfThreadGetter(app, pg, request, response);
                }
            } else if(type === 'service'){
                new DBinfoGetter(app, pg, request, response);
            } else {
                console.log("HELLO");
                response.end("HELLO");
            }
        });
    }

    static getQueryType(url){
        let arr = [];
        arr = url.split("/");
        return arr[1].toString();
    }
}

