
import config from 'config';
import { MongoClient } from 'mongodb';


export default class Database {
    constructor() {
        const mongoHost = config.get('mongodb.host');
        const mongoPort = config.get('mongodb.port');
        const mongoBase = config.get('mongodb.database');

        this._mongoUrl = `mongodb://${mongoHost}:${mongoPort}/${mongoBase}`;
        this._mongoClient = new MongoClient();
    }

    connect(callback) {
        return this._mongoClient.connect(
            this._mongoUrl,
            callback
        );
    }
}
