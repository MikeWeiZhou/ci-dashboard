import { Writable } from "stream"
import { IDataStorage } from "./IDataStorage";
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
     * @param {Array<any>} data from the stream
     * @param {string} encoding not used
     * @param {Function} callback callback when finished writing data
     * @override
     */
    public _write(data: Array<any>, encoding: string, callback: Function): void
    {
        // Uses a little hack to ensure callback() is not called too early
        // or it will signal the end of stream before data is finished writing
        this.writeAsync(data, callback);
    }

    /**
     * Writes stream data to storage using StorageWriter asynchronously.
     * @param {Array<any>} data from the stream
     * @param {Function} callback callback when finished writing data
     */
    private async writeAsync(data: Array<any>, callback: Function): Promise<void>
    {
        await this._dataStorage.Write(this._dataInterface.TableName, this._dataInterface.TableColumns, data);

        // callback signals successful writing of data,
        // ommit callback() to signal error,
        // or pass a parameter with any object/message to signal with an error
        callback();
    }
}