/**
 * IStorage.
 * 
 * Allows writing data to a storage medium.
 */
export interface IStorage
{
    /**
     * Initialize storage medium.
     * @async
     * @returns {Promise<any>} not used
     * @throws {Error} Error if failed to initialize
     */
    Initialize(): Promise<any>;

    /**
     * Query storage returning results as JSON array or null if no results or error.
     * @async
     * @param {string} sql query to run
     * @returns {Promise<any>} results as JSON array or null if no results or error
     */
    QueryResultsOrNull(sql: string): Promise<any>;

    /**
     * Write a single JSON object to table in storage.
     * @async
     * @param {string} table name
     * @param {any} jsonObject data to be written to table, must be flat (one-level)
     * @returns {Promise<boolean>} true if write successful, false otherwise
     */
    WriteSingle(table: string, jsonObject: any): Promise<boolean>;

    /**
     * Dispose any open resources.
     */
    Dispose(): void;
}