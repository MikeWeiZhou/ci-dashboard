import * as mysql from "mysql"
import { IStorage } from "./IStorage"
import { Log } from "../Log"
import { SIGVTALRM } from "constants";

/**
 * MysqlStorage.
 * 
 * Allows writing data to a MySQL database.
 */
export class MysqlStorage implements IStorage
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
     * Connect to database.
     * @async
     * @returns {Promise<any>} not used
     * @throws {MySQL.MysqlError} MysqlError if failed to connect
     * @override
     */
    public async Initialize(): Promise<any>
    {
        var _this: MysqlStorage = this;
        return new Promise((resolve: Function, reject: Function) =>
        {
            _this._connection.connect((error: mysql.MysqlError) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve();
                }
            });
        });
    }

    /**
     * Query MySQL returning results as JSON array or null if no results or error.
     * @async
     * @param {string} sql query to run
     * @param {Array<any>} [values] values for insert queries
     * @returns {Promise<any>} results as JSON array or null if no results or error
     * @override
     */
    public async QueryResultsOrNull(sql: string, values?: Array<any>): Promise<any>
    {
        var _this: MysqlStorage = this;
        return new Promise((resolve: Function, reject: Function) =>
        {
            _this._connection.query(sql, values, (error: mysql.MysqlError, results: Array<object>) =>
            {
                if (error)
                {
                    // Log error message and return null
                    // Assumption: Majority of time it's because of invalid query
                    Log(__filename, error, `SQL Query: ${sql}\n\nValues: ${values}`);
                    resolve(null);
                }
                else if (results.length == 0)
                {
                    resolve(null);
                }
                else
                {
                    resolve(results);
                }
            });
        });
    }

    /**
     * Write a single JSON object to table in MySQL.
     * @async
     * @param {string} tablename
     * @param {object} jsonObject data to be written to table, must be flat (one-level)
     * @returns {Promise<boolean>} true if successful, false otherwise
     * @override
     */
    public async WriteSingle(tablename: string, jsonObject: object): Promise<boolean>
    {
        var keys: string[] = Object.keys(jsonObject);
        var insertQuery: string = this.getInsertQuery(tablename, keys);
        var insertValues: Array<any> = [[this.getInsertValues(jsonObject, keys)]];

        return (await this.QueryResultsOrNull(insertQuery, insertValues) == null)
            ? false
            : true;
    }

    /**
     * Write multiple JSON objects to table in MySQL.
     * @async
     * @param {string} table name
     * @param {Array<object>} jsonArray data to be written to table, must be flat (one-level)
     * @returns {Promise<boolean>} true if successful, false otherwise
     * @override
     */
    // public async WriteMultiple(table: string, jsonArray: Array<object>): Promise<boolean>
    // {
    // }

    /**
     * Dispose any open resources.
     * @override
     */
    public Dispose(): void
    {
        this._connection.end();
    }

    private getInsertQuery(tablename: string, keys: string[]): string
    {
        // e.g. INSERT INTO Test (name,email,n) VALUES ?
        var query: string = `INSERT INTO ${tablename} (`;
        for (let i: number = 0; i < keys.length; ++i)
        {
            query += keys[i] + ",";
        }
        query = query.slice(0, -1); // remove last comma
        query += ") VALUES ?";
        return query;
    }

    private getInsertValues(jsonObject: object, keys: string[]): Array<any>
    {
        var values: Array<any> = [];
        for (let i: number = 0; i < keys.length; ++i)
        {
            values.push(jsonObject[keys[i]]);
        }
        return values;
    }
}