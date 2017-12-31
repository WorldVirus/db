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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class QueryMaker {
    constructor(pg){
        this.pg = pg;
    }

    getClient(){
        return new this.pg.Client({
            user: 'maildb',
            host: 'localhost',
            database: 'maildb',
            password: '123',
            port: 5432
        });
    }

    makeQuery(queryString, objectWithArray, foo){
        const client = this.getClient();
        client.connect();

        client.query(queryString, (err, res) => {
            if(err !== null) {
                console.log("ERROR FROM DB: " + err);
            }
            objectWithArray.arr = res.rows;
            client.end();
            foo();
        });
    }

    makeVeryHardQuery(queryString, objectWithArray, foo){
        const client = this.getClient();
        client.connect();

        client.query(queryString, (err, res) => {
            try {
                objectWithArray.arr = res.rows;
            } catch (e) {
                // err
                console.log("HARD QUERY ERROR FROM DB: " + err);
            }

            client.end();
            foo();
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QueryMaker;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class NumberController {
    static isNumber(paramString){
        function isCifra(c){
            const chars = "1234567890";
            for(let i = 0; i < chars.length; i++){
                if(c === chars.charAt(i)){
                    return true;
                }
            }
            return false;
        }

        function isAllCifras(s){
            for(let i = 0; i < s.length; i++){
                const c = s.charAt(i);
                if(isCifra(c) === false){
                    return false;
                }
            }
            return true;
        }

        return isAllCifras(paramString.toString());
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NumberController;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class URLsplitter {
    static explodeString(paramString) {
        const s = paramString.toString();
        let arr = [];
        arr = s.split("&");
        let mass = [];
        for(let i = 0; i < arr.length; i++) {
            const q = arr[i].toString();
            let m = [];
            m = q.split("=");
            mass.push({
               key: m[0],
               value: decodeURIComponent(m[1])
            });
        }
        return mass;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = URLsplitter;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TablesCreator_js__ = __webpack_require__(4);





class DBdropper {
    constructor(app, pg, request, response, fs){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;
        this.fs = fs;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const operation = arr[2].toString();
        if(operation === 'clear'){
            console.log("Operation: clear");
            this.dropDataBaseAndClearTables();
        }
    }

    dropDataBaseAndClearTables(){
        const t = this;
        const pg = this.pg;
        const response = this.response;
        const fs = this.fs;

        const c1 = "  DROP TABLE branches  ;    ";
        const c2 = "  DROP TABLE forums    ;    ";
        const c3 = "  DROP TABLE posts     ;    ";
        const c4 = "  DROP TABLE users     ;    ";
        const c5 = "  DROP TABLE votes     ;    ";

        const queryString = c1 + c2 + c3 + c4 + c5;

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery(queryString, {}, function(){

            new __WEBPACK_IMPORTED_MODULE_1__TablesCreator_js__["a" /* default */](fs, pg, () => {
                const answer = {
                    resultMessage: "All DB was rewrite"
                };
                console.log("Result: All DB was rewrite");
                response.end(JSON.stringify(answer));
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DBdropper;




/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);






class TablesCreator {
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
            const q = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
            q.makeQuery(content, {}, function(){
                console.log("Creating tables OK \n" + "______________________________________________\n\n");

                const c1 = "  delete from branches  ;    ";
                const c2 = "  delete from forums    ;    ";
                const c3 = "  delete from posts     ;    ";
                const c4 = "  delete from users     ;    ";
                const c5 = "  delete from votes     ;    ";
                const queryString = c1 + c2 + c3 + c4 + c5;

                new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery(queryString, {}, () => {
                    console.log("Delete old data OK \n" +  "______________________________________________\n\n");
                    foo();
                });
            });

        }  //);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TablesCreator;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Router_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TablesCreator_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__DBdropper__ = __webpack_require__(3);






let express = null;
let app = null;
let pg = null;
let fs = null;

eval("       express = require('express');       ");
eval("       app = express();                    ");
eval("       pg = require('pg');                 ");
eval("       fs = require('fs');                 ");

class Application {
    constructor(){
        Application.createTables();
        Application.allowOrigins();
        Application.routeQuery();
        Application.startServer();
    }

    static createTables(){
        new __WEBPACK_IMPORTED_MODULE_1__TablesCreator_js__["a" /* default */](fs, pg, function() { });
    }

    static allowOrigins(){
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    static routeQuery(){
        new __WEBPACK_IMPORTED_MODULE_0__Router_js__["a" /* default */](app, pg, fs);
    }

    static startServer(){
        let port = process.env.PORT || 5000;
        app.listen(port);
        console.log("Server works on port " + port + "\n");
    }
}

new Application();

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UserWorker_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UserInfo_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ForumCreator_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ForumInfo_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__PostCreator_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__PostInfo_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__PostMessageChanger_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__VoteAdder_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__PostsOfThreadGetter_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__BranchUpdater_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__BranchInfo__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__DBinfoGetter__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__DBdropper__ = __webpack_require__(3);
















class Router {
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
                new __WEBPACK_IMPORTED_MODULE_0__UserWorker_js__["a" /* default */](app, pg, request, response);
            } else if(type === 'forum'){
                new __WEBPACK_IMPORTED_MODULE_2__ForumCreator_js__["a" /* default */](app, pg, request, response);
            } else if(type === 'thread'){
                if(mass[3] === 'vote'){
                    new __WEBPACK_IMPORTED_MODULE_7__VoteAdder_js__["a" /* default */](app, pg, request, response);
                } else {
                    if(mass[3] === 'details'){
                        new __WEBPACK_IMPORTED_MODULE_9__BranchUpdater_js__["a" /* default */](app, pg, request, response);
                    } else {
                        new __WEBPACK_IMPORTED_MODULE_4__PostCreator_js__["a" /* default */](app, pg, request, response);
                    }
                }
            } else if(type === 'post'){
                new __WEBPACK_IMPORTED_MODULE_6__PostMessageChanger_js__["a" /* default */](app, pg, request, response);
            } else if(type === 'service'){
                new __WEBPACK_IMPORTED_MODULE_12__DBdropper__["a" /* default */](app, pg, request, response, fs);
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
                new __WEBPACK_IMPORTED_MODULE_1__UserInfo_js__["a" /* default */](app, pg, request, response);
            } else if(type === 'forum'){
                new __WEBPACK_IMPORTED_MODULE_3__ForumInfo_js__["a" /* default */](app, pg, request, response);
            } else if(type === 'post'){
                new __WEBPACK_IMPORTED_MODULE_5__PostInfo_js__["a" /* default */](app, pg, request, response);
            } else if(type === 'thread'){
                if(mass[3] === 'details'){
                    new __WEBPACK_IMPORTED_MODULE_10__BranchInfo__["a" /* default */](app, pg, request, response);
                } else {
                    new __WEBPACK_IMPORTED_MODULE_8__PostsOfThreadGetter_js__["a" /* default */](app, pg, request, response);
                }
            } else if(type === 'service'){
                new __WEBPACK_IMPORTED_MODULE_11__DBinfoGetter__["a" /* default */](app, pg, request, response);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;




/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);




class UserWorker {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;


        let url = request.url;
        let urlArr = url.split("/");
        let nickname = urlArr[2];
        let operation = urlArr[3];

        if(operation === "create"){
            console.log("Operation: create");
            this.addUser(nickname);
        }

        if(operation === "profile"){
            console.log("Operation: profile");
            this.changeProperties(nickname);
        }
    }

    changeProperties(nickname){
        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let dataObject = null;
        let email = null;

        let answer = null;

        let arrObj = {
            arr: []
        };

        let massObj = {
            arr: []
        };

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
            q1.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');", arrObj, function(){
                if(arrObj.arr.length === 0) {
                    answer = {
                        message: "User was NOT found in database"
                    };
                    console.log("Result: User was NOT found in database");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {
                    const email = dataObject.email;
                    const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                    q2.makeQuery("SELECT * FROM users WHERE LOWER(email) = LOWER('" + email + "')  AND LOWER(nickname) <> LOWER('" + nickname + "');", massObj, function(){
                        if(massObj.arr.length > 0){
                            answer = {
                                message: "User has conflict with other users"
                            };
                            console.log("Result: User has conflict with other users");
                            response.status(409);
                            response.end(JSON.stringify(answer));
                        } else {

                            let massObjLast = {
                                arr: []
                            };

                            const q8 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](t.pg);
                            q8.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');", massObjLast, () => {

                                let old = massObjLast.arr[0];

                                let oldAbout = old.about;
                                let oldEmail = old.email;
                                let oldFullname = old.fullname;

                                function isNormal(s) {
                                    return s !== undefined;
                                }

                                let about = dataObject.about;
                                let email = dataObject.email;
                                let fullname = dataObject.fullname;

                                if(isNormal(about) === false) about = oldAbout;
                                if(isNormal(email) === false) email = oldEmail;
                                if(isNormal(fullname) === false) fullname = oldFullname;

                                const q3 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                q3.makeQuery("UPDATE users SET about = '" + about + "', email = '" + email + "', fullname = '" + fullname + "' WHERE LOWER(nickname) = LOWER('" + nickname + "');", { }, function(){
                                    answer = {
                                        about: about + "",
                                        email: email + "",
                                        fullname: fullname + "",
                                        nickname: nickname
                                    };
                                    console.log("Result: Change user info OK");
                                    response.status(200);
                                    response.end(JSON.stringify(answer));
                                });
                            });
                        }
                    });

                }
            });
        });
    }

    addUser(nickname){
        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let dataObject = null;
        let email = null;

        let answer = null;

        let arrObj = {
            arr: []
        };

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }
            email = dataObject.email;

            const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](t.pg);
            q1.makeQuery("SELECT * FROM users WHERE LOWER(email) = LOWER('" + email + "')  OR LOWER(nickname) = LOWER('" + nickname + "');", arrObj, function(){
                if(arrObj.arr.length > 0){
                    answer = arrObj.arr;
                    console.log("Result: User was NOT added to database");
                    response.status(409);
                    response.end(JSON.stringify(answer));
                } else {

                    const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](t.pg);
                    const fullname = dataObject.fullname;
                    const about = dataObject.about;

                    q2.makeQuery("INSERT INTO users (about, email, fullname, nickname) VALUES ('" + about + "', '" + email + "', '" + fullname + "', '" + nickname + "');", {}, function(){
                        answer = {
                            about: about,
                            email: email,
                            fullname: fullname,
                            nickname: nickname
                        };
                        console.log("Result: User was added to database");
                        response.status(201);
                        response.end(JSON.stringify(answer));
                    });
                }
            });

        });
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserWorker;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);




class UserInfo {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;


        let url = request.url;
        let urlArr = url.split("/");
        let nickname = urlArr[2];
        let operation = urlArr[3];

        if(operation === "profile"){
            console.log("Operation: profile");
            this.getInfo(nickname);
        }
    }

    getInfo(nickname) {
        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let dataObject = {
            arr: []
        };

        let answer = null;

        const q = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](t.pg);
        q.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');", dataObject, function () {
            if (dataObject.arr.length === 0){
                answer = {
                    message: "User was NOT found"
                };
                console.log("Result: User was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                let obj = dataObject.arr[0];
                answer = {
                    about: obj.about,
                    email: obj.email,
                    fullname: obj.fullname,
                    nickname: obj.nickname
                };
                console.log("Result: User was found");
                response.status(200);
                response.end(JSON.stringify(answer));
            }
        });

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserInfo;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController__ = __webpack_require__(1);





class ForumCreator {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        if(url === "/forum/create"){
            console.log("Operation: create new forum");
            this.createNewForum();
        } else {
            let arr = url.split("/");
            if(arr[3] === "create"){
                console.log("Operation: create new branch");
                const forumSlug = arr[2];
                this.createBranch(forumSlug);
            }
        }
    }

    createBranch(forumSlug){
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

        let objArrSecond = {
            arr: []
        };

        let objArrThird = {
            arr: []
        };

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            const author = dataObject.author;
            let created = dataObject.created;
            const message = dataObject.message;
            const title = dataObject.title;
            let slug = dataObject.slug;

            let forumslug = forumSlug;


            const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
            q1.makeQuery("SELECT * FROM forums WHERE LOWER(slug) = LOWER('" + forumSlug + "');", objArrFirst, function(){
                if(objArrFirst.arr.length === 0){
                    answer = {
                        message: "Forum was NOT found"
                    };
                    console.log("Result: Forum was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {
                    const forumid = objArrFirst.arr[0].forumid;
                    forumSlug = objArrFirst.arr[0].slug;
                    forumslug = forumSlug;

                    const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                    q2.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + author + "');", objArrSecond, function(){
                        if(objArrSecond.arr.length === 0) {
                            answer = {
                                message: "User was NOT found"
                            };
                            console.log("Result: User was NOT found");
                            response.status(404);
                            response.end(JSON.stringify(answer));
                        } else {
                            const authorbranchid = objArrSecond.arr[0].userid;
                            const authorbranchnickname = author;
                            const votes = 0;

                            let objLast = {
                                arr: []
                            };

                            const q4 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                            q4.makeQuery("SELECT COUNT(*) from branches;" , objLast, function(){
                                const idNumber = parseInt(objLast.arr[0].count) + 1;

                                if(slug === undefined) {
                                    slug = idNumber.toString();
                                }

                                const q3 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                q3.makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + slug + "');", objArrThird, function(){

                                    if(objArrThird.arr.length > 0){
                                        let obj = objArrThird.arr[0];
                                        answer = {
                                            author: obj.authorbranchnickname,
                                            created: obj.created,
                                            forum: obj.forumslug,
                                            id: obj.branchid,
                                            message: obj.message,
                                            slug: obj.slug,
                                            title: obj.title,
                                            votes: obj.votes
                                        };
                                        console.log("Result: Branch is already exists");
                                        response.status(409);
                                        response.end(JSON.stringify(answer));
                                    } else {

                                            if(created === undefined) {
                                                created = new Date().toISOString();
                                            }

                                            const q5 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                            q5.makeQuery(" UPDATE forums SET threads = threads + 1 WHERE forumid = " + forumid + ";    INSERT INTO branches (branchid, authorbranchid, authorbranchnickname, created, forumid, forumslug, message, slug, title, votes) VALUES (" + idNumber + ", " + authorbranchid + ", '" + authorbranchnickname + "', '" + created + "', " + forumid + ", '" + forumslug + "', '" + message + "', '" + slug + "', '" + title + "', " + votes + ");", {} , function(){

                                                if(__WEBPACK_IMPORTED_MODULE_1__NumberController__["a" /* default */].isNumber(slug) === false) {
                                                    answer = {
                                                        author: authorbranchnickname,
                                                        created: created,
                                                        forum: forumslug,
                                                        id: idNumber,
                                                        message: message,
                                                        slug: slug,
                                                        title: title,
                                                        votes: votes
                                                    };
                                                } else {
                                                    answer = {
                                                        author: authorbranchnickname,
                                                        created: created,
                                                        forum: forumslug,
                                                        id: idNumber,
                                                        message: message,
                                                        title: title,
                                                        votes: votes
                                                    };
                                                }
                                                console.log("Result: Branch was added OK");
                                                response.status(201);
                                                response.end(JSON.stringify(answer));
                                            });
                                        }
                                });
                            });
                        }
                    });
                }
            })

        });
    }

    createNewForum(){
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

        let objArrSecond = {
            arr: []
        };

        request.on('data', function(data) {
            try {
                dataObject = JSON.parse(data);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            const slug = dataObject.slug;
            let nickname = dataObject.user;

            const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
            q1.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + nickname + "');" , objArrFirst, function(){
                if(objArrFirst.arr.length > 0) {
                    const userNumber = objArrFirst.arr[0].userid;
                    nickname = objArrFirst.arr[0].nickname;

                    const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                    q2.makeQuery("SELECT * FROM forums WHERE LOWER(slug) = LOWER('" + slug + "');", objArrSecond, function(){
                        if(objArrSecond.arr.length > 0){
                            const obj = objArrSecond.arr[0];
                            answer = {
                                posts: obj.posts,
                                slug: obj.slug,
                                thread: obj.thread,
                                title: obj.title,
                                user: nickname
                            };
                            console.log("Result: Forum is already exists in database");
                            response.status(409);
                            response.end(JSON.stringify(answer));
                        } else {
                            const posts = 0;
                            const threads = 0;
                            const title = dataObject.title;
                            const userid = userNumber;
                            const usernickname = dataObject.user;

                            const q3 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                            q3.makeQuery("INSERT INTO forums (posts, slug, threads, title, userid, usernickname) VALUES (" + posts + ", '" + slug + "', " + threads + ", '" + title + "', " + userid + ", '" + nickname + "');", { }, function(){
                                answer = {
                                    posts: posts,
                                    slug: slug,
                                    threads: threads,
                                    title: title,
                                    user: nickname
                                };
                                console.log("Result: Forum was added OK");
                                response.status(201);
                                response.end(JSON.stringify(answer));
                            });
                        }
                    });


                } else {
                    answer = {
                        message: "User was NOT found"
                    };
                    console.log("Result: User was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                }
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ForumCreator;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__URLsplitter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NumberController__ = __webpack_require__(1);






class ForumInfo{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = url.split("/");
        let forumSlug = arr[2];
        let operation = arr[3];

        if(operation === "details"){
            console.log("Operation: details");
            this.getInfoAboutForum(forumSlug);
        }

        let mass = operation.split("?");

        if(mass.length === 1) {
            if (operation === "threads") {
                console.log("Operation: threads");
                this.getForumThreads(forumSlug, []);
            }
            if (operation === "users") {
                console.log("Operation: users");
                this.getUsersOfForum(forumSlug, []);
            }
        } else {
             operation = operation.split("?")[0].toString();
             mass = __WEBPACK_IMPORTED_MODULE_1__URLsplitter__["a" /* default */].explodeString(mass[1].toString());
             console.log("Operation: " + operation);
             console.log("url params: ");
             for(let i = 0; i < mass.length; i++) {
                 console.log("Key: " + mass[i].key + "  Value: " + mass[i].value);
             }
             if(operation === "threads") {
                 this.getForumThreads(forumSlug, mass);
             }
             if(operation === "users") {
                 this.getUsersOfForum(forumSlug, mass);
             }
        }
    }

    getUsersOfForum(forumSlug, mmm){
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

        let objArrSecond = {
            arr: []
        };

        let objArrThird = {
            arr: []
        };

        const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
        q1.makeQuery("SELECT * FROM forums WHERE LOWER(slug) = LOWER('" + forumSlug + "');", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Forum was NOT found"
                };
                console.log("Result: Forum was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {

                const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                q2.makeQuery("SELECT * FROM users INNER JOIN posts ON LOWER(author) = LOWER(nickname) WHERE LOWER(forum) = LOWER('" + forumSlug + "');", objArrSecond, function(){
                    // objArrSecond.arr - arr of users

                    const q3 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                    q3.makeQuery("SELECT * FROM users INNER JOIN branches ON LOWER(authorbranchnickname) = LOWER(nickname) WHERE LOWER(forumslug) = LOWER('" + forumSlug + "');", objArrThird, function(){
                        // objArrThird.arr - arr of users

                        (function() {
                            // objArrSecond.arr - arr of users
                            // objArrThird.arr - arr of users

                            answer = [];

                            function isInAnswer(obj){
                                for(let i = 0; i < answer.length; i++){
                                    if(answer[i].nickname.toLowerCase() === obj.nickname.toLowerCase()){
                                        return true;
                                    }
                                }
                                return false;
                            }

                            for(let i = 0; i < objArrSecond.arr.length; i++){
                                const obj = objArrSecond.arr[i];
                                if(isInAnswer(obj) === false){
                                    answer.push(obj);
                                }
                            }

                            for(let i = 0; i < objArrThird.arr.length; i++){
                                const obj = objArrThird.arr[i];
                                if(isInAnswer(obj) === false){
                                    answer.push(obj);
                                }
                            }

                            let bufferAnswer = [];

                            for(let i = 0; i < answer.length; i++){
                                const obj = answer[i];

                                bufferAnswer.push({
                                    about: obj.about,
                                    email: obj.email,
                                    fullname: obj.fullname,
                                    nickname: obj.nickname,
                                    userid: obj.userid
                                });
                            }

                            answer = bufferAnswer;

                            for(let i = 0; i < answer.length; i++){
                                for(let j = 0; j < answer.length; j++){
                                    if(answer[i].nickname.toLowerCase() < answer[j].nickname.toLowerCase()){
                                        const x = answer[i];
                                        answer[i] = answer[j];
                                        answer[j] = x;
                                    }
                                }
                            }

                            if(mmm.length === 0) {
                                console.log("Result: Get users of forum OK");
                                response.status(200);
                                response.end(JSON.stringify(answer));
                            } else {

                                let sinceName = "";
                                for(let i = 0; i < mmm.length; i++) {
                                    const obj = mmm[i];
                                    if(obj.key === "since") {
                                        sinceName = obj.value.toString();
                                    }
                                }

                                if(sinceName === "") {

                                    let limit = 9999999;
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "limit") {
                                            limit = parseInt(obj.value);
                                        }
                                    }

                                    let vector = "+";
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "desc") {
                                            if(obj.value.toString() === "true") vector = "-";
                                            if(obj.value.toString() === "false") vector = "+";
                                        }
                                    }

                                    let newAnswer = [];

                                    if(vector === "+") {
                                        for(let i = 0; i < answer.length; i++) {
                                            if(newAnswer.length < limit) {
                                                newAnswer.push(answer[i]);
                                            }
                                        }
                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(newAnswer));
                                    }

                                    if(vector === "-") {
                                        for(let i = 0; i < answer.length; i++) {
                                            newAnswer.push(answer[i]);
                                        }

                                        while(newAnswer.length > limit) {
                                            newAnswer.splice(0,1);
                                        }

                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(newAnswer.reverse()));
                                    }

                                } else {

                                    sinceName = sinceName.toString().toLowerCase();
                                    console.log("sinceName: " + sinceName);

                                    let limit = 9999999;
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "limit") {
                                            limit = parseInt(obj.value);
                                        }
                                    }

                                    let vector = "+";
                                    for(let i = 0; i < mmm.length; i++) {
                                        const obj = mmm[i];
                                        if(obj.key === "desc") {
                                            if(obj.value.toString() === "true") vector = "-";
                                            if(obj.value.toString() === "false") vector = "+";
                                        }
                                    }

                                    let newAnswer = [];

                                    if(vector === "+") {
                                        for(let i = 0; i < answer.length; i++) {
                                            if(newAnswer.length < limit) {
                                                if(answer[i].nickname.toString().toLowerCase() > sinceName.toString().toLowerCase()) newAnswer.push(answer[i]);
                                            }
                                        }
                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(newAnswer));
                                    }

                                    if(vector === "-") {
                                        console.log("Answer length: " + answer.length);
                                        for(let i = 0; i < answer.length; i++) {
                                            if(answer[i].nickname.toString().toLowerCase() < sinceName.toString().toLowerCase()) newAnswer.push(answer[i]);
                                        }

                                        newAnswer.reverse();


                                        answer = [];

                                        for(let i = 0; i < newAnswer.length; i++) {
                                            if(i < limit) {
                                                answer.push(newAnswer[i]);
                                            }
                                        }

                                        console.log("Result: Get users of forum OK");
                                        response.status(200);
                                        response.end(JSON.stringify(answer));
                                    }

                                }
                            }
                        }());
                    });
                });
            }
        });
    }

    getForumThreads(forumSlug, mmm){
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

        let objArrSecond = {
            arr: []
        };

        const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](t.pg);
        q1.makeQuery("SELECT * FROM forums where LOWER(slug) = LOWER('" + forumSlug + "');", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Forum was NOT found"
                };
                console.log("Result: Forum was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {

                let forumId = objArrFirst.arr[0].forumid;

                let queryString = "SELECT * FROM branches WHERE forumid = " + forumId + "  ";

                if(mmm.length === 0) {
                    queryString = "SELECT * FROM branches WHERE forumid = " + forumId + " ORDER BY created;";
                } else {

                    let f = false;
                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if (obj.key === "desc") {
                            if(obj.value === "true") {
                                f = true;
                            }
                        }
                    }

                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if(obj.key === "since") {
                            if(f === false) {
                                queryString += " AND cast(created as TIMESTAMPTZ) >= cast('" + obj.value + "' as TIMESTAMPTZ)  ";
                            }
                            if(f === true) {
                                queryString += " AND cast(created as TIMESTAMPTZ) <= cast('" + obj.value + "' as TIMESTAMPTZ)  ";
                            }
                        }
                    }

                    let flag = false;
                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if(obj.key === "desc") {
                            flag = true;
                            if(obj.value === "true") {
                                queryString += " ORDER BY created DESC";
                            } else {
                                queryString += " ORDER BY created ASC";
                            }
                        }
                    }
                    if(flag === false) {
                        queryString += " ORDER BY created ASC";
                    }

                    for(let i = 0; i < mmm.length; i++) {
                        const obj = mmm[i];
                        if (obj.key === "limit") {
                            queryString += " LIMIT " + obj.value + "  ";
                        }
                    }
                    queryString += " ; ";
                }

                console.log("Query:  " + queryString);

                const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](t.pg);
                q2.makeQuery(queryString, objArrSecond, function(){
                    let mass = objArrSecond.arr;
                    answer = [];

                    for(let i = 0; i < mass.length; i++){
                        const obj = mass[i];
                        answer.push({
                            author: obj.authorbranchnickname,
                            created: obj.created,
                            forum: obj.forumslug,
                            id: obj.branchid,
                            message: obj.message,
                            slug: obj.slug,
                            title: obj.title,
                            votes: obj.votes
                        });
                    }

                    console.log("Result: Branches of forum info OK");
                    response.status(200);
                    response.end(JSON.stringify(answer));
                });
            }
        });
    }

    getInfoAboutForum(forumSlug){
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

        const q = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](t.pg);
        q.makeQuery("SELECT * FROM forums where LOWER(slug) = LOWER('" + forumSlug + "');", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Forum was NOT found"
                };
                console.log("Result: Forum was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                let obj = objArrFirst.arr[0];
                answer = {
                    posts: obj.posts,
                    slug: obj.slug,
                    threads: obj.threads,
                    title: obj.title,
                    user: obj.usernickname
                };
                console.log("Result: Forum get info OK");
                response.status(200);
                response.end(JSON.stringify(answer));
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ForumInfo;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController__ = __webpack_require__(1);





class PostCreator{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");
        let operation = arr[3];

        let dataObject = [];

        let bigString = "";

        request.on('data', (aaa) => {
            bigString += aaa.toString();
        }).on('end', () => {
            let dataValue = bigString.toString();

            try {
                dataObject = JSON.parse(dataValue.toString());
            } catch (err) {
                console.log("JSON PARSING ERROR:  " + err);
                response.end("BAD FORMAT ERROR");
            }

            let data = arr[2].toString();
            if (__WEBPACK_IMPORTED_MODULE_1__NumberController__["a" /* default */].isNumber(data) === true) {
                // id param
                console.log("Operation: Add posts using branch ID");
                this.addPostsByBranchId(parseInt(data), dataObject);
            } else {
                // slug param
                console.log("Operation: Add posts using branch slug");
                this.addPostsByBranchSlug(data, dataObject);
            }
        });
    }

    addPostsByBranchId(branchId, dataObject){
            branchId = parseInt(branchId);

            const t = this;

            const app = t.app;
            const pg = t.pg;
            const request = t.request;
            const response = t.response;

            let answer = null;

            let objArrZero = {
                arr: []
            };

            const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
            q1.makeQuery("SELECT * FROM branches WHERE branchid = " + branchId + ";", objArrZero, function () {
                if (objArrZero.arr.length === 0) {
                    answer = {
                        message: "Branch was NOT found"
                    };
                    console.log("Result: Branch was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {
                    const slug = objArrZero.arr[0].slug;
                    t.addPostsByBranchSlug(slug, dataObject);
                }
            });
    }

    addPostsByBranchSlug(slug, dataObjectParam){
            let dataObject = dataObjectParam;

            const t = this;

            const app = t.app;
            const pg = t.pg;
            const request = t.request;
            const response = t.response;

            let answer = null;

            let objArrFirst = {
                arr: []
            };

            let objArrSecond = {
                arr: []
            };

            let objArrThird = {
                arr: []
            };

            let objArrFour = {
                arr: []
            };


            let objArrLast = {
                arr: []
            };


            const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
            q1.makeQuery("SELECT * FROM branches where LOWER(slug) = LOWER('" + slug + "');", objArrFirst, function(){
                if(objArrFirst.arr.length === 0){
                    answer = {
                        message: "Branch was NOT found"
                    };
                    console.log("Result: Branch was NOT found");
                    response.status(404);
                    response.end(JSON.stringify(answer));
                } else {

                    const threadid = objArrFirst.arr[0].branchid;

                    // noinspection JSAnnotator
                    function getInt(x) {
                        x = parseInt(x);
                        if(x === undefined) return 0;
                        if(x === null) return 0;
                        if(isNaN(x) === true) return 0;
                        return x;
                    }

                    let ppp = {
                        arr: []
                    };

                    new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("select nickname from users;",ppp, () => {

                        let allUsersHere = true;

                        for(let i = 0; i < dataObject.length; i++) {
                            let find = false;
                            const thisUserNickname = dataObject[i].author.toString().toLowerCase();

                            for(let j = 0; j < ppp.arr.length; j++) {
                                const userName = ppp.arr[j].nickname.toString().toLowerCase();
                                if(thisUserNickname === userName) {
                                    find = true;
                                }
                            }

                            if(find === false) {
                                allUsersHere = false;
                            }
                        }

                        if(allUsersHere === false) {
                            answer = {
                                message: "User was not found"
                            };
                            console.log("Result: User was not found");
                            response.status(404);
                            response.end(JSON.stringify(answer));
                        } else {

                            const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                            q2.makeQuery("SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + slug + "');", objArrSecond, function () {

                                let ok = true;

                                for (let i = 0; i < dataObject.length; i++) {
                                    let parentId = getInt(parseInt(dataObject[i].parent));
                                    let find = false;

                                    for (let j = 0; j < objArrSecond.arr.length; j++) {
                                        let elementId = getInt(parseInt(objArrSecond.arr[j].idpost));
                                        if (parentId === elementId) {
                                            find = true;
                                        }
                                    }

                                    if (parentId === 0) {
                                        find = true;
                                    }

                                    if (find === false) {
                                        ok = false;
                                    }
                                }

                                if (ok === false) {
                                    answer = {
                                        message: "Parent of post was NOT found"
                                    };
                                    console.log("Result: Parent of post was NOT found");
                                    response.status(409);
                                    response.end(JSON.stringify(answer));
                                } else {
                                    const q3 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                    q3.makeQuery("SELECT NOW();", objArrThird, function () {
                                        let created = new Date().toISOString();

                                        const q4 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                        q4.makeQuery("SELECT forums.forumid, forums.slug FROM forums INNER JOIN branches ON branches.forumid = forums.forumid WHERE LOWER(branches.slug) = LOWER('" + slug + "');", objArrFour, function () {
                                            let forumid = objArrFour.arr[0].forumid;
                                            let forum = objArrFour.arr[0].slug;

                                            const q5 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                            q5.makeQuery("SELECT COUNT(*) FROM posts;", objArrLast, function () {
                                                let startNumber = getInt(parseInt(objArrLast.arr[0].count));

                                                let queriesString = "";

                                                answer = [];

                                                let incrementVariable = 0;

                                                for (let i = 0; i < dataObject.length; i++) {

                                                    incrementVariable += 1;

                                                    let obj = dataObject[i];

                                                    let author = obj.author;
                                                    let message = obj.message;
                                                    let parent = obj.parent;

                                                    const threadslug = slug;
                                                    const isedited = false;

                                                    const idid = startNumber + i + 1;

                                                    parent = getInt(parent);

                                                    answer.push({
                                                        author: author,
                                                        created: created,
                                                        forum: forum,
                                                        id: idid,
                                                        isEdited: isedited,
                                                        message: message,
                                                        parent: parent,
                                                        thread: threadid
                                                    });

                                                    if (author === undefined) console.log("---------UNDEFINED author--------------");
                                                    if (created === undefined) console.log("---------UNDEFINED created--------------");
                                                    if (forum === undefined) console.log("---------UNDEFINED forum--------------");
                                                    if (idid === undefined) console.log("---------UNDEFINED idid--------------");
                                                    if (isedited === undefined) console.log("---------UNDEFINED isedited--------------");
                                                    if (message === undefined) console.log("---------UNDEFINED message--------------");
                                                    if (parent === undefined) console.log("---------UNDEFINED parent--------------");
                                                    if (threadid === undefined) console.log("---------UNDEFINED threadid--------------");

                                                    const query = "INSERT INTO posts (idpost, author, created, forum, forumid, isedited, message, parent, threadid, threadslug) VALUES (" + idid + ",'" + author + "', '" + created + "', '" + forum + "', " + forumid + ", " + isedited + ", '" + message + "', " + parent + ", " + threadid + ", '" + threadslug + "');";
                                                    queriesString = queriesString + "  " + query + "  ";
                                                }

                                                const q6 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                                q6.makeVeryHardQuery(queriesString, {}, function () {
                                                    const q7 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                                                    q7.makeQuery("UPDATE forums SET posts = posts + " + incrementVariable + " WHERE forumid = " + forumid + ";", {}, function () {
                                                        console.log("Result: Adding posts OK");
                                                        response.status(201);
                                                        response.end(JSON.stringify(answer));
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                            });
                        }

                    });
                }
            });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostCreator;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);




class PostInfo {
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

        let q = [];
        q = operation.split("?");
        operation = q[0].toString();

        let params = "";

        if(q.length > 1) {
            params = q[1].toString();
        }

        if(operation === 'details'){
            console.log("Operation: details");
            this.getPostInfo(postId, params);
        }
    }

    getPostInfo(postId, params){
        postId = parseInt(postId);
        params = params.toString();

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

        let objArrSecond = {
            arr: []
        };

        let objArrThird = {
            arr: []
        };

        let objArrFour = {
            arr: []
        };

        const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
        q1.makeQuery("SELECT * FROM posts WHERE idpost = " + postId + ";", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Post was NOT found"
                };
                console.log("Result: Post was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {

                const post = objArrFirst.arr[0];

                const forumid = post.forumid;
                const threadid = post.threadid;
                const authorName = post.author;

                const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                q2.makeQuery("SELECT * FROM users WHERE LOWER(nickname) = LOWER('" + authorName + "');", objArrSecond, function(){
                    const user = objArrSecond.arr[0];

                    const q3 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                    q3.makeQuery("SELECT * FROM forums WHERE forumid = " + forumid + ";", objArrThird, function(){
                        const forum = objArrThird.arr[0];

                        const q4 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                        q4.makeQuery("SELECT * FROM branches WHERE branchid = " + threadid + ";", objArrFour, function(){
                           const thread = objArrFour.arr[0];

                            (function () {

                                if(params === "") {
                                    answer = {
                                        post: {
                                            author: post.author,
                                            created: post.created,
                                            forum: post.forum,
                                            id: post.idpost,
                                            isEdited: post.isedited,
                                            message: post.message,
                                            parent: post.parent,
                                            thread: post.threadid
                                        }
                                    };
                                } else {

                                    let q = [];
                                    q = params.split("=");
                                    let arrString = decodeURIComponent(q[1].toString()) + "";

                                    let mass = [];
                                    mass = arrString.split(",");

                                    answer = {
                                        post: {
                                            author: post.author,
                                            created: post.created,
                                            forum: post.forum,
                                            id: post.idpost,
                                            isEdited: post.isedited,
                                            message: post.message,
                                            parent: post.parent,
                                            thread: post.threadid
                                        }
                                    };

                                    for(let i = 0; i < mass.length; i++) {
                                        let element = mass[i].toString();

                                        if(element === "user") {
                                            const author123 = {
                                                about: user.about,
                                                email: user.email,
                                                fullname: user.fullname,
                                                nickname: user.nickname
                                            };
                                            answer.author = author123;
                                        }

                                        if(element === "thread") {
                                            const thread123 = {
                                                author: thread.authorbranchnickname,
                                                created: thread.created,
                                                forum: thread.forumslug,
                                                id: thread.branchid,
                                                message: thread.message,
                                                slug: thread.slug,
                                                title: thread.title,
                                                votes: thread.votes
                                            };
                                            answer.thread = thread123;
                                        }

                                        if(element === "forum") {
                                            const forum123 = {
                                                posts: forum.posts,
                                                slug: forum.slug,
                                                threads: forum.threads,
                                                title: forum.title,
                                                user: forum.usernickname
                                            };
                                            answer.forum = forum123;
                                        }
                                    }

                                    /*
                                    answer = {
                                         author: {
                                             about: user.about,
                                             email: user.email,
                                             fullname: user.fullname,
                                             nickname: user.nickname
                                         },
                                         forum: {
                                             posts: forum.posts,
                                             slug: forum.slug,
                                             threads: forum.threads,
                                             title: forum.title,
                                             user: forum.usernickname
                                         },
                                        post: {
                                            author: post.author,
                                            created: post.created,
                                            forum: post.forum,
                                            id: post.idpost,
                                            isEdited: post.isedited,
                                            message: post.message,
                                            parent: post.parent,
                                            thread: post.threadid
                                        }/*,
                                    thread: {
                                        author: thread.authorbranchnickname,
                                        created: thread.created,
                                        forum: thread.forumslug,
                                        id: thread.branchid,
                                        message: thread.message,
                                        slug: thread.slug,
                                        title: thread.title,
                                        votes: thread.votes
                                    }
                                };
                                */


                                }

                                console.log("Result: Get post info OK");
                                response.status(200);
                                response.end(JSON.stringify(answer));

                            }());
                        });
                    });
                });
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostInfo;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);




class PostMessageChanger {
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

            const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
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

                        const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = PostMessageChanger;




/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController_js__ = __webpack_require__(1);





class VoteAdder {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        let value = arr[2].toString();
        let operation = arr[3].toString();

        let dataObject = null;

        request.on('data', (dataValue) => {
            try {
                dataObject = JSON.parse(dataValue);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            if(operation === 'vote'){
                console.log("Operation: vote");
                if(__WEBPACK_IMPORTED_MODULE_1__NumberController_js__["a" /* default */].isNumber(value) === false){
                    // use slug
                    this.addVoteUsingSlug(value, dataObject);
                } else {
                    // use id
                    this.addVoteUsingID(value, dataObject);
                }
            }
        });
    }

    addVoteUsingID(branchID, dataObject){
        branchID = parseInt(branchID);

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let answer = null;

        let objArrFirst = {
            arr: []
        };

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE branchid = " + branchID + ";", objArrFirst, () => {
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Branch was NOT found"
                };
                console.log("Result: Branch was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                const slug = objArrFirst.arr[0].slug.toString();
                this.addVoteUsingSlug(slug, dataObject);
            }
        });
    }

    addVoteUsingSlug(branchSlug, dataObject){
        branchSlug = branchSlug.toString();

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let answer = null;

        let objArrFirst = {
            arr: []
        };

        let objArrSecond = {
            arr: []
        };

        let objArrThird = {
            arr: []
        };

        const q1 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
        q1.makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", objArrFirst, function(){
           if(objArrFirst.arr.length === 0){
               answer = {
                   message: "Branch was NOT found"
               };
               console.log("Result: Branch was NOT found");
               response.status(404);
               response.end(JSON.stringify(answer));
           } else {

               const nickname = dataObject.nickname.toString();
               branchSlug = objArrFirst.arr[0].slug.toString();
               const branchID = objArrFirst.arr[0].branchid;
               const voice = parseInt(dataObject.voice);

               let ppp = {
                   arr: []
               };

               new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("select nickname from users where LOWER(nickname) = LOWER('" + nickname + "');",ppp, () => {
                    if(ppp.arr.length > 0) {
                        // user exists

                        // noinspection JSAnnotator
                        function updateBranch() {
                            let objArrBBB = {
                                arr: []
                            };

                            let objArrCCC = {
                                arr: []
                            };

                            new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT SUM(voice) FROM votes WHERE branchid = " + branchID + ";", objArrBBB, function(){
                                let summa =  objArrBBB.arr[0].sum.toString();

                                if(summa === null || summa === undefined || summa === 'null' || summa === 'undefined' || summa === '') {
                                    summa = 0;
                                }
                                summa = parseInt(summa);

                                new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("UPDATE branches SET votes = " + summa + " WHERE branchid = " + branchID + ";", {}, function(){

                                    new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE branchid = " + branchID + ";", objArrCCC, function(){
                                        const obj = objArrCCC.arr[0];

                                        answer = {
                                            author: obj.authorbranchnickname,
                                            created: obj.created,
                                            forum: obj.forumslug,
                                            id: obj.branchid,
                                            message: obj.message,
                                            slug: obj.slug,
                                            title: obj.title,
                                            votes: obj.votes
                                        };

                                        console.log("Result: Get branch info OK");
                                        response.status(200);
                                        response.end(JSON.stringify(answer));
                                    });
                                });
                            });
                        }

                        const q2 = new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg);
                        q2.makeQuery("SELECT * FROM votes WHERE LOWER(branchslug) = LOWER('" + branchSlug + "') AND LOWER(nickname) = LOWER('" + nickname + "');", objArrSecond, function(){
                            if(objArrSecond.arr.length === 0){  // if not voted before
                                new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("INSERT INTO votes (nickname, branchid, branchslug, voice) VALUES ('" + nickname + "', " + branchID + ", '" + branchSlug + "', " + voice + ");", {}, function(){
                                    updateBranch();
                                });
                            } else { // if man voted before
                                new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("UPDATE votes SET voice = " + voice + " WHERE LOWER(branchslug) = LOWER('" + branchSlug + "') AND LOWER(nickname) = LOWER('" + nickname + "');", {}, function() {
                                    updateBranch();
                                });
                            }
                        });


                    } else {
                        // user NO exists
                        answer = {
                            message: "User no exists"
                        };
                        console.log("Result: User no exists");
                        response.status(404);
                        response.end(JSON.stringify(answer));
                    }
               });
           }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = VoteAdder;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__URLsplitter__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ThreeBuilder__ = __webpack_require__(17);







class PostsOfThreadGetter {
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const data = arr[2].toString();
        let operation = arr[3].toString();

        if(operation === 'posts') {
            console.log("Operation: posts");

            if (__WEBPACK_IMPORTED_MODULE_1__NumberController_js__["a" /* default */].isNumber(data) === true) {
                // data is ID
                const branchID = parseInt(data);
                this.getMessagesByBranchID(branchID, []);
            } else {
                // data is SLUG
                const branchSlug = data.toString();
                this.getMessagesByBranchSlug(branchSlug, []);
            }
        } else {

            let mass = [];
            mass = operation.split("?");
            operation = mass[0].toString();
            let variablesString = mass[1].toString();

            mass = __WEBPACK_IMPORTED_MODULE_2__URLsplitter__["a" /* default */].explodeString(variablesString);

            if (__WEBPACK_IMPORTED_MODULE_1__NumberController_js__["a" /* default */].isNumber(data) === true) {
                // data is ID
                const branchID = parseInt(data);
                this.getMessagesByBranchID(branchID, mass);
            } else {
                // data is SLUG
                const branchSlug = data.toString();
                this.getMessagesByBranchSlug(branchSlug, mass);
            }
        }
    }

    getMessagesByBranchID(branchID, mmm){
        branchID = parseInt(branchID);

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let answer = null;

        let objArrFirst = {
            arr: []
        };

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE branchid = " + branchID + ";", objArrFirst, () => {
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Branch was NOT found"
                };
                console.log("Result: Branch was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                const branchSlug = objArrFirst.arr[0].slug.toString();
                this.getMessagesByBranchSlug(branchSlug, mmm);
            }
        });
    }

    getMessagesByBranchSlug(branchSlug, mmm){
        branchSlug = branchSlug.toString();

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let answer = null;

        let objArrFirst = {
            arr: []
        };

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", objArrFirst, function(){
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Branch was NOT found"
                };
                console.log("Result: Branch was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {

                let objArrBBB = {
                   arr: []
                };

                let sortType = "flat";

                let queryString = "SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + branchSlug + "')   ";

                if(mmm.length === 0) {
                    queryString = "SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + branchSlug + "') ORDER BY idpost;";
                } else {

                    let s1 = "  ";
                    let s2 = "  ";
                    let s3 = "  ";
                    let s4 = "  ";

                    sortType = "flat";

                    let sortingVector = "+";

                    for(let i = 0; i < mmm.length; i++){
                        const obj = mmm[i];

                        if(obj.key === "limit") {
                            s1 = " LIMIT " + obj.value + "  ";
                        }

                        if(obj.key === "desc") {
                            if(obj.value === "true") {
                                s2 = " ORDER BY idpost DESC ";
                                sortingVector = "-"
                            } else {
                                s2 = " ORDER BY idpost ASC ";
                                sortingVector = "+";
                            }
                        }

                        if(obj.key === "since") {
                            if(sortingVector === "+") s3 = " AND idpost > " + obj.value + " ";
                            if(sortingVector === "-") s3 = " AND idpost < " + obj.value + " ";
                        }

                        if(obj.key === "sort") {
                            sortType = obj.value;
                        }
                    }

                    if(s2 === "  ") {
                        s2 =  " ORDER BY idpost ASC ";
                    }


                    queryString = queryString + s3 + s2 + s1;
                    queryString += " ; ";
                }

                if(sortType === "flat") {
                    console.log(queryString.toString());
                    new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery(queryString.toString(), objArrBBB, function () {
                        const mass = objArrBBB.arr;

                        answer = [];

                        for (let i = 0; i < mass.length; i++) {
                            const obj = mass[i];
                            answer.push({
                                author: obj.author,
                                created: obj.created,
                                forum: obj.forum,
                                id: obj.idpost,
                                isEdited: obj.isedited,
                                message: obj.message,
                                parent: obj.parent,
                                thread: obj.threadid
                            });
                        }

                        console.log("Result: Get posts of branch OK");
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    });
                } else {

                    // if sortType <> flat

                    let bbb = {
                        arr: []
                    };

                    new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM posts WHERE LOWER(threadslug) = LOWER('" + branchSlug + "') ORDER BY idpost;", bbb, () => {
                        let desc = false;
                        let limit = 9999999999999;
                        let since = -1;

                        for(let i = 0; i < mmm.length; i++) {
                            if(mmm[i].key === "desc") {
                                if(mmm[i].value === "true") {
                                    desc = true;
                                }
                            }

                            if(mmm[i].key === "limit") {
                                limit = parseInt(mmm[i].value);
                            }

                            if(mmm[i].key === "since") {
                                since = parseInt(mmm[i].value);
                            }
                        }

                        if(sortType === "tree") {
                            const three = new __WEBPACK_IMPORTED_MODULE_3__ThreeBuilder__["a" /* default */](bbb.arr, response);
                            three.getResult(sortType, desc, limit, since);
                        }

                        if(sortType === "parent_tree") {
                            const three = new __WEBPACK_IMPORTED_MODULE_3__ThreeBuilder__["a" /* default */](bbb.arr, response);
                            three.getResultParentThree(sortType, desc, limit, since);
                        }
                    });
                }
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostsOfThreadGetter;




/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class ThreeBuilder {
    constructor(arr, response) {
        function getInt(x) {
            x = parseInt(x);
            if(x === undefined) return 0;
            if(x === null) return 0;
            if(isNaN(x) === true) return 0;
            return x;
        }

        this.arr = arr;
        this.response = response;

        for(let i = 0; i < this.arr.length; i++) {
            const obj = this.arr[i];
            obj.parent = getInt(obj.parent);
            obj.idpost = getInt(obj.idpost);
            obj.mass = [];
            obj.level = 0;
            obj.father = null;
            obj.marked = false;
        }
    }

    addChildrenToElement(element) {
        const arr = this.arr;

        for(let i = 0; i < arr.length; i++) {
            const nowElement = arr[i];

            if(element !== nowElement) {
                if(nowElement.parent === element.idpost) {
                    element.mass.push(nowElement);
                    nowElement.father = element;
                }
            }
        }
    }

    makeThree() {
        const arr = this.arr;

        this.koren = {
            level: 0,
            idpost: 0,
            mass: []
        };

        this.addChildrenToElement(this.koren);

        for(let i = 0; i < arr.length; i++) {
            this.addChildrenToElement(arr[i]);
        }
    }

    setLevel(element, level) {
        element.level = level;
        if(level > this.maxLevel) {
            this.maxLevel = level;
        }
        for(let i = 0; i < element.mass.length; i++) {
            this.setLevel(element.mass[i], level + 1);
        }
    }

    addElement(element) {

        if(element !== this.koren) {
            this.answer.push(element);
        }

        for(let i = 0; i < element.mass.length; i++) {
            this.addElement(element.mass[i]);
        }
    }

    sortElementsInSloys() {
        console.log("\n\n\n");

        const arr = this.arr;
        for(let level = 0; level <= this.maxLevel + 1; level++) {

            let mass = [];
            let s = "Level " + level + ": ";

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].level === level) {
                    s = s + arr[i].idpost + " ";
                    mass.push(arr[i]);
                }
            }

            for(let i = 0; i < mass.length; i++) {
                for(let j = 0; j < mass.length; j++) {
                    if(mass[i].idpost < mass[j].idpost) {
                        let tmp = mass[i];
                        mass[i] = mass[j];
                        mass[j] = tmp;
                    }
                }
            }
        }

        console.log("\n\n\n");

        for(let level = 0; level <= this.maxLevel + 1; level++) {
            let s = "Level " + level + ": ";
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].level === level) {
                    s = s + arr[i].idpost + ":" + arr[i].parent + "  ";
                }
            }
            console.log(s);
        }

        console.log("\n\n\n");
    }

    getOneFather(element) {
        if(element.level === 1) {
            return element;
        } else {
            return this.getOneFather(element.father);
        }
    }

    pushYYY(element, yyy) {
        const obj = element;
        yyy.push({
            author: obj.author,
            created: obj.created,
            forum: obj.forum,
            id: obj.idpost,
            isEdited: obj.isedited,
            message: obj.message,
            parent: obj.parent,
            thread: obj.threadid
        });


        for(let i = 0; i < element.mass.length; i++) {
            this.pushYYY(element.mass[i], yyy);
        }
    }

    workWithChildren(element, xxx, flag) {
        if(element.marked === true) {
            return;
        }

        if(element.marked === false) {
            const obj = element;
            element.marked = true;
            xxx.push({
                author: obj.author,
                created: obj.created,
                forum: obj.forum,
                id: obj.idpost,
                isEdited: obj.isedited,
                message: obj.message,
                parent: obj.parent,
                thread: obj.threadid
            });

            for (let i = 0; i < element.mass.length; i++) {
                this.workWithChildren(element.mass[i], xxx, false);
            }

            if(flag === true) {
                return element;
            } else {
                return null;
            }
        }
    }

    getResultParentThree(type, desc, limit, since) {
        limit = parseInt(limit);
        since = parseInt(since);

        const response = this.response;
        const arr = this.arr;
        this.answer = [];

        this.makeThree();
        this.addElement(this.koren);

        this.maxLevel = 0;
        this.setLevel(this.koren, 0);
        this.sortElementsInSloys();

        let xxx = [];

        if(since === -1) {
            if (desc === false) {
                let now = 0;
                for (let i = 0; i < this.answer.length; i++) {
                    const obj = this.answer[i];
                    if (now < limit) {
                        if(obj.marked === false) {
                            this.workWithChildren(obj, xxx);
                            now++;
                        }
                    }
                }
            }

            if (desc === true) {
                let now = 0;

                let ttt = [];

                for (let i = 0; i < this.answer.length; i++) {
                    const obj = this.answer[i];
                    if (obj.marked === false) {
                        let elemStarter = this.workWithChildren(obj, xxx, true);
                        ttt.push(elemStarter);
                        console.log("ID: " + elemStarter.idpost);
                    }
                }

                let yyy = [];

                console.log("\nLimit: " + limit);
                while(ttt.length > limit) {
                    ttt.splice(0, 1);
                }

                for(let i = 0; i < ttt.length; i++){
                    console.log("ID__ = " + ttt[i].idpost);
                    this.pushYYY(ttt[i], yyy);
                }

                xxx = yyy;
                xxx.reverse();

                console.log("\n");
            }
        }



        if(since !== -1) {
            if (desc === false) {

                console.log("AAAAAAAAAAAA");
                let index = -1;

                for (let i = 0; i < this.answer.length; i++) {
                    const obj = this.answer[i];
                    if(obj.idpost === since) {
                        index = i + 1;
                    }
                }

                console.log("\n");
                console.log("BBBBBBBBBBBB");
                let flag = false;
                for (let i = 0; i < this.answer.length; i++) {
                    const obj = this.answer[i];
                    if(index === i || index === -1) {
                        flag = true;
                    }
                    console.log(obj.idpost);
                    if(flag === true) {
                        if (true) {
                            xxx.push({
                                author: obj.author,
                                created: obj.created,
                                forum: obj.forum,
                                id: obj.idpost,
                                isEdited: obj.isedited,
                                message: obj.message,
                                parent: obj.parent,
                                thread: obj.threadid
                            });
                        }
                    }
                }
                console.log("\n");
            }

            if (desc === true) {
                if (desc === true) {
                    let now = 0;

                    let ttt = [];

                    for (let i = 0; i < this.answer.length; i++) {
                        const obj = this.answer[i];
                        if (obj.marked === false && obj.idpost < since) {
                            let elemStarter = this.workWithChildren(obj, xxx, true);
                            ttt.push(elemStarter);
                            console.log("ID: " + elemStarter.idpost);
                        }
                    }

                    let yyy = [];

                    console.log("\nLimit: " + limit);
                    while(ttt.length > limit) {
                        ttt.splice(0, 1);
                    }

                    for(let i = 0; i < ttt.length; i++){
                        console.log("ID__ = " + ttt[i].idpost);
                        this.pushYYY(ttt[i], yyy);
                    }

                    xxx = yyy;
                    xxx.reverse();

                    console.log("\n");
                }
            }
        }

        console.log("Result: Get posts of branch OK");
        response.status(200);
        response.end(JSON.stringify(xxx));
    }

    getResult(type, desc, limit, since) {
        limit = parseInt(limit);
        since = parseInt(since);

        const response = this.response;
        const arr = this.arr;
        this.answer = [];

        this.makeThree();
        this.addElement(this.koren);

        this.maxLevel = 0;
        this.setLevel(this.koren, 0);
        this.sortElementsInSloys();

        let xxx = [];

        if(since === -1) {
            if (desc === false) {
                let now = 0;
                for (let i = 0; i < this.answer.length; i++) {
                    if (now < limit) {
                        const obj = this.answer[i];
                        xxx.push({
                            author: obj.author,
                            created: obj.created,
                            forum: obj.forum,
                            id: obj.idpost,
                            isEdited: obj.isedited,
                            message: obj.message,
                            parent: obj.parent,
                            thread: obj.threadid
                        });
                    }
                    now++;
                }
            }

            if (desc === true) {
                let now = 0;
                for (let i = this.answer.length - 1; i >= 0; i--) {
                    if (now < limit) {
                        const obj = this.answer[i];
                        xxx.push({
                            author: obj.author,
                            created: obj.created,
                            forum: obj.forum,
                            id: obj.idpost,
                            isEdited: obj.isedited,
                            message: obj.message,
                            parent: obj.parent,
                            thread: obj.threadid
                        });
                    }
                    now++;
                }
            }
        }



        if(since !== -1) {
            if (desc === false) {

                console.log("AAAAAAAAAAAA");
                let index = -1;

                for (let i = 0; i < this.answer.length; i++) {
                    const obj = this.answer[i];
                    if(obj.idpost === since) {
                        index = i + 1;
                    }
                }

                console.log("\n");
                console.log("BBBBBBBBBBBB");
                let now = 0;
                let flag = false;
                for (let i = 0; i < this.answer.length; i++) {
                    const obj = this.answer[i];
                    if(index === i || index === -1) {
                        flag = true;
                    }
                    console.log(obj.idpost);
                    if(flag === true) {
                        if (now < limit) {
                            xxx.push({
                                author: obj.author,
                                created: obj.created,
                                forum: obj.forum,
                                id: obj.idpost,
                                isEdited: obj.isedited,
                                message: obj.message,
                                parent: obj.parent,
                                thread: obj.threadid
                            });
                        }
                        now++;
                    }
                }
                console.log("\n");
            }

            if (desc === true) {

                console.log("AAAAAAAAAAAA");
                let index = -1;

                for (let i = 0; i < this.answer.length; i++) {
                    const obj = this.answer[i];
                    if(obj.idpost === since) {
                        index = i - 1;
                    }
                }

                let abc = false;
                for(let i = 0; i < this.answer.length; i++) {
                    if(this.answer[i].idpost < since) {
                        abc = true;
                    }
                }
                if(abc === false) index = -100;

                console.log("\n");
                console.log("BBBBBBBBBBBB");
                let now = 0;
                let flag = false;
                for (let i = this.answer.length - 1; i >= 0; i--) {
                    const obj = this.answer[i];
                    if(index === i || index === -1) {
                        flag = true;
                    }
                    console.log(obj.idpost);
                    if(flag === true) {
                        if (now < limit) {
                            xxx.push({
                                author: obj.author,
                                created: obj.created,
                                forum: obj.forum,
                                id: obj.idpost,
                                isEdited: obj.isedited,
                                message: obj.message,
                                parent: obj.parent,
                                thread: obj.threadid
                            });
                        }
                        now++;
                    }
                }
                console.log("\n");
            }

        }

        console.log("Result: Get posts of branch OK");
        response.status(200);
        response.end(JSON.stringify(xxx));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ThreeBuilder;




/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController_js__ = __webpack_require__(1);





class BranchUpdater{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const data = arr[2].toString();
        const operation = arr[3].toString();

        let dataObject = null;

        request.on('data', (dataValue) => {
            try {
                dataObject = JSON.parse(dataValue);
            } catch (err) {
                response.end("BAD FORMAT ERROR");
            }

            if (operation === 'details') {
                console.log("Operation: details");
                if (__WEBPACK_IMPORTED_MODULE_1__NumberController_js__["a" /* default */].isNumber(data) === true) {
                    // data - branchID
                    const branchID = parseInt(data);
                    this.updateBranchByID(branchID, dataObject);
                } else {
                    // data - branchSLUG
                    const branchSlug = data.toString();
                    this.updateBranchBySLUG(branchSlug, dataObject);
                }
            }
        });
    }

    updateBranchByID(branchID, dataObject){
        branchID = parseInt(branchID);

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let answer = null;

        let objArrFirst = {
            arr: []
        };

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE branchid = " + branchID + ";", objArrFirst, () => {
            if(objArrFirst.arr.length === 0){
                answer = {
                    message: "Branch was NOT found"
                };
                console.log("Result: Branch was NOT found");
                response.status(404);
                response.end(JSON.stringify(answer));
            } else {
                const branchSlug = objArrFirst.arr[0].slug.toString();
                this.updateBranchBySLUG(branchSlug, dataObject);
            }
        });
    }

    updateBranchBySLUG(branchSlug, dataObject){
        branchSlug = branchSlug.toString();

        const t = this;

        const app = t.app;
        const pg = t.pg;
        const request = t.request;
        const response = t.response;

        let answer = null;

        let objArrFirst = {
            arr: []
        };

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", objArrFirst, function(){
           if(objArrFirst.arr.length === 0){
               answer = {
                   message: "Branch was NOT found"
               };
               console.log("Result: Branch was NOT found");
               response.status(404);
               response.end(JSON.stringify(answer));
           } else {

                branchSlug = objArrFirst.arr[0].slug.toString();

                // noinspection JSAnnotator
               function isNormal(x) {
                    if(x === undefined) return false;
                    if(x === null) return false;
                    return true;
                }

                let message = undefined;
                let title = undefined;

                if(isNormal(dataObject.message) === true) message = dataObject.message.toString();
                if(isNormal(dataObject.title) === true) title = dataObject.title.toString();

                let bigQuery = "  ";

                if(message !== undefined) {
                    bigQuery = bigQuery + "  UPDATE branches SET message = '" + message + "'  WHERE LOWER(slug) = LOWER('" + branchSlug + "');  ";
                }

                if(title !== undefined) {
                    bigQuery = bigQuery + "  UPDATE branches SET title = '" + title + "'  WHERE LOWER(slug) = LOWER('" + branchSlug + "');  ";
                }

                new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery(bigQuery, { }, function(){
                    let obj = null;

                    let zzz = {
                      arr: []
                    };

                    new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", zzz, () => {
                        obj = zzz.arr[0];

                        answer = {
                            author: obj.authorbranchnickname,
                            created: obj.created,
                            forum: obj.forumslug,
                            id: obj.branchid,
                            message: obj.message,
                            slug: obj.slug,
                            title: obj.title,
                            votes: obj.votes
                        };

                        console.log("Result: Branch title and message update OK");
                        response.status(200);
                        response.end(JSON.stringify(answer));
                    });
                });
           }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BranchUpdater;




