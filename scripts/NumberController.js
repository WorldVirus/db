"use strict";

import MyWriter from "./MyWriter.js";

export default class NumberController {
    static isNumber(paramString) {
        const s = paramString + "";
        return parseInt(s) + "" === s;
    }
}
