"use strict";

export default class ThreeBuilder {
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

