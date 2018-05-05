import * as mysql from "mysql"
import { IStorage } from "./IStorage"
import { Log } from "../Log"

/**
 * MysqlStorage.
 * 
 * Allows writing data to a MySQL database.
 */
export class MysqlStorage implements IStorage
{
    /** Node.js MySQL connector requires insert statements with separate values parameter
     * be wrapped with this many array layers.
     */
    private readonly _REQUIRED_VALUES_ARRAY_LAYER_COUNT = 3;

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
     * @param {Array<any>} [data] for insert queries only
     * @returns {Promise<any>} results as JSON array or null if no results or error
     * @override
     */
    public async QueryResultsOrNull(sql: string, data?: Array<any>): Promise<any>
    {
        var _this: MysqlStorage = this;
        return new Promise((resolve: Function, reject: Function) =>
        {
            _this._connection.query(sql, data, (error: mysql.MysqlError, results: Array<object>) =>
            {
                if (error)
                {
                    // Log error message and return null
                    // Assumption: Majority of time it's because of invalid query
                    Log(__filename, error, `SQL Query: ${sql}\n\nData: ${data}`);
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
     * Write one or more entries to specified table in database.
     * @async
     * @param {string} tablename
     * @param {Array<any>} keys field names of the table
     * @param {Array<any>} data to be inserted
     * @returns {Promise<boolean>} true if write successful, false otherwise
     * @override
     */
    public async Write(tablename: string, keys: Array<any>, data: Array<any>): Promise<boolean>
    {
        var insertQuery: string = this.getInsertQuery(tablename, keys);
        var insertData: Array<any> = this.wrapInsertDataArray(data);
        return (await this.QueryResultsOrNull(insertQuery, insertData) == null)
            ? false
            : true;
    }

    /**
     * Dispose any open resources.
     * @override
     */
    public Dispose(): void
    {
        this._connection.end();
    }

    /**
     * Return an insert query for prepared statements.
     * @param {string} tablename
     * @param {string[]} keys in table
     */
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

    /**
     * Wraps insert data with a set number of arrays.
     * Required for MySQL connector query() function.
     * @param Array<any> data to be wrapped
     */
    private wrapInsertDataArray(data: Array<any>): Array<any>
    {
        var arrayLayersCount: number = 1;
        var traverse: Array<any> = data;
        while (Array.isArray(traverse[0]))
        {
            traverse = traverse[0];
            ++arrayLayersCount;
        }
        while (++arrayLayersCount <= this._REQUIRED_VALUES_ARRAY_LAYER_COUNT)
        {
            data = [data];
        }
        return data;
    }
}