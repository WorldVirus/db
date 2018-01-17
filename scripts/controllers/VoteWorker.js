"use strict";

import MyWriter from "../MyWriter.js";

import Help from "../Help";

export default class VoteWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;

        this.count = 0;
    }

    addVote(request, response, thread_id_slug) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();
        let ccc = Help.objArr();
        let kkk = Help.objArr();
        let xxx = Help.objArr();

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            const vote = JSON.parse(bigString);

            let thread_id = "";
            let thread_slug = "";

            let q = "  ";

            if(parseInt(thread_id_slug) + "" !== thread_id_slug + "") {
                // is is slug
                thread_slug = thread_id_slug;
                q = q + " SELECT t1, t8 FROM t WHERE LOWER(t8) = LOWER('" + thread_slug + "'); ";
            } else {
                // it is id
                thread_id = thread_id_slug;
                q = q + " SELECT t1, t8 FROM t WHERE t1 = " + thread_id + "; ";
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

                    thread_id = thread.t1;
                    thread_slug = thread.t8;

                    let nickname = vote.nickname;

                    this.queryManager.createQuery("SELECT u1, u2 FROM u WHERE LOWER(u2) = LOWER('" + nickname + "');", bbb, () => {
                        if(bbb.arr.length === 0) {
                            // user not found
                            response.status(404);
                            response.end(JSON.stringify({
                                message: "NO_USER"
                            }));
                        } else {
                            const user = bbb.arr[0];

                            let user_name = user.u2;
                            let user_id = user.u1;

                            // голосовал ли пользователь до этого
                            this.queryManager.createQuery("SELECT v1 FROM v WHERE v2 = " + user_id + " AND v3 = " + thread_id + ";", ccc, () => {
                                if(ccc.arr.length === 0) {
                                    // пользователь не голосовал
                                    this.queryManager.createQuery("INSERT INTO v (v2, v3, v4) VALUES (" + user_id + ", " + thread_id + ", " + vote.voice + ");", xxx, () => {
                                        this.queryManager.createQuery("SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t8 AS slug, t6 AS title, t9 AS votes FROM t WHERE t1 = " + thread_id + ";", kkk, () => {
                                            const answer = kkk.arr[0];
                                            response.status(200);
                                            response.end(JSON.stringify(answer));
                                        }, (err) => {
                                            MyWriter.log(err);
                                        });
                                    }, () => {});
                                } else {
                                    // пользователь уже голосовал
                                    const v1 = ccc.arr[0].v1;
                                    this.queryManager.createQuery("UPDATE v SET v4 = " + vote.voice + " WHERE v1 = " + v1 + ";", {}, () => {
                                        this.queryManager.createQuery("SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t8 AS slug, t6 AS title, t9 AS votes FROM t WHERE t1 = " + thread_id + ";", kkk, () => {
                                            const answer = kkk.arr[0];
                                            response.status(200);
                                            response.end(JSON.stringify(answer));
                                        }, () => {
                                            MyWriter.log("nnn");
                                        });
                                    }, () => {});
                                }
                            }, () => {});
                        }
                    }, () => {});
                }
            }, () => {});
        });
    }
}
