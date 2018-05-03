import * as mysql from "mysql"

import IStorageReader from "./IStorageReader"

export default class MySqlStorageReader implements IStorageReader
{
    private _connection: mysql.Connection;

    /**
     * Constructor.
     * @param {string} host 
     * @param {string} db 
     * @param {string} user 
     * @param {string} pass 
     */
    public constructor(host: string, db: string, user: string, pass: string)
    {
        this._connection = mysql.createConnection
        ({
            host: host,
            database: db,
            user: user,
            password: pass
        });
    }

    /**
     * Initialize the storage.
     * @override
     */
    public Initialize(): void
    {
        this._connection.connect((error: mysql.MysqlError) =>
        {
            if (error)
            {
                console.log("MySQL connection error:");
                console.log(error);
                throw error;
            }
            console.log("Connected to MySQL database!");
        });
    }

    /**
     * Query storage returning results in an array of JSON or null.
     * @param {string} sql query to run
     * @returns {Promise<any>} a Promise: results in an array of JSON, or null if error
     * @override
     */
    public async QueryOrNull(sql: string): Promise<any>
    {
        var _this: MySqlStorageReader = this;
        return new Promise ((resolve: any, reject: any) =>
        {
            _this._connection.query(sql, (error: mysql.MysqlError, result: any) =>
            {
                if (error)
                    reject(null);
                else
                    resolve(result);
            });
        });
    }

    /**
     * Cleanup/dispose any open resources.
     * @override
     */
    public Cleanup(): void
    {
        this._connection.end();
    }
}