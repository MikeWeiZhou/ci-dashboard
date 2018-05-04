import * as MySQL from "mysql"
import IStorage from "./IStorage"

/**
 * MySqlStorage.
 * 
 * Allows writing data to a MySQL database.
 * 
 * @todo Write() needs to queue up JSON objects then write in a batch for performance
 */
export default class MySqlStorage implements IStorage
{
    private _connection: MySQL.Connection;

    /**
     * Constructor.
     * @param {string} host 
     * @param {string} db 
     * @param {string} user 
     * @param {string} pass 
     */
    public constructor(host: string, db: string, user: string, pass: string)
    {
        this._connection = MySQL.createConnection
        ({
            host: host,
            database: db,
            user: user,
            password: pass
        });
    }

    /**
     * Connect to database.
     * @async
     * @returns {Promise<any>} not used
     * @throws {MySQL.MysqlError} MysqlError if failed to connect
     * @override
     */
    public async Initialize(): Promise<any>
    {
        var _this: MySqlStorage = this;
        return new Promise((resolve: Function, reject: Function) =>
        {
            _this._connection.connect((error: MySQL.MysqlError) =>
            {
                if (error)
                {
                    throw error;
                }
                resolve();
            });
        });
    }

    /**
     * Query MySQL returning results as JSON array or null.
     * @async
     * @param {string} sql query to run
     * @returns {Promise<any>} results as JSON array or null
     * @override
     */
    public async QueryOrNull(sql: string): Promise<any>
    {
        var _this: MySqlStorage = this;
        return new Promise((resolve: Function, reject: Function) =>
        {
            _this._connection.query(sql, (error: MySQL.MysqlError, results: any) =>
            {
                if (error)
                {
                    reject(null);
                }
                else
                {
                    resolve(results);
                }
            });
        });
    }

    /**
     * Write a JSON object to table in MySQL.
     * @async
     * @param {string} table name
     * @param {any} jsonObject data to be written to table, must be flat (one-level)
     * @returns {Promise<any>} true if successful, false otherwise
     * @override
     */
    public async Write(table: string, jsonObject: any): Promise<any>
    {
        var _this: MySqlStorage = this;
        return new Promise(async (resolve: Function, reject: Function) =>
        {
            const keys: string[] = Object.keys(jsonObject);
            var sql: string = `INSERT INTO ${table} (`;
            var results: any;
    
            for (var i: number = 0; i < keys.length; ++i)
            {
                sql += keys[i] + ", ";
            }
            sql = sql.slice(0, -2);
            sql += ") VALUES(";
    
            for (var i: number = 0; i < keys.length; ++i)
            {
                sql += "'" + jsonObject[keys[i]] + "', "; // can access through associative array LOL
            }
            sql = sql.slice(0, -2);
            sql += ")";
    
            results = await _this.QueryOrNull(sql);
            if (results == null)
            {
                reject(false);
            }
            else
            {
                resolve(true);
            }
        });
    }

    /**
     * Dispose any open resources.
     * @override
     */
    public Dispose(): void
    {
        this._connection.end();
    }
}