"use strict";

import MyWriter from "../MyWriter.js";

import Help from "../Help";

export default class ThreadWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    changeThreadInfo(request, response, thread_id_slug) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();

        let thread_id = "";
        let thread_slug = "";

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            const dataObject = JSON.parse(bigString);

            let q = " ";

            if (parseInt(thread_id_slug) + "" !== thread_id_slug + "") {
                // is is slug
                thread_slug = thread_id_slug;
                q = " SELECT   t1 AS id   FROM t WHERE LOWER(t8) = LOWER('" + thread_slug + "');";
            } else {
                // it is id
                thread_id = thread_id_slug;
                q = " SELECT   t1 AS id   FROM t WHERE t1 = " + thread_id + " ; ";
            }

                this.queryManager.createQuery(q, aaa, () => {
                    if (aaa.arr.length === 0) {
                        // branch not found
                        response.status(404);
                        response.end(JSON.stringify({
                            message: "NO"
                        }));
                    } else {
                        const branchObject = aaa.arr[0];
                        const branch_id = branchObject.id;

                        // noinspection JSAnnotator
                        function isNormal(x) {
                            if(x === undefined) return false;
                            if(x === null) return false;
                            return true;
                        }

                        let message = undefined;
                        let title = undefined;

                        if(isNormal(dataObject.message) === true) message = dataObject.message + "";
                        if(isNormal(dataObject.title) === true) title = dataObject.title + "";

                        let bigQuery = " ";

                        if(message !== undefined) {
                            bigQuery = bigQuery + "  UPDATE t SET t7 = '" + message + "' WHERE t1 = " + branch_id + " ;  ";
                        }

                        if(title !== undefined) {
                            bigQuery = bigQuery + "  UPDATE t SET t6 = '" + title + "'  WHERE t1 = " + branch_id + " ;  ";
                        }

                        bigQuery = bigQuery + " ; ";

                        this.queryManager.createQuery(bigQuery, {}, () => {

                            let qq = " SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t6 AS title, t9 AS votes, t8 AS slug_chern FROM t WHERE t1 = " + branch_id + "; ";

                            this.queryManager.createQuery(qq, bbb, () => {
                                const answer = bbb.arr[0];
                                if(parseInt(answer.slug_chern) + "" !== answer.slug_chern + "") {
                                    answer.slug = answer.slug_chern;
                                }
                                response.status(200);
                                response.end(JSON.stringify(answer));

                            }, () => {
                                MyWriter.log("ERROR_1");
                            });
                        }, () => {
                            MyWriter.log("__UPDATING_ERROR___");
                        })
                    }
                }, () => {
                    MyWriter.log("ERROR_3");
                });
        });
    }

    getThreadInfo(request, response, thread_id_slug) {
        let aaa = Help.objArr();

        let thread_id = "";
        let thread_slug = "";

        let q = " ";

        if(parseInt(thread_id_slug) + "" !== thread_id_slug) {
            // is is slug
            thread_slug = thread_id_slug;
            q = q + " SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t6 AS title, t9 AS votes, t8 AS slug_chern FROM t WHERE LOWER(t8) = LOWER('" + thread_slug + "'); ";
        } else {
            // it is id
            thread_id = thread_id_slug;
            q = q + " SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t6 AS title, t9 AS votes, t8 AS slug_chern FROM t WHERE t1 = " + thread_id + "; ";
        }

        this.queryManager.createQuery(q, aaa, () => {
            if(aaa.arr.length > 0) {
                const answer = aaa.arr[0];
                if(parseInt(answer.slug_chern) + "" !== answer.slug_chern + "") {
                    answer.slug = answer.slug_chern;
                }
                response.status(200);
                response.end(JSON.stringify(answer));
            } else {
                response.status(404);
                response.end(JSON.stringify({
                    message: "NO"
                }));
            }
        }, () => {});
    }

    addThread(request, response, forum_slug) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();
        let ccc = Help.objArr();
        let eee = Help.objArr();

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            const thread = JSON.parse(bigString);

            if(thread.created === null || thread.created === undefined) {
                thread.created = new Date().toISOString() + "";
            }

            let nickname = thread.author;
            this.queryManager.createQuery("SELECT u1, u2 FROM u WHERE LOWER(u2) = LOWER('" + nickname + "');", aaa, () => {
                if(aaa.arr.length === 0) {
                    // user not found
                    response.status(404);
                    response.end(JSON.stringify({
                        message: "NO"
                    }));
                    MyWriter.log("P_1");
                } else {
                    const user = aaa.arr[0];
                    const user_id = user.u1;
                    nickname = user.u2;

                    this.queryManager.createQuery("SELECT f3, f1 FROM f WHERE LOWER(f3) = LOWER('" + forum_slug + "');", bbb, () => {
                        if(bbb.arr.length === 0) {
                            // forum not found
                            response.status(404);
                            response.end(JSON.stringify({
                                message: "NO"
                            }));
                            MyWriter.log("P_2");
                        } else {
                            const forum = bbb.arr[0];
                            const forum_id = forum.f1;
                            forum_slug = forum.f3;

                            let q1 = " ";

                            if (thread.slug !== null && thread.slug !== undefined) {
                                q1 = q1 + " INSERT INTO t (t2, t3, t4, t5, t6, t10, t7, t8) ";
                                q1 = q1 + " VALUES ('" + nickname + "', " + user_id + ", '" + forum_slug + "', " + forum_id + ", '" + thread.title + "', '" + thread.created + "', '" + thread.message + "', '" + thread.slug + "') RETURNING ";
                            } else {
                                    q1 = q1 + " INSERT INTO t (t2, t3, t4, t5, t6, t10, t7) ";
                                    q1 = q1 + " VALUES ('" + nickname + "', " + user_id + ", '" + forum_slug + "', " + forum_id + ", '" + thread.title + "', '" + thread.created + "', '" + thread.message + "') RETURNING ";
                                }

                            q1 = q1 + " t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t8 AS slug, t6 AS title, t9 AS votes ;";

                            this.queryManager.createQuery(q1, ccc, () => {
                                // result thread for answer
                                const answer = ccc.arr[0];

                                // registrate pair: forum, user
                                this.queryManager.createQuery("INSERT INTO fp (fp_1, fp_2) VALUES (" + user_id + ", " + forum_id + ");", {} , () => {
                                    response.status(201);
                                    response.end(JSON.stringify(answer));
                                    MyWriter.log("P_3");
                                }, () => {
                                    response.status(201);
                                    response.end(JSON.stringify(answer));
                                    MyWriter.log("P_4");
                                });
                            }, (err) => {
                                MyWriter.log(err);
                                // branch is already exists
                                this.queryManager.createQuery("SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t8 AS slug, t6 AS title, t9 AS votes FROM t WHERE LOWER(t8) = LOWER('" + thread.slug + "');", eee, () => {
                                    MyWriter.log("thread.slug: " + thread.slug);
                                    const answer = eee.arr[0];
                                    MyWriter.log(answer);
                                    response.status(409);
                                    response.end(JSON.stringify(answer));
                                    MyWriter.log("P_5");
                                }, () => {
                                    MyWriter.log("P_6");
                                });
                            });
                        }
                    }, () => {});
                }
            }, () => {});
        });
    }

    getThreadsOfForum(request, response, forum_slug, dict) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();

        this.queryManager.createQuery("SELECT f1 FROM f WHERE LOWER(f3) = LOWER('" + forum_slug + "');", aaa, () => {
            if(aaa.arr.length === 0) {
                // forum not found
                response.status(404);
                response.end(JSON.stringify({
                    message: "NO"
                }));
            } else {
                const forum = aaa.arr[0];
                const forum_id = forum.f1;

                let q = " SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t8 AS slug, t6 AS title, t9 AS votes from t  ";
                q = q + " WHERE t5 = " + forum_id + "  ";

                let sort = '+';
                if(Help.exists(dict['desc']) === true) {
                    if(dict['desc'] === "true") sort = '-';
                    if(dict['desc'] === "false") sort = '+';
                }

                let since = null;
                if(Help.exists(dict["since"]) === true) {
                    since = dict["since"] + "";
                    MyWriter.log("SINCE: " + since);
                }

                if(since !== null) {
                   if(sort === "+") q = q + "  AND  t10 >= '" + since + "' ";
                   if(sort === "-") q = q + "  AND  t10 <= '" + since + "' ";
                }

                if(sort === "+")  q = q + " ORDER BY t10 ASC    ";
                if(sort === "-")  q = q + " ORDER BY t10  DESC   ";

                if(Help.exists(dict["limit"]) === true) {
                   q = q + " LIMIT  " + dict["limit"] + " ";
                }

                q = q + " ; ";

                this.queryManager.createQuery(q, bbb, () => {
                    response.status(200);
                    response.end(JSON.stringify(bbb.arr));
                }, (err) => {
                    MyWriter.log(err);
                });
            }
        }, () => {});
    }
}