/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumberController__ = __webpack_require__(1);





class BranchInfo{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const data = arr[2].toString();
        const operation = arr[3].toString();

        if(operation === 'details'){
            console.log("Operation: details");

            if(__WEBPACK_IMPORTED_MODULE_1__NumberController__["a" /* default */].isNumber(data) === true){
                // data - branchID
                const branchID = parseInt(data);
                this.getBranchInfoByID(branchID);
            } else {
                // data - branchSLUG
                const branchSlug = data.toString();
                this.getBranchInfoBySLUG(branchSlug);
            }
        }
    }

    getBranchInfoByID(branchID){
        branchID = parseInt(branchID);

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

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE branchid = " + branchID + ";", objArrFirst, () => {
           if(objArrFirst.arr.length === 0){
               answer = {
                   message: "Branch was NOT found"
               };
               console.log("Result: Branch was NOT found");
               response.status(404);
               response.end(JSON.stringify(answer));
           } else {

               const branchSlug = objArrFirst.arr[0].slug.toString();
               this.getBranchInfoBySLUG(branchSlug);
           }
        });
    }

    getBranchInfoBySLUG(branchSlug){
        branchSlug = branchSlug.toString();

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

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT * FROM branches WHERE LOWER(slug) = LOWER('" + branchSlug + "');", objArrFirst, function(){
           if(objArrFirst.arr.length === 0){
               answer = {
                   message: "Branch was NOT found"
               };
               console.log("Result: Branch was NOT found");
               response.status(404);
               response.end(JSON.stringify(answer));
           } else {

               const obj = objArrFirst.arr[0];

               answer = {
                   author: obj.authorbranchnickname,
                   created: obj.created,
                   forum: obj.forumslug,
                   id: obj.branchid,
                   message: obj.message,
                   slug: obj.slug,
                   title: obj.title,
                   votes: obj.votes
               };

               console.log("Result: Get branch info OK");
               response.status(200);
               response.end(JSON.stringify(answer));
           }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BranchInfo;




/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__ = __webpack_require__(0);




class DBinfoGetter{
    constructor(app, pg, request, response){
        this.app = app;
        this.pg = pg;
        this.request = request;
        this.response = response;

        let url = request.url;
        let arr = [];
        arr = url.split("/");

        const operation = arr[2].toString();

        if(operation === 'status'){
            console.log("Operation: status");
            this.getDBinfo();
        }
    }

    getDBinfo(){
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

        let objArrSecond = {
            arr: []
        };

        let objArrThird = {
            arr: []
        };

        let objArrFour = {
            arr: []
        };

        new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT title FROM forums;", objArrFirst, function(){
            const forumsNumber =  objArrFirst.arr.length;

            new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT author FROM posts;", objArrSecond, function () {
                const postsNumber = objArrSecond.arr.length;

                new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT slug FROM branches;", objArrThird, function(){
                    const branchesNumber = objArrThird.arr.length;

                    new __WEBPACK_IMPORTED_MODULE_0__QueryMaker_js__["a" /* default */](pg).makeQuery("SELECT nickname FROM users;", objArrFour, function(){
                        const usersNumber = objArrFour.arr.length;

                        answer = {
                            forum: forumsNumber,
                            post: postsNumber,
                            thread: branchesNumber,
                            user: usersNumber
                        };

                        console.log("Result: Get DB info OK");
                        response.end(JSON.stringify(answer));
                    });
                });
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DBinfoGetter;




/***/ })
/******/ ]);