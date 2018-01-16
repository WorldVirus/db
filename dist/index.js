/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class MyWriter {
    static log(s) {
         // console.log(s);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MyWriter;




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);




class Help {
    static objArr() {
        return {
            arr: []
        };
    }

    static exists(x) {
        return !(x === null || x === undefined);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Help;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);




class NumberController {
    static isNumber(paramString) {
        const s = paramString + "";
        return parseInt(s) + "" === s;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NumberController;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);




class DBiniter {
    constructor(app, pg, fs, queryManager, callback) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;

        this.fs.readFile('./DATABASE.sql', 'utf8',  (err, data) => {
            this.queryManager.createQuery(data, {}, () => {
                console.log("INIT_DATABASE_OK");
                callback();
            }, (e) => {
                console.log("ERROR_OF_INITING_DATABASE");
                __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("================================================================================");
                console.log("================================================================================");
                console.log(e);
                console.log("================================================================================");
                __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("================================================================================");
                console.log("STOP");
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DBiniter;



/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__QueryManager__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__DBiniter__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UserWorker__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ForumWorker__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ThreadWorker__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Dictionary__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__PostWorker__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__VoteWorker__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__PostsPrinter__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ServiceWorker__ = __webpack_require__(12);















class Router {
    constructor(app, pg, fs) {
        this.number = 0;
        this.app = app;
        this.pg = pg;
        this.fs = fs;

        this.databaseCreated = false;

        this.queryManager = new __WEBPACK_IMPORTED_MODULE_1__QueryManager__["a" /* default */](this.app, this.pg, this.fs);

        this.userWorker = new __WEBPACK_IMPORTED_MODULE_3__UserWorker__["a" /* default */](this.app, this.pg, this.fs, this.queryManager);
        this.forumWorker = new __WEBPACK_IMPORTED_MODULE_4__ForumWorker__["a" /* default */](this.app, this.pg, this.fs, this.queryManager);
        this.threadWorker = new __WEBPACK_IMPORTED_MODULE_5__ThreadWorker__["a" /* default */](this.app, this.pg, this.fs, this.queryManager);
        this.postWorker = new __WEBPACK_IMPORTED_MODULE_7__PostWorker__["a" /* default */](this.app, this.pg, this.fs, this.queryManager);
        this.voteWorker = new __WEBPACK_IMPORTED_MODULE_8__VoteWorker__["a" /* default */](this.app, this.pg, this.fs, this.queryManager);
        this.postsPrinter = new __WEBPACK_IMPORTED_MODULE_9__PostsPrinter__["a" /* default */](this.app, this.pg, this.fs, this.queryManager);
        this.serviceWorker = new __WEBPACK_IMPORTED_MODULE_10__ServiceWorker__["a" /* default */](this.app, this.pg, this.fs, this.queryManager)
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
                    new __WEBPACK_IMPORTED_MODULE_2__DBiniter__["a" /* default */](this.app, this.pg, this.fs, this.queryManager, () => {
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
                    const dict = new __WEBPACK_IMPORTED_MODULE_6__Dictionary__["a" /* default */](tail).getDictionary();
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
                    const dict = new __WEBPACK_IMPORTED_MODULE_6__Dictionary__["a" /* default */](tail).getDictionary();
                    this.postsPrinter.printPosts(request, response, thread_id_slug, dict);
                    return;
                }
            }

            if(mass[1] === "forum") {
                if(mass[3] === "users") {
                    const forum_slug = mass[2];
                    const dict = new __WEBPACK_IMPORTED_MODULE_6__Dictionary__["a" /* default */](tail).getDictionary();
                    this.forumWorker.getUsersOfForum(request, response, forum_slug, dict);
                    return;
                }
            }

            if(mass[1] === "post") {
                if(mass[3] === "details") {
                    const post_id = mass[2];
                    const dict = new __WEBPACK_IMPORTED_MODULE_6__Dictionary__["a" /* default */](tail).getDictionary();
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
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("CHANGE_THREAD_INFO_NEED");
                    const thread_slug_id = mass[2];
                    this.threadWorker.changeThreadInfo(request, response, thread_slug_id);
                    return;
                }
            }

            if(mass[1] === "post") {
                if(mass[3] === "details") {
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("__POST_____CHANGE__MESSAGE__INFO__");
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);




class Dictionary {
    constructor(content) {
        this.content = content;
    }

    getDictionary() {
        let dict = {};

        let mass = this.content.split("&");
        for(let i = 0; i < mass.length; i++) {
            let s = mass[i];
            let arr = s.split("=");
            let key = arr[0] + "";
            let value = arr[1] + "";
            dict[key] = decodeURIComponent(value);
        }

        return dict;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Dictionary;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Help__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MyWriter_js__ = __webpack_require__(0);






class ForumWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    getUsersOfForum(request, response, forum_slug, dict) {
        let aaa = __WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].objArr();

        this.queryManager.createQuery("SELECT f1 AS id FROM f WHERE LOWER(f3) = LOWER('" + forum_slug + "');", aaa, () => {
            if(aaa.arr.length === 0) {
                // forum not found
                response.status(404);
                response.end(JSON.stringify({
                    message: "NO"
                }));
            } else {
                const forum_id = aaa.arr[0].id;
                let bbb = __WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].objArr();

                let query = "  SELECT u1, u2 AS nickname, u3 AS fullname, u4 AS email, u5 AS about FROM u INNER JOIN fp on (fp_1 = u1) WHERE fp_2 = " + forum_id + "   ";

                let sort = "+";
                if(__WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].exists(dict["desc"]) === true) {
                    if(dict["desc"] === "true") sort = "-";
                    if(dict["desc"] === "false") sort = "+";
                }

                if(__WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].exists(dict["since"]) === true) {
                    const since = dict["since"] + "";
                    if(sort === "+") query = query + "  AND LOWER(u2) > LOWER('" + since + "')   ";
                    if(sort === "-") query = query + "  AND LOWER(u2) < LOWER('" + since + "')   ";
                }

                if(sort === "+") query = query + "  ORDER BY LOWER(u2)  ASC   ";
                if(sort === "-") query = query + "  ORDER BY LOWER(u2)  DESC  ";

                if(__WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].exists(dict["limit"]) === true) {
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
        let aaa = __WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].objArr();
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
            let aaa = __WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].objArr();
            let bbb = __WEBPACK_IMPORTED_MODULE_0__Help__["a" /* default */].objArr();
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
/* harmony export (immutable) */ __webpack_exports__["a"] = ForumWorker;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MyWriter_js__ = __webpack_require__(0);






class MainClassStarterApp {
    static importModule(s) {
        let answer = "";
        eval("  answer = require('" + s + "');  ");
        return answer;
    }

    constructor() {
        let pg = MainClassStarterApp.importModule("pg");
        let fs = MainClassStarterApp.importModule("fs");
        let express = MainClassStarterApp.importModule("express");

        this.app = express();
        this.pg = pg;
        this.fs = fs;

        this.router = new __WEBPACK_IMPORTED_MODULE_0__Router__["a" /* default */](this.app, this.pg, this.fs);

        this.allowAllOrigins();
        this.addListenersToServerQueries();
        this.startServer();
    }

    startServer() {
        let port = process.env.PORT || 5000;
        this.app.listen(port);
        console.log("\nServer works on port " + port);
        console.log("_____________________________________\n\n")
    }

    allowAllOrigins() {
        const app = this.app;
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    addListenersToServerQueries() {
        const app = this.app;
        const pg = this.pg;
        const fs = this.fs;

        this.freeProcess = true;
        this.mass = [];

        let inter = setInterval(() => {
            if(this.mass.length > 0) {
                if(this.mass[0].res.finished === true) {
                    this.mass.splice(0,1);
                    this.freeProcess = true;

                    if(this.freeProcess === true) {
                        if(this.mass.length > 0) {
                            this.freeProcess = false;
                            const type = "POST";
                            this.router.addQuery(type, this.mass[0].req, this.mass[0].res);
                        }
                    }
                }
            }
        }, 1);

        app.get('/*', (request, response) => {
            const type = "GET";
            this.router.addQuery(type, request, response);
        });

        app.post('/*', (request, response) => {
            this.mass.push({
                req: request,
                res: response
            });

            if(this.freeProcess === true) {
                if(this.mass.length > 0) {
                    this.freeProcess = false;
                    const type = "POST";
                    this.router.addQuery(type, this.mass[0].req, this.mass[0].res);
                }
            }
        });
    }
}

const mainObj = new MainClassStarterApp();

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(4)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Help__ = __webpack_require__(1);







class PostWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;

        this.count = 2;
    }

    changePostMessage(request, response, post_id) {
        let aaa = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();

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

                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("---------------------------------------");
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("OLD message");
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(oldMessage);
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("---------------------------------------");
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("NEW message");
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(newMessage);
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("---------------------------------------");

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
                        __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("___NO___CHANGES____");
                    } else {
                        // change message OK
                        this.queryManager.createQuery("UPDATE p SET p9 = '" + resultString + "', p11 = True WHERE p1 = " + post.id + ";", {}, () => {
                            post.isEdited = true;
                            post.message = resultString;
                            response.status(200);
                            response.end(JSON.stringify(post));
                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("___YES___CHANGES____");
                        }, (e) => {
                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("_______UPDATING__POST__MESSAGE___ERROR___");
                        });
                    }
                }
            }, () => {});
        });
    }

    getPostDetails(request, response, post_id, dict) {
        let aaa = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();

        let bbb = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let ccc = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let kkk = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();

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

                            if(__WEBPACK_IMPORTED_MODULE_1__NumberController__["a" /* default */].isNumber(thread.slug_chern) === false) {
                                thread.slug = thread.slug_chern;
                            }

                            let answer = {};
                            answer.post = post;

                            if(__WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].exists(dict["related"]) === true) {
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
        let aaa = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let ccc = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let kkk = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            const created = new Date().toISOString();
            const postArray = JSON.parse(bigString);

            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("-------------------------------------------------------");
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("POSTS number start: " + postArray.length);
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("-------------------------------------------------------");

            let thread_id = "";
            let thread_slug = "";

            let q = " ";

            if(__WEBPACK_IMPORTED_MODULE_1__NumberController__["a" /* default */].isNumber(thread_id_slug) === false) {
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
                                                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("________FP____fp_1___fp_2_____ERROR___");
                                                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(eee);
                                                        });

                                                    }, (e) => {
                                                        __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("__UPDATE__FORUM___ERROR___");
                                                        __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(e);
                                                    });
                                                }, (err) => {
                                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("X_1");
                                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(err);
                                                });
                                    }
                                }, () => {
                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("X_2");
                                });
                            }
                        }, () => {
                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("X_3");
                        });
                    }
                }

            }, () => {
                __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("X_4");
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostWorker;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Help__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NumberController__ = __webpack_require__(2);







class PostsPrinter {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    printPosts(request, response, thread_id_slug, dict) {
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

        let thread_id = "";
        let thread_slug = "";

        let q = " ";

        if(__WEBPACK_IMPORTED_MODULE_2__NumberController__["a" /* default */].isNumber(thread_id_slug) === false) {
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
                if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["sort"]) === true) {
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
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let ccc = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

        let sort = "+";
        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["desc"]) === true) {
            if(dict["desc"] === "true") sort = "-";
            if(dict["desc"] === "false") sort = "+";
        }

        let since = null;
        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["since"]) === true) {
            since = dict["since"];
        }

        let query = "  ";

        query = query + " WITH roots AS ( ";
        query = query + " SELECT p1 FROM p ";
        query = query + " WHERE p4 = " + thread_id + " AND p7 = 0 ";

        if(since != null) {
            if(sort === "+") query = query + " AND p12 > (SELECT p12 FROM p WHERE p1 = " + since + ") ";
            if(sort === "-") query = query + " AND p12 < (SELECT p12 FROM p WHERE p1 = " + since + ") ";
        }

        if(sort === "+") query = query + "  ORDER BY p1 ASC   ";
        if(sort === "-") query = query + "  ORDER BY p1 DESC  ";

        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["limit"]) === true) {
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
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(answer);
            response.status(200);
            response.end(JSON.stringify(answer));
        }, (e) => {
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("XXXXXXXXXX");
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(e);
        })
    }

    treeSort(request, response, thread_id, dict) {
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let ccc = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

        let query = " SELECT p2 AS author, p10 AS created, p6 AS forum, p1 AS id, p11 AS isEdited, p9 AS message, p7 AS parent, p4 AS thread FROM p WHERE p4 = " + thread_id + "  ";

        let sort = "+";
        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["desc"]) === true) {
            if(dict["desc"] === "true") sort = "-";
            if(dict["desc"] === "false") sort = "+";
        }

        let since = null;
        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["since"]) === true) {
            since = dict["since"];
        }

        if(since !== null) {
            if (sort === "+") query = query + " AND p.p12 > (SELECT p12 FROM p WHERE p1 = " + since + ") ";
            if (sort === "-") query = query + " AND p.p12 < (SELECT p12 FROM p WHERE p1 = " + since + ") ";
        }

        if(sort === "+") query = query + " ORDER BY p.p12 ASC    ";
        if(sort === "-") query = query + " ORDER BY p.p12 DESC   ";

        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["limit"]) === true) {
            query = query + " LIMIT " + dict["limit"] + " ";
        }

        query += " ; ";
        __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(query);

        this.queryManager.createQuery(query, aaa, () => {
            let answer = aaa.arr;
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("Array_len: " + answer.length);
            response.status(200);
            response.end(JSON.stringify(answer));
        }, (e) => {
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("EEEEEEEE");
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(e);
        });

    }

    flatSort(request, response, thread_id, dict) {
        let query = "  SELECT p2 AS author, p10 AS created, p6 AS forum, p1 AS id, p11 AS isEdited, p9 AS message, p7 AS parent, p4 AS thread FROM p WHERE p4 = " + thread_id + "    ";

        let sort = "+";
        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["desc"]) === true) {
            if(dict["desc"] === "true") sort = "-";
            if(dict["desc"] === "false") sort = "+";
        }

        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["since"]) === true) {
            if(sort === "+") query = query + "  AND p1 > " + dict["since"] + "  ";
            if(sort === '-') query = query + "  AND p1 < " + dict["since"] + "  ";
        }

        if(sort === "+") query += "  ORDER BY p1 ASC   ";
        if(sort === "-") query += "  ORDER BY p1 DESC  ";

        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["limit"]) === true) {
            query = query + " LIMIT " +  dict["limit"] + " ";
        }

        query = query + " ; ";

        __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(query);

        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        this.queryManager.createQuery(query, aaa, () => {
            let answer = aaa.arr;
            response.status(200);
            response.end(JSON.stringify(answer));
        }, (e) => {
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(e);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostsPrinter;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);




class QueryManager {
    constructor(app, pg, fs) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;

        const pool = new pg.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'bbb_12345',
            password: '12345',
            port: 5432
        });

        pool.on('error', (err, client) => {
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("_____POOL_____ERROR_____");
        });

        this.pool = pool;
    }

    createQuery(queryString, resultObject, callbackNormal, callbackError) {
        const pool = this.pool;

        pool.query(queryString, [], (err, res) => {
            if(err !== null) {
                __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("callbackError");
                callbackError(err);
            } else {
                __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("callbackNormal");
                resultObject.arr = res.rows;
                callbackNormal();
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QueryManager;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Help__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__DBiniter__ = __webpack_require__(3);







class ServiceWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    clearAll(request, response) {
        new __WEBPACK_IMPORTED_MODULE_2__DBiniter__["a" /* default */](this.app, this.pg, this.fs, this.queryManager, () => {
            response.status(200);
            response.end("CLEAR_ALL_DB_OK");
            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("CLEAR_ALL_DB_OK");
        });
    }

    getInfoAboutAllTables(request, response) {
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let ccc = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let kkk = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

        this.queryManager.createQuery("SELECT count(*) AS rrr FROM u;", aaa, () => {
            this.queryManager.createQuery("SELECT count(*) AS rrr FROM f;", bbb, () => {
                this.queryManager.createQuery("SELECT count(*) AS rrr FROM p;", ccc, () => {
                    this.queryManager.createQuery("SELECT count(*) AS rrr FROM t;", kkk, () => {
                        let users = aaa.arr[0].rrr;
                        let forums = bbb.arr[0].rrr;
                        let posts = ccc.arr[0].rrr;
                        let threads = kkk.arr[0].rrr;

                        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(users) === false) users = 0;
                        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(forums) === false) forums = 0;
                        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(posts) === false) posts = 0;
                        if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(threads) === false) threads = 0;

                        const answer = {
                            forum: parseInt(forums),
                            post: parseInt(posts),
                            thread: parseInt(threads),
                            user: parseInt(users)
                        };

                        __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("GET DB INFO OK");
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    }, () => {});
                }, () => {});
            }, () => {});
        }, () =>{});
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ServiceWorker;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Help__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NumberController__ = __webpack_require__(2);







class ThreadWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    changeThreadInfo(request, response, thread_id_slug) {
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

        let thread_id = "";
        let thread_slug = "";

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            const dataObject = JSON.parse(bigString);

            let q = " ";

            if (__WEBPACK_IMPORTED_MODULE_2__NumberController__["a" /* default */].isNumber(thread_id_slug) === false) {
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

                                if(__WEBPACK_IMPORTED_MODULE_2__NumberController__["a" /* default */].isNumber(answer.slug_chern) === false) {
                                    answer.slug = answer.slug_chern;
                                }
                                response.status(200);
                                response.end(JSON.stringify(answer));

                            }, () => {
                                __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("ERROR_1");
                            });
                        }, () => {
                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("__UPDATING_ERROR___");
                        })
                    }
                }, () => {
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("ERROR_3");
                });
        });
    }

    getThreadInfo(request, response, thread_id_slug) {
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

        let thread_id = "";
        let thread_slug = "";

        let q = " ";

        if(__WEBPACK_IMPORTED_MODULE_2__NumberController__["a" /* default */].isNumber(thread_id_slug) === false) {
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
                if(__WEBPACK_IMPORTED_MODULE_2__NumberController__["a" /* default */].isNumber(answer.slug_chern) === false) {
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
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let ccc = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let eee = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

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
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("P_1");
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
                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("P_2");
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
                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("P_3");
                                }, () => {
                                    response.status(201);
                                    response.end(JSON.stringify(answer));
                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("P_4");
                                });
                            }, (err) => {
                                __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(err);
                                // branch is already exists
                                this.queryManager.createQuery("SELECT t2 AS author, t10 AS created, t4 AS forum, t1 AS id, t7 AS message, t8 AS slug, t6 AS title, t9 AS votes FROM t WHERE LOWER(t8) = LOWER('" + thread.slug + "');", eee, () => {
                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("thread.slug: " + thread.slug);
                                    const answer = eee.arr[0];
                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(answer);
                                    response.status(409);
                                    response.end(JSON.stringify(answer));
                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("P_5");
                                }, () => {
                                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("P_6");
                                });
                            });
                        }
                    }, () => {});
                }
            }, () => {});
        });
    }

    getThreadsOfForum(request, response, forum_slug, dict) {
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

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
                if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict['desc']) === true) {
                    if(dict['desc'] === "true") sort = '-';
                    if(dict['desc'] === "false") sort = '+';
                }

                let since = null;
                if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["since"]) === true) {
                    since = dict["since"] + "";
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("SINCE: " + since);
                }

                if(since !== null) {
                   if(sort === "+") q = q + "  AND  t10 >= '" + since + "' ";
                   if(sort === "-") q = q + "  AND  t10 <= '" + since + "' ";
                }

                if(sort === "+")  q = q + " ORDER BY t10 ASC    ";
                if(sort === "-")  q = q + " ORDER BY t10  DESC   ";

                if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(dict["limit"]) === true) {
                   q = q + " LIMIT  " + dict["limit"] + " ";
                }

                q = q + " ; ";

                this.queryManager.createQuery(q, bbb, () => {
                    response.status(200);
                    response.end(JSON.stringify(bbb.arr));
                }, (err) => {
                    __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(err);
                });
            }
        }, () => {});
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ThreadWorker;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Help__ = __webpack_require__(1);






class UserWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;
    }

    changeUserInfo(request, response, nickname) {
        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
            let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
            this.queryManager.createQuery("SELECT * FROM u WHERE LOWER(u2) = LOWER('" + nickname + "');", aaa, () => {
                if(aaa.arr.length === 0) {
                    const answer = {
                        message: "NO"
                    };
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {
                    const newUser = JSON.parse(bigString);
                    const oldUser = aaa.arr[0];
                    const id = oldUser.u1;

                    if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(newUser.fullname) === true) oldUser.u3 = newUser.fullname;
                    if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(newUser.email) === true) oldUser.u4 = newUser.email;
                    if(__WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].exists(newUser.about) === true) oldUser.u5 = newUser.about;

                    this.queryManager.createQuery("UPDATE u SET u3 = '" + oldUser.u3 + "', u4 = '" + oldUser.u4 + "', u5 = '" + oldUser.u5 + "' WHERE u1 = " + id + " RETURNING u2 AS nickname, u3 AS fullname, u4 AS email, u5 AS about", bbb, () => {
                        const answer = bbb.arr[0];
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    }, () => {
                        const answer = {
                            message: "NO"
                        };
                        response.status(409);
                        response.end(JSON.stringify(answer));
                    });
                }
            }, () => {});
        });
    }

    getUserInfo(request, response, nickname) {
        let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
        this.queryManager.createQuery("SELECT u2 AS nickname, u3 AS fullname, u4 AS email, u5 AS about FROM u WHERE LOWER(u2) = LOWER('" + nickname + "');", aaa, () => {
            if(aaa.arr.length > 0) {
                const answer = aaa.arr[0];
                response.status(200);
                response.end(JSON.stringify(answer));
            } else {
                const answer = {
                    message: "NO"
                };
                response.status(404);
                response.end(JSON.stringify(answer));
            }
        }, () => {});
    }

    addUser(request, response, nickname) {
        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            let user = JSON.parse(bigString);
            const u2 = nickname;
            const u3 = user.fullname;
            const u4 = user.email;
            const u5 = user.about;

            let aaa = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();
            let bbb = __WEBPACK_IMPORTED_MODULE_1__Help__["a" /* default */].objArr();

            this.queryManager.createQuery("INSERT INTO u (u2, u3, u4, u5) VALUES ('" + u2 + "','" + u3 + "','" + u4 + "','" + u5 + "') RETURNING u2 AS nickname, u3 AS fullname, u4 AS email, u5 AS about;", aaa, () => {
                const answer = aaa.arr[0];
                response.status(201);
                response.end(JSON.stringify(answer));
            }, () => {
                this.queryManager.createQuery("SELECT u2 AS nickname, u3 AS fullname, u4 AS email, u5 AS about FROM u WHERE LOWER(u2) = LOWER('" + u2 + "') OR LOWER(u4) = LOWER('" + u4 + "');", bbb, () => {
                    let answer = bbb.arr;
                    response.status(409);
                    response.end(JSON.stringify(answer));
                }, () => { });
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserWorker;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Help__ = __webpack_require__(1);







class VoteWorker {
    constructor(app, pg, fs, queryManager) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;
        this.queryManager = queryManager;

        this.count = 0;
    }

    addVote(request, response, thread_id_slug) {
        let aaa = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let bbb = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let ccc = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let kkk = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();
        let xxx = __WEBPACK_IMPORTED_MODULE_2__Help__["a" /* default */].objArr();

        let bigString = "";
        request.on('data', (data) => {
            bigString += data;
        }).on('end', () => {
            const vote = JSON.parse(bigString);

            let thread_id = "";
            let thread_slug = "";

            let q = "  ";

            if (__WEBPACK_IMPORTED_MODULE_1__NumberController__["a" /* default */].isNumber(thread_id_slug) === false) {
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
                                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log(err);
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
                                            __WEBPACK_IMPORTED_MODULE_0__MyWriter_js__["a" /* default */].log("nnn");
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
/* harmony export (immutable) */ __webpack_exports__["a"] = VoteWorker;



/***/ })
/******/ ]);