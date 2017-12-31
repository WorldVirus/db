"use strict";

import QueryMaker from "./QueryMaker.js";

export default class PostMessageChanger {
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

        if(operation === 'details'){
            console.log("Operation: details");
            this.changePostMessageText(postId);
        }
    }

    changePostMessageText(postId){
        postId = parseInt(postId);

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

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

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

                    const oldText = objArrFirst.arr[0].message.toString();
                    let newText = oldText;

                    if(dataObject.message !== null && dataObject.message !== undefined) {
                        newText = dataObject.message.toString();
                    }

                    if(oldText === newText){
                        const obj = objArrFirst.arr[0];

                        answer = {
                            author: obj.author,
                            created: obj.created,
                            forum: obj.forum,
                            id: obj.idpost,
                            isEdited: obj.isedited,
                            message: obj.message,
                            parent: obj.parent,
                            thread: obj.threadid
                        };

                        console.log("Result: Message of post was NOT changed");
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    } else {

                        const q2 = new QueryMaker(pg);
                        q2.makeQuery("UPDATE posts SET message = '" + newText + "', isedited = true WHERE idpost = " + postId + ";", {}, function(){

                            const obj = objArrFirst.arr[0];

                            answer = {
                                author: obj.author,
                                created: obj.created,
                                forum: obj.forum,
                                id: obj.idpost,
                                isEdited: true,
                                message: newText,
                                parent: obj.parent,
                                thread: obj.threadid
                            };

                            console.log("Result: Message of post was changed OK");
                            response.status(200);
                            response.end(JSON.stringify(answer));
                        });
                    }
                }
            });
        });
    }
}

