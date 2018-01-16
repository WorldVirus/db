"use strict";

import MyWriter from "../MyWriter.js";

import NumberController from "../NumberController";
import Help from "../Help";

export default class PostWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;

        this.count = 2;
    }

    changePostMessage(request, response, post_id) {
        let aaa = Help.objArr();

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            let dataObj = JSON.parse(bigString);
            const newMessage = dataObj.message;

            this.queryManager.createQuery("SELECT p2 AS author, p10 AS created, p6 AS forum, p1 AS id, p11 AS is___edited, p9 AS message, p4 AS thread FROM p WHERE p1 = " + post_id + ";", aaa, () => {
                if (aaa.arr.length === 0) {
                    // post not exists
                    response.status(404);
                    response.end(JSON.stringify({
                        message: "NO"
                    }));
                } else {
                    let post = aaa.arr[0];

                    const oldMessage = post.message + "";

                    MyWriter.log("---------------------------------------");
                    MyWriter.log("OLD message");
                    MyWriter.log(oldMessage);
                    MyWriter.log("---------------------------------------");
                    MyWriter.log("NEW message");
                    MyWriter.log(newMessage);
                    MyWriter.log("---------------------------------------");

                    let resultString = oldMessage;
                    let changed = false;

                    if(newMessage !== null && newMessage !== undefined && newMessage !== oldMessage) {
                        resultString = newMessage + "";
                        changed = true;
                    }

                    if(changed === false) {
                        // no changes is message
                        post.isEdited = post.is___edited;
                        response.status(200);
                        response.end(JSON.stringify(post));
                        MyWriter.log("___NO___CHANGES____");
                    } else {
                        // change message OK
                        this.queryManager.createQuery("UPDATE p SET p9 = '" + resultString + "', p11 = True WHERE p1 = " + post.id + ";", {}, () => {
                            post.isEdited = true;
                            post.message = resultString;
                            response.status(200);
                            response.end(JSON.stringify(post));
                            MyWriter.log("___YES___CHANGES____");
                        }, (e) => {
                            MyWriter.log("_______UPDATING__POST__MESSAGE___ERROR___");
                        });
                    }
                }
            }, () => {});
        });
    }

    getPostDetails(request, response, post_id, dict) {
        let aaa = Help.objArr();

        let bbb = Help.objArr();
        let ccc = Help.objArr();
        let kkk = Help.objArr();

        this.queryManager.createQuery("SELECT p3 AS author_id, p5 AS forum_id, p2 AS author, p10 AS created, p6 AS forum, p1 AS id, p11 AS is____edited, p9 AS message, p7 AS parent, p4 AS thread FROM p WHERE p1 = " + post_id + ";", aaa, () => {
            if(aaa.arr.length === 0) {
                // post not exists
                response.status(404);
                response.end(JSON.stringify({
                    message: "NO"
                }));
            } else {
                const post = aaa.arr[0];
                post.isEdited = post.is____edited;

                const user_id = post.author_id;
                const forum_id = post.forum_id;
                const thread_id = post.thread;

                this.queryManager.createQuery("SELECT u2 AS nickname, u3 AS fullname, u4 AS email, u5 AS about FROM u WHERE u1 = " + user_id + " ;", bbb, () => {
                    this.queryManager.createQuery("SELECT f2 AS posts, f3 AS slug, f5 AS threads, f4 AS title, f6 AS user FROM f WHERE f1 = " + forum_id + " ;", ccc, () => {
                        this.queryManager.createQuery("SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t6 AS title, t9 AS votes, t8 AS slug_chern FROM t WHERE t1 = " + thread_id + " ;", kkk, () => {
                            const user = bbb.arr[0];
                            const forum = ccc.arr[0];
                            const thread = kkk.arr[0];

                            if(NumberController.isNumber(thread.slug_chern) === false) {
                                thread.slug = thread.slug_chern;
                            }

                            let answer = {};
                            answer.post = post;

                            if(Help.exists(dict["related"]) === true) {
                                const content = dict["related"];
                                const mass = content.split(",");

                                if(mass.indexOf("forum") !== -1) answer.forum = forum;
                                if(mass.indexOf("thread") !== -1) answer.thread = thread;
                                if(mass.indexOf("user") !== -1) answer.author = user;
                            }

                            response.status(200);
                            response.end(JSON.stringify(answer));
                        }, () => {});
                    }, () => {});
                }, () => {});
            }
        }, () => {});
    }

    addPostsArray(request, response, thread_id_slug) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();
        let ccc = Help.objArr();
        let kkk = Help.objArr();

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            const created = new Date().toISOString();
            const postArray = JSON.parse(bigString);

            MyWriter.log("-------------------------------------------------------");
            MyWriter.log("POSTS number start: " + postArray.length);
            MyWriter.log("-------------------------------------------------------");

            let thread_id = "";
            let thread_slug = "";

            let q = " ";

            if(NumberController.isNumber(thread_id_slug) === false) {
                // is is slug
                thread_slug = thread_id_slug;
                q = q + " SELECT t1, t8, t4, t5 FROM t WHERE LOWER(t8) = LOWER('" + thread_slug + "'); ";
            } else {
                // it is id
                thread_id = thread_id_slug;
                q = q + " SELECT t1, t8, t4, t5 FROM t WHERE t1 = " + thread_id + "; ";
            }

            this.queryManager.createQuery(q, aaa, () => {
                if(aaa.arr.length === 0) {
                    // ветка не найдена
                    response.status(404);
                    response.end(JSON.stringify({
                        message: "NO"
                    }));
                } else {
                    const thread = aaa.arr[0];

                    let parentsDB = [];

                    thread_id = thread.t1;
                    thread_slug = thread.t8;
                    const forum_id = thread.t5;
                    const forum_slug = thread.t4;

                    if(postArray.length === 0) {
                        // передан пустой массив
                        response.status(201);
                        response.end(JSON.stringify( [] ));
                    } else {

                        let parentsArray = [];

                        for(let i = 0; i < postArray.length; i++) {
                            let parent = postArray[i].parent;
                            if(parent === null || parent === undefined) parent = 0;
                            postArray[i].parent = parent;
                            parentsArray.push(parent);
                        }

                        let s = parentsArray.join(" , ");
                        s = " ( " + s + " ) ";

                        let q1 = " SELECT p1,p8,p12 FROM p WHERE p5 = " + forum_id + " AND p1 IN " + s + "  ";
                        let q2 = " SELECT p1,p8,p12 FROM p WHERE p5 = " + forum_id + " AND p1 IN " + s + "  ";
                        let q3 = q1 + " UNION " + q2 + " ; ";

                        this.queryManager.createQuery(q3, bbb, () => {
                            parentsDB = bbb.arr;

                            let ok = true;

                            for(let i = 0; (i < postArray.length) && ok === true; i++) {
                               let postParrent = postArray[i].parent;
                               let find = false;

                               if(postParrent === 0) {
                                   find = true;
                               } else {
                                   for (let j = 0; j < parentsDB.length; j++) {
                                       let post_id = parentsDB[j].p1;
                                       if (postParrent === post_id) {
                                           find = true;
                                           break;
                                       }
                                   }
                               }

                               if(find === false) {
                                   ok = false;
                                   break;
                               }
                            }

                            if(ok === false) {
                                // parent post not exists
                                response.status(409);
                                response.end(JSON.stringify( {
                                    message: "NO_PARENT"
                                } ));
                            } else {
                                // all parents ok

                                // try to control users
                                let usersArray = [];
                                for(let i = 0; i < postArray.length; i++) {
                                    const author = postArray[i].author;
                                    usersArray.push(" LOWER('" + author + "') ");
                                }

                                s = usersArray.join(" , ");
                                s = " ( " + s + " ) ";

                                this.queryManager.createQuery("SELECT u2, u1 FROM u WHERE LOWER(u2) IN " + s + " ; ", ccc, () => {
                                    let usersDB = ccc.arr;

                                    let okok = true;

                                    for(let i = 0; (i < postArray.length) && okok === true; i++) {
                                        const userNickname = postArray[i].author.toLowerCase();
                                        let find = false;

                                        for(let j = 0; j < usersDB.length; j++) {
                                            const u2 =  usersDB[j].u2.toLowerCase();
                                            if(userNickname === u2) {
                                                find = true;
                                                postArray[i].author_id = usersDB[j].u1;
                                                postArray[i].author = usersDB[j].u2;
                                                break;
                                            }
                                        }

                                        if(find === false) {
                                            okok = false;
                                            break;
                                        }
                                    }

                                    if(okok === false) {
                                        // no correct user
                                        response.status(404);
                                        response.end(JSON.stringify( {
                                            message: "NO_USER"
                                        } ));
                                    } else {

                                        let queryAdding = "  ";

                                        let n = 0;

                                        // noinspection JSAnnotator
                                        function copyArray(answer, arr) {
                                            for(let i = 0; i < arr.length; i++) {
                                                answer.push(arr[i]);
                                            }
                                        }


                                                // adding posts
                                                for(let i = 0; i < postArray.length; i++) {

                                                    this.count++;
                                                    postArray[i].id = this.count;

                                                    let find = false;
                                                    for(let j = 0; j < parentsDB.length; j++) {
                                                        if(postArray[i].parent === parentsDB[j].p1) {
                                                            postArray[i].root = 0;
                                                            const mmm = parentsDB[j].p12;

                                                            postArray[i].path = [];
                                                            // copy arrays
                                                            copyArray(postArray[i].path, mmm);
                                                            postArray[i].path.push(postArray[i].id);

                                                            find = true;
                                                            break;
                                                        }
                                                    }

                                                    if(find === false || postArray[i].parent === 0) {
                                                        postArray[i].root = postArray[i].id;
                                                        postArray[i].path = " ARRAY [ " + postArray[i].id + " ] ";
                                                    } else {
                                                        postArray[i].root = postArray[i].path[0];
                                                        postArray[i].path = "ARRAY [ " +  postArray[i].path.join(" , ") + " ] ";
                                                    }

                                                    postArray[i].path = "" + postArray[i].path;
                                                    //MyWriter.log(postArray[i].path);


                                                    let h = " ";
                                                    h = h + "INSERT INTO p (p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12) ";
                                                    h = h + " VALUES (" + postArray[i].id + ", '" + postArray[i].author + "', " + postArray[i].author_id + ", " + thread_id + ", " + forum_id + ", '" + forum_slug + "', " + postArray[i].parent + ", " + postArray[i].root + ", '" + postArray[i].message + "', '" + created + "', " + "False" + ", " + postArray[i].path + ");  ";
                                                    n++;
                                                    queryAdding += h;
                                                }

                                                this.queryManager.createQuery(queryAdding, kkk, () => {
                                                    // add all posts ok
                                                    let answer = [];

                                                    for(let i = 0; i < postArray.length; i++) {
                                                        const obj = postArray[i];

                                                        answer.push({
                                                            user_id: obj.author_id,
                                                            author: obj.author,
                                                            created: created,
                                                            forum: forum_slug,
                                                            id: obj.id,
                                                            isEdited: false,
                                                            message: obj.message,
                                                            parent: obj.parent,
                                                            thread: thread_id,
                                                            path: obj.path,
                                                            root: obj.root
                                                        });
                                                    }

                                                    //MyWriter.log("-------------------------------------------------------");
                                                    //MyWriter.log("POSTS number finish: " + n);
                                                    //MyWriter.log("-------------------------------------------------------");

                                                    this.queryManager.createQuery("UPDATE f SET f2 = f2 + " + postArray.length + " WHERE f1 = " + forum_id + ";", {}, () => {

                                                        // registrate users_id and forum_id in fp table

                                                        let registString = "  ";

                                                        for(let i = 0; i < answer.length; i++) {
                                                            const z = "  INSERT INTO fp (fp_1, fp_2) VALUES(" + answer[i].user_id + ", " + forum_id + ") ON CONFLICT DO NOTHING;  ";
                                                            registString += z;
                                                            //MyWriter.log(z);
                                                        }

                                                        this.queryManager.createQuery(registString, {}, () => {
                                                            response.status(201);
                                                            response.end(JSON.stringify(answer));
                                                        }, (eee) => {
                                                            MyWriter.log("________FP____fp_1___fp_2_____ERROR___");
                                                            MyWriter.log(eee);
                                                        });

                                                    }, (e) => {
                                                        MyWriter.log("__UPDATE__FORUM___ERROR___");
                                                        MyWriter.log(e);
                                                    });
                                                }, (err) => {
                                                    MyWriter.log("X_1");
                                                    MyWriter.log(err);
                                                });
                                    }
                                }, () => {
                                    MyWriter.log("X_2");
                                });
                            }
                        }, () => {
                            MyWriter.log("X_3");
                        });
                    }
                }

            }, () => {
                MyWriter.log("X_4");
            });
        });
    }
}
