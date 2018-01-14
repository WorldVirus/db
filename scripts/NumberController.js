"use strict";



export default class NumberController {
    static isNumber(paramString) {
        const s = paramString + "";
        return parseInt(s) + "" === s;
    }
}
