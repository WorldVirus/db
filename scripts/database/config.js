'use strict'
import DataBase from './db';
import bbPromise from 'bluebird';

const dataBase = new DataBase({
    promiseLib: bbPromise
}, {
    user: 'docker',
    database: 'docker',
    password: 'docker',
    host: 'localhost',
    port: 5432
});

export default dataBase;
