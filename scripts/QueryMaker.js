"use strict";

export default class QueryMaker {
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
