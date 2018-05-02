import { Writable } from "stream"

import { IStorageWriter } from "./storagewriters/IStorageWriter";

/**
 * WriteStream.
 * 
 * Writes JSON objects using a given DataWriter and pushes it down the pipeline.
 */
export class WriteStream extends Writable
{
    private _storageWriter: IStorageWriter;

    /**
     * Constructor.
     * @param {IStorageWriter} dataWriter DataWriter used to transform the JSON object
     */
    constructor(dataWriter: IStorageWriter)
    {
        super({
            objectMode: true // stream accepts any JS object rather than the default string/buffer
        });

        this._storageWriter = dataWriter;
    }

    /**
     * Writes to storage using a StorageWriter.
     * @param {any} jsonObj a JSON object from the stream
     * @param {string} encoding not used
     * @param {Function} callback callback when finished writing jsonObj
     * @override
     */
    _write(jsonObj: any, encoding: string, callback: Function): void
    {
        this._storageWriter.Write("insurance", jsonObj);

        // callback signals successful writing of jsonObj
        // pass a parameter with any object to signal with an error msg
        callback();
    }
}