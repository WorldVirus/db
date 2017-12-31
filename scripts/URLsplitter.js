"use strict";

export default class URLsplitter {
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
