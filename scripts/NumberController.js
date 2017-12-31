"use strict";

export default class NumberController {
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
