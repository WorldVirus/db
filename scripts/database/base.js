'use strict'

import dataBase from './config';

export default class BaseService {
    constructor() {
        this._query = '';
        this._dataBase = dataBase.controller;
        this._pgp = dataBase.pgp;
    }

    get pgp() {
        return this._pgp;
    }

    get task() {
        return this.dataBase.task;
    }

    get transaction() {
        return this.dataBase.tx;
    }

    get dataBase() {
        return this._dataBase;
    }

    get query() {
        return this._query;
    }

    set query(string) {
        this._query = string;
    }
}
