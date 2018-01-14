"use strict";

import MyWriter from "./MyWriter.js";

export default class Help {
    static objArr() {
        return {
            arr: []
        };
    }

    static exists(x) {
        return !(x === null || x === undefined);
    }
}
