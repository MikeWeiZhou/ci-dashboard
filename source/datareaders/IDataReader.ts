/**
 * IDataReader.
 * 
 * Reads from a data source and calls a callback function on every record.
 */
export interface IDataReader
{
    /**
     * Initialize the data source.
     */
    Initialize(): void;

    /**
     * Returns a stream of the data source.
     * @returns {any} any stream that can be piped: e.g. fs.ReadStream, fs.WriteStream
     */
    GetStream(): any;

    /**
     * Cleanup/dispose any open resources.
     */
    Cleanup(): void;
}