import { Writable } from "stream"
import { IDataWriter } from "./datawriters/IDataWriter";

/**
 * WriteStream.
 * 
 * Writes JSON objects using a given DataWriter and pushes it down the pipeline.
 */
export class WriteStream extends Writable
{
    private _dataWriter: IDataWriter;

    /**
     * Constructor.
     * @param {IDataWriter} dataWriter DataWriter used to transform the JSON object
     */
    constructor(dataWriter: IDataWriter)
    {
        super({
            objectMode: true // stream accepts any JS object rather than the default string/buffer
        });

        this._dataWriter = dataWriter;
    }

    /**
     * Writes to storage using a DataWriter.
     * @param {any} jsonObj a JSON object from the stream
     * @param {string} encoding not used
     * @param {Function} callback callback when finished writing jsonObj
     */
    _write(jsonObj: any, encoding: string, callback: Function): void
    {
        this._dataWriter.Write("insurance", jsonObj);

        // callback signals successful writing of jsonObj
        // pass a parameter with any object to signal an error
        callback();
    }
}