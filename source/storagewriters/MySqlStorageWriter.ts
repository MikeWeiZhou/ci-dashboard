import * as mysql from "mysql"

import IStorageWriter from "./IStorageWriter"

/**
 * MySqlStorageWriter.
 * 
 * Allows writing data to a MySQL database.
 */
export default class MySqlStorageWriter implements IStorageWriter
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

    // /**
    //  * Add record to buffer.
    //  * @param {string} table name
    //  * @param {any} record JSON object of the record, MUST BE FLAT (one-leveled)
    //  * @override
    //  */
    // public AddToBuffer(table: string, record: any): void
    // {
    // }

    // /**
    //  * Writes all buffered data to source.
    //  * @override
    //  */
    // public WriteData(): void
    // {
    // }

    /**
     * Write record to MySQL database.
     * @param {string} table name
     * @param {any} record in JSON format, MUST BE FLAT (one-leveled)
     * @override
     */
    public Write(table: string, record: any): void
    {
        const keys: string[] = Object.keys(record);
        var sql = `INSERT INTO ${table} (`;

        for (var i: number = 0; i < keys.length; ++i)
        {
            sql += keys[i] + ", ";
        }
        sql = sql.slice(0, -2);
        sql += ") VALUES(";

        for (var i: number = 0; i < keys.length; ++i)
        {
            sql += "'" + record[keys[i]] + "', "; // can access through associative array LOL
        }
        sql = sql.slice(0, -2);
        sql += ")";

        this.RawQuery(sql);
    }

    /**
     * Run a raw SQL query on MySQL.
     * @param {string} sql query
     */
    public RawQuery(sql: string): void
    {
        this._connection.query(sql, (error: mysql.MysqlError, result: any) =>
        {
            if (error)
            {
                console.log("MySQL raw query error: " + sql);
                console.log(error);
                throw error;
            }
            // console.log("Raw query successfully executed: " + sql);
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