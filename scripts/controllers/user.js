"use strict";


import Help from "../Help";

export default class UserWorker {
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
            let aaa = Help.objArr();
            let bbb = Help.objArr();
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

                    if(Help.exists(newUser.fullname) === true) oldUser.u3 = newUser.fullname;
                    if(Help.exists(newUser.email) === true) oldUser.u4 = newUser.email;
                    if(Help.exists(newUser.about) === true) oldUser.u5 = newUser.about;

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
        let aaa = Help.objArr();
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

            let aaa = Help.objArr();
            let bbb = Help.objArr();

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
