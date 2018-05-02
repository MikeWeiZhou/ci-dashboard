/**
 * IDataCollector.
 * 
 * Returns a stream to the data source.
 */
export interface IDataCollector
{
    /**
     * Initialize the data source.
     */
    Initialize(): void;

    /**
     * Returns a stream of the data.
     * @returns {any} any stream that can be piped: e.g. fs.ReadStream, fs.WriteStream
     */
    GetStream(): any;

    /**
     * Cleanup/dispose any open resources.
     */
    Cleanup(): void;
}