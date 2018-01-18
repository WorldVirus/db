"use strict";

import Help from "../Help";

import MyWriter from "../MyWriter.js";

export default class ForumWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    getUsersOfForum(request, response, forum_slug, dict) {
        let aaa = Help.objArr();

        this.queryManager.createQuery("SELECT f1 AS id FROM f WHERE LOWER(f3) = LOWER('" + forum_slug + "');", aaa, () => {
            if(aaa.arr.length === 0) {
                // forum not found
                response.status(404);
                response.end(JSON.stringify({
                    message: "NO"
                }));
            } else {
                const forum_id = aaa.arr[0].id;
                let bbb = Help.objArr();

                let query = "  SELECT u1, u2 AS nickname, u3 AS fullname, u4 AS email, u5 AS about FROM u INNER JOIN fp on (fp_1 = u1) WHERE fp_2 = " + forum_id + "   ";

                let sort = "+";
                if(Help.exists(dict["desc"]) === true) {
                    if(dict["desc"] === "true") sort = "-";
                    if(dict["desc"] === "false") sort = "+";
                }

                if(Help.exists(dict["since"]) === true) {
                    const since = dict["since"] + "";
                    if(sort === "+") query = query + "  AND LOWER(u2) > LOWER('" + since + "')   ";
                    if(sort === "-") query = query + "  AND LOWER(u2) < LOWER('" + since + "')   ";
                }

                if(sort === "+") query = query + "  ORDER BY LOWER(u2)  ASC   ";
                if(sort === "-") query = query + "  ORDER BY LOWER(u2)  DESC  ";

                if(Help.exists(dict["limit"]) === true) {
                    query = query + "  LIMIT  " + dict["limit"] + "  ";
                }

                query += " ; ";

                this.queryManager.createQuery(query, bbb, () => {
                    response.status(200);
                    response.end(JSON.stringify(bbb.arr));
                }, (e) => {
                    //console.log("GET users ERROR:");
                    //console.log(e);
                });
            }
        }, () => {});
    }

    getForumInfo(request, response, slug) {
        let aaa = Help.objArr();
        this.queryManager.createQuery("SELECT f2 AS posts, f3 AS slug, f5 AS threads, f4 AS title, f6 AS user FROM f WHERE LOWER(f3) = LOWER('" + slug + "');", aaa, () => {
            if(aaa.arr.length === 0) {
                response.status(404);
                response.end(JSON.stringify({
                    message: "NO"
                }));
            } else {
                const answer = aaa.arr[0];
                response.status(200);
                response.end(JSON.stringify(answer));
            }
        }, () => {});
    }

    addForum(request, response) {
        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            let forum = JSON.parse(bigString);
            let q1 = "WITH uuu AS ( SELECT u1, u2 FROM u WHERE LOWER(u2) = LOWER('" + forum.user + "') ) ";
            q1 = q1 + " INSERT INTO f (f3 , f7 , f6 , f4)  ";
            q1 = q1 + " VALUES ('" + forum.slug + "', (SELECT u1 FROM uuu), (SELECT u2 FROM uuu), '" + forum.title + "') RETURNING ";
            q1 = q1 + " f2 AS posts, f3 AS slug, f5 AS threads, f4 AS title, f6 AS user ; ";
            let aaa = Help.objArr();
            let bbb = Help.objArr();
            this.queryManager.createQuery(q1, aaa, () => {
                let answer = aaa.arr[0];
                response.status(201);
                response.end(JSON.stringify(answer));
            }, (err) => {
                // forum is exists
                if(parseInt(err.code) === 23505) {
                    this.queryManager.createQuery("SELECT f2 AS posts, f3 AS slug, f5 AS threads, f4 AS title, f6 AS user FROM f WHERE LOWER(f3) = LOWER('" + forum.slug + "')", bbb, () => {
                        const answer = bbb.arr[0];
                        response.status(409);
                        response.end(JSON.stringify(answer));
                    }, () => {});
                }
                // user not found
                if(parseInt(err.code) === 23502) {
                    response.status(404);
                    response.end(JSON.stringify({
                        message: "NO"
                    }));
                }
            });
        });
    }
}
