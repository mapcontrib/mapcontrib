
import config from 'config';
import { MongoClient } from 'mongodb';



export default class Database {
    constructor () {
        let mongoHost = config.get('mongodb.host');
        let mongoPort = config.get('mongodb.port');
        let mongoBase = config.get('mongodb.database');

        this._mongoUrl = `mongodb://${mongoHost}:${mongoPort}/${mongoBase}`;
        this._mongoClient = new MongoClient();
    }

    connect (callback) {
        return this._mongoClient.connect(
            this._mongoUrl,
            callback
        );
    }
}
