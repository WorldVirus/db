"use strict";

import QueryMaker from "./QueryMaker.js";



export default class TablesCreator {
    constructor(fs, pg, foo){
        //fs.readFile("Labels", function (err, data) {
        if(true){

            // noinspection JSAnnotator
            function getString() {
                let s = " \n" +
                    "CREATE TABLE IF NOT EXISTS users (\n" +
                    "    userId SERIAL PRIMARY KEY,\n" +
                    "    about TEXT, email TEXT,\n" +
                    "    fullname TEXT,\n" +
                    "    nickname TEXT\n" +
                    ");\n" +
                    "\n" +
                    "\n" +
                    "CREATE TABLE IF NOT EXISTS forums (\n" +
                    "    forumID SERIAL PRIMARY KEY,\n" +
                    "    posts INTEGER,\n" +
                    "    slug TEXT,\n" +
                    "    threads INTEGER,\n" +
                    "    title TEXT,\n" +
                    "    userID INTEGER,\n" +
                    "    userNickname TEXT\n" +
                    ");\n" +
                    "\n" +
                    "\n" +
                    "CREATE TABLE IF NOT EXISTS branches (\n" +
                    "    branchId  INTEGER,\n" +
                    "    authorBranchId INTEGER,\n" +
                    "    authorBranchNickname TEXT,\n" +
                    "    created TIMESTAMPTZ,\n" +
                    "    forumId INTEGER,\n" +
                    "    forumSlug TEXT,\n" +
                    "    message TEXT,\n" +
                    "    slug TEXT,\n" +
                    "    title TEXT,\n" +
                    "    votes INTEGER\n" +
                    ");\n" +
                    "\n" +
                    "\n" +
                    "CREATE TABLE IF NOT EXISTS posts (\n" +
                    "    author TEXT,\n" +
                    "    created TIMESTAMPTZ,\n" +
                    "    forum TEXT,\n" +
                    "    forumId INTEGER,\n" +
                    "    idPost INTEGER,\n" +
                    "    isEdited BOOLEAN,\n" +
                    "    message TEXT,\n" +
                    "    parent INTEGER,\n" +
                    "    threadId INTEGER,\n" +
                    "    threadSlug TEXT\n" +
                    ");\n" +
                    "\n" +
                    "\n" +
                    "CREATE TABLE IF NOT EXISTS votes (\n" +
                    "    voteId SERIAL PRIMARY KEY,\n" +
                    "    nickname TEXT,\n" +
                    "    branchId INTEGER,\n" +
                    "    branchSlug TEXT,\n" +
                    "    voice INTEGER\n" +
                    ");\n" +
                    "\n";
                return s;
            }

            //const content = data.toString();
            const content =  getString();
            const q = new QueryMaker(pg);
            q.makeQuery(content, {}, function(){
                console.log("Creating tables OK \n" + "______________________________________________\n\n");

                const c1 = "  delete from branches  ;    ";
                const c2 = "  delete from forums    ;    ";
                const c3 = "  delete from posts     ;    ";
                const c4 = "  delete from users     ;    ";
                const c5 = "  delete from votes     ;    ";
                const queryString = c1 + c2 + c3 + c4 + c5;

                new QueryMaker(pg).makeQuery(queryString, {}, () => {
                    console.log("Delete old data OK \n" +  "______________________________________________\n\n");
                    foo();
                });
            });

        }  //);
    }
}
