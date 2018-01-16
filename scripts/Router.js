"use strict";

import MyWriter from "./MyWriter.js";

import QueryManager from "./QueryManager";
import DBiniter from "./DBiniter";
import UserWorker from "./UserWorker";
import ForumWorker from "./ForumWorker";
import ThreadWorker from "./ThreadWorker";
import Dictionary from "./Dictionary";
import PostWorker from "./PostWorker";
import VoteWorker from "./VoteWorker";
import PostsPrinter from "./PostsPrinter";
import ServiceWorker from "./ServiceWorker";

export default class Router {
    constructor(app, pg, fs) {
        this.number = 0;
        this.app = app;
        this.pg = pg;
        this.fs = fs;

        this.databaseCreated = false;

        this.queryManager = new QueryManager(this.app, this.pg, this.fs);

        this.userWorker = new UserWorker(this.app, this.pg, this.fs, this.queryManager);
        this.forumWorker = new ForumWorker(this.app, this.pg, this.fs, this.queryManager);
        this.threadWorker = new ThreadWorker(this.app, this.pg, this.fs, this.queryManager);
        this.postWorker = new PostWorker(this.app, this.pg, this.fs, this.queryManager);
        this.voteWorker = new VoteWorker(this.app, this.pg, this.fs, this.queryManager);
        this.postsPrinter = new PostsPrinter(this.app, this.pg, this.fs, this.queryManager);
        this.serviceWorker = new ServiceWorker(this.app, this.pg, this.fs, this.queryManager)
    }

    addQuery(type, request, response) {
        //////////////////////////////////////////////////////////

        /***************************************************/

        // modify url
        request.url = request.url.substring(4, request.url.length);
        if(request.url === "") request.url = "/";

        /***************************************************/

        const parts = (request.url + "").split("?");

        const url = parts[0] + "";
        let mass = url.split("/");

        let tail = "";
        if(parts.length > 1) {
            tail = parts[1] + "";
        }

        ///////////////////////////////////////////////////////////

        if(type === "GET") {
            if(url === "/") {
                if(this.databaseCreated === false) {
                    this.databaseCreated = true;
                    new DBiniter(this.app, this.pg, this.fs, this.queryManager, () => {
                       response.status(200);
                       response.end("HELLO");
                       return;
                    });
                } else {
                    response.status(200);
                    response.end("HELLO");
                    return;
                }
            }

            if(mass[1] === "user") {
                if(mass[3] === "profile") {
                    const nickname = mass[2];
                    this.userWorker.getUserInfo(request, response, nickname);
                    return;
                }
            }

            if(mass[1] === "forum") {
                if(mass[3] === "details") {
                    const slug = mass[2];
                    this.forumWorker.getForumInfo(request, response, slug);
                    return;
                }
            }

            if(mass[1] === "forum") {
                if(mass[3] === "threads") {
                    const forum_slug = mass[2];
                    const dict = new Dictionary(tail).getDictionary();
                    this.threadWorker.getThreadsOfForum(request, response, forum_slug, dict);
                    return;
                }
            }

            if(mass[1] === "thread") {
                if(mass[3] === "details") {
                    const thread_slug_id = mass[2];
                    this.threadWorker.getThreadInfo(request, response, thread_slug_id);
                    return;
                }
            }

            if(mass[1] === "thread") {
                if(mass[3] === "posts") {
                    const thread_id_slug = mass[2];
                    const dict = new Dictionary(tail).getDictionary();
                    this.postsPrinter.printPosts(request, response, thread_id_slug, dict);
                    return;
                }
            }

            if(mass[1] === "forum") {
                if(mass[3] === "users") {
                    const forum_slug = mass[2];
                    const dict = new Dictionary(tail).getDictionary();
                    this.forumWorker.getUsersOfForum(request, response, forum_slug, dict);
                    return;
                }
            }

            if(mass[1] === "post") {
                if(mass[3] === "details") {
                    const post_id = mass[2];
                    const dict = new Dictionary(tail).getDictionary();
                    this.postWorker.getPostDetails(request, response, post_id, dict);
                    return;
                }
            }

            if(url === "/service/status") {
                this.serviceWorker.getInfoAboutAllTables(request, response);
                return;
            }
        }

        if(type === "POST") {

            if(mass[1] === "user") {
                if(mass[3] === "create") {
                    const nickname = mass[2];
                    this.userWorker.addUser(request, response, nickname);
                    return;
                }
            }

            if(mass[1] === "user") {
                if(mass[3] === "profile") {
                    const nickname = mass[2];
                    this.userWorker.changeUserInfo(request, response, nickname);
                    return;
                }
            }

            if(url === "/forum/create") {
                this.forumWorker.addForum(request, response);
                return;
            }

            if(mass[1] === "forum") {
                if(mass[3] === "create") {
                    const forum_slug = mass[2];
                    this.threadWorker.addThread(request, response, forum_slug);
                    return;
                }
            }

            if(mass[1] === "thread") {
                if(mass[3] === "create") {
                    const thread_slug = mass[2];
                    this.postWorker.addPostsArray(request, response, thread_slug);
                    return;
                }
            }

            if(mass[1] === "thread") {
                if(mass[3] === "vote") {
                    const thread_id_slug = mass[2];
                    this.voteWorker.addVote(request, response, thread_id_slug);
                    return;
                }
            }

            if(mass[1] === "thread") {
                if(mass[3] === "details") {
                    MyWriter.log("CHANGE_THREAD_INFO_NEED");
                    const thread_slug_id = mass[2];
                    this.threadWorker.changeThreadInfo(request, response, thread_slug_id);
                    return;
                }
            }

            if(mass[1] === "post") {
                if(mass[3] === "details") {
                    MyWriter.log("__POST_____CHANGE__MESSAGE__INFO__");
                    const post_id = mass[2];
                    this.postWorker.changePostMessage(request, response, post_id);
                    return;
                }
            }

            if(url === "/service/clear") {
                this.serviceWorker.clearAll(request, response);
                return;
            }
        }
    }
}
