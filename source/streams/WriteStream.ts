import { Writable } from "stream"
import { IDataStorage } from "../datastorages/IDataStorage";
import { IDataInterface } from "../datainterfaces/IDataInterface"

/**
 * WriteStream.
 * 
 * Writes JSON objects using a given Storage medium and pushes it down the pipeline.
 */
export class WriteStream extends Writable
{
    private _dataStorage: IDataStorage;
    private _dataInterface: IDataInterface;

    /**
     * Constructor.
     * @param {IDataStorage} dataStorage used to store the data
     * @param {IDataInterface} dataInterface used to transform the JSON object
     */
    public constructor(dataStorage: IDataStorage, dataInterface: IDataInterface)
    {
        // objectMode: stream accepts any JS object rather than the default string/buffer
        super({objectMode: true});
        this._dataStorage = dataStorage;
        this._dataInterface = dataInterface;
    }

    /**
     * Writes stream data to storage using a StorageWriter.
     * Called automatically when used in a pipe.
     * @param {Array<any>|null} data from the stream
     * @param {string} encoding not used
     * @param {Function} done callback when finished writing data or error
     * @throws {Error} when data storage write fails
     * @override
     */
    public _write(data: Array<any>|null, encoding: string, done: Function): void
    {
        if (data == null)
        {
            done();
        }
        else
        {
            // Uses a little hack to ensure done() is not called too early
            // or it will signal the end of stream before data is finished writing
            this.writeAsync(data, done);
        }
    }

    /**
     * Writes stream data to storage using StorageWriter asynchronously.
     * @async
     * @param {Array<any>} data from the stream
     * @param {Function} done callback when finished writing data or error
     * @throws {Error} when data storage write fails
     */
    private async writeAsync(data: Array<any>, done: Function): Promise<void>
    {
        try
        {
            await this._dataStorage.Write(this._dataInterface.TableName, this._dataInterface.TableColumns, data);
            done();
        }
        catch (err)
        {
            done(err);
        }
    }
}