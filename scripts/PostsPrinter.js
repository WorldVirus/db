"use strict";


import Help from "./Help";
import NumberController from "./NumberController";

export default class PostsPrinter {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    printPosts(request, response, thread_id_slug, dict) {
        let aaa = Help.objArr();

        let thread_id = "";
        let thread_slug = "";

        let q = " ";

        if(NumberController.isNumber(thread_id_slug) === false) {
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

                let sort = "flat";
                if(Help.exists(dict["sort"]) === true) {
                    sort = dict["sort"];
                }

                if(sort === "flat") {
                    this.flatSort(request, response, thread_id, dict);
                }

                if(sort === "tree") {
                    this.treeSort(request, response, thread_id, dict);
                }

                if(sort === "parent_tree") {
                    this.parentTreeSort(request, response, thread_id, dict);
                }
            }
        }, () => {});
    }


    parentTreeSort(request, response, thread_id, dict) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();
        let ccc = Help.objArr();

        let sort = "+";
        if(Help.exists(dict["desc"]) === true) {
            if(dict["desc"] === "true") sort = "-";
            if(dict["desc"] === "false") sort = "+";
        }

        let since = null;
        if(Help.exists(dict["since"]) === true) {
            since = dict["since"];
        }

        let query = "  ";

        query = query + " WITH roots AS ( ";
        query = query + " SELECT p1 FROM p ";
        query = query + " WHERE p4 = " + thread_id + " AND p7 = 0 ";

        if(since !== null) {
            if(sort === "+") query = query + " AND p12 > (SELECT p12 FROM p WHERE p1 = " + since + ") ";
            if(sort === "-") query = query + " AND p12 < (SELECT p12 FROM p WHERE p1 = " + since + ") ";
        }

        if(sort === "+") query = query + "  ORDER BY p1 ASC   ";
        if(sort === "-") query = query + "  ORDER BY p1 DESC  ";

        if(Help.exists(dict["limit"]) === true) {
            const limit = dict["limit"];
            query = query + " LIMIT " + limit + "  ";
        }

        query = query + " ) ";

        query = query + " SELECT p.p1 AS id, p2 AS author, p10 AS created, p6 AS forum, p11 AS isEdited, p9 AS message, p7 AS parent, p4 AS thread FROM p JOIN roots ON roots.p1 = p.p8 ";

        if(sort === "+") query = query + " ORDER BY p.p12 ASC   ";
        if(sort === "-") query = query + " ORDER BY p.p12 DESC   ";

        query += " ; ";

        this.queryManager.createQuery(query, aaa, () => {
            let answer = aaa.arr;
            MyWriter.log(answer);
            response.status(200);
            response.end(JSON.stringify(answer));
        }, (e) => {
            MyWriter.log("XXXXXXXXXX");
            MyWriter.log(e);
        })
    }

    treeSort(request, response, thread_id, dict) {
        let aaa = Help.objArr();
        let bbb = Help.objArr();
        let ccc = Help.objArr();

        let query = " SELECT p2 AS author, p10 AS created, p6 AS forum, p1 AS id, p11 AS isEdited, p9 AS message, p7 AS parent, p4 AS thread FROM p WHERE p4 = " + thread_id + "  ";

        let sort = "+";
        if(Help.exists(dict["desc"]) === true) {
            if(dict["desc"] === "true") sort = "-";
            if(dict["desc"] === "false") sort = "+";
        }

        let since = null;
        if(Help.exists(dict["since"]) === true) {
            since = dict["since"];
        }

        if(since !== null) {
            if (sort === "+") query = query + " AND p.p12 > (SELECT p12 FROM p WHERE p1 = " + since + ") ";
            if (sort === "-") query = query + " AND p.p12 < (SELECT p12 FROM p WHERE p1 = " + since + ") ";
        }

        if(sort === "+") query = query + " ORDER BY p.p12 ASC    ";
        if(sort === "-") query = query + " ORDER BY p.p12 DESC   ";

        if(Help.exists(dict["limit"]) === true) {
            query = query + " LIMIT " + dict["limit"] + " ";
        }

        query += " ; ";
        MyWriter.log(query);

        this.queryManager.createQuery(query, aaa, () => {
            let answer = aaa.arr;
            MyWriter.log("Array_len: " + answer.length);
            response.status(200);
            response.end(JSON.stringify(answer));
        }, (e) => {
            MyWriter.log("EEEEEEEE");
            MyWriter.log(e);
        });

    }

    flatSort(request, response, thread_id, dict) {
        let query = "  SELECT p2 AS author, p10 AS created, p6 AS forum, p1 AS id, p11 AS isEdited, p9 AS message, p7 AS parent, p4 AS thread FROM p WHERE p4 = " + thread_id + "    ";

        let sort = "+";
        if(Help.exists(dict["desc"]) === true) {
            if(dict["desc"] === "true") sort = "-";
            if(dict["desc"] === "false") sort = "+";
        }

        if(Help.exists(dict["since"]) === true) {
            if(sort === "+") query = query + "  AND p1 > " + dict["since"] + "  ";
            if(sort === '-') query = query + "  AND p1 < " + dict["since"] + "  ";
        }

        if(sort === "+") query += "  ORDER BY p1 ASC   ";
        if(sort === "-") query += "  ORDER BY p1 DESC  ";

        if(Help.exists(dict["limit"]) === true) {
            query = query + " LIMIT " +  dict["limit"] + " ";
        }

        query = query + " ; ";

        MyWriter.log(query);

        let aaa = Help.objArr();
        this.queryManager.createQuery(query, aaa, () => {
            let answer = aaa.arr;
            response.status(200);
            response.end(JSON.stringify(answer));
        }, (e) => {
            MyWriter.log(e);
        });
    }
}
