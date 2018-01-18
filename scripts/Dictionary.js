"use strict";


export default class Dictionary {
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
